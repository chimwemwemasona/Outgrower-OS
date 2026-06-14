# Outgrower OS Zambia Prototype

Master planning and progress guide for the Outgrower OS Zambia prototype / pilot validation release.

This README is the single source of truth for future implementation sessions. Every phase must be implemented incrementally, documented as it progresses, and closed only after the user has demonstrated understanding of the problem, the solution, the design choices, the edge cases, and the broader impact.

## Baseline Sources

- Product baseline: `Outgrower_OS_Prototype_SRS.docx`
- SRS version: 1.0
- SRS date: 14 June 2026
- Release type: Prototype for field and business validation
- Pilot geography: Lusaka Province, Zambia
- Pilot scale: 20-30 farmers, at least 30 fields, 2-3 priority crops
- Proposed development and pilot-preparation duration: 12-16 weeks
- Teaching baseline image: `assets/baseline/teaching-baseline.png`

> The baseline image is referenced above and transcribed below. If the image file is missing, future sessions must still follow the transcript and should save the original image at `assets/baseline/teaching-baseline.png` when it becomes available as a file.

![Teaching baseline](assets/baseline/teaching-baseline.png)

## Teaching Baseline

The attached image establishes how every implementation session should be run:

- Be a wise and effective teacher whose goal is to make sure the human deeply understands the session.
- Work incrementally. Do not save all explanation for the end.
- Before moving to the next stage, confirm the current stage is understood at both the high level, such as motivation, and the low level, such as business logic and edge cases.
- Keep a running Markdown document with a checklist of what the human should understand.
- Make sure the human understands:
  - The problem and why the problem exists.
  - The solution, why it was resolved that way, the design decisions, and the edge cases.
  - The broader context, why the work matters, and what the changes will impact.
- Ask the human to restate their understanding first, then fill in gaps.
- Use open-ended or multiple-choice questions when useful, changing the order of correct answers where applicable.
- Show code or use debugging where needed.
- Do not end a phase until the human has demonstrated understanding of everything on the phase checklist.

## Prototype Purpose

Outgrower OS Zambia is a digital production and procurement management system for smallholder farming networks. The prototype exists to validate whether one connected system can improve the complete outgrower production cycle before investing in a full commercial platform.

The prototype must prove:

- Field officers can capture useful farmer, field, visit, and planting data on mobile devices under low-connectivity conditions.
- Managers can see production status, risks, expected harvests, and operational gaps.
- Collection and finance users can record deliveries, quality, deductions, payments, and farmer statements.
- Produce deliveries can be traced back to farmers, fields, crop cycles, visits, and inputs.
- Pilot evidence can support a documented go / revise / stop decision.

## Pilot Success Measures

| Measure | Prototype target |
| --- | --- |
| Farmers registered | 20-30 |
| Fields mapped | At least 30 |
| Crops monitored | 2-3 |
| Field observations | At least 100 |
| Produce deliveries | At least 50 |
| Forecast coverage | All active pilot fields |
| Payment statements | Available for every farmer with a payable delivery |
| Data completeness | At least 90% for mandatory records |
| Critical workflow usability | At least 80% task completion without developer assistance |
| Pilot decision | Documented go / revise / stop recommendation |

## Session Operating Standard

Each implementation session must update this README before it ends.

For every phase or substantial feature, document:

- Problem: What operational or technical problem is being solved?
- Why: Why does this problem exist in the outgrower workflow?
- Solution: What was built or changed?
- Design decisions: Why was it solved this way?
- Edge cases: What unusual, invalid, offline, permission, or financial cases matter?
- Impact: What users, data, workflows, reports, or future phases are affected?
- Evidence: What tests, manual checks, screenshots, exports, or acceptance scenarios prove it works?
- Understanding check: What the user should be able to explain before the phase is considered complete.

Future sessions must teach as they implement. A phase is not complete until both the implementation evidence and the understanding checklist are complete.

## Current Phase Status

| Phase | Status | Owner | Last updated | Notes |
| --- | --- | --- | --- | --- |
| 1. Discovery and UX | Done | Product / UX / Engineering | 2026-06-14 | SRS baseline has been converted into approved prototype defaults, workflow, role, data, UX, backlog, and acceptance artifacts. |
| 2. Foundation | Done | Engineering | 2026-06-14 | React/Vite frontend, Gin backend, database schema/seeds, demo auth, role permissions, reference-data foundation, setup commands, and verification evidence are complete. |
| 3. Production Modules | Not Started | Engineering / Operations | 2026-06-14 | Farmer, field, crop cycle, inputs, visits, photos, and offline drafts pending. |
| 4. Procurement Modules | Not Started | Engineering / Finance / Collection | 2026-06-14 | Forecasts, collections, quality, deductions, payments, and statements pending. |
| 5. Reporting and Hardening | Not Started | Engineering / Product | 2026-06-14 | Dashboard, exports, audit, backups, performance, and security pending. |
| 6. UAT and Pilot Launch | Not Started | Product / Operations | 2026-06-14 | Training, setup data, acceptance evidence, and production launch pending. |
| 7. Pilot Support and Evaluation | Not Started | Product / Operations / Engineering | 2026-06-14 | Support logs, usage metrics, feedback, forecast analysis, and scale decision pending. |

Status values: `Not Started`, `In Progress`, `Blocked`, `Done`, `Deferred`.

## Local Development Commands

Use these commands from the repository root unless noted otherwise.

| Task | Command | Notes |
| --- | --- | --- |
| Install frontend dependencies | `npm install` | Uses the root npm workspace and installs `frontend` dependencies. |
| Run frontend dev server | `npm run dev` | Serves the Vite app, normally at `http://localhost:5173`. |
| Typecheck frontend | `npm run typecheck` | Runs TypeScript in strict mode for the frontend workspace. |
| Build frontend | `npm run build` | Produces the Vite production build. |
| Audit frontend dependencies | `npm audit` | Current Phase 2 baseline reports 0 vulnerabilities. |
| Run backend checks | `$env:GOCACHE='.cache/go-build'; & 'C:\Program Files\Go\bin\go.exe' test ./...` from `backend/` | Use the workspace-local Go build cache in restricted environments. |
| Run backend API | `$env:GOCACHE='C:\Users\justp\Documents\Outgrower OS\.cache\go-build'; $env:OUTGROWER_HTTP_ADDR=':18080'; & 'C:\Program Files\Go\bin\go.exe' run .\cmd\api` from `backend/` | Starts the Gin API on port 18080 to avoid common local Apache/IIS/dev-server collisions on 8080. |
| Backend health check | `Invoke-WebRequest -Uri 'http://127.0.0.1:18080/api/v1/health' -UseBasicParsing` | Confirms the Gin API is responding. |

