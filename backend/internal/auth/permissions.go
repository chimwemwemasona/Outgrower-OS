package auth

type Permission string
type RoleKey string

const (
	RoleAdmin             RoleKey = "admin"
	RoleProductionManager RoleKey = "production_manager"
	RoleFieldOfficer      RoleKey = "field_officer"
	RoleCollectionQuality RoleKey = "collection_quality"
	RoleFinance           RoleKey = "finance"
	RoleViewer            RoleKey = "viewer"
)

var rolePermissions = map[RoleKey]map[Permission]struct{}{
	RoleAdmin: allow(
		"users.manage",
		"reference.manage",
		"dashboard.view",
		"farmers.write",
		"fields.write",
		"crop_cycles.write",
		"inputs.write",
		"visits.write",
		"deliveries.write",
		"quality.write",
		"payments.write",
		"statements.generate",
		"exports.full",
		"audit.view",
	),
	RoleProductionManager: allow(
		"dashboard.view",
		"farmers.write",
		"fields.write",
		"crop_cycles.write",
		"inputs.write",
		"visits.write",
		"statements.generate",
		"exports.production",
	),
	RoleFieldOfficer: allow(
		"dashboard.limited",
		"farmers.write",
		"fields.write",
		"crop_cycles.planting_confirm",
		"inputs.write",
		"visits.write",
		"offline_drafts.sync",
	),
	RoleCollectionQuality: allow("dashboard.limited", "deliveries.write", "quality.write", "exports.collection"),
	RoleFinance:           allow("dashboard.limited", "payments.write", "statements.generate", "exports.finance"),
	RoleViewer:            allow("dashboard.view", "exports.approved_summary"),
}

func HasPermission(role RoleKey, permission Permission) bool {
	permissions, ok := rolePermissions[role]
	if !ok {
		return false
	}

	_, ok = permissions[permission]
	return ok
}

func allow(permissions ...Permission) map[Permission]struct{} {
	allowed := make(map[Permission]struct{}, len(permissions))
	for _, permission := range permissions {
		allowed[permission] = struct{}{}
	}

	return allowed
}

