# DLP Exception Governance Agent

> Agente de **Microsoft Copilot Studio** para revisar, priorizar y actualizar excepciones DLP combinando inventario de excepciones y actividad real de alertas.

---

## ¿Qué hace el agente?

Las excepciones DLP son necesarias en algunos procesos de negocio, pero se vuelven un riesgo si no se revisan. Este agente cruza dos fuentes de datos para dar respuestas concretas:

```
Inventario de excepciones  +  Export de alertas DLP
              ↓
     Correlación automática
              ↓
  Scoring de riesgo  +  Recomendación  +  Actualización del inventario
```

---

## Fuentes de datos

| Fichero | Descripción |
|--------|-------------|
| `DLP_Excepciones_MVP_ES.xlsx` | Inventario de solicitudes y aprobaciones de excepciones |
| `DLP_Alertas_MVP_ES.xlsx` | Export periódico de alertas generadas por reglas DLP |

---

## Capacidades principales

| Capacidad | Descripción |
|-----------|-------------|
| 🔍 Revisar excepciones activas | Identifica qué excepciones siguen vigentes |
| ⏰ Detectar excepciones caducadas | Localiza excepciones vencidas que requieren acción |
| 📊 Calcular alertas recientes | Cuenta alertas asociadas en los últimos 30 días |
| ⚡ Priorizar por actividad | Destaca excepciones con más eventos recientes |
| 🚫 Detectar excepciones sin uso | Localiza excepciones activas sin actividad reciente |
| 🧮 Evaluar riesgo | Aplica scoring sobre estado, caducidad, actividad y tipo de dato |
| ✅ Recomendar acciones | Propone renovar, revisar, retirar o escalar |
| 📝 Actualizar el inventario | Completa campos de riesgo y actividad en el Excel |

---

## Lógica de correlación

El agente cruza ambos datasets usando tres campos:

```
Solicitante  =  Usuario
DirectivaDLP  =  Directiva
Fecha dentro de los últimos 30 días
```

Con este cruce calcula `Alertas30Dias` y genera los campos de gobierno:

| Campo | Descripción |
|-------|-------------|
| `Alertas30Dias` | Número de alertas asociadas a la excepción |
| `FechaUltimaActividad` | Última fecha de actividad encontrada |
| `PuntuacionRiesgo` | Resultado numérico del scoring |
| `NivelRiesgo` | Bajo · Medio · Alto · Crítico |
| `AccionRecomendada` | Renovar · Revisar · Retirar · Escalar |

---

## Estructura del repositorio

```
dlp-exception-governance-agent/
│
├── README.md
├── PROJECT_OVERVIEW.md
├── SETUP_GUIDE.md
├── DEMO_GUIDE.md
├── ROADMAP.md
│
├── data/
│   ├── DLP_Excepciones_MVP_ES.xlsx
│   └── DLP_Alertas_MVP_ES.xlsx
│
├── copilot-studio/
│   ├── agent-instructions.md
│   └── test-prompts.md
│
└── docs/
    ├── data-model.md
    ├── correlation-logic.md
    └── use-cases.md
```

---

## Alcance del MVP

**Incluido**
- Dataset sintético de excepciones y alertas DLP
- Correlación por usuario, directiva DLP y fecha
- Cálculo de alertas en los últimos 30 días
- Scoring básico de riesgo y recomendaciones de gobierno
- Actualización asistida del inventario de excepciones

**Fuera de alcance**
- Conexión directa con Microsoft Purview
- Uso de APIs reales o modelo de datos en Dataverse
- Remediación automática sin revisión humana

---

> ⚠️ Los datos incluidos en el repositorio son **sintéticos**. No deben incluirse datos reales de usuarios, clientes o entornos productivos.
