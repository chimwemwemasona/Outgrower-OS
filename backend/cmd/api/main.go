package main

import (
	"fmt"
	"log"
	"net/http"
	"os"
	"strings"
	"sync"
	"time"

	"github.com/gin-gonic/gin"
)

const version = "0.1.0"

type responseEnvelope map[string]any

type loginRequest struct {
	Role string `json:"role"`
}

type farmerRecord struct {
	ID               string `json:"id"`
	FarmerCode       string `json:"farmer_code"`
	FullName         string `json:"full_name"`
	PrimaryPhone     string `json:"primary_phone"`
	Sex              string `json:"sex"`
	DistrictArea     string `json:"district_area"`
	RegistrationDate string `json:"registration_date"`
	ConsentStatus    string `json:"consent_status"`
	Status           string `json:"status"`
}

type fieldRecord struct {
	ID            string  `json:"id"`
	FieldCode     string  `json:"field_code"`
	FarmerID      string  `json:"farmer_id"`
	Acreage       float64 `json:"acreage"`
	Latitude      float64 `json:"latitude"`
	Longitude     float64 `json:"longitude"`
	LocationLabel string  `json:"location_label"`
	Status        string  `json:"status"`
}

type cropCycleRecord struct {
	ID                  string  `json:"id"`
	FieldID             string  `json:"field_id"`
	CropCode            string  `json:"crop_code"`
	VarietyCode         string  `json:"variety_code"`
	AreaPlanted         float64 `json:"area_planted"`
	PlantingDate        string  `json:"planting_date"`
	ExpectedHarvestDate string  `json:"expected_harvest_date"`
	Stage               string  `json:"stage"`
	ExpectedYield       float64 `json:"expected_yield"`
	Status              string  `json:"status"`
}

type inputIssueRecord struct {
	ID               string  `json:"id"`
	FarmerID         string  `json:"farmer_id"`
	CropCycleID      string  `json:"crop_cycle_id"`
	Item             string  `json:"item"`
	Quantity         float64 `json:"quantity"`
	Unit             string  `json:"unit"`
	IssueDate        string  `json:"issue_date"`
	Issuer           string  `json:"issuer"`
	Recoverable      bool    `json:"recoverable"`
	RecoverableValue float64 `json:"recoverable_value"`
}

type fieldVisitRecord struct {
	ID             string `json:"id"`
	FieldID        string `json:"field_id"`
	CropCycleID    string `json:"crop_cycle_id"`
	Officer        string `json:"officer"`
	VisitDate      string `json:"visit_date"`
	CropStage      string `json:"crop_stage"`
	Condition      string `json:"condition"`
	Notes          string `json:"notes"`
	RiskCategory   string `json:"risk_category"`
	RiskSeverity   string `json:"risk_severity"`
	Recommendation string `json:"recommendation"`
	FollowUpDate   string `json:"follow_up_date"`
	PhotoName      string `json:"photo_name"`
}

type offlineDraftRequest struct {
	Type    string         `json:"type"`
	Payload map[string]any `json:"payload"`
}

type productionStore struct {
	mu          sync.Mutex
	nextID      int
	farmers     []farmerRecord
	fields      []fieldRecord
	cropCycles  []cropCycleRecord
	inputIssues []inputIssueRecord
	fieldVisits []fieldVisitRecord
}

var store = &productionStore{
	nextID: 2,
	farmers: []farmerRecord{
		{ID: "farmer-1", FarmerCode: "FARM-001", FullName: "Mable Phiri", PrimaryPhone: "0977000001", Sex: "Female", DistrictArea: "Chongwe", RegistrationDate: "2026-06-14", ConsentStatus: "verbal", Status: "active"},
	},
	fields: []fieldRecord{
		{ID: "field-1", FieldCode: "FIELD-001", FarmerID: "farmer-1", Acreage: 1.5, Latitude: -15.4067, Longitude: 28.2871, LocationLabel: "Chongwe block A", Status: "active"},
	},
	cropCycles: []cropCycleRecord{
		{ID: "cycle-1", FieldID: "field-1", CropCode: "tomato", VarietyCode: "Tengeru 97", AreaPlanted: 1.2, PlantingDate: "2026-06-14", ExpectedHarvestDate: "2026-09-15", Stage: "planted", ExpectedYield: 8500, Status: "planted"},
	},
}