## Prototype Phase Plan

### Phase 1. Discovery and UX

Objective: Validate the operating model, roles, workflows, data fields, and UX before application code is built.

Outputs:

- Validated end-to-end workflow from registration through payment statement.
- Role map for administrators, managers, field officers, collection staff, finance users, and read-only viewers.
- Data dictionary for core entities and reference data.
- Mobile-first wireframes for field workflows and desktop-friendly views for management and finance.
- Prioritized backlog mapped to SRS Must / Should / Could requirements.

Acceptance gate:

- Product owner and pilot representative approve workflows, roles, required fields, and phase backlog.
- All Must requirements are either represented in the backlog or explicitly waived with a reason.

Documentation requirements:

- Record workflow decisions in the Decision Log.
- Add open product questions to Open Questions.
- Update risks if pilot assumptions change.

Understanding checklist:

- The user can explain the full production cycle from farmer registration to payment.
- The user can identify each role and what data that role owns.
- The user can explain why complete workflows matter more than broad feature coverage.
- The user can describe which SRS items are intentionally out of scope for the prototype.

### Phase 2. Foundation

Objective: Establish the technical base for a separate frontend, backend, database, authentication, configuration, and repeatable environments.

Outputs:

- Repository structure for React + TypeScript PWA frontend and Go backend API.
- PostgreSQL setup with migrations and seed/reference-data scripts.
- Authentication and role-based access foundation.
- Base API structure with consistent validation and error responses.
- Local development environment and documented setup commands.

Acceptance gate:

- A user can sign in, roles can be enforced, reference data can be managed, and the system can run locally from documented commands.

Documentation requirements:

- Document architecture decisions, setup commands, environment variables, and known tradeoffs.
- Add test evidence for authentication, role access, and reference configuration.

Understanding checklist:

- The user can explain why the frontend and backend are separate.
- The user can explain why a modular monolith is appropriate for the prototype.
- The user can explain how roles protect farmer and payment information.
- The user can describe how reference data supports later workflow modules.

### Phase 3. Production Modules

Objective: Build the core production workflow for farmers, fields, crop cycles, inputs, monitoring visits, photos, and selected offline drafts.

Outputs:

- Farmer registry with duplicate-code blocking and probable duplicate phone warning.
- Field registration with GPS point and acreage.
- Crop cycle allocation, stage tracking, and status transitions.
- Input distribution with recoverable cost tracking.
- Field visit scheduling/completion with observations, risks, recommendations, follow-up dates, and photos.
- Offline draft capture for farmer registration, field visits, and planting confirmation.

Acceptance gate:

- A test farmer can be registered, assigned a field, planted, issued inputs, visited, flagged for risk, photographed, and synced after an offline draft.

Documentation requirements:

- Record business rules for duplicates, active crop cycles, input recoveries, risk closure, and provisional offline records.
- Add manual or automated test evidence for each Must production workflow.

Understanding checklist:

- The user can explain why farmer, field, and crop-cycle records must be separate.
- The user can explain the difference between online saved records and offline provisional drafts.
- The user can explain how input recoveries later affect payable balances.
- The user can describe high-severity risk behavior and closure requirements.

### Phase 4. Procurement Modules

Objective: Build harvest forecasting, collection, quality, deductions, payments, traceability, and printable farmer statements.

Outputs:

- Rule-based harvest forecasts from planted area and expected yield.
- Forecast aggregation by crop, farmer, location, and date range.
- Produce delivery records with batch references.
- Quality grading, accepted/rejected quantities, and rejection reasons.
- Gross value, deductions, input recoveries, net payable, payments, and outstanding balances.
- Printable farmer statements.
- Delivery traceability chain.

Acceptance gate:

- A test crop cycle can be forecast, delivered, graded, deducted, paid, printed as a statement, and traced back to farmer, field, visits, and inputs.

Documentation requirements:

- Record calculation examples for forecast quantity, gross value, net payable, and outstanding balance.
- Add evidence that accepted plus rejected quantity cannot exceed gross quantity.
- Add payment correction/reversal behavior once implemented.

Understanding checklist:

- The user can explain why net payable is gross value minus deductions and recoveries.
- The user can explain how traceability connects a delivery to production history.
- The user can explain why confirmed payments should be corrected by reversal rather than deletion.
- The user can describe how forecast accuracy will be evaluated during the pilot.

### Phase 5. Reporting and Hardening

Objective: Make the prototype operationally trustworthy through dashboards, exports, audit history, backups, performance checks, and security fixes.

Outputs:

- Pilot dashboard for farmers, fields, crop cycles, open high risks, forecast quantity, delivered quantity, and payable balance.
- CSV exports for farmer, field, forecast, delivery, and payment data.
- Audit history for material changes.
- Backup and restoration procedure.
- Structured logs and application error capture.
- Security and performance fixes needed for pilot launch.

Acceptance gate:

- Dashboard figures reconcile with detail lists, core records export to CSV, audit events exist for material changes, and backup restoration has been tested.

Documentation requirements:

- Record backup/restore proof, security checks, performance checks, and unresolved risks.
- Record any waived non-functional requirement with owner approval.

Understanding checklist:

- The user can explain why dashboards must reconcile with detail records.
- The user can explain what audit history protects and what it does not.
- The user can explain why backup restoration must be tested before field launch.
- The user can identify which risks remain before UAT.

### Phase 6. UAT and Pilot Launch

Objective: Prepare real pilot users, reference data, support procedures, and acceptance evidence for production launch.

Outputs:

- Role-based user training scenarios.
- Configured pilot users and reference data.
- Administrator runbook.
- Known-issues register.
- UAT evidence from field, collection, finance, and management users.
- Production launch checklist.

Acceptance gate:

- Pilot users complete role-based training and practical scenario checks, operational readiness is confirmed, and launch approval is documented.

Documentation requirements:

- Record UAT findings, fixes, workarounds, training completion, and launch approval.
- Update the Progress Log with production launch date and support contacts.

Understanding checklist:

- The user can explain each role's launch responsibilities.
- The user can explain how support severity works during the pilot.
- The user can describe known issues and approved workarounds.
- The user can explain the go / no-go decision for pilot launch.

