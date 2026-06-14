import type {
  AuthenticatedUser,
  CropCycleRecord,
  CropReference,
  FarmerRecord,
  FieldRecord,
  FieldVisitRecord,
  HealthResponse,
  InputIssueRecord,
  OfflineDraft
} from "../types";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? defaultApiBaseUrl();

function defaultApiBaseUrl(): string {
  if (typeof window === "undefined") {
    return "http://localhost:18080/api/v1";
  }

  return `${window.location.protocol}//${window.location.hostname}:18080/api/v1`;
}

export async function fetchHealth(): Promise<HealthResponse> {
  const response = await fetch(`${apiBaseUrl}/health`);

  await ensureOk(response, "Health check failed");

  return response.json() as Promise<HealthResponse>;
}

interface ApiCrop {
  name: string;
  variety: string;
  grade_a_price_zmw: number;
  grade_b_price_zmw: number;
}

interface ReferenceDataResponse {
  crops: ApiCrop[];
  grades: string[];
  payment_methods: string[];
  collection_points: string[];
}

interface LoginResponse {
  session: {
    token_type: string;
    expires_in: number;
  };
  user: AuthenticatedUser;
}

export interface ReferenceData {
  crops: CropReference[];
  grades: string[];
  paymentMethods: string[];
  collectionPoints: string[];
}

export async function fetchReferenceData(): Promise<ReferenceData> {
  const response = await fetch(`${apiBaseUrl}/reference-data`);
  await ensureOk(response, "Reference data request failed");

  const payload = (await response.json()) as ReferenceDataResponse;
  return {
    crops: payload.crops.map((crop) => ({
      crop: crop.name,
      variety: crop.variety,
      gradeAPriceZmw: crop.grade_a_price_zmw,
      gradeBPriceZmw: crop.grade_b_price_zmw,
      isActive: true
    })),
    grades: payload.grades,
    paymentMethods: payload.payment_methods,
    collectionPoints: payload.collection_points
  };
}

