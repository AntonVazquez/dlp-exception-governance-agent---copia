function main(
  workbook: ExcelScript.Workbook,
  exceptionsJson: string,
  alertsJson: string,
  daysBack: number,
  analysisDateIso: string
): string {

  type Row = { [key: string]: string | number | boolean | null | undefined };

  const exceptions: Row[] = JSON.parse(exceptionsJson);
  const alerts: Row[] = JSON.parse(alertsJson);

  const analysisDate = parseDate(analysisDateIso) ?? new Date();
  const cutoffDate = new Date(analysisDate);
  cutoffDate.setDate(cutoffDate.getDate() - daysBack);

  const alertGroups = new Map<string, {
    user: string;
    policy: string;
    alertsLastPeriod: number;
    lastActivityDate: Date | null;
    locations: string[];
    sensitiveDataTypes: string[];
    activityTypes: string[];
  }>();

  for (const alert of alerts) {
    const user = clean(alert["User"]);
    const policy = clean(alert["Policy"]);
    const occurred = parseDate(alert["Occurred"]);

    if (!user || !policy || !occurred) continue;
    if (occurred < cutoffDate || occurred > analysisDate) continue;

    const key = makeKey(user, policy);

    if (!alertGroups.has(key)) {
      alertGroups.set(key, {
        user,
        policy,
        alertsLastPeriod: 0,
        lastActivityDate: null,
        locations: [],
        sensitiveDataTypes: [],
        activityTypes: []
      });
    }

    const group = alertGroups.get(key)!;
    group.alertsLastPeriod += 1;

    if (!group.lastActivityDate || occurred > group.lastActivityDate) {
      group.lastActivityDate = occurred;
    }

    addUnique(group.locations, clean(alert["Location"]));
    addUnique(group.sensitiveDataTypes, clean(alert["Sensitive information type"]));
    addUnique(group.activityTypes, clean(alert["Activity type"]));
  }

  const alertCorrelation = Array.from(alertGroups.values()).map(group => ({
    User: group.user,
    Policy: group.policy,
    AlertsLast30Days: group.alertsLastPeriod,
    LastActivityDate: formatDate(group.lastActivityDate),
    Locations: group.locations.join(", "),
    SensitiveDataTypes: group.sensitiveDataTypes.join(", "),
    ActivityTypes: group.activityTypes.join(", ")
  }));

  const exceptionResults = exceptions.map(exception => {
    const exceptionId = clean(exception["ExceptionID"]);
    const requester = clean(exception["Requester"]);
    const department = clean(exception["Department"]);
    const businessJustification = clean(exception["BusinessJustification"]);
    const channel = clean(exception["Channel"]);
    const dlpPolicy = clean(exception["DLPPolicy"]);
    const sensitiveDataType = clean(exception["SensitiveDataType"]);
    const communicationStatus = clean(exception["CommunicationStatus"]);
    const formResponseStatus = clean(exception["FormResponseStatus"]);
    const approvalStatus = clean(exception["ApprovalStatus"]);
    const exceptionStatus = clean(exception["ExceptionStatus"]);
    const expiryDate = parseDate(exception["ExpiryDate"]);

    const group = alertGroups.get(makeKey(requester, dlpPolicy));

    const alertsLast30Days = group ? group.alertsLastPeriod : 0;
    const lastActivityDate = group ? formatDate(group.lastActivityDate) : "";
    const locations = group ? group.locations.join(", ") : "";
    const alertSensitiveDataTypes = group ? group.sensitiveDataTypes.join(", ") : "";
    const activityTypes = group ? group.activityTypes.join(", ") : "";

    const readiness = checkReadiness(
      communicationStatus,
      formResponseStatus,
      approvalStatus,
      exceptionStatus
    );

    if (!readiness.ready) {
      return {
        ExceptionID: exceptionId,
        Requester: requester,
        Department: department,
        BusinessJustification: businessJustification,
        DLPPolicy: dlpPolicy,
        Channel: channel,
        SensitiveDataType: sensitiveDataType,
        CommunicationStatus: communicationStatus,
        FormResponseStatus: formResponseStatus,
        ApprovalStatus: approvalStatus,
        ExceptionStatus: exceptionStatus,
        ExpiryDate: formatDate(expiryDate),
        AlertsLast30Days: alertsLast30Days,
        LastActivityDate: lastActivityDate,
        Locations: locations,
        AlertSensitiveDataTypes: alertSensitiveDataTypes,
        ActivityTypes: activityTypes,
        ReadyForAssessment: "No",
        RiskScore: "",
        RiskLevel: "Not ready for assessment",
        RiskExplanation: readiness.reason,
        RecommendedAction: readiness.requiredAction,
        LastRiskAssessmentDate: "",
        SortRiskScore: -1
      };
    }

    const scoring = calculateRisk(
      exceptionStatus,
      expiryDate,
      alertsLast30Days,
      sensitiveDataType,
      alertSensitiveDataTypes,
      channel,
      analysisDate
    );

    const recommendedAction = calculateRecommendedAction(
      exceptionStatus,
      alertsLast30Days,
      scoring.riskLevel,
      businessJustification
    );

    return {
      ExceptionID: exceptionId,
      Requester: requester,
      Department: department,
      BusinessJustification: businessJustification,
      DLPPolicy: dlpPolicy,
      Channel: channel,
      SensitiveDataType: sensitiveDataType,
      CommunicationStatus: communicationStatus,
      FormResponseStatus: formResponseStatus,
      ApprovalStatus: approvalStatus,
      ExceptionStatus: exceptionStatus,
      ExpiryDate: formatDate(expiryDate),
      AlertsLast30Days: alertsLast30Days,
      LastActivityDate: lastActivityDate,
      Locations: locations,
      AlertSensitiveDataTypes: alertSensitiveDataTypes,
      ActivityTypes: activityTypes,
      ReadyForAssessment: "Yes",
      RiskScore: scoring.riskScore,
      RiskLevel: scoring.riskLevel,
      RiskExplanation: scoring.explanation,
      RecommendedAction: recommendedAction,
      LastRiskAssessmentDate: formatDate(analysisDate),
      SortRiskScore: scoring.riskScore
    };
  });

  const readyExceptions = exceptionResults.filter(row => row.ReadyForAssessment === "Yes");
  const notReadyExceptions = exceptionResults.filter(row => row.ReadyForAssessment !== "Yes");

  const top5 = readyExceptions
    .slice()
    .sort((a, b) => {
      const scoreA = Number(a.SortRiskScore);
      const scoreB = Number(b.SortRiskScore);

      if (scoreB !== scoreA) return scoreB - scoreA;

      const alertsA = Number(a.AlertsLast30Days);
      const alertsB = Number(b.AlertsLast30Days);

      return alertsB - alertsA;
    })
    .slice(0, 5)
    .map((row, index) => ({
      Rank: index + 1,
      ExceptionID: row.ExceptionID,
      Requester: row.Requester,
      DLPPolicy: row.DLPPolicy,
      ExceptionStatus: row.ExceptionStatus,
      AlertsLast30Days: row.AlertsLast30Days,
      LastActivityDate: row.LastActivityDate,
      RiskScore: row.RiskScore,
      RiskLevel: row.RiskLevel,
      RecommendedAction: row.RecommendedAction,
      RiskExplanation: row.RiskExplanation
    }));

  const unusedExceptions = exceptionResults
    .filter(row => Number(row.AlertsLast30Days) === 0)
    .map(row => ({
      ExceptionID: row.ExceptionID,
      Requester: row.Requester,
      DLPPolicy: row.DLPPolicy,
      ExceptionStatus: row.ExceptionStatus,
      AlertsLast30Days: row.AlertsLast30Days,
      RiskLevel: row.RiskLevel,
      RecommendedAction: row.RecommendedAction,
      RiskExplanation: row.RiskExplanation
    }));

  const riskLevelSummary = {
    Critical: readyExceptions.filter(row => row.RiskLevel === "Critical").length,
    High: readyExceptions.filter(row => row.RiskLevel === "High").length,
    Medium: readyExceptions.filter(row => row.RiskLevel === "Medium").length,
    Low: readyExceptions.filter(row => row.RiskLevel === "Low").length,
    NotReadyForAssessment: notReadyExceptions.length
  };

  const actionSummary = {
    Escalate: exceptionResults.filter(row => row.RecommendedAction === "Escalate").length,
    Review: exceptionResults.filter(row => row.RecommendedAction === "Review").length,
    Remove: exceptionResults.filter(row => row.RecommendedAction === "Remove").length,
    Renew: exceptionResults.filter(row => row.RecommendedAction === "Renew").length,
    NoImmediateAction: exceptionResults.filter(row => row.RecommendedAction === "No immediate action").length
  };

  const result = {
    AnalysisDate: formatDate(analysisDate),
    DaysBack: daysBack,
    CutoffDate: formatDate(cutoffDate),
    TotalAlertsRead: alerts.length,
    TotalExceptionsRead: exceptions.length,
    UserPolicyGroupsFound: alertCorrelation.length,
    ReadyForAssessmentCount: readyExceptions.length,
    NotReadyForAssessmentCount: notReadyExceptions.length,
    RiskLevelSummary: riskLevelSummary,
    RecommendedActionSummary: actionSummary,
    AlertCorrelationByUserPolicy: alertCorrelation,
    ExceptionCorrelationAndRisk: exceptionResults.map(row => removeSortField(row)),
    Top5RiskiestExceptions: top5,
    UnusedExceptions: unusedExceptions
  };

  return JSON.stringify(result);
}

