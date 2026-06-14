import type { AuthenticatedUser, CropReference, HealthResponse } from "../types";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:18080/api/v1";

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