func main() {
	addr := env("OUTGROWER_HTTP_ADDR", ":18080")
	allowedOrigins := splitCSV(env("OUTGROWER_ALLOWED_ORIGINS", "http://localhost:5173,http://127.0.0.1:5173"))

	router := setupRouter(allowedOrigins)

	server := &http.Server{
		Addr:         addr,
		Handler:      router,
		ReadTimeout:  10 * time.Second,
		WriteTimeout: 10 * time.Second,
		IdleTimeout:  60 * time.Second,
	}

	log.Printf("outgrower api listening on %s", addr)
	if err := server.ListenAndServe(); err != nil && err != http.ErrServerClosed {
		log.Fatal(err)
	}
}

func setupRouter(allowedOrigins map[string]struct{}) *gin.Engine {
	gin.SetMode(gin.ReleaseMode)

	router := gin.New()
	router.Use(gin.Logger(), gin.Recovery(), corsMiddleware(allowedOrigins))

	api := router.Group("/api/v1")
	api.GET("/health", handleHealth)
	api.POST("/auth/login", handleLogin)
	api.GET("/auth/me", handleMe)
	api.GET("/reference-data", handleReferenceData)
	api.GET("/farmers", handleListFarmers)
	api.POST("/farmers", handleCreateFarmer)
	api.GET("/fields", handleListFields)
	api.POST("/fields", handleCreateField)
	api.GET("/crop-cycles", handleListCropCycles)
	api.POST("/crop-cycles", handleCreateCropCycle)
	api.GET("/input-issues", handleListInputIssues)
	api.POST("/input-issues", handleCreateInputIssue)
	api.GET("/field-visits", handleListFieldVisits)
	api.POST("/field-visits", handleCreateFieldVisit)
	api.POST("/offline-drafts/sync", handleSyncOfflineDraft)

	return router
}

func handleLogin(c *gin.Context) {
	var payload loginRequest
	if err := c.ShouldBindJSON(&payload); err != nil {
		c.JSON(http.StatusBadRequest, responseEnvelope{"code": "invalid_json", "message": "Request body must be valid JSON."})
		return
	}

	user, ok := demoUsers[payload.Role]
	if !ok {
		c.JSON(http.StatusUnauthorized, responseEnvelope{"code": "invalid_role", "message": "Select a valid prototype role."})
		return
	}

	c.JSON(http.StatusOK, responseEnvelope{
		"session": responseEnvelope{
			"token_type": "prototype",
			"expires_in": 3600,
		},
		"user": user,
	})
}

func handleMe(c *gin.Context) {
	c.JSON(http.StatusOK, responseEnvelope{
		"user": demoUsers["admin"],
	})
}

func handleHealth(c *gin.Context) {
	c.JSON(http.StatusOK, responseEnvelope{
		"status":  "ok",
		"service": "outgrower-os-api",
		"version": version,
	})
}

var demoUsers = map[string]responseEnvelope{
	"admin": {
		"name":        "Prototype Admin",
		"role":        "admin",
		"permissions": []string{"users.manage", "reference.manage", "dashboard.view", "audit.view"},
	},
	"production_manager": {
		"name":        "Prototype Production Manager",
		"role":        "production_manager",
		"permissions": []string{"dashboard.view", "farmers.write", "fields.write", "crop_cycles.write", "inputs.write", "visits.write"},
	},
	"field_officer": {
		"name":        "Prototype Field Officer",
		"role":        "field_officer",
		"permissions": []string{"dashboard.limited", "farmers.write", "fields.write", "visits.write", "offline_drafts.sync"},
	},
	"collection_quality": {
		"name":        "Prototype Collection Officer",
		"role":        "collection_quality",
		"permissions": []string{"dashboard.limited", "deliveries.write", "quality.write"},
	},
	"finance": {
		"name":        "Prototype Finance Officer",
		"role":        "finance",
		"permissions": []string{"dashboard.limited", "payments.write", "statements.generate"},
	},
	"viewer": {
		"name":        "Prototype Viewer",
		"role":        "viewer",
		"permissions": []string{"dashboard.view", "exports.approved_summary"},
	},
}

