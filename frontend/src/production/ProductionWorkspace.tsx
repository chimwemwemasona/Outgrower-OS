import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import {
  createCropCycle,
  createFarmer,
  createField,
  createFieldVisit,
  createInputIssue,
  fetchProductionSnapshot,
  syncOfflineDraft
} from "../api/client";
import type {
  AuthenticatedUser,
  CropCycleRecord,
  CropReference,
  FarmerRecord,
  FieldRecord,
  FieldVisitRecord,
  InputIssueRecord,
  OfflineDraft
} from "../types";

const draftsKey = "outgrower-os:offline-drafts";

interface ProductionWorkspaceProps {
  user: AuthenticatedUser;
  crops: CropReference[];
}

type ProductionTab = "register" | "planting" | "support" | "offline";

export function ProductionWorkspace({ user, crops }: ProductionWorkspaceProps) {
  const [activeTab, setActiveTab] = useState<ProductionTab>("register");
  const [farmers, setFarmers] = useState<FarmerRecord[]>([]);
  const [fields, setFields] = useState<FieldRecord[]>([]);
  const [cropCycles, setCropCycles] = useState<CropCycleRecord[]>([]);
  const [inputIssues, setInputIssues] = useState<InputIssueRecord[]>([]);
  const [fieldVisits, setFieldVisits] = useState<FieldVisitRecord[]>([]);
  const [drafts, setDrafts] = useState<OfflineDraft[]>(() => loadDrafts());
  const [notice, setNotice] = useState("Load production records from the API to begin Phase 3.");

  const [farmerForm, setFarmerForm] = useState({
    farmerCode: "FARM-002",
    fullName: "Chileshe Banda",
    primaryPhone: "0977000002",
    sex: "Female",
    districtArea: "Kafue",
    registrationDate: today(),
    consentStatus: "verbal"
  });

  const [fieldForm, setFieldForm] = useState({
    fieldCode: "FIELD-002",
    farmerId: "",
    acreage: "1.00",
    latitude: "-15.7690",
    longitude: "28.1810",
    locationLabel: "Kafue block B"
  });

  const [cycleForm, setCycleForm] = useState({
    fieldId: "",
    cropCode: "tomato",
    varietyCode: "Tengeru 97",
    areaPlanted: "1.00",
    plantingDate: today(),
    expectedHarvestDate: "2026-09-30",
    stage: "planted",
    expectedYield: "7000"
  });

  const [inputForm, setInputForm] = useState({
    farmerId: "",
    cropCycleId: "",
    item: "Seed tray",
    quantity: "1",
    unit: "tray",
    issueDate: today(),
    issuer: user.name,
    recoverable: true,
    recoverableValue: "120"
  });

  const [visitForm, setVisitForm] = useState({
    fieldId: "",
    cropCycleId: "",
    officer: user.name,
    visitDate: today(),
    cropStage: "vegetative",
    condition: "Good stand establishment",
    notes: "Plants are establishing well. Check irrigation consistency.",
    riskCategory: "water_stress",
    riskSeverity: "medium",
    recommendation: "Review irrigation schedule within 3 days.",
    followUpDate: "",
    photoName: "field-photo-placeholder.jpg"
  });

  useEffect(() => {
    void refreshProduction();
  }, []);

  useEffect(() => {
    saveDrafts(drafts);
  }, [drafts]);

  useEffect(() => {
    setFieldForm((current) => ({ ...current, farmerId: current.farmerId || farmers[0]?.id || "" }));
    setInputForm((current) => ({ ...current, farmerId: current.farmerId || farmers[0]?.id || "" }));
  }, [farmers]);

  useEffect(() => {
    setCycleForm((current) => ({ ...current, fieldId: current.fieldId || fields[0]?.id || "" }));
    setVisitForm((current) => ({ ...current, fieldId: current.fieldId || fields[0]?.id || "" }));
  }, [fields]);

  useEffect(() => {
    setInputForm((current) => ({ ...current, cropCycleId: current.cropCycleId || cropCycles[0]?.id || "" }));
    setVisitForm((current) => ({ ...current, cropCycleId: current.cropCycleId || cropCycles[0]?.id || "" }));
  }, [cropCycles]);

  const openHighRisks = fieldVisits.filter((visit) => visit.riskSeverity === "high").length;
  const recoverableBalance = inputIssues.reduce((total, issue) => total + (issue.recoverable ? issue.recoverableValue : 0), 0);
  const expectedProduction = cropCycles.reduce((total, cycle) => total + cycle.areaPlanted * cycle.expectedYield, 0);

  const selectedCrop = useMemo(
    () => crops.find((crop) => crop.crop.toLowerCase() === cycleForm.cropCode),
    [crops, cycleForm.cropCode]
  );

  async function refreshProduction() {
    try {
      const snapshot = await fetchProductionSnapshot();
      setFarmers(snapshot.farmers);
      setFields(snapshot.fields);
      setCropCycles(snapshot.cropCycles);
      setInputIssues(snapshot.inputIssues);
      setFieldVisits(snapshot.fieldVisits);
      setNotice("Production records loaded from the backend API.");
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Could not load production records.");
    }
  }

  async function submitFarmer() {
    try {
      const response = await createFarmer(farmerForm);
      setFarmers((current) => [...current, response.farmer]);
      setNotice(response.warnings.length > 0 ? response.warnings.join(" ") : "Farmer registered through the API.");
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Could not register farmer.");
    }
  }

  async function submitField() {
    try {
      const field = await createField({
        ...fieldForm,
        acreage: Number(fieldForm.acreage),
        latitude: Number(fieldForm.latitude),
        longitude: Number(fieldForm.longitude)
      });
      setFields((current) => [...current, field]);
      setCycleForm((current) => ({ ...current, fieldId: field.id }));
      setVisitForm((current) => ({ ...current, fieldId: field.id }));
      setNotice("Field registered through the API.");
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Could not register field.");
    }
  }

  async function submitCropCycle() {
    try {
      const cycle = await createCropCycle({
        ...cycleForm,
        areaPlanted: Number(cycleForm.areaPlanted),
        expectedYield: Number(cycleForm.expectedYield),
        status: "planted"
      });
      setCropCycles((current) => [...current, cycle]);
      setNotice("Crop cycle created through the API.");
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Could not create crop cycle.");
    }
  }

  async function submitInputIssue() {
    try {
      const issue = await createInputIssue({
        ...inputForm,
        quantity: Number(inputForm.quantity),
        recoverableValue: Number(inputForm.recoverableValue)
      });
      setInputIssues((current) => [...current, issue]);
      setNotice("Input issue recorded through the API.");
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Could not record input issue.");
    }
  }

  async function submitFieldVisit() {
    try {
      const visit = await createFieldVisit(visitForm);
      setFieldVisits((current) => [...current, visit]);
      setNotice("Field visit recorded through the API.");
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Could not record field visit.");
    }
  }

  function saveOfflineDraft(type: OfflineDraft["type"]) {
    const draft: OfflineDraft = {
      id: crypto.randomUUID(),
      type,
      label:
        type === "farmer_registration"
          ? farmerForm.fullName
          : type === "field_visit"
            ? `${visitForm.officer} visit`
            : `${cycleForm.cropCode} planting`,
      payload:
        type === "farmer_registration"
          ? farmerForm
          : type === "field_visit"
            ? visitForm
            : cycleForm,
      status: "pending",
      createdAt: new Date().toISOString()
    };
    setDrafts((current) => [draft, ...current]);
    setNotice("Offline draft saved locally. Sync it when the API is available.");
  }

  async function syncDraft(draft: OfflineDraft) {
    setDrafts((current) => current.map((item) => (item.id === draft.id ? { ...item, status: "pending", error: undefined } : item)));
    try {
      await syncOfflineDraft(draft);
      setDrafts((current) => current.map((item) => (item.id === draft.id ? { ...item, status: "synced" } : item)));
      setNotice("Offline draft synced with the backend API.");
    } catch (error) {
      setDrafts((current) =>
        current.map((item) =>
          item.id === draft.id
            ? { ...item, status: "failed", error: error instanceof Error ? error.message : "Sync failed." }
            : item
        )
      );
      setNotice("Offline draft sync failed. Keep it queued and retry.");
    }
  }

  return (
    <section className="production-workspace" aria-label="Phase 3 production workspace">
      <div className="workspace-head">
        <div>
          <h2>Production workspace</h2>
          <p>Register farmers, map fields, plant crop cycles, issue inputs, record visits, and manage offline drafts.</p>
        </div>
        <button type="button" onClick={refreshProduction}>Refresh API data</button>
      </div>

      <div className="metric-strip">
        <Metric label="Farmers" value={farmers.length} />
        <Metric label="Fields" value={fields.length} />
        <Metric label="Crop cycles" value={cropCycles.length} />
        <Metric label="Open high risks" value={openHighRisks} />
        <Metric label="Expected kg" value={Math.round(expectedProduction).toLocaleString()} />
        <Metric label="Recoverable ZMW" value={recoverableBalance.toFixed(2)} />
      </div>

      <p className="notice-line">{notice}</p>

      <div className="tab-row" role="tablist" aria-label="Production workflow">
        <TabButton active={activeTab === "register"} onClick={() => setActiveTab("register")}>Register</TabButton>
        <TabButton active={activeTab === "planting"} onClick={() => setActiveTab("planting")}>Planting</TabButton>
        <TabButton active={activeTab === "support"} onClick={() => setActiveTab("support")}>Inputs & visits</TabButton>
        <TabButton active={activeTab === "offline"} onClick={() => setActiveTab("offline")}>Offline queue</TabButton>
      </div>

      {activeTab === "register" ? (
        <div className="workflow-grid">
          <FormPanel title="Farmer registration" action="Register farmer" onSubmit={submitFarmer} secondaryAction={() => saveOfflineDraft("farmer_registration")}>
            <Field label="Farmer code" value={farmerForm.farmerCode} onChange={(value) => setFarmerForm({ ...farmerForm, farmerCode: value })} />
            <Field label="Full name" value={farmerForm.fullName} onChange={(value) => setFarmerForm({ ...farmerForm, fullName: value })} />
            <Field label="Primary phone" value={farmerForm.primaryPhone} onChange={(value) => setFarmerForm({ ...farmerForm, primaryPhone: value })} />
            <Field label="Sex" value={farmerForm.sex} onChange={(value) => setFarmerForm({ ...farmerForm, sex: value })} />
            <Field label="District / area" value={farmerForm.districtArea} onChange={(value) => setFarmerForm({ ...farmerForm, districtArea: value })} />
            <Field label="Consent status" value={farmerForm.consentStatus} onChange={(value) => setFarmerForm({ ...farmerForm, consentStatus: value })} />
          </FormPanel>

          <FormPanel title="Field registration" action="Register field" onSubmit={submitField}>
            <SelectField label="Farmer" value={fieldForm.farmerId} onChange={(value) => setFieldForm({ ...fieldForm, farmerId: value })} options={farmers.map((farmer) => ({ value: farmer.id, label: `${farmer.farmerCode} - ${farmer.fullName}` }))} />
            <Field label="Field code" value={fieldForm.fieldCode} onChange={(value) => setFieldForm({ ...fieldForm, fieldCode: value })} />
            <Field label="Acreage" value={fieldForm.acreage} onChange={(value) => setFieldForm({ ...fieldForm, acreage: value })} />
            <Field label="Latitude" value={fieldForm.latitude} onChange={(value) => setFieldForm({ ...fieldForm, latitude: value })} />
            <Field label="Longitude" value={fieldForm.longitude} onChange={(value) => setFieldForm({ ...fieldForm, longitude: value })} />
            <Field label="Location label" value={fieldForm.locationLabel} onChange={(value) => setFieldForm({ ...fieldForm, locationLabel: value })} />
          </FormPanel>
        </div>
      ) : null}

      {activeTab === "planting" ? (
        <div className="workflow-grid">
          <FormPanel title="Planting confirmation" action="Create crop cycle" onSubmit={submitCropCycle} secondaryAction={() => saveOfflineDraft("planting_confirmation")}>
            <SelectField label="Field" value={cycleForm.fieldId} onChange={(value) => setCycleForm({ ...cycleForm, fieldId: value })} options={fields.map((field) => ({ value: field.id, label: field.fieldCode }))} />
            <SelectField label="Crop" value={cycleForm.cropCode} onChange={(value) => {
              const crop = crops.find((item) => item.crop.toLowerCase() === value);
              setCycleForm({ ...cycleForm, cropCode: value, varietyCode: crop?.variety ?? cycleForm.varietyCode });
            }} options={crops.map((crop) => ({ value: crop.crop.toLowerCase(), label: crop.crop }))} />
            <Field label="Variety" value={selectedCrop?.variety ?? cycleForm.varietyCode} onChange={(value) => setCycleForm({ ...cycleForm, varietyCode: value })} />
            <Field label="Area planted" value={cycleForm.areaPlanted} onChange={(value) => setCycleForm({ ...cycleForm, areaPlanted: value })} />
            <Field label="Planting date" value={cycleForm.plantingDate} onChange={(value) => setCycleForm({ ...cycleForm, plantingDate: value })} />
            <Field label="Expected harvest" value={cycleForm.expectedHarvestDate} onChange={(value) => setCycleForm({ ...cycleForm, expectedHarvestDate: value })} />
            <Field label="Expected yield / area" value={cycleForm.expectedYield} onChange={(value) => setCycleForm({ ...cycleForm, expectedYield: value })} />
          </FormPanel>

          <RecordList title="Active crop cycles" items={cropCycles.map((cycle) => `${cycle.id}: ${cycle.cropCode} on ${fieldLabel(fields, cycle.fieldId)} (${cycle.status})`)} />
        </div>
      ) : null}

      {activeTab === "support" ? (
        <div className="workflow-grid">
          <FormPanel title="Input issue" action="Record input" onSubmit={submitInputIssue}>
            <SelectField label="Farmer" value={inputForm.farmerId} onChange={(value) => setInputForm({ ...inputForm, farmerId: value })} options={farmers.map((farmer) => ({ value: farmer.id, label: farmer.fullName }))} />
            <SelectField label="Crop cycle" value={inputForm.cropCycleId} onChange={(value) => setInputForm({ ...inputForm, cropCycleId: value })} options={cropCycles.map((cycle) => ({ value: cycle.id, label: `${cycle.cropCode} - ${cycle.id}` }))} />
            <Field label="Item" value={inputForm.item} onChange={(value) => setInputForm({ ...inputForm, item: value })} />
            <Field label="Quantity" value={inputForm.quantity} onChange={(value) => setInputForm({ ...inputForm, quantity: value })} />
            <Field label="Unit" value={inputForm.unit} onChange={(value) => setInputForm({ ...inputForm, unit: value })} />
            <Field label="Recoverable ZMW" value={inputForm.recoverableValue} onChange={(value) => setInputForm({ ...inputForm, recoverableValue: value })} />
          </FormPanel>

          <FormPanel title="Field visit" action="Record visit" onSubmit={submitFieldVisit} secondaryAction={() => saveOfflineDraft("field_visit")}>
            <SelectField label="Field" value={visitForm.fieldId} onChange={(value) => setVisitForm({ ...visitForm, fieldId: value })} options={fields.map((field) => ({ value: field.id, label: field.fieldCode }))} />
            <SelectField label="Crop cycle" value={visitForm.cropCycleId} onChange={(value) => setVisitForm({ ...visitForm, cropCycleId: value })} options={cropCycles.map((cycle) => ({ value: cycle.id, label: `${cycle.cropCode} - ${cycle.id}` }))} />
            <Field label="Condition" value={visitForm.condition} onChange={(value) => setVisitForm({ ...visitForm, condition: value })} />
            <Field label="Risk category" value={visitForm.riskCategory} onChange={(value) => setVisitForm({ ...visitForm, riskCategory: value })} />
            <SelectField label="Risk severity" value={visitForm.riskSeverity} onChange={(value) => setVisitForm({ ...visitForm, riskSeverity: value })} options={["low", "medium", "high"].map((value) => ({ value, label: value }))} />
            <Field label="Recommendation" value={visitForm.recommendation} onChange={(value) => setVisitForm({ ...visitForm, recommendation: value })} />
            <Field label="Photo name" value={visitForm.photoName} onChange={(value) => setVisitForm({ ...visitForm, photoName: value })} />
          </FormPanel>
        </div>
      ) : null}

      {activeTab === "offline" ? (
        <div className="workflow-grid">
          <RecordList title="Offline drafts" items={drafts.map((draft) => `${draft.label} - ${draft.type} - ${draft.status}${draft.error ? ` (${draft.error})` : ""}`)} />
          <div className="form-panel">
            <h3>Sync queue</h3>
            <p>Drafts are provisional until the backend accepts them.</p>
            <div className="draft-actions">
              {drafts.map((draft) => (
                <button key={draft.id} type="button" disabled={draft.status === "synced"} onClick={() => void syncDraft(draft)}>
                  Sync {draft.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}

function Metric({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="metric">
      <strong>{value}</strong>
      <span>{label}</span>
    </div>
  );
}

function TabButton({ active, children, onClick }: { active: boolean; children: string; onClick: () => void }) {
  return (
    <button type="button" className={active ? "active-tab" : ""} onClick={onClick}>
      {children}
    </button>
  );
}

function FormPanel({ title, action, children, onSubmit, secondaryAction }: { title: string; action: string; children: ReactNode; onSubmit: () => void; secondaryAction?: () => void }) {
  return (
    <div className="form-panel">
      <h3>{title}</h3>
      <div className="form-grid">{children}</div>
      <div className="form-actions">
        <button type="button" onClick={onSubmit}>{action}</button>
        {secondaryAction ? <button type="button" className="secondary-button" onClick={secondaryAction}>Save offline draft</button> : null}
      </div>
    </div>
  );
}

function Field({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="field-control">
      {label}
      <input value={value} onChange={(event) => onChange(event.target.value)} />
    </label>
  );
}

function SelectField({ label, value, options, onChange }: { label: string; value: string; options: Array<{ value: string; label: string }>; onChange: (value: string) => void }) {
  return (
    <label className="field-control">
      {label}
      <select value={value} onChange={(event) => onChange(event.target.value)}>
        <option value="">Select</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>{option.label}</option>
        ))}
      </select>
    </label>
  );
}

function RecordList({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="form-panel">
      <h3>{title}</h3>
      <ul className="record-list">
        {items.length > 0 ? items.map((item) => <li key={item}>{item}</li>) : <li>No records yet.</li>}
      </ul>
    </div>
  );
}

function fieldLabel(fields: FieldRecord[], id: string) {
  return fields.find((field) => field.id === id)?.fieldCode ?? id;
}

function today() {
  return new Date().toISOString().slice(0, 10);
}

function loadDrafts(): OfflineDraft[] {
  try {
    const raw = localStorage.getItem(draftsKey);
    return raw ? (JSON.parse(raw) as OfflineDraft[]) : [];
  } catch {
    return [];
  }
}

function saveDrafts(drafts: OfflineDraft[]) {
  localStorage.setItem(draftsKey, JSON.stringify(drafts));
}
