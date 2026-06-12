# Data Model

## Datasets

| Dataset | File | Purpose |
|---|---|---|
| DLP Exceptions | `data/DLP_Excepciones_MVP_ES.xlsx` | Governance inventory for DLP exceptions |
| DLP Alerts | `data/DLP_Alertas_MVP_ES.xlsx` | Operational export of DLP rule match alerts |

## DLP Exceptions dataset

| Column | Purpose | Source |
|---|---|---|
| IDExcepcion | Unique identifier for the exception | Manual / process |
| Solicitante | User who requested the exception | Forms / Excel |
| Departamento | Business area of the requester | Forms / Excel |
| JustificacionNegocio | Business justification for the exception | Forms |
| Canal | DLP workload or location related to the exception | Manual / controlled list |
| DirectivaDLP | DLP policy linked to the exception | Manual / controlled list |
| TipoDatoSensible | Sensitive data type involved | Manual / controlled list |
| EstadoComunicacion | Status of the communication with the requester | Process |
| EstadoRespuestaFormulario | Status of the requester form response | Forms / process |
| Aprobador | Person responsible for approving the exception | Approval process |
| EstadoAprobacion | Approval status | Approval process |
| FechaCaducidad | Expiration date of the exception | Approval process |
| EstadoExcepcion | Current lifecycle state of the exception | Formula / calculated |
| Alertas30Dias | Number of related alerts in the last 30 days | Agent calculated |
| FechaUltimaActividad | Last related DLP activity found | Agent calculated |
| ListaParaEvaluacion | Indicates whether the exception can be assessed | Formula / calculated |
| PuntuacionRiesgo | Numeric risk score | Agent calculated |
| NivelRiesgo | Risk level based on the score | Agent calculated |
| ExplicacionRiesgo | Human-readable risk explanation | Agent calculated |
| AccionRecomendada | Suggested governance action | Agent calculated |
| FechaUltimaEvaluacionRiesgo | Last date when risk was evaluated | Agent calculated |

## DLP Alerts dataset

| Column | Purpose |
|---|---|
| Archivo | File involved in the DLP event |
| Ubicación | Workload or location where the alert occurred |
| Usuario | User associated with the DLP alert |
| Sucedido | Date and time of the DLP event |
| Tipo de información confidencial | Sensitive information type detected |
| Recuento del tipo de información confidencial | Number of sensitive information matches |
| Directiva | DLP policy that generated the alert |
| Regla | DLP rule that generated the alert |
| Destinatario del correo electrónico | Recipient, when the alert is related to email |
| Extensión de archivo | File extension |
| Tamaño del archivo | File size |
| Aplicación | Application involved in the activity |
| Modo de cumplimiento | Policy enforcement mode |
| Dominio de destino | Destination domain, when applicable |
| Tipo de actividad | Activity that triggered the alert |

## Fields updated by the agent

| Field | Updated from |
|---|---|
| Alertas30Dias | Count of matching DLP alerts |
| FechaUltimaActividad | Most recent matching alert date |
| PuntuacionRiesgo | Risk scoring logic |
| NivelRiesgo | Risk score result |
| ExplicacionRiesgo | Agent risk reasoning |
| AccionRecomendada | Agent recommendation |
| FechaUltimaEvaluacionRiesgo | Date of the assessment |
