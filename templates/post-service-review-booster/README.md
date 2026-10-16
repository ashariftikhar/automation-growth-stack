# ⭐ Post-Service Review Booster & Reputation Gatekeeper

**Automate positive review velocity on Google Maps while privately defusing negative customer experiences before they become public.**

Part of the **[Ashflow Automation Growth Stack](https://ashflow.site)**.

---

## ⚡ What It Does

Customer feedback is binary: enthusiastic promoters drive revenue growth through public social proof, while dissatisfied clients require rapid service recovery.

This workflow creates an automated gatekeeper:
1. **Triggered on Job/Invoice Completion**: Listens for webhooks from QuickBooks, Stripe, Jobber, Housecall Pro, or your custom CRM.
2. **Dispatches 1-Click Sentiment Rating**: Customer receives a low-friction prompt (Email/SMS) to rate their experience.
3. **Smart Sentiment Routing**:
   - **Ratings 4 or 5 (Promoters)**: User is routed directly to your official Google Business Profile review link with a personalized thank-you note and guidance on keywords to mention. Internal team is celebrated in `#customer-love`.
   - **Ratings 1 to 3 (Detractors)**: The public review is intercepted. An immediate high-priority alert is sent to `#management-escalations`, an apology email is delivered to the customer, and a ticket is flagged for executive outreach within 60 minutes.

```
[Job / Service Completed]
          │
          ▼
 [Send 1-Click Rating Link]
          │
          ▼
[Customer Submits Rating (1-5)]
          │
    ┌─────┴────────────────────────┐
    │                              │
[Rating >= 4: Promoters]       [Rating < 4: Detractors]
    │                              │
    ├──► Send Google Review Link   ├──► Urgent Slack Management Alert
    ├──► Slack #customer-love      ├──► Executive Apology Email
    └──► Redirect to Google Maps   └──► Private Resolution Feedback
```

---

## ⏱️ Setup Time & Requirements

- **Setup Time**: ~12 minutes
- **Skill Level**: Beginner to Intermediate

| Service | Requirement | Purpose |
|---|---|---|
| **n8n** (v1.0+) | Self-hosted or Cloud | Automation engine |
| **Email (SMTP / SendGrid)** | SMTP Credential | Transmitting review invites |
| **Slack / Telegram** | Bot OAuth Token | Internal escalations & team alerts |
| **Google Business Profile** | Place Review Link | Target destination for 5-star reviews |

---

## 🛠️ Step-by-Step Setup Guide

### 1. Import Workflow
1. In n8n, navigate to **Workflows**.
2. Click **Add workflow** → **`⋮`** → **Import from File**.
3. Select [`workflow.json`](./workflow.json).

### 2. Configure Your Google Review URL
1. Find your Google Business review shortlink:
   - Search for your business in Google Maps.
   - Click **Ask for reviews** → Copy the review URL (e.g. `https://g.page/r/YOUR_ID/review`).
2. In the **Generate Review Links** node, update `googleReviewUrl` default or pass it via inbound webhook.

### 3. Connect Email / SMTP Credentials
1. Open the three Email nodes:
   - `Send Initial Review Request Email`
   - `Send Google Review Booster Email`
   - `Send Apology Recovery Email`
2. Connect your SMTP credential (or replace with SendGrid/Postmark/Resend).

### 4. Trigger Webhook Payload

When a job or invoice completes in your CRM, dispatch a `POST` request to `https://<YOUR-N8N-DOMAIN>/webhook/service-completed`:

```json
{
  "customer_name": "Marcus Vance",
  "customer_email": "marcus.vance@example.com",
  "customer_phone": "+1-403-555-0182",
  "service_name": "Commercial HVAC Seasonal Tuneup",
  "technician_name": "Dave Miller",
  "invoice_id": "INV-2026-8819",
  "google_review_url": "https://g.page/r/your-business-id/review"
}
```

---

## 📝 Copy Templates (SMS & Email)

### 1. Initial Review Request
**Email Subject:** `How was your service today with {{technician_name}}?`
```text
Hi {{customer_name}},

Thank you for trusting us with {{service_name}} today!

Our highest priority is making sure your experience was flawless. How did Dave do today?

⭐⭐⭐⭐⭐ Exceptional (5 Stars) -> [Link 5]
⭐⭐⭐⭐ Good (4 Stars) -> [Link 4]
⭐⭐⭐ Could Be Better (3 Stars) -> [Link 3]
```

**SMS Alternative (160 characters):**
```text
Hi Marcus! Thanks for choosing Apex HVAC today. How would you rate Dave's service (1-5)? Reply 5 or tap: https://feedback.ashflow.site/rate?inv=8819&r=5
```

---

### 2. Promoter Booster (Rating >= 4)
**Email Subject:** `Thank you so much! Could you share your review on Google?`
```text
Hi {{customer_name}},

We're so glad you had a 5-star experience with {{technician_name}}!

As an independent business, online reviews help other local clients find quality service. 

Would you mind taking 30 seconds to paste your rating on our official Google Business page?

👉 [Post Review on Google Maps] (https://g.page/r/...)

Thank you so much for your support!
```

---

### 3. Detractor Service Recovery (Rating < 4)
**Email Subject:** `A personal note from our management team regarding your service`
```text
Hi {{customer_name}},

We saw your feedback regarding invoice #{{invoice_id}}, and we take this to heart.

We hold our team to the highest standards, and it is clear we fell short today. Our executive operations manager has been personally notified.

We want to make this right immediately. Someone from our leadership team will contact you directly within 2 hours.

Warm regards,
Operations Leadership
Ashflow Partner Network
```

---

## 🚀 Enterprise Scaling & Custom Setup

Want to pipe reviews automatically into high-converting testimonial widgets or synchronize with Birdeye/Podium?

👉 **[Book a Strategy Audit with Ashflow](https://ashflow.site/book-audit)** — We scale customer acquisition & reputation engines for market leaders.

---

## 📄 License

MIT © [Ashflow](https://ashflow.site). Free for commercial and personal automation workflows.