function clean(value: string | number | boolean | null | undefined): string {
  if (value === null || value === undefined) return "";
  return String(value).trim();
}

function normalize(value: string): string {
  return value.trim().toLowerCase().replace(/\s+/g, " ");
}

function makeKey(user: string, policy: string): string {
  return `${ normalize(user) }|| ${ normalize(policy) } `;
}

function addUnique(list: string[], value: string): void {
  if (!value) return;

  const normalized = normalize(value);
  const exists = list.some(item => normalize(item) === normalized);

  if (!exists) {
    list.push(value);
  }
}

function parseDate(value: string | number | boolean | null | undefined): Date | null {
  if (value === null || value === undefined || value === "") return null;

  if (typeof value === "number") {
    return excelSerialDateToDate(value);
  }

  const raw = String(value).trim();

  if (/^\d+(\.\d+)?$/.test(raw)) {
    return excelSerialDateToDate(Number(raw));
  }

  if (/^\d{4}-\d{2}-\d{2}/.test(raw)) {
    const isoDate = new Date(raw);
    if (!isNaN(isoDate.getTime())) return isoDate;
  }

  const match = raw.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})(?:\s+(\d{1,2}):(\d{2}))?/);
  if (match) {
    const day = Number(match[1]);
    const month = Number(match[2]) - 1;
    const year = Number(match[3]);
    const hour = match[4] ? Number(match[4]) : 0;
    const minute = match[5] ? Number(match[5]) : 0;

    return new Date(year, month, day, hour, minute);
  }

  return null;
}