### Phase 7. Pilot Support and Evaluation

Objective: Support live pilot usage, measure outcomes, evaluate adoption, and produce the scale decision.

Outputs:

- Support logs and incident summaries.
- Usage metrics and data-completeness reports.
- Forecast-versus-actual analysis.
- User feedback and task-completion findings.
- Key defects, workarounds, and enhancement recommendations.
- Written go / revise / stop recommendation.

Acceptance gate:

- Target farmer, field, visit, and delivery volumes have been attempted; statements have been produced; feedback has been gathered; forecast accuracy has been calculated; and the scale recommendation is documented.

Documentation requirements:

- Record pilot evidence, final metrics, lessons learned, and migration implications.
- Update commercial-platform migration notes before closing the pilot.

Understanding checklist:

- The user can explain whether the prototype validated the business case.
- The user can explain which prototype choices can be reused commercially and which need hardening.
- The user can explain the strongest evidence behind the go / revise / stop recommendation.
- The user can describe the next product investment decision.

## Phase 1 Discovery Workspace

Status: Done

Phase 1 turns the SRS into a shared operating blueprint before code is written. The main problem is that outgrower operations often fail because records are split across notebooks, spreadsheets, phone calls, and WhatsApp. That fragmentation creates disputes, weak forecasts, poor traceability, and incomplete payment evidence. Phase 1 prevents us from automating confusion by validating the real workflow, the responsible roles, the required data, and the first user experience shape.

### Draft End-to-End Workflow

1. Administrator configures users, roles, crops, varieties, grades, input types, rejection reasons, payment methods, and collection points.
2. Field officer registers a farmer with contact, identity, location, consent, and production notes.
3. Field officer registers one or more fields for the farmer, including acreage and GPS point.
4. Production manager allocates a crop cycle to a field with crop, variety, area planted, planting date, expected harvest date, and starting status.
5. Inputs are issued against the farmer or crop cycle, including recoverable value when applicable.
6. Field officer records planting confirmation and field visits with stage, condition, observations, risks, recommendations, follow-up date, and photos.
7. System calculates forecast quantity from planted area and expected yield, then aggregates it by crop, farmer, location, and date range.
8. Collection officer records produce delivery, gross quantity, grade, accepted quantity, rejected quantity, rejection reason, and batch reference.
9. System calculates gross value, deductions, input recoveries, net payable, and outstanding balance.
10. Finance officer records payment and generates a printable farmer statement.
11. Manager reviews dashboard, traceability chain, exports, open risks, forecast accuracy, and pilot evidence.

Workflow understanding check:

- Can the user explain why the workflow starts with configuration before field data capture?
- Can the user explain how a delivery traces back through farmer, field, crop cycle, visits, and inputs?
- Can the user explain why payments depend on collection, quality, deductions, and input recovery records?

### Role Map

| Role | Owns / updates | Reads | Phase 1 validation needed |
| --- | --- | --- | --- |
| System Administrator | Users, roles, reference data, account activation/deactivation, audit visibility | Full operational data | Confirm who will administer the pilot and reset accounts. |
| Production Manager | Crop cycles, production status, risks, forecasts, operational review | Farmers, fields, inputs, visits, dashboards | Confirm crop-cycle approval rules and risk review cadence. |
| Field Officer / Agronomist | Farmer registration, field registration, planting confirmation, visits, observations, risks, photos, offline drafts | Assigned farmers, fields, crop cycles, visit history | Confirm mobile device constraints and the minimum field form. |
| Collection / Quality Officer | Deliveries, grades, accepted/rejected quantities, rejection reasons, quality notes | Farmer/crop-cycle lookup and collection history | Confirm collection-point workflow and grading examples. |
| Finance Officer | Payments, payment references, statement generation, balance review | Deliveries, deductions, recoveries, farmer balances | Confirm payment approval, correction, and statement expectations. |
| Buyer / Management Viewer | No operational edits in prototype | Approved forecasts, collection summary, dashboard reports | Confirm which reports are safe for read-only viewing. |
| Farmer | Provides information and receives statements | No login in prototype | Confirm consent, statement format, and dispute-handling process. |

Role understanding check:

- Can the user identify which role creates each core record?
- Can the user explain why farmers have no direct login in the prototype?
- Can the user explain which roles should see payment and personal farmer information?

### Draft Data Dictionary

| Entity | Purpose | Key fields for prototype | Important rules |
| --- | --- | --- | --- |
| Organisation | Pilot operating unit | Name, pilot geography, timezone, currency | Prototype supports one organisation only. |
| User | Authenticated staff account | Name, email/phone, password hash, role, status | Deactivated users cannot sign in; old records remain attributable. |
| Role | Permission grouping | Role name, permissions | Access must block screens and API operations outside the role. |
| Farmer | Producer profile | Farmer code, name, phone, sex, district/area, registration date, consent, status | Farmer code must be unique; duplicate phones warn but do not automatically block. |
| Field | Physical production site | Field code, farmer, GPS point/boundary, acreage, location, status | Field code must be unique; GPS coordinates must be valid numbers. |
| Crop / Variety | Production reference data | Crop name, variety name, active status | Values already used by records should be deactivated, not deleted. |
| Crop Cycle | Production season on a field | Field, crop, variety, area planted, planting date, expected harvest, stage, expected yield, actual yield, status | A field should not have conflicting active crop cycles unless intercropping is explicitly enabled. |
| Input Issue | Input distribution and recovery record | Farmer/crop cycle, item, quantity, unit, issue date, issuer, unit cost, recoverable value | Negative quantities/costs are invalid; corrections should preserve history. |
| Field Visit | Monitoring record | Crop cycle, officer, date, stage, condition, observations, risk, recommendation, follow-up, photos | High-severity risks remain open until resolved or closed. |
| Forecast | Expected production estimate | Crop cycle, basis, expected quantity, date range, confidence/adjustment, status | Expected quantity equals planted area multiplied by expected yield unless manually adjusted with reason. |
| Delivery | Collection and batch record | Batch reference, farmer, crop cycle, date, collection point, gross quantity, accepted quantity, rejected quantity, grade, price | Accepted plus rejected quantity cannot exceed gross quantity. |
| Deduction | Value reduction or recovery | Delivery/farmer, type, amount, reason | Net payable subtracts deductions and approved recoveries. |
| Payment | Payment record | Farmer, amount, date, method, reference, status | Confirmed payments should be corrected by reversal or adjustment, not deletion. |
| Statement | Farmer-facing balance summary | Farmer, period, deliveries, deductions, payments, opening and closing balance | Must be printable from the browser. |
| Attachment | Uploaded evidence | File type, size, storage key, linked record, uploader | Images must be compressed where practical and validated before storage. |
| Audit Event | Change accountability | Actor, action, entity, entity ID, timestamp, selected before/after information | Audit details are visible to administrators and cannot be edited through the UI. |

