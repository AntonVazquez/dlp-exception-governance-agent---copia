# Correlation Logic

## Objective

Correlate the DLP exception inventory with the DLP alerts export to determine whether an exception has recent real activity.

---

## Datasets used

| Dataset                      | Purpose             |
| ---------------------------- | ------------------- |
| `DLP_Exceptions_MVP_EN.xlsx` | Exception inventory |
| `DLP_Alerts_MVP_EN.xlsx`     | DLP alerts export   |

---

## Main correlation rule

An alert belongs to an exception when the following fields match:

| Exceptions  | Alerts   |
| ----------- | -------- |
| `Requester` | `User`   |
| `DLPPolicy` | `Policy` |

```text
Requester = User
AND DLPPolicy = Policy
```

---

## Calculation of `AlertsLast30Days`

The agent must count the alerts that meet the following conditions:

```text
User = Requester
AND Policy = DLPPolicy
AND Occurred >= Today - 30 days
```

Result:

```text
AlertsLast30Days = number of alerts found
```

---

## Calculation of `LastActivityDate`

The agent must take the most recent date among the related alerts:

```text
LastActivityDate = MAX(Occurred)
```

---

## Channel values

`Channel` in the exceptions Excel file must use the same values as `Location` in the alerts export:

```text
Endpoint devices
Exchange
OneDrive
SharePoint
Teams
```

In the MVP, `Channel` is used as context. The main correlation is based on:

```text
Requester + DLPPolicy + Date
```

---

## Exclusion rules

The agent must not count an alert if:

* The user does not match.
* The DLP policy does not match.
* The alert is older than 30 days.
* The policy does not correspond to an `EXCL` exception policy.
* The exception is not ready for assessment.

---

## Expected result

The agent must complete or update:

| Field               | Result                                       |
| ------------------- | -------------------------------------------- |
| `AlertsLast30Days`  | Number of related alerts in the last 30 days |
| `LastActivityDate`  | Most recent related alert date               |
| `RiskScore`         | Calculated scoring                           |
| `RiskLevel`         | Low / Medium / High / Critical               |
| `RecommendedAction` | Renew / Review / Remove / Escalate           |
