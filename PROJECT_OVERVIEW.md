# Project Overview

## The problem

DLP exceptions are necessary, but they become a risk if they are not reviewed periodically. Security teams face several challenges:

* Active exceptions with no usage that keep unnecessary permissions in place
* Expired exceptions with real activity that have not been reviewed
* Renewals approved without evidence of activity
* Requests, approvals and alerts stored separately

---

## The solution

The agent combines two perspectives that are usually reviewed separately:

```
DLP exception inventory  →  who requested it, status, expiry date
DLP alerts export        →  real activity by user and policy
```

Instead of correlating this data manually, the agent does it automatically and returns an analysis ready for action.

---

## Process context

The MVP is based on a realistic exception management process:

```
User requests an exception (Microsoft Forms)
        ↓
Power Automate records the request in Excel
        ↓
Manager approval
        ↓
Status update in the inventory
        ↓
Periodic export of DLP alerts
        ↓
Analysis and update by the agent
```

---

## Risk scoring

The agent applies configurable criteria to assess each exception:

| Criterion                    | Effect                    |
| ---------------------------- | ------------------------- |
| Expired exception            | Increases risk            |
| Close to expiry              | Requires review           |
| High number of recent alerts | Higher priority           |
| No recent alerts             | Consider removal          |
| Critical sensitive data type | Higher severity           |
| Endpoint channel             | Higher potential exposure |

---

## Project value

| Before                                    | With the agent           |
| ----------------------------------------- | ------------------------ |
| Manual Excel review                       | Conversational query     |
| Alerts and exceptions reviewed separately | Automatic correlation    |
| Subjective prioritization                 | Risk scoring             |
| Renewals without evidence                 | Activity-based decisions |
| Manual inventory update                   | Assisted update          |

---

## Target users

Security teams · DLP administrators · GRC · SOC · Compliance owners

---

## Future evolution

| Improvement                              | Value                               |
| ---------------------------------------- | ----------------------------------- |
| Direct connection with Microsoft Purview | Removes manual exports              |
| Advanced Power Automate flows            | Automates notifications and updates |
| Dataverse                                | More robust data model              |
| Power BI dashboards                      | Executive tracking                  |
| Ticketing / SIEM integration             | More complete operations            |