Data understanding check:

- Can the user explain the difference between a farmer, a field, and a crop cycle?
- Can the user explain why reference data is deactivated instead of deleted?
- Can the user explain which records are financial and need stronger correction rules?

### Draft UX Surface Map

Mobile-first field surfaces:

- Sign in.
- Field officer home with assigned tasks, pending sync, and quick actions.
- Farmer registration form.
- Field registration form with GPS capture.
- Planting confirmation form.
- Field visit form with observations, risk, follow-up, and photo upload.
- Offline queue with pending, failed, and synced states.

Desktop-friendly management surfaces:

- Operations dashboard.
- Farmer profile with fields, crop cycles, inputs, visits, deliveries, payments, and balance.
- Crop-cycle detail with forecast, visits, risks, inputs, and delivery history.
- Forecast list with crop, location, date-range, and risk filters.
- Reference-data configuration.
- User and role administration.

Collection and finance surfaces:

- Delivery intake form.
- Quality and rejection form.
- Delivery detail with traceability chain.
- Payable balance review.
- Payment recording form.
- Printable farmer statement.

UX understanding check:

- Can the user explain why field workflows are mobile-first while management and finance workflows are desktop-friendly?
- Can the user describe the difference between offline draft, pending sync, failed sync, and confirmed server record?
- Can the user identify which screens are needed for the first end-to-end acceptance test?

### Prioritized Phase 1 Backlog

| Priority | Backlog item | SRS coverage | Phase 1 outcome |
| --- | --- | --- | --- |
| Must | Validate end-to-end workflow from configuration to payment statement. | Operating model, all Must workflow modules | Approved workflow or documented changes. |
| Must | Confirm pilot roles, permissions, and data ownership. | AUTH, roles, security/privacy | Role-permission matrix ready for Phase 2. |
| Must | Confirm mandatory fields for farmer, field, crop cycle, visit, delivery, payment, and statement records. | Data requirements, functional requirements | Data dictionary ready for schema design. |
| Must | Confirm offline scope for farmer registration, field visit, and planting confirmation drafts. | OFF-001 to OFF-003 | Offline behavior ready for architecture and UX design. |
| Must | Confirm financial calculation examples for price, deduction, input recovery, net payable, payment, and balance. | COL, PAY, BR-005, BR-006 | Testable calculation examples ready for implementation. |
| Must | Confirm acceptance scenarios for the first end-to-end test farmer. | Testing and acceptance | Scenario pack ready for Phase 2/3 test planning. |
| Should | Draft mobile wireframe notes for field workflows. | UX requirements | Low-fidelity screen inventory ready for implementation. |
| Should | Draft desktop wireframe notes for dashboard, profile, collection, finance, and configuration workflows. | UX/reporting requirements | Low-fidelity screen inventory ready for implementation. |
| Could | Identify future integration placeholders for SMS, WhatsApp, mobile money, accounting, and weather. | Deferred integrations | Notes only; no prototype implementation. |

### Phase 1 Approved Prototype Defaults

These defaults close the Phase 1 validation items and are approved as implementation assumptions for Phase 2. If product or operations later changes them, record the change in the Decision Log before implementing the new behavior.

| Item | Approved default |
| --- | --- |
| Pilot crops | Tomato, onion, cabbage, ABE Chilli |
| Initial varieties | Tomato: Tengeru 97; Onion: Red Creole; Cabbage: Copenhagen Market; Chilli: ABE Chilli |
| Pilot collection point | Lusaka Central Collection Point |
| Grading model | Grade A, Grade B, Reject |
| Rejection reasons | Pest damage, disease damage, immature produce, physical damage, contamination, undersized, overripe |
| Units | Kilogram for produce; kilogram, litre, packet, tray, and each for inputs |
| Currency | Zambian Kwacha, shown as ZMW with two decimal places |
| Example tomato Grade A price | ZMW 8.00 per kg |
| Example tomato Grade B price | ZMW 5.50 per kg |
| Example onion Grade A price | ZMW 10.00 per kg |
| Example onion Grade B price | ZMW 7.00 per kg |
| Example cabbage Grade A price | ZMW 6.00 per head or kg equivalent; implementation should store the configured unit with the price |
| Example quality deduction | 10% deduction for Grade B when a crop uses one base price instead of grade-specific prices |
| Example input recovery | Seed tray issued at ZMW 120.00 recoverable against future deliveries |
| Example payment methods | Cash, mobile money, bank transfer |
| UAT representative users | One administrator, one production manager, two field officers, one collection/quality officer, one finance officer, one management viewer |
| Mobile device assumption | Android 9+ using current Chrome or Chromium-based browser on a low-to-mid range smartphone |
| Connectivity assumption | Intermittent 3G/4G; selected field forms must save drafts offline and sync later |
| Farmer consent default | Verbal consent or signed acknowledgement captured as `consent_status`, `consent_date`, and optional notes during farmer registration |
| Language default | English labels for prototype; use plain wording that can be translated later |
| Timezone | Africa/Lusaka |

### Role-Permission Matrix

Permissions are grouped for prototype clarity. Phase 2 should enforce them in both the UI and API.

| Capability | Admin | Production Manager | Field Officer | Collection / Quality | Finance | Viewer |
| --- | --- | --- | --- | --- | --- | --- |
| Manage users and roles | Yes | No | No | No | No | No |
| Manage reference data | Yes | No | No | No | No | No |
| View dashboard | Yes | Yes | Limited | Limited | Limited | Yes |
| Create/edit farmers | Yes | Yes | Yes | No | No | No |
| Create/edit fields | Yes | Yes | Yes | No | No | No |
| Create/edit crop cycles | Yes | Yes | Limited planting confirmation | No | No | No |
| Issue inputs | Yes | Yes | Yes | No | No | No |
| Schedule/complete visits | Yes | Yes | Yes | No | No | No |
| Record deliveries | Yes | No | No | Yes | No | No |
| Record quality results | Yes | No | No | Yes | No | No |
| Record payments | Yes | No | No | No | Yes | No |
| Generate statements | Yes | Yes | No | No | Yes | No |
| Export CSV reports | Yes | Yes | No | Limited collection exports | Yes | Approved summaries only |
| View audit history | Yes | No | No | No | No | No |

