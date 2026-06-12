# Roadmap

## Objective

Evolve the DLP Exception Governance Agent from an MVP based on Excel and synthetic data into a production-ready governance process integrated with Microsoft security, compliance and workflow platforms.

---

## Current MVP

The current version demonstrates the core governance logic:

- exception inventory review,
- DLP alert correlation,
- readiness validation,
- risk scoring,
- recommended actions,
- inventory update,
- executive summaries.

Current data sources:

```text
DLP exception inventory in Excel
DLP alerts export in Excel
Documented risk scoring model
````

Current automation:

```text
Copilot Studio agent
Power Automate flow
Office Script for correlation and scoring
Excel inventory update
```

---

## Phase 1 - Improve data model

Goal: replace spreadsheet limitations with a more robust structure.

Planned improvements:

* move exception inventory to Dataverse or a controlled database,
* separate exception requests, approvals, alerts and assessments,
* add audit history,
* add owner and reviewer fields,
* store assessment history over time,
* track status transitions.

Expected value:

* better traceability,
* safer updates,
* stronger governance controls,
* support for multiple review cycles.

---

## Phase 2 - Integrate with Microsoft Purview

Goal: remove manual DLP alert exports.

Planned improvements:

* ingest DLP alert data directly from Microsoft Purview,
* filter alerts by date, user, policy and workload,
* support scheduled alert ingestion,
* reduce manual preparation,
* align review frequency with DLP operations.

Expected value:

* near-real activity evidence,
* less manual effort,
* more accurate exception reviews.

---

## Phase 3 - Workflow automation

Goal: connect recommendations with operational actions.

Planned improvements:

* trigger renewal workflows for valid exceptions,
* create review tasks for medium-risk exceptions,
* escalate high and critical exceptions,
* notify owners before expiry,
* route unused exceptions for removal approval,
* integrate with ticketing or GRC platforms.

Expected value:

* faster response,
* clearer ownership,
* reduced manual follow-up,
* better evidence of governance actions.

---

## Phase 4 - WorkIQ enrichment

Goal: use organizational context to support better decisions.

WorkIQ should not calculate risk scores or alert counts.

It can enrich reviews by finding:

* business justification,
* related documents,
* previous discussions,
* exception owners,
* approval context,
* supporting evidence,
* renewal rationale,
* audit context.

Expected value:

* more informed decisions,
* better reviewer context,
* stronger evidence for renewals or escalations,
* improved audit readiness.

---

## Phase 5 - Reporting and analytics

Goal: provide management visibility over DLP exception posture.

Planned improvements:

* dashboards for risk distribution,
* aging of exceptions,
* unused exceptions,
* expired exceptions with activity,
* recurring high-risk users,
* recurring high-risk policies,
* monthly review trends,
* action tracking.

Expected value:

* executive visibility,
* trend analysis,
* measurable governance improvement,
* easier reporting to Security, GRC and Compliance.

---

## Phase 6 - Production controls

Goal: prepare the agent for real enterprise usage.

Planned improvements:

* role-based access control,
* environment separation,
* approval gates before updates,
* audit logging,
* data retention controls,
* privacy review,
* security review,
* exception lifecycle policy alignment.

Expected value:

* safe production deployment,
* controlled automation,
* stronger compliance posture.

---

## Target production flow

```text
Exception request
        ↓
Approval workflow
        ↓
Central exception inventory
        ↓
Automatic DLP alert ingestion
        ↓
Scheduled agent review
        ↓
Risk scoring and recommendation
        ↓
Owner notification or escalation
        ↓
Inventory and audit trail update
        ↓
Dashboard and management reporting
```

---

## Long-term vision

The long-term goal is to turn DLP exception management into a governed, evidence-based and repeatable process.

The agent should help teams move from:

```text
Manual review + fragmented evidence + subjective decisions
```

to:

```text
Automated correlation + explainable risk + governed actions + continuous monitoring
```