func handleReferenceData(c *gin.Context) {
	c.JSON(http.StatusOK, responseEnvelope{
		"crops": []responseEnvelope{
			{"name": "Tomato", "variety": "Tengeru 97", "grade_a_price_zmw": 8.00, "grade_b_price_zmw": 5.50},
			{"name": "Onion", "variety": "Red Creole", "grade_a_price_zmw": 10.00, "grade_b_price_zmw": 7.00},
			{"name": "Cabbage", "variety": "Copenhagen Market", "grade_a_price_zmw": 6.00, "grade_b_price_zmw": 4.50},
			{"name": "Chilli", "variety": "ABE Chilli", "grade_a_price_zmw": 18.00, "grade_b_price_zmw": 12.00},
		},
		"grades":            []string{"Grade A", "Grade B", "Reject"},
		"payment_methods":   []string{"Cash", "Mobile money", "Bank transfer"},
		"collection_points": []string{"Lusaka Central Collection Point"},
	})
}

func handleListFarmers(c *gin.Context) {
	store.mu.Lock()
	defer store.mu.Unlock()
	c.JSON(http.StatusOK, responseEnvelope{"farmers": store.farmers})
}

func handleCreateFarmer(c *gin.Context) {
	var payload farmerRecord
	if err := c.ShouldBindJSON(&payload); err != nil {
		c.JSON(http.StatusBadRequest, responseEnvelope{"code": "invalid_json", "message": "Farmer request body must be valid JSON."})
		return
	}

	if strings.TrimSpace(payload.FarmerCode) == "" || strings.TrimSpace(payload.FullName) == "" || strings.TrimSpace(payload.PrimaryPhone) == "" {
		c.JSON(http.StatusBadRequest, responseEnvelope{"code": "missing_required_fields", "message": "Farmer code, full name, and primary phone are required."})
		return
	}

	store.mu.Lock()
	defer store.mu.Unlock()

	for _, farmer := range store.farmers {
		if strings.EqualFold(farmer.FarmerCode, payload.FarmerCode) {
			c.JSON(http.StatusConflict, responseEnvelope{"code": "duplicate_farmer_code", "message": "A farmer with this code already exists."})
			return
		}
	}

	warnings := []string{}
	for _, farmer := range store.farmers {
		if farmer.PrimaryPhone == payload.PrimaryPhone {
			warnings = append(warnings, "Probable duplicate phone number. Confirm this is a different farmer.")
			break
		}
	}

	payload.ID = store.next("farmer")
	if payload.Status == "" {
		payload.Status = "active"
	}
	store.farmers = append(store.farmers, payload)
	c.JSON(http.StatusCreated, responseEnvelope{"farmer": payload, "warnings": warnings})
}

func handleListFields(c *gin.Context) {
	store.mu.Lock()
	defer store.mu.Unlock()
	c.JSON(http.StatusOK, responseEnvelope{"fields": store.fields})
}

func handleCreateField(c *gin.Context) {
	var payload fieldRecord
	if err := c.ShouldBindJSON(&payload); err != nil {
		c.JSON(http.StatusBadRequest, responseEnvelope{"code": "invalid_json", "message": "Field request body must be valid JSON."})
		return
	}

	if strings.TrimSpace(payload.FieldCode) == "" || strings.TrimSpace(payload.FarmerID) == "" || payload.Acreage < 0 {
		c.JSON(http.StatusBadRequest, responseEnvelope{"code": "invalid_field", "message": "Field code, farmer, and non-negative acreage are required."})
		return
	}

	store.mu.Lock()
	defer store.mu.Unlock()

	if !store.hasFarmer(payload.FarmerID) {
		c.JSON(http.StatusBadRequest, responseEnvelope{"code": "unknown_farmer", "message": "Select a registered farmer before creating a field."})
		return
	}
	for _, field := range store.fields {
		if strings.EqualFold(field.FieldCode, payload.FieldCode) {
			c.JSON(http.StatusConflict, responseEnvelope{"code": "duplicate_field_code", "message": "A field with this code already exists."})
			return
		}
	}

	payload.ID = store.next("field")
	if payload.Status == "" {
		payload.Status = "active"
	}
	store.fields = append(store.fields, payload)
	c.JSON(http.StatusCreated, responseEnvelope{"field": payload})
}

