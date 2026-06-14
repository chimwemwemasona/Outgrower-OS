import { useEffect, useMemo, useState } from "react";
import { ClipboardCheck, Database, LogOut, ShieldCheck, Sprout } from "lucide-react";
import { hasPermission } from "./auth/permissions";
import { fetchHealth, fetchReferenceData, login } from "./api/client";
import { cropDefaults, gradeOptions, paymentMethods, roleLabels } from "./data/prototypeDefaults";
import type { AuthenticatedUser, CropReference, HealthResponse, RoleKey } from "./types";

const foundationItems = [
  "React + TypeScript PWA shell",
  "Go API foundation",
  "PostgreSQL migrations",
  "Role-based access model",
  "Reference-data seeds"
];

const roleKeys = Object.keys(roleLabels) as RoleKey[];

export function App() {
  const [activeUser, setActiveUser] = useState<AuthenticatedUser | null>(null);
  const [selectedRole, setSelectedRole] = useState<RoleKey>("admin");
  const [crops, setCrops] = useState(() => cropDefaults.map((crop) => ({ ...crop, isActive: true })));
  const [grades, setGrades] = useState(() => gradeOptions.map((grade) => grade.label));
  const [methods, setMethods] = useState(() => paymentMethods.map((method) => method.label));
  const [collectionPoints, setCollectionPoints] = useState<string[]>([]);
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [apiStatus, setApiStatus] = useState<"checking" | "connected" | "offline">("checking");
  const [message, setMessage] = useState("Checking backend API...");
  const [isSigningIn, setIsSigningIn] = useState(false);

  useEffect(() => {
    let isCurrent = true;

    async function loadFoundationData() {
      try {
        const [healthResponse, referenceData] = await Promise.all([fetchHealth(), fetchReferenceData()]);
        if (!isCurrent) {
          return;
        }

        setHealth(healthResponse);
        setCrops(referenceData.crops);
        setGrades(referenceData.grades);
        setMethods(referenceData.paymentMethods);
        setCollectionPoints(referenceData.collectionPoints);
        setApiStatus("connected");
        setMessage("Backend API connected.");
      } catch (error) {
        if (!isCurrent) {
          return;
        }

        setApiStatus("offline");
        setMessage(error instanceof Error ? error.message : "Backend API unavailable; showing local seed data.");
      }
    }

    void loadFoundationData();
    return () => {
      isCurrent = false;
    };
  }, []);

  const activeRole = activeUser?.role ?? null;
  const signedInLabel = activeUser ? `${activeUser.name} (${roleLabels[activeUser.role]})` : "Not signed in";
  const canManageReference = activeRole ? hasPermission(activeRole, "reference.manage") : false;
  const canRecordVisits = activeRole ? hasPermission(activeRole, "visits.write") : false;
  const canRecordPayments = activeRole ? hasPermission(activeRole, "payments.write") : false;
  const canRecordDeliveries = activeRole ? hasPermission(activeRole, "deliveries.write") : false;

  const visibleModules = useMemo(
    () => [
      { label: "Field visits", enabled: canRecordVisits },
      { label: "Deliveries", enabled: canRecordDeliveries },
      { label: "Payments", enabled: canRecordPayments },
      { label: "Reference data", enabled: canManageReference }
    ],
    [canManageReference, canRecordDeliveries, canRecordPayments, canRecordVisits]
  );

  function toggleCrop(crop: CropReference) {
    setCrops((current) =>
      current.map((item) => (item.variety === crop.variety ? { ...item, isActive: !item.isActive } : item))
    );
  }

  async function handleSignIn() {
    setIsSigningIn(true);
    setMessage("Signing in through backend API...");

    try {
      const response = await login(selectedRole);
      setActiveUser(response.user);
      setApiStatus("connected");
      setMessage(`Signed in as ${response.user.name}.`);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Sign-in failed.");
    } finally {
      setIsSigningIn(false);
    }
  }

  function handleSignOut() {
    setActiveUser(null);
    setMessage("Signed out locally.");
  }

  return (
    <main className="app-shell">
      <header className="topbar">
        <div>
          <p className="eyebrow">Outgrower OS Zambia</p>
          <h1>Foundation workspace</h1>
        </div>
        <span className="status-pill">{signedInLabel}</span>
      </header>

      <section className={`api-banner ${apiStatus}`} aria-live="polite">
        <strong>{apiStatus === "connected" ? "API online" : apiStatus === "checking" ? "Checking API" : "API offline"}</strong>
        <span>{message}</span>
        {health ? <span>{health.service} v{health.version}</span> : null}
      </section>

      <section className="auth-panel" aria-label="Demo sign in">
        <div>
          <h2>Demo sign in</h2>
          <p>Select a role to inspect the Phase 2 permission foundation.</p>
        </div>
        <div className="auth-actions">
          <label>
            Role
            <select value={selectedRole} onChange={(event) => setSelectedRole(event.target.value as RoleKey)}>
              {roleKeys.map((role) => (
                <option key={role} value={role}>
                  {roleLabels[role]}
                </option>
              ))}
            </select>
          </label>
          <button type="button" onClick={handleSignIn} disabled={isSigningIn}>
            {isSigningIn ? "Signing in" : "Sign in"}
          </button>
          <button type="button" className="icon-button" onClick={handleSignOut} aria-label="Sign out">
            <LogOut aria-hidden="true" />
          </button>
        </div>
      </section>

      <section className="summary-grid" aria-label="Foundation summary">
        <article>
          <ShieldCheck aria-hidden="true" />
          <h2>Access</h2>
          <p>Roles are defined for administration, production, field work, collection, finance, and viewing.</p>
        </article>
        <article>
          <Sprout aria-hidden="true" />
          <h2>Crops</h2>
          <p>Tomato, onion, cabbage, and ABE Chilli are ready as prototype reference data.</p>
        </article>
        <article>
          <Database aria-hidden="true" />
          <h2>Data</h2>
          <p>The schema starts from farmer, field, crop cycle, input, visit, delivery, payment, and audit records.</p>
        </article>
        <article>
          <ClipboardCheck aria-hidden="true" />
          <h2>Acceptance</h2>
          <p>The first build target is a signed-in user seeing configured roles and reference data.</p>
        </article>
      </section>

      <section className="content-band two-column">
        <div>
          <h2>Role access</h2>
          <ul className="module-list">
            {visibleModules.map((module) => (
              <li key={module.label} className={module.enabled ? "enabled" : "disabled"}>
                <span>{module.label}</span>
                <strong>{module.enabled ? "Allowed" : "Hidden"}</strong>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2>Why this matters</h2>
          <p>
            Field, collection, and finance records affect traceability and payment trust, so the UI and API must both
            enforce role permissions.
          </p>
        </div>
      </section>

      <section className="content-band">
        <div>
          <h2>Phase 2 build targets</h2>
          <ul className="check-list">
            {foundationItems.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>

        <div>
          <h2>Seed crops</h2>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Crop</th>
                  <th>Variety</th>
                  <th>Grade A</th>
                  <th>Grade B</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {crops.map((crop) => (
                  <tr key={crop.variety}>
                    <td>{crop.crop}</td>
                    <td>{crop.variety}</td>
                    <td>ZMW {crop.gradeAPriceZmw.toFixed(2)}</td>
                    <td>ZMW {crop.gradeBPriceZmw.toFixed(2)}</td>
                    <td>
                      <button type="button" disabled={!canManageReference} onClick={() => toggleCrop(crop)}>
                        {crop.isActive ? "Deactivate" : "Activate"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="content-band two-column">
        <div>
          <h2>Roles</h2>
          <ul className="plain-list">
            {Object.values(roleLabels).map((role) => (
              <li key={role}>{role}</li>
            ))}
          </ul>
        </div>
        <div>
          <h2>Reference options</h2>
          <p>{grades.join(", ")}</p>
          <p>{methods.join(", ")}</p>
          <p>{collectionPoints.length > 0 ? collectionPoints.join(", ") : "Collection points loading from API."}</p>
        </div>
      </section>
    </main>
  );
}
