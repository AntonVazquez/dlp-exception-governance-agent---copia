# DLP Exception Governance Agent

> **Microsoft Copilot Studio** agent for reviewing, prioritizing and updating DLP exceptions by combining an exception inventory with real DLP alert activity.

---

## Overview

DLP exceptions are often required for valid business processes. However, if they are not reviewed periodically, they can become a security, compliance and governance risk.

The **DLP Exception Governance Agent** helps Security, DLP, SOC, GRC and Compliance teams answer key questions:

- Which DLP exceptions are still being used?
- Which exceptions are expired or close to expiry?
- Which exceptions have no recent activity?
- Which exceptions represent the highest risk?
- Which exceptions should be renewed, reviewed, removed or escalated?

The agent supports a governed review process by combining structured data, alert correlation, risk scoring and inventory updates.

---

## How it works

The agent combines two operational data sources with a documented scoring model:

```text
DLP exception inventory
        +
DLP alert export
        +
Risk scoring model
        ↓
Structured correlation
        ↓
Risk assessment
        ↓
Recommended action
        ↓
Inventory update
````

For calculations, the agent uses a structured tool built with **Power Automate** and **Office Script**.
This avoids relying on semantic search for row-level calculations such as alert counts, dates or risk scores.

---

## Data sources

| Source                               | Description                                                                  |
| ------------------------------------ | ---------------------------------------------------------------------------- |
| `DLP_Exceptions_MVP_EN_v4_anon.xlsx` | Inventory of DLP exception requests, approvals, status and governance fields |
| `DLP_Alerts_MVP_EN.xlsx`             | Export of DLP alerts generated during the review period                      |
| `risk-scoring.md`                    | Mandatory scoring model, risk thresholds and recommended actions             |

---

## Main capabilities

| Capability                              | Description                                                                                       |
| --------------------------------------- | ------------------------------------------------------------------------------------------------- |
| Review exception inventory              | Shows active, expired, pending, rejected and draft exceptions                                     |
| Validate readiness                      | Checks whether an exception is ready for risk assessment                                          |
| Correlate alert activity                | Matches DLP alerts with exceptions using user and policy                                          |
| Calculate recent activity               | Calculates `AlertsLast30Days` and `LastActivityDate`                                              |
| Detect unused exceptions                | Finds exceptions with no alert activity in the last 30 days                                       |
| Detect expired exceptions with activity | Identifies expired exceptions that are still generating alerts                                    |
| Detect near-expiry exceptions           | Highlights exceptions that expire soon and require review                                         |
| Calculate risk                          | Applies a transparent scoring model based on status, expiry, activity, sensitive data and channel |
| Explain risk drivers                    | Shows how each risk score was calculated point by point                                           |
| Recommend governance actions            | Suggests whether to renew, review, remove or escalate each exception                              |
| Update the inventory                    | Updates calculated governance fields in the Excel inventory when explicitly requested             |

---

## Correlation logic

The agent correlates exceptions and alerts using controlled matching rules:

```text
Requester = User
DLPPolicy = Policy
Occurred date within the last 30 days
```

Using this logic, the agent calculates:

| Field                    | Description                                            |
| ------------------------ | ------------------------------------------------------ |
| `AlertsLast30Days`       | Number of matching alerts in the last 30 days          |
| `LastActivityDate`       | Most recent matching alert date                        |
| `RiskScore`              | Integer score calculated using the defined risk model  |
| `RiskLevel`              | Low, Medium, High or Critical                          |
| `RiskExplanation`        | Point-by-point explanation of the score                |
| `RecommendedAction`      | Renew, Review, Remove, Escalate or No immediate action |
| `LastRiskAssessmentDate` | Date of the latest assessment                          |

---

## Risk assessment rules

A full risk assessment is only performed when an exception meets all governance conditions:

```text
CommunicationStatus = Sent
FormResponseStatus = Completed
ApprovalStatus = Approved
ExceptionStatus = Active or Expired
```

If any condition is not met, the agent does not calculate a risk score.
Instead, it marks the exception as **Not ready for assessment** and explains which condition is missing or invalid.

This prevents draft, pending or rejected exceptions from being incorrectly scored.

---

## Risk scoring model

The agent uses a transparent point-based model.

| Factor                                  | Points |
| --------------------------------------- | -----: |
| Expired exception                       |     +3 |
| Expires in the next 15 days             |     +2 |
| More than 10 alerts in the last 30 days |     +3 |
| 5 to 10 alerts in the last 30 days      |     +2 |
| 1 to 4 alerts in the last 30 days       |     +1 |
| High-impact sensitive data type         |     +2 |
| Endpoint devices channel                |     +2 |

Risk levels:

| Score | RiskLevel |
| ----: | --------- |
|   0-2 | Low       |
|   3-5 | Medium    |
|   6-8 | High      |
|    9+ | Critical  |

Allowed recommended actions:

```text
Renew
Review
Remove
Escalate
No immediate action
```

---

## Example outcome

During the MVP review, the agent can identify cases such as:

```text
DLP-0005
AlertsLast30Days: 18
RiskScore: 9
RiskLevel: Critical
RecommendedAction: Escalate
```

The explanation is auditable:

```text
Expired exception: No → +0
Expires in the next 15 days: Yes → +2
AlertsLast30Days = 18 → +3
High-impact sensitive data type: Yes → +2
Channel = Endpoint devices → +2

