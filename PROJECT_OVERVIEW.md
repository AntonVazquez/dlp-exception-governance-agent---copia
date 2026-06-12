# Project Overview

## El problema

Las excepciones DLP son necesarias, pero se convierten en riesgo si no se revisan periódicamente. Los equipos de seguridad se enfrentan a:

- Excepciones activas sin uso que mantienen permisos innecesarios
- Excepciones caducadas con actividad real, sin revisar
- Renovaciones aprobadas sin evidencia de actividad
- Solicitudes, aprobaciones y alertas almacenadas por separado

---

## La solución

El agente combina dos perspectivas que normalmente se revisan por separado:

```
Inventario de excepciones DLP  →  quién solicitó, estado, vencimiento
Export de alertas DLP          →  actividad real por usuario y directiva
```

En lugar de cruzar esos datos a mano, el agente lo hace automáticamente y devuelve un análisis listo para actuar.

---

## Contexto del proceso

El MVP parte de un proceso realista de gestión de excepciones:

```
Usuario solicita excepción (Microsoft Forms)
        ↓
Power Automate registra la solicitud en Excel
        ↓
Aprobación del responsable
        ↓
Actualización del estado en el inventario
        ↓
Export periódico de alertas DLP
        ↓
Análisis y actualización por el agente
```

---

## Scoring de riesgo

El agente aplica criterios configurables para evaluar cada excepción:

| Criterio | Efecto |
|----------|--------|
| Excepción caducada | Aumenta el riesgo |
| Próxima a caducar | Requiere revisión |
| Muchas alertas recientes | Mayor prioridad |
| Sin alertas recientes | Valorar retirada |
| Tipo de dato sensible crítico | Mayor severidad |
| Canal Endpoint | Mayor exposición potencial |

---

## Valor del proyecto

| Antes | Con el agente |
|-------|---------------|
| Revisión manual de Excel | Consulta conversacional |
| Alertas y excepciones separadas | Correlación automática |
| Priorización subjetiva | Scoring de riesgo |
| Renovaciones sin evidencia | Decisiones basadas en actividad |
| Actualización manual del inventario | Actualización asistida |

---

## Usuarios objetivo

Equipos de seguridad · Administradores DLP · GRC · SOC · Responsables de cumplimiento

---

## Evolución futura

| Mejora | Valor |
|--------|-------|
| Conexión directa con Microsoft Purview | Elimina exports manuales |
| Power Automate avanzado | Automatiza notificaciones y actualizaciones |
| Dataverse | Modelo de datos más robusto |
| Dashboards Power BI | Seguimiento ejecutivo |
| Integración con ticketing / SIEM | Operación más completa |
