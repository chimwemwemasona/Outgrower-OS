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

export interface FarmerRecord {
  id: string;
  farmerCode: string;
  fullName: string;
  primaryPhone: string;
  sex: string;
  districtArea: string;
  registrationDate: string;
  consentStatus: string;
  status: string;
}

export interface FieldRecord {
  id: string;
  fieldCode: string;
  farmerId: string;
  acreage: number;
  latitude: number;
  longitude: number;
  locationLabel: string;
  status: string;
}

export interface CropCycleRecord {
  id: string;
  fieldId: string;
  cropCode: string;
  varietyCode: string;
  areaPlanted: number;
  plantingDate: string;
  expectedHarvestDate: string;
  stage: string;
  expectedYield: number;
  status: string;
}

export interface InputIssueRecord {
  id: string;
  farmerId: string;
  cropCycleId: string;
  item: string;
  quantity: number;
  unit: string;
  issueDate: string;
  issuer: string;
  recoverable: boolean;
  recoverableValue: number;
}

export interface FieldVisitRecord {
  id: string;
  fieldId: string;
  cropCycleId: string;
  officer: string;
  visitDate: string;
  cropStage: string;
  condition: string;
  notes: string;
  riskCategory: string;
  riskSeverity: string;
  recommendation: string;
  followUpDate: string;
  photoName: string;
}

export type OfflineDraftStatus = "pending" | "synced" | "failed";

export interface OfflineDraft {
  id: string;
  type: "farmer_registration" | "field_visit" | "planting_confirmation";
  label: string;
  payload: Record<string, unknown>;
  status: OfflineDraftStatus;
  createdAt: string;
  error?: string;
}
