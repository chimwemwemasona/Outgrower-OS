import type { CropDefault, ReferenceOption, RoleKey } from "../types";

export const cropDefaults: CropDefault[] = [
  { crop: "Tomato", variety: "Tengeru 97", gradeAPriceZmw: 8, gradeBPriceZmw: 5.5 },
  { crop: "Onion", variety: "Red Creole", gradeAPriceZmw: 10, gradeBPriceZmw: 7 },
  { crop: "Cabbage", variety: "Copenhagen Market", gradeAPriceZmw: 6, gradeBPriceZmw: 4.5 },
  { crop: "Chilli", variety: "ABE Chilli", gradeAPriceZmw: 18, gradeBPriceZmw: 12 }
];

export const roleLabels: Record<RoleKey, string> = {
  admin: "System Administrator",
  production_manager: "Production Manager",
  field_officer: "Field Officer / Agronomist",
  collection_quality: "Collection / Quality Officer",
  finance: "Finance Officer",
  viewer: "Buyer / Management Viewer"
};

export const gradeOptions: ReferenceOption[] = [
  { value: "grade_a", label: "Grade A" },
  { value: "grade_b", label: "Grade B" },
  { value: "reject", label: "Reject" }
];

export const rejectionReasons: ReferenceOption[] = [
  { value: "pest_damage", label: "Pest damage" },
  { value: "disease_damage", label: "Disease damage" },
  { value: "immature", label: "Immature produce" },
  { value: "physical_damage", label: "Physical damage" },
  { value: "contamination", label: "Contamination" },
  { value: "undersized", label: "Undersized" },
  { value: "overripe", label: "Overripe" }
];

export const paymentMethods: ReferenceOption[] = [
  { value: "cash", label: "Cash" },
  { value: "mobile_money", label: "Mobile money" },
  { value: "bank_transfer", label: "Bank transfer" }
];