### Required Field Set

These are the minimum fields Phase 2 and Phase 3 should design for. Additional optional fields may be added only when they support the SRS.

| Record | Required fields |
| --- | --- |
| User | Full name, email or phone, role, status |
| Farmer | Farmer code, full name, primary phone, sex, district/area, registration date, consent status |
| Field | Field code, farmer, acreage, GPS latitude, GPS longitude, location label, status |
| Crop Cycle | Field, crop, variety, area planted, planting date, expected harvest date, stage, expected yield, status |
| Input Issue | Item, quantity, unit, issue date, recipient farmer or crop cycle, issuer, recoverable flag |
| Field Visit | Field, crop cycle, officer, visit date, crop stage, condition, notes |
| Observation / Risk | Risk category, severity, recommendation, follow-up date when follow-up is needed |
| Forecast | Crop cycle, planted area, expected yield, expected quantity, expected date range |
| Delivery | Farmer, crop cycle, delivery date, collection point, gross quantity, accepted quantity, rejected quantity, grade, price |
| Deduction | Farmer or delivery, deduction type, amount, reason |
| Payment | Farmer, amount, payment date, method, reference |
| Statement | Farmer, period start, period end |

### Low-Fidelity Wireframe Specs

These notes are the Phase 1 wireframe baseline. They describe layout and behavior without requiring visual design work yet.

| Screen | Primary user | Required content and controls |
| --- | --- | --- |
| Sign in | All staff | Email/phone, password, submit, safe generic error, session handling. |
| Field Officer Home | Field officer | Quick actions for register farmer, register field, planting confirmation, field visit, pending sync; list of recent assigned farmers/fields. |
| Farmer Registration | Field officer | Required farmer fields, consent capture, duplicate farmer-code blocking, duplicate-phone warning, save draft when offline. |
| Field Registration | Field officer | Farmer lookup, field code, acreage, GPS capture, manual coordinate fallback, status, save draft if needed. |
| Planting Confirmation | Field officer | Field/crop-cycle lookup, crop, variety, area planted, planting date, stage, expected harvest, offline draft support. |
| Field Visit | Field officer | Crop-cycle lookup, date, stage, condition, notes, risk severity, recommendation, follow-up date, photo upload, offline draft support. |
| Offline Queue | Field officer | Pending, failed, and synced draft states; retry failed sync; clear success state only after server confirmation. |
| Operations Dashboard | Manager/viewer | Farmers, fields, active crop cycles, open high risks, forecast quantity, delivered quantity, payable balance, filters. |
| Farmer Profile | Manager/finance | Farmer details, fields, crop cycles, inputs, visits, deliveries, payments, balance, statement action. |
| Crop Cycle Detail | Manager/field officer | Crop status, forecast basis, visits, open risks, inputs, delivery history, traceability links. |
| Delivery Intake | Collection/quality | Farmer/crop-cycle lookup, gross quantity, grade, accepted/rejected quantities, rejection reason, price, batch reference. |
| Payment Recording | Finance | Farmer balance, payable line items, payment amount, method, date, reference, overpayment confirmation. |
| Farmer Statement | Finance/manager | Period selector, opening balance, deliveries, deductions/recoveries, payments, closing balance, browser print. |
| Configuration | Admin | Crops, varieties, input types, grades, rejection reasons, payment methods, collection points, deactivate instead of delete. |

### Phase 1 Validation Closure

The original open validation items are closed as follows:

| Question | Closure |
| --- | --- |
| Which 2-3 priority crops will be used in the pilot? | Tomato, onion, cabbage, and ABE Chilli are approved as prototype defaults; the pilot success target remains 2-3 actively monitored crops. |
| What exact crop varieties should be configured first? | Tengeru 97, Red Creole, Copenhagen Market, and ABE Chilli. |
| What are the collection points and grading rules? | Start with Lusaka Central Collection Point and Grade A / Grade B / Reject. |
| What are the price, deduction, input recovery, and payment examples? | Use the approved prototype defaults above as seed data and test examples. |
| Which users will represent each role during UAT? | Use one admin, one production manager, two field officers, one collection/quality officer, one finance officer, and one viewer. |
| What Android devices and connectivity should the mobile UX assume? | Android 9+ Chrome on low-to-mid range devices with intermittent 3G/4G. |
| What consent process should be used? | Capture farmer consent status, date, and optional notes during registration; allow signed or verbal acknowledgement. |

### Phase 1 Acceptance Scenario Draft

The first acceptance scenario should prove a complete production cycle without direct database edits:

1. Admin creates reference data and users.
2. Field officer registers farmer `FARM-001`.
3. Field officer registers field `FIELD-001` with acreage and GPS point.
4. Manager creates an active crop cycle for a pilot crop.
5. Field officer records planting confirmation and one field visit with a medium or high risk.
6. Field officer captures one offline visit draft and syncs it successfully.
7. System calculates a forecast from planted area and expected yield.
8. Collection officer records a delivery with accepted and rejected quantities.
9. System calculates gross value, deductions, recoveries, and net payable.
10. Finance officer records a partial or full payment.
11. User prints a farmer statement.
12. Manager opens the delivery traceability chain and verifies linked farmer, field, crop cycle, visits, inputs, quality, and payment context.

### Phase 1 Teaching Notes

What matters most in this phase:

- The prototype is not just a CRUD app. It is a test of whether one connected operating record improves trust, forecasting, traceability, and payment clarity.
- The core modeling choice is farmer -> field -> crop cycle -> visit/input/forecast -> delivery -> payment. Keeping those concepts separate prevents confusion later.
- Offline records are provisional. They help field officers keep working, but they do not become official until synchronized.
- Financial records need stronger correction behavior than ordinary drafts because deleting or silently editing them can create disputes.
- Traceability is only as strong as the links captured earlier in the workflow.

## Progress Log

Append new entries at the top of this table.

