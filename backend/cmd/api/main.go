package main

import (
	"log"
	"net/http"
	"os"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
)

const version = "0.1.0"

type responseEnvelope map[string]any

type loginRequest struct {
	Role string `json:"role"`
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

func corsMiddleware(allowedOrigins map[string]struct{}) gin.HandlerFunc {
	return func(c *gin.Context) {
		if origin := c.GetHeader("Origin"); origin != "" {
			_, isAllowed := allowedOrigins[strings.ToLower(origin)]
			if !isAllowed {
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
