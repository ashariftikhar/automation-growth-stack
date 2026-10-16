# 🔄 CRM Bi-Directional Sync with Turso & Google Sheets

**Production n8n workflow for continuous lead replication, real-time deduplication, and atomic synchronization between edge SQL (Turso LibSQL) and Google Sheets.**

Part of the **[Ashflow Automation Growth Stack](https://ashflow.site)**.

---

## ⚡ What It Does

When scaling multi-channel lead funnels, companies often suffer from fragmented data, duplicate records, and out-of-sync spreadsheets.

This workflow provides an enterprise-grade sync bridge:
1. **Intakes Leads via Webhook**: Standardized endpoint receiving records from Typeform, Webflow, Clay, HubSpot, or outreach campaigns.
2. **Deterministic Deduplication**: Normalizes email and computes a cryptographic dedupe hash (`sha256(email)`).
3. **Turso Edge SQL Query**: Verifies in sub-10ms whether the prospect exists in your Turso database.
4. **Intelligent Branching**:
   - **New Record**: Inserts into Turso and appends a row to Google Sheets.
   - **Existing Record**: Updates pipeline stage, deal value, and timestamps in both Turso and Google Sheets without creating duplicate rows.
5. **Atomic Webhook Confirmation**: Replies with the exact sync action taken (`created` vs `updated`).

```
[Inbound Webhook Intake]
          │
          ▼
[Normalize & Hash Lead (SHA-256)]
          │
          ▼
[Turso LibSQL: SELECT WHERE dedupe_hash]
          │
    ┌─────┴────────────────────────┐
    │                              │
[Lead Exists = False]         [Lead Exists = True]
    │                              │
    ├──► Turso INSERT              ├──► Turso UPDATE
    │                              │
    ├──► Google Sheets Append      ├──► Google Sheets Update
    │                              │
    └──► Webhook (201 Created)     └──► Webhook (200 Updated)
```

---

## ⏱️ Setup Time & Requirements

- **Setup Time**: ~15 minutes
- **Skill Level**: Intermediate

| Service | Requirement | Purpose |
|---|---|---|
| **n8n** (v1.0+) | Self-hosted or Cloud | Automation orchestrator |
| **Turso** | Free / Pro Account | Ultra-fast SQLite database on the edge |
| **Google Sheets** | OAuth2 Credential | Real-time visual spreadsheet for sales reps |

---

## 🗄️ Database Schema (Turso / SQLite DDL)

Before activating the workflow, execute this DDL in your Turso database (via Turso CLI or Web Shell):

```sql
CREATE TABLE IF NOT EXISTS leads (
    id TEXT PRIMARY KEY,
    dedupe_hash TEXT UNIQUE NOT NULL,
    email TEXT NOT NULL,
    full_name TEXT,
    company TEXT,
    phone TEXT,
    stage TEXT DEFAULT 'New Lead',
    deal_value REAL DEFAULT 0.0,
    source TEXT,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
);

-- Optimize deduplication queries
CREATE INDEX IF NOT EXISTS idx_leads_dedupe ON leads (dedupe_hash);
CREATE INDEX IF NOT EXISTS idx_leads_email ON leads (email);
```

---

## 📊 Google Sheets Column Layout

Create a spreadsheet tab named `Leads` with these exact column headers in row 1:

| Column A | Column B | Column C | Column D | Column E | Column F | Column G | Column H | Column I | Column J |
|---|---|---|---|---|---|---|---|---|---|
| `id` | `dedupe_hash` | `email` | `full_name` | `company` | `phone` | `stage` | `deal_value` | `source` | `created_at` |

---

## 🛠️ Step-by-Step Setup Guide

### 1. Import Workflow
1. In n8n, navigate to **Workflows**.
2. Click **Add workflow** → **`⋮`** → **Import from File**.
3. Select [`workflow.json`](./workflow.json).

### 2. Configure Environment Variables
Set the following variables in your n8n environment (or `.env` file):

```env
TURSO_DATABASE_URL=https://<your-database>-<org>.turso.io
TURSO_AUTH_TOKEN=eyJhbGciOi...
```

> **Tip**: If you prefer not to use environment variables, you can paste your Turso URL and Bearer token directly into the HTTP Request nodes.

### 3. Connect Google Sheets
1. Open the two Google Sheets nodes:
   - `Google Sheets - Update Row`
   - `Google Sheets - Append Row`
2. Connect your **Google Sheets OAuth2 API** credential.
3. Select your spreadsheet and map the sheet to `Leads`.

### 4. Test Webhook Intake

Send a sample lead payload to your test webhook:

```bash
curl -X POST "https://<YOUR-N8N-DOMAIN>/webhook-test/crm-lead-sync" \
  -H "Content-Type: application/json" \
  -d '{
    "first_name": "Alexander",
    "last_name": "Wright",
    "email": "alex.wright@hyperion-tech.io",
    "company": "Hyperion Tech",
    "phone": "+1-415-555-0149",
    "stage": "Discovery Call Scheduled",
    "deal_value": 24000,
    "source": "Outbound Email Campaign"
  }'
```

**Response (First time - Created):**
```json
{
  "status": "success",
  "action": "created",
  "lead_id": "lead_e4f3a2c1b9d80765",
  "dedupe_hash": "e4f3a2c1b9d80765",
  "email": "alex.wright@hyperion-tech.io",
  "stage": "Discovery Call Scheduled",
  "created_at": "2026-10-16T15:30:00.000Z"
}
```

**Response (Second time with updated stage - Updated):**
```json
{
  "status": "success",
  "action": "updated",
  "lead_id": "lead_e4f3a2c1b9d80765",
  "dedupe_hash": "e4f3a2c1b9d80765",
  "email": "alex.wright@hyperion-tech.io",
  "stage": "Contract Sent",
  "updated_at": "2026-10-16T15:45:00.000Z"
}
```

---

## 🚀 Enterprise Scaling & Custom Setup

Need bi-directional webhooks with HubSpot, Close.io, or Salesforce, or high-throughput batching?

👉 **[Book an Automation Strategy Audit](https://ashflow.site/book-audit)** — Ashflow designs hardened data pipelines for scaling organizations.

---

## 📄 License

MIT © [Ashflow](https://ashflow.site). Free for commercial and personal automation workflows.