| Date | Phase | Completed work | Decisions made | Tests / evidence | Risks / blockers | Next step |
| --- | --- | --- | --- | --- | --- | --- |
| 2026-06-14 | Phase 2. Foundation | Wired the frontend to the Gin backend for health, reference data, and demo sign-in. | Frontend should use backend APIs as the source of truth for foundation data, with local seed data only as a fallback if the API is unavailable. | `npm run typecheck`, `npm run build`, `npm audit`, `go test ./...`, and API CORS smoke tests passed. | Reference-data activation toggles are still local UI state until persistence-backed configuration is implemented. | Phase 3 can build production modules on a live frontend/backend contract. |
| 2026-06-14 | Phase 2. Foundation | Changed the backend default/documented API port from 8080 to 18080 after local 8080 requests were served by Apache. | Use port 18080 for the prototype Gin API unless the operator explicitly overrides `OUTGROWER_HTTP_ADDR`. | Local probe showed `127.0.0.1:8080` returned `Server: Apache`; backend docs and env defaults now use 18080. | None. | Use `http://127.0.0.1:18080/api/v1/...` for API checks. |
| 2026-06-14 | Phase 2. Foundation | Migrated the backend API from standard-library routing to Gin and completed Phase 2 acceptance. | Gin is the Go framework of choice for the backend API. | `go test ./...` passed; Gin API smoke test passed for `/api/v1/health`, `/api/v1/reference-data` with ABE Chilli, and `/api/v1/auth/login`; `npm run typecheck`, `npm run build`, and `npm audit` passed. | Workspace-local `GOCACHE` is still needed in this restricted environment. | Begin Phase 3 Production Modules: farmer, field, crop cycle, inputs, visits, photos, and offline drafts. |
| 2026-06-14 | Phase 2. Foundation | Installed Go and verified the backend scaffold. | Use workspace-local `GOCACHE` for backend checks in this restricted environment. | `C:\Program Files\Go\bin\go.exe version` returned Go 1.26.4; `go test ./...` passed with `GOCACHE=.cache/go-build`; machine PATH includes `C:\Program Files\Go\bin`. | Current tool shell may not see `go` on PATH until a new terminal/session is opened; absolute path works now. | Continue Phase 2 by replacing demo auth with database-backed users/sessions. |
| 2026-06-14 | Phase 2. Foundation | Added demo sign-in by role, permission-aware module visibility, local reference-data activation toggles, and backend auth endpoint shapes. | Use a lightweight demo auth/config flow to prove the role model before database-backed sessions are implemented. | `npm run typecheck`, `npm run build`, `npm audit`, and bounded dev-server HTTP 200 passed after the changes. | Superseded by Go install verification above. | Replace demo auth with database-backed users/sessions. |
| 2026-06-14 | Phase 2. Foundation | Verified the frontend scaffold with dependency install, typecheck, production build, audit, and bounded dev-server smoke test. | Use npm workspace scripts as the frontend verification path. | `npm install`, `npm run typecheck`, `npm run build`, `npm audit`, and dev-server HTTP 200 all passed; build/dev required elevated execution because sandbox blocked esbuild spawn. | Superseded by Go install verification above. | Continue auth/session wiring. |
| 2026-06-14 | Phase 2. Foundation | Scaffolded React + TypeScript + Vite frontend, Go API foundation, PostgreSQL migration and seed files, shared permission model, env example, and workspace scripts. | Keep the first backend foundation on Go standard library HTTP until route complexity justifies a framework. | Files created under `frontend/`, `backend/`, `database/`, `shared/`, plus root package/env/gitignore files. | Superseded by Go install verification above. | Continue from verified frontend and backend foundation. |
| 2026-06-14 | Phase 1. Discovery and UX | Added ABE Chilli to the approved prototype defaults and initial variety seed list. | Treat ABE Chilli as a configured prototype crop while keeping the SRS pilot success target at 2-3 actively monitored crops. | README defaults, validation closure, and decision log updated. | None. | Include ABE Chilli in Phase 2 reference-data seeds. |
| 2026-06-14 | Phase 1. Discovery and UX | Completed Phase 1 by closing validation items with approved prototype defaults, role-permission matrix, required field set, low-fidelity wireframe specs, and validation closure table. | Phase 1 defaults are approved for Phase 2 implementation unless changed through the Decision Log. | README Phase 1 workspace now contains workflow, roles, permissions, data dictionary, required fields, UX surfaces, screen specs, backlog, acceptance scenario, defaults, and teaching notes. | Defaults are suitable for prototype implementation but should be rechecked with real pilot operators before UAT. | Begin Phase 2 Foundation: scaffold frontend/backend, database, auth, roles, reference data, and local setup. |
| 2026-06-14 | Phase 1. Discovery and UX | Converted the SRS into draft discovery artifacts: workflow, role map, data dictionary, UX surface map, prioritized backlog, validation items, acceptance scenario, and teaching notes. | Treat SRS workflow and entities as the draft operating blueprint until product/pilot validation changes them. | README contains Phase 1 workspace with all required discovery outputs in draft form. | Superseded by completed Phase 1 closure above. | Use approved Phase 1 defaults for Phase 2. |
| 2026-06-14 | Planning baseline | Created master README structure for phased implementation, progress tracking, decision logging, and teaching baseline preservation. | Use one root README as the source of truth; preserve the teaching baseline as image path plus transcript. | Markdown structure created; all seven SRS phases represented. | Original attached image is not yet available as a filesystem asset. | Save original image to `assets/baseline/teaching-baseline.png` when available; begin Phase 1 discovery. |

## Decision Log

Append new entries at the top of this table.