function excelSerialDateToDate(serial: number): Date {
  const excelEpoch = Date.UTC(1899, 11, 30);
  return new Date(excelEpoch + serial * 86400000);
}

function formatDate(date: Date | null): string {
  if (!date) return "";

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  return `${ day } /${month}/${ year } `;
}

function checkReadiness(
  communicationStatus: string,
  formResponseStatus: string,
  approvalStatus: string,
  exceptionStatus: string
): { ready: boolean; reason: string; requiredAction: string } {

  const missing: string[] = [];
  const requiredActions: string[] = [];

  if (normalize(communicationStatus) !== "sent") {
    missing.push(`CommunicationStatus is '${communicationStatus}', required value is 'Sent'`);
    requiredActions.push("Send communication");
  }

  if (normalize(formResponseStatus) !== "completed") {
    missing.push(`FormResponseStatus is '${formResponseStatus}', required value is 'Completed'`);
    requiredActions.push("Complete form");
  }

  if (normalize(approvalStatus) !== "approved") {
    missing.push(`ApprovalStatus is '${approvalStatus}', required value is 'Approved'`);
    requiredActions.push("Complete approval");
  }

  const normalizedExceptionStatus = normalize(exceptionStatus);
  if (normalizedExceptionStatus !== "active" && normalizedExceptionStatus !== "expired") {
    missing.push(`ExceptionStatus is '${exceptionStatus}', required value is 'Active' or 'Expired'`);
    requiredActions.push("Validate exception status");
  }

  if (missing.length === 0) {
    return {
      ready: true,
      reason: "Ready for assessment",
      requiredAction: ""
    };
  }

  return {
    ready: false,
    reason: `Risk cannot be calculated because: ${ missing.join("; ") }.`,
    requiredAction: uniqueText(requiredActions).join(" / ")
  };
}

