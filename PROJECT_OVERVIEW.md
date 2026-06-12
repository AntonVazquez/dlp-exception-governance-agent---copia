# Project Overview

## Problem

DLP exceptions are sometimes required to support legitimate business processes. However, without periodic review, they can create security and compliance risk.

Common challenges include:

- active exceptions with no recent usage,
- expired exceptions still generating activity,
- renewals approved without evidence,
- requests, approvals and alerts stored separately,
- manual Excel-based reviews,
- subjective prioritization.

---

## Solution

The DLP Exception Governance Agent combines exception inventory data with DLP alert activity.

```text
Exception inventory → who requested it, status, expiry, approval state
DLP alert export    → real activity by user, policy and date
````

The agent correlates both datasets and returns an action-oriented review.

It can identify:

* which exceptions are still active,
* which exceptions are unused,
* which exceptions are expired but still generating alerts,
* which records are not ready for assessment,
* which exceptions should be escalated, removed, reviewed or renewed.

---

## MVP process

The MVP is based on a realistic exception management flow:

```text
User requests an exception
        ↓
Request is recorded in the inventory
        ↓
Approval process is completed
        ↓
Exception status is updated
        ↓
DLP alerts are exported periodically
        ↓
Agent correlates alerts and exceptions
        ↓
Agent calculates risk and recommends actions
        ↓
Inventory is updated when explicitly requested
```

---

## Agent architecture

The agent is built with Microsoft Copilot Studio.

It uses:

| Component         | Purpose                                                         |
| ----------------- | --------------------------------------------------------------- |
| Excel inventory   | Stores exception records and governance fields                  |
| DLP alerts export | Provides activity evidence                                      |
| Power Automate    | Executes structured workflow logic                              |
| Office Script     | Performs correlation, readiness validation and risk calculation |
| `risk-scoring.md` | Defines the mandatory scoring model                             |
| WorkIQ            | Optional contextual enrichment layer                            |

The key design principle is:

```text
Structured tool = calculations
Knowledge = documentation and rules
WorkIQ = business context
```

This avoids using semantic search for row-level calculations.

---

## Risk and governance logic

Risk is calculated only when the exception is ready for assessment.

Required conditions:

```text
CommunicationStatus = Sent
FormResponseStatus = Completed
ApprovalStatus = Approved
ExceptionStatus = Active or Expired
```

If the exception is not ready, the agent does not calculate risk.
It explains the missing or invalid conditions instead.

For eligible exceptions, the agent calculates risk using:

* expiry status,
* proximity to expiry,
* alert volume,
* sensitive data type,
* channel.

The output includes:

* `AlertsLast30Days`,
* `LastActivityDate`,
* `RiskScore`,
* `RiskLevel`,
* `RiskExplanation`,
* `RecommendedAction`.

---

## Project value

| Before                                    | With the agent              |
| ----------------------------------------- | --------------------------- |
| Manual spreadsheet review                 | Conversational review       |
| Alerts and exceptions reviewed separately | Automatic correlation       |
| Subjective prioritization                 | Transparent risk scoring    |
| Renewals without evidence                 | Activity-based decisions    |
| Manual inventory update                   | Assisted update             |
| Limited auditability                      | Point-by-point explanations |
| Unclear ownership context                 | WorkIQ enrichment potential |

---

## Target users

* Security teams
* DLP administrators
* SOC analysts
* GRC teams
* Compliance owners
* Data protection teams

---

## Example use cases

* Show all exceptions and readiness status.
* Calculate alerts from the last 30 days for each exception.
* Identify unused exceptions.
* Identify expired exceptions still generating alerts.
* Calculate the top riskiest exceptions.
* Explain a risk score.
* Recommend governance actions.
* Run a weekly exception review.
* Update the exception inventory.

---

## Current MVP outcome

The MVP demonstrates how an agent can support DLP exception governance using a synthetic dataset.

It can produce outputs such as:

```text
Total exceptions: 16
Ready for assessment: 12
Not ready for assessment: 4
DLP alerts analyzed: 114
Critical risk: 1
High risk: 3
Medium risk: 3
Low risk: 5
```

This provides a clear basis for review, escalation, cleanup and renewal decisions.