| Date | Category | Decision | Rationale | Impact |
| --- | --- | --- | --- | --- |
| 2026-06-14 | Architecture | Wire the Phase 2 frontend to the Gin backend APIs. | The foundation should prove browser-to-API flow before Phase 3 adds real production workflows. | `App.tsx` now calls health, reference-data, and login endpoints through `frontend/src/api/client.ts`. |
| 2026-06-14 | Architecture | Allow both `localhost:5173` and `127.0.0.1:5173` as local frontend origins. | Local development may use either hostname, and CORS must not block valid browser API calls. | Backend CORS now uses `OUTGROWER_ALLOWED_ORIGINS` with a comma-separated local allowlist. |
| 2026-06-14 | Architecture | Use port 18080 as the default local Gin API port. | Port 8080 is already served by Apache in the local environment, causing API health checks to hit the wrong process. | `.env.example`, backend default address, README commands, and local checks use `http://127.0.0.1:18080`. |
| 2026-06-14 | Architecture | Use Gin as the Go backend web framework. | Gin gives the prototype a familiar router, middleware pattern, JSON binding, recovery, and route grouping without heavy architectural ceremony. | Backend routes should be implemented through Gin handlers and middleware; the prior standard-library-only routing decision is superseded. |
| 2026-06-14 | Architecture | Scaffold the frontend as a React + TypeScript + Vite PWA workspace. | This matches the SRS recommendation and keeps the field/mobile and desktop management UI in one browser-based app. | Frontend code lives in `frontend/` and root npm scripts delegate to that workspace. |
| 2026-06-14 | Architecture | Supersede the standard-library-only backend routing decision. | The user selected Gin as the framework of choice before Phase 2 completion. | Backend code now uses Gin in `backend/cmd/api/main.go`. |
| 2026-06-14 | Data | Add PostgreSQL migration and reference-data seed files before implementing domain workflows. | The SRS requires repeatable scripts and stable reference configuration. | Phase 2 can initialize roles, crops, varieties, grades, collection point, and payment methods from SQL. |
| 2026-06-14 | Security | Represent role permissions in shared JSON plus frontend and backend helpers. | Permissions must be enforced in both UI and API, and a shared source makes drift easier to spot. | Future Phase 2 auth work should wire these permissions into session/user checks. |
| 2026-06-14 | Product | Add ABE Chilli to the prototype crop defaults and initial variety seed list. | The prototype should support chilli as part of the configured horticultural crop set. | Phase 2 seed data should include ABE Chilli; pilot reporting still measures the SRS target of 2-3 actively monitored crops. |
| 2026-06-14 | Product | Use tomato, onion, and cabbage as the prototype pilot crops. | The SRS requires 2-3 priority crops, and these are practical horticultural crops for a Lusaka Province validation pilot. | Phase 2 seed data and Phase 3/4 acceptance scenarios should use these crops unless a later decision changes them. |
| 2026-06-14 | Product | Use Tengeru 97, Red Creole, Copenhagen Market, and ABE Chilli as the initial crop varieties. | The prototype needs named varieties for configuration, field workflows, and forecast examples. | Reference-data seeds should include these varieties. |
| 2026-06-14 | Product | Use Lusaka Central Collection Point, Grade A / Grade B / Reject, and the documented price examples as prototype procurement defaults. | Phase 4 needs concrete collection, quality, and payment examples for testable financial flows. | Calculation tests and seed records should use these examples until replaced by real operator data. |
| 2026-06-14 | UX | Use Android 9+ Chrome on low-to-mid range smartphones with intermittent 3G/4G as the mobile baseline. | This matches the SRS compatibility target and keeps field UX realistic for pilot conditions. | Field screens must support large tap targets, clear sync states, and selected offline drafts. |
| 2026-06-14 | Privacy | Capture farmer consent status, date, and optional notes during registration. | The SRS requires consent or acknowledgement for pilot data collection. | Farmer schema and registration UX must include consent fields. |
| 2026-06-14 | Discovery | Use the SRS end-to-end workflow as the first Phase 1 operating blueprint. | The SRS already defines the complete prototype cycle and acceptance gates. | Phase 1 review can focus on validation and exceptions instead of starting from a blank workflow. |
| 2026-06-14 | UX | Split UX surfaces into mobile-first field workflows, desktop management workflows, and collection/finance workflows. | The SRS identifies different device and task contexts for field officers, managers, collection staff, and finance users. | Future wireframes and implementation should optimize each workflow for its real operating context. |
| 2026-06-14 | Documentation | Use root `README.md` as the master project guide. | The repository is new, and future sessions need one obvious source of truth. | All implementation phases must update this README before ending. |
| 2026-06-14 | Documentation | Preserve the teaching baseline as both an image reference and transcript. | The image may not render or may not be available to future sessions. | Future sessions can follow the baseline even without the original image file. |
| 2026-06-14 | Product | Use the SRS dated 14 June 2026 as the prototype baseline. | It defines scope, success measures, roles, requirements, architecture, and delivery phases. | Changes to Must requirements, pilot scale, financial calculations, or offline scope require documented approval. |

## Risks and Assumptions

| Type | Item | Response |
| --- | --- | --- |
| Assumption | Pilot users have access to Android smartphones or shared devices. | Confirm device inventory before development completes. |
| Assumption | The pilot operator can provide reliable crop, pricing, grading, and deduction rules. | Phase 1 prototype defaults are approved for implementation; recheck with real operator data before UAT. |
| Constraint | Connectivity may be intermittent or expensive. | Compress images, minimize payloads, and support selected offline drafts. |
| Constraint | Pilot budget and team are limited. | Use one PWA, a modular Go API, PostgreSQL, and managed infrastructure. |
| Risk | Users continue using paper, spreadsheets, WhatsApp, or phone calls instead of entering data. | Run training, define ownership, and review completeness weekly. |
| Risk | Forecast logic is perceived as inaccurate. | Show calculation basis, allow justified adjustments, and compare forecast to actual. |
| Risk | Payment disputes arise from incorrect configuration. | Require tested price/deduction rules and visible statement line items. |
| Risk | Sensitive personal data is exposed. | Apply role controls, HTTPS, secure hosting, and minimal data collection. |
| Risk | Prototype code becomes the commercial system without hardening. | Complete architecture, security, legal, and product reviews before commercial expansion. |
| Resolved constraint | Go was not installed in the original local environment. | Go 1.26.4 is now installed at `C:\Program Files\Go\bin\go.exe`, machine PATH includes `C:\Program Files\Go\bin`, and backend tests pass when `GOCACHE` points to `.cache/go-build`. |

## Open Questions

| Date | Phase | Question | Owner | Status |
| --- | --- | --- | --- | --- |
| 2026-06-14 | Phase 1 | Which 2-3 priority crops will be used in the pilot? | Product Owner / Operations | Closed: tomato, onion, cabbage, and ABE Chilli approved as prototype defaults; 2-3 active monitored crops remains the pilot target. |
| 2026-06-14 | Phase 1 | What crop, pricing, grading, deduction, and recovery examples should seed the prototype? | Product Owner / Operations / Finance | Closed: documented Phase 1 defaults approved for implementation. |
| 2026-06-14 | Phase 1 | Which pilot users and devices will participate in UAT and launch? | Product Owner / Operations | Closed for prototype defaults: role representatives and Android 9+ Chrome baseline documented. |

## Test and Acceptance Evidence