export async function login(role: string): Promise<LoginResponse> {
  const response = await fetch(`${apiBaseUrl}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ role })
  });

  await ensureOk(response, "Sign-in failed");
  return response.json() as Promise<LoginResponse>;
}

export interface ProductionSnapshot {
  farmers: FarmerRecord[];
  fields: FieldRecord[];
  cropCycles: CropCycleRecord[];
  inputIssues: InputIssueRecord[];
  fieldVisits: FieldVisitRecord[];
}

export async function fetchProductionSnapshot(): Promise<ProductionSnapshot> {
  const [farmers, fields, cropCycles, inputIssues, fieldVisits] = await Promise.all([
    request<{ farmers: ApiFarmer[] }>("/farmers"),
    request<{ fields: ApiField[] }>("/fields"),
    request<{ crop_cycles: ApiCropCycle[] }>("/crop-cycles"),
    request<{ input_issues: ApiInputIssue[] }>("/input-issues"),
    request<{ field_visits: ApiFieldVisit[] }>("/field-visits")
  ]);

  return {
    farmers: farmers.farmers.map(mapFarmer),
    fields: fields.fields.map(mapField),
    cropCycles: cropCycles.crop_cycles.map(mapCropCycle),
    inputIssues: inputIssues.input_issues.map(mapInputIssue),
    fieldVisits: fieldVisits.field_visits.map(mapFieldVisit)
  };
}

export async function createFarmer(payload: Omit<FarmerRecord, "id" | "status">): Promise<{ farmer: FarmerRecord; warnings: string[] }> {
  const response = await request<{ farmer: ApiFarmer; warnings?: string[] }>("/farmers", {
    method: "POST",
    body: JSON.stringify(toApiFarmer(payload))
  });

  return { farmer: mapFarmer(response.farmer), warnings: response.warnings ?? [] };
}

export async function createField(payload: Omit<FieldRecord, "id" | "status">): Promise<FieldRecord> {
  const response = await request<{ field: ApiField }>("/fields", {
    method: "POST",
    body: JSON.stringify(toApiField(payload))
  });

  return mapField(response.field);
}

export async function createCropCycle(payload: Omit<CropCycleRecord, "id" | "status"> & { status?: string }): Promise<CropCycleRecord> {
  const response = await request<{ crop_cycle: ApiCropCycle }>("/crop-cycles", {
    method: "POST",
    body: JSON.stringify(toApiCropCycle(payload))
  });

  return mapCropCycle(response.crop_cycle);
}

export async function createInputIssue(payload: Omit<InputIssueRecord, "id">): Promise<InputIssueRecord> {
  const response = await request<{ input_issue: ApiInputIssue }>("/input-issues", {
    method: "POST",
    body: JSON.stringify(toApiInputIssue(payload))
  });

  return mapInputIssue(response.input_issue);
}

export async function createFieldVisit(payload: Omit<FieldVisitRecord, "id">): Promise<FieldVisitRecord> {
  const response = await request<{ field_visit: ApiFieldVisit }>("/field-visits", {
    method: "POST",
    body: JSON.stringify(toApiFieldVisit(payload))
  });

  return mapFieldVisit(response.field_visit);
}

export async function syncOfflineDraft(draft: OfflineDraft): Promise<void> {
  await request("/offline-drafts/sync", {
    method: "POST",
    body: JSON.stringify({
      type: draft.type,
      payload: draft.payload
    })
  });
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${apiBaseUrl}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...init?.headers
    }
  });

  await ensureOk(response, `Request failed for ${path}`);
  return response.json() as Promise<T>;
}

async function ensureOk(response: Response, fallbackMessage: string): Promise<void> {
  if (response.ok) {
    return;
  }

  let message = `${fallbackMessage} with status ${response.status}`;
  try {
    const payload = (await response.json()) as { message?: string };
    if (payload.message) {
      message = payload.message;
    }
  } catch {
    // Keep the status-based fallback when the response is not JSON.
  }

  throw new Error(message);
}

interface ApiFarmer {
  id: string;
  farmer_code: string;
  full_name: string;
  primary_phone: string;
  sex: string;
  district_area: string;
  registration_date: string;
  consent_status: string;
  status: string;
}

interface ApiField {
  id: string;
  field_code: string;
  farmer_id: string;
  acreage: number;
  latitude: number;
  longitude: number;
  location_label: string;
  status: string;
}

interface ApiCropCycle {
  id: string;
  field_id: string;
  crop_code: string;
  variety_code: string;
  area_planted: number;
  planting_date: string;
  expected_harvest_date: string;
  stage: string;
  expected_yield: number;
  status: string;
}

interface ApiInputIssue {
  id: string;
  farmer_id: string;
  crop_cycle_id: string;
  item: string;
  quantity: number;
  unit: string;
  issue_date: string;
  issuer: string;
  recoverable: boolean;
  recoverable_value: number;
}

interface ApiFieldVisit {
  id: string;
  field_id: string;
  crop_cycle_id: string;
  officer: string;
  visit_date: string;
  crop_stage: string;
  condition: string;
  notes: string;
  risk_category: string;
  risk_severity: string;
  recommendation: string;
  follow_up_date: string;
  photo_name: string;
}

function mapFarmer(farmer: ApiFarmer): FarmerRecord {
  return {
    id: farmer.id,
    farmerCode: farmer.farmer_code,
    fullName: farmer.full_name,
    primaryPhone: farmer.primary_phone,
    sex: farmer.sex,
    districtArea: farmer.district_area,
    registrationDate: farmer.registration_date,
    consentStatus: farmer.consent_status,
    status: farmer.status
  };
}

function mapField(field: ApiField): FieldRecord {
  return {
    id: field.id,
    fieldCode: field.field_code,
    farmerId: field.farmer_id,
    acreage: field.acreage,
    latitude: field.latitude,
    longitude: field.longitude,
    locationLabel: field.location_label,
    status: field.status
  };
}

function mapCropCycle(cycle: ApiCropCycle): CropCycleRecord {
  return {
    id: cycle.id,
    fieldId: cycle.field_id,
    cropCode: cycle.crop_code,
    varietyCode: cycle.variety_code,
    areaPlanted: cycle.area_planted,
    plantingDate: cycle.planting_date,
    expectedHarvestDate: cycle.expected_harvest_date,
    stage: cycle.stage,
    expectedYield: cycle.expected_yield,
    status: cycle.status
  };
}

function mapInputIssue(issue: ApiInputIssue): InputIssueRecord {
  return {
    id: issue.id,
    farmerId: issue.farmer_id,
    cropCycleId: issue.crop_cycle_id,
    item: issue.item,
    quantity: issue.quantity,
    unit: issue.unit,
    issueDate: issue.issue_date,
    issuer: issue.issuer,
    recoverable: issue.recoverable,
    recoverableValue: issue.recoverable_value
  };
}

function mapFieldVisit(visit: ApiFieldVisit): FieldVisitRecord {
  return {
    id: visit.id,
    fieldId: visit.field_id,
    cropCycleId: visit.crop_cycle_id,
    officer: visit.officer,
    visitDate: visit.visit_date,
    cropStage: visit.crop_stage,
    condition: visit.condition,
    notes: visit.notes,
    riskCategory: visit.risk_category,
    riskSeverity: visit.risk_severity,
    recommendation: visit.recommendation,
    followUpDate: visit.follow_up_date,
    photoName: visit.photo_name
  };
}

function toApiFarmer(farmer: Omit<FarmerRecord, "id" | "status">): Omit<ApiFarmer, "id" | "status"> {
  return {
    farmer_code: farmer.farmerCode,
    full_name: farmer.fullName,
    primary_phone: farmer.primaryPhone,
    sex: farmer.sex,
    district_area: farmer.districtArea,
    registration_date: farmer.registrationDate,
    consent_status: farmer.consentStatus
  };
}

function toApiField(field: Omit<FieldRecord, "id" | "status">): Omit<ApiField, "id" | "status"> {
  return {
    field_code: field.fieldCode,
    farmer_id: field.farmerId,
    acreage: field.acreage,
    latitude: field.latitude,
    longitude: field.longitude,
    location_label: field.locationLabel
  };
}

function toApiCropCycle(cycle: Omit<CropCycleRecord, "id" | "status"> & { status?: string }): Omit<ApiCropCycle, "id"> {
  return {
    field_id: cycle.fieldId,
    crop_code: cycle.cropCode,
    variety_code: cycle.varietyCode,
    area_planted: cycle.areaPlanted,
    planting_date: cycle.plantingDate,
    expected_harvest_date: cycle.expectedHarvestDate,
    stage: cycle.stage,
    expected_yield: cycle.expectedYield,
    status: cycle.status ?? "planned"
  };
}

function toApiInputIssue(issue: Omit<InputIssueRecord, "id">): Omit<ApiInputIssue, "id"> {
  return {
    farmer_id: issue.farmerId,
    crop_cycle_id: issue.cropCycleId,
    item: issue.item,
    quantity: issue.quantity,
    unit: issue.unit,
    issue_date: issue.issueDate,
    issuer: issue.issuer,
    recoverable: issue.recoverable,
    recoverable_value: issue.recoverableValue
  };
}

function toApiFieldVisit(visit: Omit<FieldVisitRecord, "id">): Omit<ApiFieldVisit, "id"> {
  return {
    field_id: visit.fieldId,
    crop_cycle_id: visit.cropCycleId,
    officer: visit.officer,
    visit_date: visit.visitDate,
    crop_stage: visit.cropStage,
    condition: visit.condition,
    notes: visit.notes,
    risk_category: visit.riskCategory,
    risk_severity: visit.riskSeverity,
    recommendation: visit.recommendation,
    follow_up_date: visit.followUpDate,
    photo_name: visit.photoName
  };
}
