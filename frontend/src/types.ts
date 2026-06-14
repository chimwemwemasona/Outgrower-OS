export type PhaseStatus = "Not Started" | "In Progress" | "Blocked" | "Done" | "Deferred";

export type RoleKey =
  | "admin"
  | "production_manager"
  | "field_officer"
  | "collection_quality"
  | "finance"
  | "viewer";

export interface CropDefault {
  crop: string;
  variety: string;
  gradeAPriceZmw: number;
  gradeBPriceZmw: number;
}

export interface CropReference extends CropDefault {
  isActive: boolean;
}

export interface ReferenceOption {
  value: string;
  label: string;
}

export interface AuthenticatedUser {
  name: string;
  role: RoleKey;
  permissions: string[];
}

export interface HealthResponse {
  status: string;
  service: string;
  version: string;
}