Use this table to link implementation evidence to phase gates and SRS requirements.

| Date | Phase | Requirement / gate | Evidence | Result | Notes |
| --- | --- | --- | --- | --- | --- |
| 2026-06-14 | Phase 2. Foundation | Frontend consumes backend health endpoint. | `frontend/src/api/client.ts`, `frontend/src/App.tsx`, Gin `/api/v1/health` | Passed | UI displays API online/offline status and backend service version. |
| 2026-06-14 | Phase 2. Foundation | Frontend consumes backend reference data. | `GET /api/v1/reference-data`; frontend crop/reference tables | Passed | API reference data includes ABE Chilli and is mapped from snake_case to frontend camelCase. |
| 2026-06-14 | Phase 2. Foundation | Frontend sign-in calls backend auth endpoint. | `POST /api/v1/auth/login`; demo role selector | Passed | Demo login returns backend user payload and drives role-aware UI state. |
| 2026-06-14 | Phase 2. Foundation | Local browser CORS compatibility. | Health request with `Origin: http://127.0.0.1:5173` | Passed | Response included `Access-Control-Allow-Origin: http://127.0.0.1:5173`. |
| 2026-06-14 | Phase 2. Foundation | Phase 2 acceptance gate: sign-in, role-aware access, reference data, local setup, frontend/backend verification. | Frontend demo sign-in; Gin `/api/v1/auth/login`; permission helpers; reference-data seed/routes; npm and Go checks | Passed | Phase 2 is complete as a foundation; persistence-backed auth/reference management continues in later implementation. |
| 2026-06-14 | Phase 2. Foundation | Gin backend framework migration. | `backend/cmd/api/main.go`, `backend/go.mod`, `backend/go.sum` | Passed | API routes use Gin route groups, JSON binding, logger/recovery, and CORS middleware. |
| 2026-06-14 | Phase 2. Foundation | Gin API smoke test. | Temporary backend on port 18080 | Passed | `/health` returned OK, `/reference-data` included ABE Chilli, and `/auth/login` returned prototype admin session payload. |
| 2026-06-14 | Phase 2. Foundation | Backend Go toolchain availability. | `C:\Program Files\Go\bin\go.exe version` | Passed | Installed Go 1.26.4. |
| 2026-06-14 | Phase 2. Foundation | Backend compile/test verification. | `GOCACHE=.cache/go-build go test ./...` | Passed | Packages compile; no backend test files exist yet. |
| 2026-06-14 | Phase 2. Foundation | Demo sign-in and role-aware UI foundation. | `frontend/src/App.tsx`, `frontend/src/auth/permissions.ts`, `backend/cmd/api/main.go` | Created and frontend verified | Demo flow is local/prototype-only until database-backed sessions are implemented. |
| 2026-06-14 | Phase 2. Foundation | Reference-data management foundation. | Frontend crop activation toggles and backend `/api/v1/reference-data` route | Created and frontend verified | UI toggles are local state for now; persistence comes with backend database integration. |
| 2026-06-14 | Phase 2. Foundation | Frontend dependency and security baseline. | `npm install`; `npm audit` | Passed | Audit reported 0 vulnerabilities after install. |
| 2026-06-14 | Phase 2. Foundation | Frontend type safety. | `npm run typecheck` | Passed | TypeScript project compiles with strict settings. |
| 2026-06-14 | Phase 2. Foundation | Frontend production build. | `npm run build` | Passed | Required elevated execution because sandbox blocked esbuild process spawning. |
| 2026-06-14 | Phase 2. Foundation | Frontend local serving smoke test. | Bounded Vite dev-server check at `http://127.0.0.1:5173` | Passed | Returned HTTP 200; job was stopped after verification. |
| 2026-06-14 | Phase 2. Foundation | Backend compile verification. | `go version` | Superseded by Go install verification | Go is now installed; see later backend verification rows. |
| 2026-06-14 | Phase 2. Foundation | Repository structure for React frontend and Go backend exists. | `frontend/`, `backend/`, root `package.json`, `backend/go.mod` | Passed | Superseded by complete Phase 2 acceptance evidence above. |
| 2026-06-14 | Phase 2. Foundation | Reference configuration foundation exists. | `database/seeds/reference_data.sql`, `frontend/src/data/prototypeDefaults.ts`, backend `/api/v1/reference-data` route | Created | Includes ABE Chilli. |
| 2026-06-14 | Phase 2. Foundation | Role model foundation exists. | `shared/permissions.json`, `backend/internal/auth/permissions.go`, `frontend/src/auth/permissions.ts` | Passed for foundation | Demo auth proves role-aware access; persistence-backed enforcement continues in later phases. |
| 2026-06-14 | Phase 1. Discovery and UX | Phase 1 acceptance gate: workflows, roles, required fields, and backlog are approved for implementation. | `README.md` Phase 1 Discovery Workspace | Passed for prototype planning | Real operator review should still happen before UAT, but Phase 2 can proceed. |
| 2026-06-14 | Phase 1. Discovery and UX | All Must requirements are represented in the discovery baseline or deferred according to SRS scope. | Phase 1 backlog, required field set, role-permission matrix, acceptance scenario | Passed for prototype planning | No Must requirement was waived in Phase 1. |
| 2026-06-14 | Phase 1. Discovery and UX | Draft workflow, role map, data dictionary, UX surfaces, and prioritized backlog are documented. | `README.md` Phase 1 Discovery Workspace | Superseded by completed Phase 1 closure | Later Phase 1 entries add approved defaults and close validation items. |
| 2026-06-14 | Planning baseline | Master README exists and represents all seven SRS phases. | `README.md` | Pending review | Documentation-only baseline; no application code implemented. |

## Future Session Checklist

Before implementing:

- Read this README.
- Confirm the current phase status.
- Review the latest Progress Log, Decision Log, Risks, Open Questions, and Test Evidence.
- Identify which SRS requirements the session touches.
- Explain the problem and why it matters before changing code.

During implementation:

- Work incrementally.
- Update progress as each meaningful step is completed.
- Teach the business logic, data flow, design choices, and edge cases.
- Show code, tests, or debugging output when it helps understanding.

Before ending:

- Update Current Phase Status if needed.
- Add a Progress Log entry.
- Add Decision Log entries for meaningful choices.
- Add Test and Acceptance Evidence.
- Add or close Open Questions.
- Confirm the user can explain the work at the required level for the phase.
