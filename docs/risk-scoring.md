# Risk Scoring Model

## Objective

This document defines the mandatory risk scoring model for the DLP Exception Governance Agent.

The agent must use this model whenever it calculates risk for a DLP exception.

The agent must not create alternative scoring models, percentages, weighted models or approximate scores.

---

## Eligibility for risk assessment

The agent may calculate risk only when the exception meets all these conditions:

| Field                 | Required value        |
| --------------------- | --------------------- |
| `CommunicationStatus` | `Sent`                |
| `FormResponseStatus`  | `Completed`           |
| `ApprovalStatus`      | `Approved`            |
| `ExceptionStatus`     | `Active` or `Expired` |

If any condition is not met:

* Do not calculate `RiskScore`.
* Do not calculate `RiskLevel`.
* Do not generate approximate risk.
* Mark the exception as `Not ready for assessment`.
* Explain which condition is missing or invalid.
* Only show the required previous action.

---

## Mandatory risk scoring model

RiskScore is calculated using a simple integer point model.

Do not use a 0-100 scale.
Do not use percentages.
Do not use weighted scoring.
Do not create alternative factors.
Do not cap or normalize the score.

| Condition                                   | Points |
| ------------------------------------------- | ------ |
| Exception is expired                        | +3     |
| Exception expires in the next 15 days       | +2     |
| More than 10 alerts in the last 30 days     | +3     |
| Between 5 and 10 alerts in the last 30 days | +2     |
| Between 1 and 4 alerts in the last 30 days  | +1     |
| High-impact sensitive data type             | +2     |
| Channel is `Endpoint devices`               | +2     |

---

## Alert volume scoring

Use `AlertsLast30Days`:

| AlertsLast30Days | Points |
| ---------------- | ------ |
| 0                | +0     |
| 1-4              | +1     |
| 5-10             | +2     |
| More than 10     | +3     |

---

## High-impact sensitive data types

Add +2 points when the sensitive data type includes or clearly refers to:

* Financial data
* Banking data
* Payment cards
* Credit cards
* Personally identifiable information
* National ID
* Passport
* DNI
* Credentials
* Passwords
* Confidential information
* Legal data
* HR data
* Medical or health data

Examples:

| SensitiveDataType     | High impact?                                                                                               |
| --------------------- | ---------------------------------------------------------------------------------------------------------- |
| `Spain DNI`           | Yes                                                                                                        |
| `Spanish National ID` | Yes                                                                                                        |
| `Credit Card`         | Yes                                                                                                        |
| `Medical Data`        | Yes                                                                                                        |
| `Credentials`         | Yes                                                                                                        |
| `Large files`         | No, unless the exception context indicates confidential or regulated data                                  |
| `Non-medical Data`    | No, unless the detected sensitive information type indicates PII, credentials, financial, legal or HR data |

---

## Risk levels

After summing all applicable points, assign the risk level:

| RiskScore | RiskLevel  |
| --------- | ---------- |
| 0-2       | `Low`      |
| 3-5       | `Medium`   |
| 6-8       | `High`     |
| 9 or more | `Critical` |

---

## Recommended actions

Use only these values for `RecommendedAction`:

* `Renew`
* `Review`
* `Remove`
* `Escalate`
* `No immediate action`

| Situation                                                                           | RecommendedAction     |
| ----------------------------------------------------------------------------------- | --------------------- |
| Active, approved, justified and with recent activity, without high or critical risk | `Renew`               |
| Active with no recent activity                                                      | `Remove`              |
| Active with unclear usage or governance concerns                                    | `Review`              |
| Medium risk                                                                         | `Review`              |
| Expired with recent activity                                                        | `Escalate`            |
| High or critical risk                                                               | `Escalate`            |
| Low risk and controlled                                                             | `No immediate action` |

If multiple rules apply, choose the most conservative action from a security perspective.

Priority order:

```text
Escalate > Review > Remove > Renew > No immediate action
```

---

## Required explanation format

When the user asks how the score was calculated, the agent must show the point-by-point calculation.

Use this format:

```text
Risk calculation for <ExceptionID>:

- Expired exception: <Yes/No> → +X
- Expires in the next 15 days: <Yes/No> → +X
- AlertsLast30Days = <number> → +X
- High-impact sensitive data type: <Yes/No> → +X
- Channel = <channel> → +X

Total RiskScore = X
RiskLevel = Low / Medium / High / Critical
RecommendedAction = Renew / Review / Remove / Escalate / No immediate action
```

---

## Example

Example for an active endpoint exception with 7 alerts and Spain DNI:

```text
Risk calculation:

- Expired exception: No → +0
- Expires in the next 15 days: No → +0
- AlertsLast30Days = 7 → +2
- High-impact sensitive data type: Yes, Spain DNI is PII/National ID → +2
- Channel = Endpoint devices → +2

Total RiskScore = 6
RiskLevel = High
RecommendedAction = Escalate
```

Reason:

The exception has active usage, involves high-impact personal data and occurs through Endpoint devices. According to the mandatory scoring model, a score of 6 maps to High risk.

---

## Non-ready exception example

If an exception has:

```text
ApprovalStatus = Pending
```

The agent must respond:

```text
RiskScore: Not calculated
RiskLevel: Not ready for assessment
RecommendedAction: Complete approval before risk assessment
RiskExplanation: Risk cannot be calculated because ApprovalStatus is Pending. Required value is Approved.
```

The agent must not provide an approximate score.