func handleListCropCycles(c *gin.Context) {
	store.mu.Lock()
	defer store.mu.Unlock()
	c.JSON(http.StatusOK, responseEnvelope{"crop_cycles": store.cropCycles})
}

func handleCreateCropCycle(c *gin.Context) {
	var payload cropCycleRecord
	if err := c.ShouldBindJSON(&payload); err != nil {
		c.JSON(http.StatusBadRequest, responseEnvelope{"code": "invalid_json", "message": "Crop-cycle request body must be valid JSON."})
		return
	}

	if strings.TrimSpace(payload.FieldID) == "" || strings.TrimSpace(payload.CropCode) == "" || payload.AreaPlanted < 0 || payload.ExpectedYield < 0 {
		c.JSON(http.StatusBadRequest, responseEnvelope{"code": "invalid_crop_cycle", "message": "Field, crop, planted area, and expected yield are required."})
		return
	}

	store.mu.Lock()
	defer store.mu.Unlock()

	if !store.hasField(payload.FieldID) {
		c.JSON(http.StatusBadRequest, responseEnvelope{"code": "unknown_field", "message": "Select a registered field before creating a crop cycle."})
		return
	}
	if store.hasActiveCropCycle(payload.FieldID) {
		c.JSON(http.StatusConflict, responseEnvelope{"code": "active_crop_cycle_exists", "message": "This field already has an active crop cycle."})
		return
	}

	payload.ID = store.next("cycle")
	if payload.Status == "" {
		payload.Status = "planned"
	}
	store.cropCycles = append(store.cropCycles, payload)
	c.JSON(http.StatusCreated, responseEnvelope{"crop_cycle": payload})
}

func handleListInputIssues(c *gin.Context) {
	store.mu.Lock()
	defer store.mu.Unlock()
	c.JSON(http.StatusOK, responseEnvelope{"input_issues": store.inputIssues})
}

func handleCreateInputIssue(c *gin.Context) {
	var payload inputIssueRecord
	if err := c.ShouldBindJSON(&payload); err != nil {
		c.JSON(http.StatusBadRequest, responseEnvelope{"code": "invalid_json", "message": "Input issue request body must be valid JSON."})
		return
	}

	if strings.TrimSpace(payload.Item) == "" || payload.Quantity < 0 || payload.RecoverableValue < 0 || (payload.FarmerID == "" && payload.CropCycleID == "") {
		c.JSON(http.StatusBadRequest, responseEnvelope{"code": "invalid_input_issue", "message": "Item, farmer or crop cycle, non-negative quantity, and non-negative recoverable value are required."})
		return
	}

	store.mu.Lock()
	defer store.mu.Unlock()

	if payload.FarmerID != "" && !store.hasFarmer(payload.FarmerID) {
		c.JSON(http.StatusBadRequest, responseEnvelope{"code": "unknown_farmer", "message": "Input issue references an unknown farmer."})
		return
	}
	if payload.CropCycleID != "" && !store.hasCropCycle(payload.CropCycleID) {
		c.JSON(http.StatusBadRequest, responseEnvelope{"code": "unknown_crop_cycle", "message": "Input issue references an unknown crop cycle."})
		return
	}

	payload.ID = store.next("input")
	store.inputIssues = append(store.inputIssues, payload)
	c.JSON(http.StatusCreated, responseEnvelope{"input_issue": payload})
}

func handleListFieldVisits(c *gin.Context) {
	store.mu.Lock()
	defer store.mu.Unlock()
	c.JSON(http.StatusOK, responseEnvelope{"field_visits": store.fieldVisits})
}

