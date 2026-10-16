# 🤖 AI Receptionist & Intelligent Lead Booking

**Autonomous inbound pipeline: Webhook Intake → OpenAI Structured Qualification → Google Calendar Booking → Slack Real-Time Alerts.**

Part of the **[Ashflow Automation Growth Stack](https://ashflow.site)**.

---

## ⚡ Architecture & Flow

This workflow converts website forms, voice receptionist transcripts (Bland.ai, Vapi, Retell), or inbound webhooks into booked high-ticket strategy calls in seconds:

```
[Inbound Webhook Intake]
          │
          ▼
[Normalize & Validate Payload]
          │
          ▼
[OpenAI GPT-4o-mini Qualification]
  • fit_score (1-100)
  • tier (Enterprise / Mid-Market / SMB)
  • recommended_service
          │
          ▼
[Condition: Qualified Lead?]
      ├─── YES (fit_score >= 50) ────────────────┐
      │                                          │
      ▼                                          ▼
[Google Calendar Event Creation]           [Slack Nurture Alert]
      │                                          │
      ▼                                          ▼
[Slack / Telegram Real-Time Alert]         [Webhook JSON Response: Queued]
      │
      ▼
[Webhook JSON Response: Confirmed]
```

---

## 🎯 Key Capabilities

- **Zero-Latency Lead Response**: Responds instantaneously while the lead is hot.
- **Intelligent Qualification Guardrails**: Uses OpenAI structured JSON output to filter spam, unqualified requests, and tire-kickers based on budget, requirements, and business fit.
- **Automated Scheduling**: Provisions Google Calendar meetings with automated attendee invites and tailored briefing notes.
- **Bi-Directional Webhook Confirmation**: Directly replies to the client form or frontend caller with meeting confirmation details.

---

## ⏱️ Setup Time & Requirements

- **Setup Time**: ~15 minutes
- **Skill Level**: Intermediate

| Service | Requirement | Purpose |
|---|---|---|
| **n8n** (v1.0+) | Self-hosted or Cloud | Orchestration engine |
| **OpenAI API** | API Key (`gpt-4o-mini` or `gpt-4o`) | Natural language qualification |
| **Google Calendar** | Google OAuth2 Credential | Meeting provisioning |
| **Slack / Telegram** | Bot User OAuth Token | Sales notification channel |

---

## 🛠️ Step-by-Step Setup Guide

### 1. Import Workflow
1. In your n8n workspace, navigate to **Workflows**.
2. Click **Add workflow** → **`⋮`** (Menu) → **Import from File**.
3. Select [`workflow.json`](./workflow.json).

### 2. Configure Credentials

#### OpenAI
1. In n8n, open the **OpenAI Qualify Lead** node.
2. Under **Credential to connect with**, select **Create New Credential** → **OpenAI API**.
3. Supply your API Key (`sk-...`).

#### Google Calendar
1. Open the **Book Google Calendar Event** node.
2. Select or create a **Google Calendar OAuth2 API** credential.
3. Authorize the Google Workspace account hosting your booking calendar.
4. Verify the `Calendar` field is mapped to `primary` (or your dedicated sales calendar ID).

#### Slack Notifications
1. Open **Slack Alert - Qualified** and **Slack Alert - Nurture Lead**.
2. Connect your **Slack API** or **Slack Bot Token** (`xoxb-...`).
3. Select your notification channels (e.g., `#leads-qualified` and `#leads-nurture`).

### 3. Webhook Intake Payload Schema

Send a `POST` request to `https://<YOUR-N8N-DOMAIN>/webhook/receptionist-lead-intake` with the following JSON:

```json
{
  "name": "Sarah Jenkins",
  "company": "Apex Freight Logistics",
  "email": "sarah.jenkins@apexfreight.com",
  "phone": "+1-512-555-0199",
  "budget": "$15,000 - $30,000",
  "preferred_time": "2026-10-20T15:00:00Z",
  "requirements": "Looking to automate our freight carrier onboarding process. We currently process 80 PDFs manually per day and want automated extraction into Turso DB with Slack escalations."
}
```

#### Test via cURL:
```bash
curl -X POST "https://<YOUR-N8N-DOMAIN>/webhook-test/receptionist-lead-intake" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Sarah Jenkins",
    "company": "Apex Freight Logistics",
    "email": "sarah.jenkins@apexfreight.com",
    "phone": "+1-512-555-0199",
    "budget": "$15,000 - $30,000",
    "requirements": "Automate carrier onboarding and PDF extraction."
  }'
```

### 4. Customizing Qualification Logic
Edit the prompt inside **OpenAI Qualify Lead** to reflect your specific ICP (Ideal Customer Profile), minimum engagement budget, and product lines.

---

## 🚀 Scaling to Production

Need custom voice agent integration (Twilio / Vapi), live SMS reminders, or multi-calendar round-robin distribution?

👉 **[Book an Automation Strategy Audit](https://ashflow.site/book-audit)** — Ashflow designs bespoke growth engines for modern enterprises.

---

## 📄 License

MIT © [Ashflow](https://ashflow.site). Free for commercial and personal automation workflows.