function calculateRisk(
  exceptionStatus: string,
  expiryDate: Date | null,
  alertsLast30Days: number,
  sensitiveDataType: string,
  alertSensitiveDataTypes: string,
  channel: string,
  analysisDate: Date
): { riskScore: number; riskLevel: string; explanation: string } {

  let riskScore = 0;
  const details: string[] = [];

  const expired = normalize(exceptionStatus) === "expired";
  if (expired) {
    riskScore += 3;
    details.push("Expired exception: Yes → +3");
  } else {
    details.push("Expired exception: No → +0");
  }

  const expiresSoon =
    expiryDate !== null &&
    !expired &&
    daysBetween(analysisDate, expiryDate) >= 0 &&
    daysBetween(analysisDate, expiryDate) <= 15;

  if (expiresSoon) {
    riskScore += 2;
    details.push("Expires in the next 15 days: Yes → +2");
  } else {
    details.push("Expires in the next 15 days: No → +0");
  }

  const alertPoints = getAlertVolumePoints(alertsLast30Days);
  riskScore += alertPoints;
  details.push(`AlertsLast30Days = ${ alertsLast30Days } → +${ alertPoints } `);

  const highImpact = isHighImpactSensitiveData(sensitiveDataType, alertSensitiveDataTypes);
  if (highImpact) {
    riskScore += 2;
    details.push("High-impact sensitive data type: Yes → +2");
  } else {
    details.push("High-impact sensitive data type: No → +0");
  }

  const endpoint = normalize(channel) === "endpoint devices";
  if (endpoint) {
    riskScore += 2;
    details.push("Channel = Endpoint devices → +2");
  } else {
    details.push(`Channel = ${ channel || "not provided" } → +0`);
  }

  const riskLevel = calculateRiskLevel(riskScore);

  return {
    riskScore: riskScore,
    riskLevel: riskLevel,
    explanation: `${ details.join("; ") }. Total RiskScore = ${ riskScore }.RiskLevel = ${ riskLevel }.`
  };
}

function getAlertVolumePoints(alertsLast30Days: number): number {
  if (alertsLast30Days > 10) return 3;
  if (alertsLast30Days >= 5 && alertsLast30Days <= 10) return 2;
  if (alertsLast30Days >= 1 && alertsLast30Days <= 4) return 1;

  return 0;
}

function isHighImpactSensitiveData(exceptionSensitiveDataType: string, alertSensitiveDataTypes: string): boolean {
  const combined = normalize(`${ exceptionSensitiveDataType } ${ alertSensitiveDataTypes } `);

  const highImpactTerms = [
    "financial",
    "bank",
    "banking",
    "payment",
    "payment card",
    "card",
    "credit card",
    "pii",
    "personally identifiable",
    "personal identifier",
    "national id",
    "national identification",
    "dni",
    "passport",
    "credential",
    "credentials",
    "password",
    "confidential",
    "legal",
    "hr",
    "human resources",
    "medical",
    "health",
    "healthcare"
  ];

  return highImpactTerms.some(term => combined.includes(term));
}

function calculateRiskLevel(riskScore: number): string {
  if (riskScore >= 9) return "Critical";
  if (riskScore >= 6) return "High";
  if (riskScore >= 3) return "Medium";

  return "Low";
}

function calculateRecommendedAction(
  exceptionStatus: string,
  alertsLast30Days: number,
  riskLevel: string,
  businessJustification: string
): string {

  const normalizedStatus = normalize(exceptionStatus);
  const normalizedRisk = normalize(riskLevel);
  const hasJustification = businessJustification.length > 0;

  if (normalizedStatus === "expired" && alertsLast30Days > 0) {
    return "Escalate";
  }

  if (normalizedStatus === "expired" && alertsLast30Days === 0) {
    return "Remove";
  }

  if (normalizedRisk === "critical" || normalizedRisk === "high") {
    return "Escalate";
  }

  if (normalizedStatus === "active" && alertsLast30Days === 0) {
    return "Remove";
  }

  if (normalizedRisk === "medium") {
    return "Review";
  }

  if (normalizedStatus === "active" && alertsLast30Days > 0 && hasJustification) {
    return "Renew";
  }

  if (!hasJustification) {
    return "Review";
  }

  return "No immediate action";
}

function daysBetween(startDate: Date, endDate: Date): number {
  const start = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
  const end = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate());
  const diff = end.getTime() - start.getTime();

  return Math.ceil(diff / 86400000);
}

function uniqueText(values: string[]): string[] {
  const result: string[] = [];

  for (const value of values) {
    if (!result.some(item => normalize(item) === normalize(value))) {
      result.push(value);
    }
  }

  return result;
}

function removeSortField(row: { [key: string]: string | number | boolean | null | undefined }): { [key: string]: string | number | boolean | null | undefined } {
  const cleanRow: { [key: string]: string | number | boolean | null | undefined } = {};

  for (const key in row) {
    if (key !== "SortRiskScore") {
      cleanRow[key] = row[key];
    }
  }

  return cleanRow;
}