func handleCreateFieldVisit(c *gin.Context) {
	var payload fieldVisitRecord
	if err := c.ShouldBindJSON(&payload); err != nil {
		c.JSON(http.StatusBadRequest, responseEnvelope{"code": "invalid_json", "message": "Field visit request body must be valid JSON."})
		return
	}

	if strings.TrimSpace(payload.FieldID) == "" || strings.TrimSpace(payload.CropCycleID) == "" || strings.TrimSpace(payload.Officer) == "" {
		c.JSON(http.StatusBadRequest, responseEnvelope{"code": "invalid_field_visit", "message": "Field, crop cycle, and officer are required."})
		return
	}

	store.mu.Lock()
	defer store.mu.Unlock()

	if !store.hasField(payload.FieldID) || !store.hasCropCycle(payload.CropCycleID) {
		c.JSON(http.StatusBadRequest, responseEnvelope{"code": "unknown_production_record", "message": "Visit must reference a known field and crop cycle."})
		return
	}

	payload.ID = store.next("visit")
	store.fieldVisits = append(store.fieldVisits, payload)
	c.JSON(http.StatusCreated, responseEnvelope{"field_visit": payload})
}

func handleSyncOfflineDraft(c *gin.Context) {
	var payload offlineDraftRequest
	if err := c.ShouldBindJSON(&payload); err != nil {
		c.JSON(http.StatusBadRequest, responseEnvelope{"code": "invalid_json", "message": "Offline draft request body must be valid JSON."})
		return
	}

	c.JSON(http.StatusAccepted, responseEnvelope{
		"status":       "synced",
		"draft_type":   payload.Type,
		"server_note":  "Prototype sync accepted. Persist specific draft types through their module endpoints.",
		"received_at":  time.Now().Format(time.RFC3339),
		"payload_echo": payload.Payload,
	})
}

func (s *productionStore) next(prefix string) string {
	id := fmt.Sprintf("%s-%d", prefix, s.nextID)
	s.nextID++
	return id
}

func (s *productionStore) hasFarmer(id string) bool {
	for _, farmer := range s.farmers {
		if farmer.ID == id {
			return true
		}
	}
	return false
}

func (s *productionStore) hasField(id string) bool {
	for _, field := range s.fields {
		if field.ID == id {
			return true
		}
	}
	return false
}

func (s *productionStore) hasCropCycle(id string) bool {
	for _, cycle := range s.cropCycles {
		if cycle.ID == id {
			return true
		}
	}
	return false
}

func (s *productionStore) hasActiveCropCycle(fieldID string) bool {
	for _, cycle := range s.cropCycles {
		if cycle.FieldID == fieldID && cycle.Status != "completed" && cycle.Status != "failed" && cycle.Status != "cancelled" {
			return true
		}
	}
	return false
}

func corsMiddleware(allowedOrigins map[string]struct{}) gin.HandlerFunc {
	return func(c *gin.Context) {
		if origin := c.GetHeader("Origin"); origin != "" {
			if !isAllowedOrigin(origin, allowedOrigins) {
				c.Next()
				return
			}

			c.Header("Access-Control-Allow-Origin", origin)
			c.Header("Vary", "Origin")
			c.Header("Access-Control-Allow-Headers", "Content-Type, Authorization")
			c.Header("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS")
		}

		if c.Request.Method == http.MethodOptions {
			c.Status(http.StatusNoContent)
			c.Abort()
			return
		}

		c.Next()
	}
}

func isAllowedOrigin(origin string, allowedOrigins map[string]struct{}) bool {
	normalized := strings.ToLower(strings.TrimSpace(origin))
	if _, ok := allowedOrigins[normalized]; ok {
		return true
	}

	return normalized == "http://localhost:5173" || normalized == "http://127.0.0.1:5173"
}

func splitCSV(value string) map[string]struct{} {
	parts := strings.Split(value, ",")
	values := make(map[string]struct{}, len(parts))
	for _, part := range parts {
		trimmed := strings.ToLower(strings.TrimSpace(part))
		if trimmed != "" {
			values[trimmed] = struct{}{}
		}
	}

	return values
}

func env(key string, fallback string) string {
	value := strings.TrimSpace(os.Getenv(key))
	if value == "" {
		return fallback
	}

	return value
}