Total RiskScore = 9
RiskLevel = Critical
RecommendedAction = Escalate
```

---

## WorkIQ usage

WorkIQ is not used to calculate alert counts, dates or risk scores.

Instead, WorkIQ can be used as a contextual enrichment layer. In a real environment, it could help reviewers find:

* business justification for an exception,
* related documents or conversations,
* exception owners,
* approval context,
* supporting evidence for renewal or escalation,
* additional context for audit or governance reviews.

This keeps the scoring controlled and data-driven while still allowing business context to support final decisions.

---

## Inventory update

The agent can update the exception inventory when explicitly requested by the user.

Updated fields include:

```text
AlertsLast30Days
LastActivityDate
RiskScore
RiskLevel
RiskExplanation
RecommendedAction
LastRiskAssessmentDate
```

Administrative fields are not modified by default, such as:

```text
Requester
DLPPolicy
ExpiryDate
ApprovalStatus
Approver
BusinessJustification
```

This ensures that the agent updates governance assessment fields without changing the original approval record.

---

## MVP scope

### Included

* Synthetic dataset of DLP exceptions and DLP alerts
* Alert correlation by user, policy and date
* Calculation of alerts from the last 30 days
* Readiness validation before risk scoring
* Transparent risk scoring model
* Recommended governance actions
* Assisted update of the exception inventory
* Executive summaries and weekly review outputs

### Out of scope

* Direct Microsoft Purview API integration
* Production Dataverse data model
* Automatic remediation without human review
* Automatic approval or rejection of exceptions
* Direct ticket creation or workflow escalation

---

## Roadmap

The MVP can be extended into a production-ready governance process through the following steps:

1. Replace Excel with Dataverse or another controlled database.
2. Connect directly with Microsoft Purview to ingest DLP alerts automatically.
3. Integrate Power Automate approval workflows for renewals, removals and escalations.
4. Use WorkIQ to enrich decisions with business context, ownership and supporting evidence.
5. Create dashboards for risk trends, exception aging, unused exceptions and recurring high-risk users or policies.
6. Integrate with ticketing or GRC platforms for formal tracking and remediation.

---

## Value

The DLP Exception Governance Agent turns a manual review process into a repeatable, explainable and governed workflow.

It helps teams move from:

```text
Manual spreadsheet review
```

to:

```text
Correlated activity + transparent risk + recommended action + updated inventory
```

This allows Security, DLP, SOC, GRC and Compliance teams to focus first on the exceptions that matter most.

```
```
