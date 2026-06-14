import type { RoleKey } from "../types";

export type Permission =
  | "users.manage"
  | "reference.manage"
  | "dashboard.view"
  | "dashboard.limited"
  | "farmers.write"
  | "fields.write"
  | "crop_cycles.write"
  | "crop_cycles.planting_confirm"
  | "inputs.write"
  | "visits.write"
  | "offline_drafts.sync"
  | "deliveries.write"
  | "quality.write"
  | "payments.write"
  | "statements.generate"
  | "exports.full"
  | "exports.production"
  | "exports.collection"
  | "exports.finance"
  | "exports.approved_summary"
  | "audit.view";

const rolePermissions: Record<RoleKey, Set<Permission>> = {
  admin: new Set([
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
    "audit.view"
  ]),
  production_manager: new Set([
    "dashboard.view",
    "farmers.write",
    "fields.write",
    "crop_cycles.write",
    "inputs.write",
    "visits.write",
    "statements.generate",
    "exports.production"
  ]),
  field_officer: new Set([
    "dashboard.limited",
    "farmers.write",
    "fields.write",
    "crop_cycles.planting_confirm",
    "inputs.write",
    "visits.write",
    "offline_drafts.sync"
  ]),
  collection_quality: new Set(["dashboard.limited", "deliveries.write", "quality.write", "exports.collection"]),
  finance: new Set(["dashboard.limited", "payments.write", "statements.generate", "exports.finance"]),
  viewer: new Set(["dashboard.view", "exports.approved_summary"])
};

export function hasPermission(role: RoleKey, permission: Permission): boolean {
  return rolePermissions[role].has(permission);
}

