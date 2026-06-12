# Use Cases

## Objective

The agent helps review DLP exceptions by using the exception inventory and the real activity from the alerts export.

---

## MVP use cases

| Use case                                | What the agent does                                  |
| --------------------------------------- | ---------------------------------------------------- |
| Review active exceptions                | Lists current exceptions and summarizes their status |
| Calculate recent activity               | Completes `AlertsLast30Days`                         |
| Detect unused exceptions                | Finds active exceptions with no recent alerts        |
| Detect expired exceptions with activity | Identifies unmanaged risk                            |
| Prioritize review                       | Sorts exceptions by risk                             |
| Recommend actions                       | Suggests renewing, reviewing, removing or escalating |
| Generate executive summary              | Summarizes status, risks and actions                 |

---

## Test prompts

### Review active exceptions

```text
Show me the active exceptions and summarize their status.
```

### Calculate recent alerts

```text
Calculate the alerts from the last 30 days for each exception.
```

### Detect unused exceptions

```text
Which active exceptions have no activity in the last 30 days?
```

### Detect expired exceptions with activity

```text
Which expired exceptions are still generating alerts?
```

### Prioritize review

```text
Prioritize the exceptions that should be reviewed first.
```

### Recommend actions

```text
Recommend an action for each active exception.
```

### Executive summary

```text
Generate an executive summary of the DLP exception status.
```

---

## Recommended actions

| Action                | When it applies                           |
| --------------------- | ----------------------------------------- |
| `Renew`               | Active, justified exception with activity |
| `Review`              | Unclear activity or requires validation   |
| `Remove`              | Active exception with no recent activity  |
| `Escalate`            | Expired exception or high risk            |
| `No immediate action` | Controlled exception with low risk        |

---

## Out of scope for the MVP

* Direct connection with Microsoft Purview.
* Automatic remediation.
* Dataverse.
* Power BI.
* SIEM or ticketing.
* Multi-agent architecture.
