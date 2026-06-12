# Test Prompts

This document contains sample prompts to test the **DLP Exception Governance Agent** in Microsoft Copilot Studio.

The prompts are designed to validate the main MVP use cases: reviewing exceptions, correlating DLP alerts, calculating recent activity, assessing risk, recommending actions and updating the exception inventory.

---

## Basic review prompts

| Use case                    | Prompt                                                                                    |
| --------------------------- | ----------------------------------------------------------------------------------------- |
| Review active exceptions    | Show me the active DLP exceptions and summarize their current status.                     |
| Review all exceptions       | Show me all exceptions in the inventory and indicate which ones are ready for assessment. |
| Review a specific exception | Analyze exception EXC-001 and explain its risk and recommended action.                    |
| Summarize exception status  | Summarize the current status of the DLP exception inventory.                              |

---

## Activity correlation prompts

| Use case                           | Prompt                                                                                                 |
| ---------------------------------- | ------------------------------------------------------------------------------------------------------ |
| Calculate recent activity          | Calculate the DLP alerts from the last 30 days for each exception.                                     |
| Complete last activity date        | Show the last activity date for each exception based on the DLP alerts export.                         |
| Explain correlation                | Explain how the alerts were correlated with the exceptions.                                            |
| Review activity by user and policy | For each exception, show the requester, DLP policy, alerts in the last 30 days and last activity date. |

---

## Risk assessment prompts

| Use case                    | Prompt                                                               |
| --------------------------- | -------------------------------------------------------------------- |
| Prioritize by risk          | Prioritize the exceptions that should be reviewed first.             |
| Recommend actions           | Recommend an action for each exception that is ready for assessment. |
| Explain risk drivers        | Explain the main risk drivers for the highest risk exceptions.       |
| Detect high-risk exceptions | Show me the exceptions with high or critical risk.                   |

---

## Governance prompts

| Use case                                | Prompt                                                                          |
| --------------------------------------- | ------------------------------------------------------------------------------- |
| Detect unused exceptions                | Which active exceptions have no activity in the last 30 days?                   |
| Detect expired exceptions with activity | Which expired exceptions are still generating DLP alerts?                       |
| Detect exceptions close to expiry       | Which exceptions are close to expiry and should be reviewed soon?               |
| Identify exceptions to remove           | Which exceptions should be removed because they are no longer being used?       |
| Identify exceptions to renew            | Which exceptions should be renewed because they are still active and justified? |
| Identify exceptions to escalate         | Which exceptions should be escalated due to expiry, activity or high risk?      |

---

## Inventory update prompts

| Use case                            | Prompt                                                                                          |
| ----------------------------------- | ----------------------------------------------------------------------------------------------- |
| Weekly review and inventory update  | Run the weekly exception review and update the full exception inventory.                        |
| Update inventory with latest alerts | Update the exception inventory using the latest DLP alerts and recalculate the risk assessment. |
| Update one exception                | Update exception EXC-001 with the latest activity and risk assessment.                          |
| Save risk assessment                | Save the calculated risk assessment in the exception inventory.                                 |

---

## Executive summary prompts

| Use case                  | Prompt                                                                                                 |
| ------------------------- | ------------------------------------------------------------------------------------------------------ |
| Executive summary         | Generate an executive summary of the DLP exception governance status.                                  |
| Summary for security team | Summarize the exceptions that require action from the security team.                                   |
| Summary for management    | Create a short management summary with the number of active, expired, high-risk and unused exceptions. |
| Weekly governance summary | Generate a weekly governance summary based on the current exception inventory and DLP alerts.          |

---

## Quality validation prompts

| Validation area                  | Prompt                                                                                             |
| -------------------------------- | -------------------------------------------------------------------------------------------------- |
| Non-ready exceptions             | Show me which exceptions are not ready for assessment and explain why.                             |
| No risk for non-ready exceptions | Review all exceptions, but do not calculate risk for exceptions that are not ready for assessment. |
| Activity without risk            | For non-ready exceptions, show only recent activity and the reason why risk cannot be calculated.  |
| Explain skipped records          | After reviewing the inventory, explain which records were skipped and why.                         |

---

## Recommended demo flow

Use the following prompts during a demo:

1. Show me all exceptions in the inventory and indicate which ones are ready for assessment.

2. Calculate the DLP alerts from the last 30 days for each exception.

3. Prioritize the exceptions that should be reviewed first.

4. Run the weekly exception review and update the full exception inventory.

5. Generate an executive summary of the DLP exception governance status.
