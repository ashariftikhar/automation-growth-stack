<!-- ============================================================ -->
<!--  AUTOMATION GROWTH STACK · by Ashar Iftikhar              -->
<!--  SEO: n8n automation, workflow templates, lead generation  -->
<!--  ai automation, growth stack, open source                  -->
<!-- ============================================================ -->

<!-- HEADER -->
<div align="center">
  <img src="https://capsule-render.vercel.app/api?type=waving&color=0:0d1117,50:0a1929,100:0d2137&height=180&section=header&text=Automation%20Growth%20Stack&fontSize=36&fontColor=58a6ff&animation=fadeIn&fontAlignY=38&desc=Production-ready%20automation%20templates%20%C2%B7%20workflows%20%C2%B7%20growth%20systems&descAlignY=62&descSize=14&descColor=8b949e" width="100%"/>
</div>

<div align="center">

[![GitHub Stars](https://img.shields.io/github/stars/ashariftikhar/automation-growth-stack?style=for-the-badge&logo=github&logoColor=white&color=1f6feb&label=Stars)](https://github.com/ashariftikhar/automation-growth-stack/stargazers)
[![GitHub Forks](https://img.shields.io/github/forks/ashariftikhar/automation-growth-stack?style=for-the-badge&logo=github&logoColor=white&color=1f6feb&label=Forks)](https://github.com/ashariftikhar/automation-growth-stack/network/members)
[![MIT License](https://img.shields.io/badge/License-MIT-3fb950?style=for-the-badge&logo=opensourceinitiative&logoColor=white)](LICENSE)
[![Made With n8n](https://img.shields.io/badge/Built%20With-n8n-EA4B71?style=for-the-badge&logo=n8n&logoColor=white)](https://n8n.io)
[![Author](https://img.shields.io/badge/Author-Ashar%20Iftikhar-58a6ff?style=for-the-badge&logo=github&logoColor=white)](https://github.com/ashariftikhar)

</div>

<br/>

<div align="center">

> ### *Stop doing manually what a system can do permanently.*
>
> A curated collection of production-ready automation templates, n8n workflows, and growth systems — built to eliminate repetitive work and compound your results over time.

</div>

---

## 📋 Table of Contents

- [Why This Stack](#-why-this-stack)
- [What's Inside](#-whats-inside)
- [Quick Start](#-quick-start)
- [Templates](#-templates)
- [Guides](#-step-by-step-guides)
- [Stack Requirements](#-stack-requirements)
- [Roadmap](#-roadmap)
- [Contributing](#-contributing)
- [Author](#-author)

---

## 🎯 Why This Stack

Most automation tutorials show you *how to use a tool*. This repo shows you *how to build systems that generate outcomes.*

Every template here is:

- ✅ **Production-tested** — not toy demos, real workflow logic
- ✅ **Plug-and-play** — clone, configure credentials, run
- ✅ **Documented** — every step explained, no guessing
- ✅ **Composable** — combine templates to build bigger systems
- ✅ **Free to use** — MIT license, personal or commercial

> **Time saved by this stack (estimated):** 15–25 hours/month of manual work eliminated per active user.

---

## 📦 What's Inside

### 🔧 Templates

Production-ready automation workflows — clone and configure in minutes.

| Template | What It Does | Tools | Status |
|----------|-------------|-------|--------|
| [**Lead Funnel**](templates/lead-funnel/) | Form submission → CRM entry → email sequence → conversion tracking | n8n · Notion · Gmail | ✅ Ready |
| [**Client Reports**](templates/client-reports/) | Pull API data → generate PDF report → email to client every Monday | n8n · OpenAI · Gmail | ✅ Ready |
| [**Content Repurpose Bot**](templates/content-bot/) | Blog post → reformatted Twitter thread + LinkedIn post → auto-scheduled | n8n · OpenAI · Buffer | 🚧 Coming Soon |
| [**Lead Scoring Engine**](templates/lead-scoring/) | Score inbound leads by behavior → route hot leads to Slack instantly | n8n · Airtable · Slack | 🚧 Coming Soon |
| [**Onboarding Flow**](templates/onboarding/) | New client signs → welcome email → task list created → kickoff booked | n8n · Notion · Calendly | 📐 Planned |
| [**Re-engagement Sequence**](templates/re-engagement/) | Dormant leads → personalized re-engagement → response tracking | n8n · ConvertKit | 📐 Planned |

### 📚 Guides

Step-by-step documentation to go from zero to running system.

| Guide | What You'll Learn |
|-------|------------------|
| [30-Minute Setup Guide](guides/setup-guide.md) | Install n8n, configure credentials, run your first workflow |
| [Add AI to Any Workflow](guides/ai-integration.md) | Connect OpenAI API to any trigger for smart automation |
| [Track Everything That Matters](guides/measurement.md) | GA4, webhook analytics, and building a metrics dashboard |
| [Credential Security](guides/credentials.md) | Keep API keys safe — env variables, secrets management |

---

## 🚀 Quick Start

**Prerequisites:** Node.js 18+ · npm · A free [n8n account](https://cloud.n8n.io) or self-hosted instance

```bash
# 1. Clone the repo
git clone https://github.com/ashariftikhar/automation-growth-stack.git
cd automation-growth-stack

# 2. Pick a template
cd templates/lead-funnel

# 3. Read the template README and configure credentials
cat README.md

# 4. Import the workflow JSON into n8n
# n8n Dashboard → Workflows → Import from file → workflow.json

# 5. Add your credentials in n8n
# (Gmail, Notion, Slack — instructions in each template README)

# 6. Activate and test
# Click "Active" toggle in n8n → submit a test form → check your inbox
```

> **No coding required for most templates.** If you can use a spreadsheet, you can run these workflows.

---

## 🔩 Templates (Detailed)

### ⚡ Template 01 — Lead Funnel Automation

**What it does:** Every lead that hits your form is automatically captured, tagged, added to your CRM, sent a personalized welcome email, and enrolled in a nurture sequence — in under 60 seconds.

**Workflow:**
```
Form Submit → n8n Webhook → Tag by Source → Notion CRM Entry
    → Welcome Email (< 60s) → Wait 2 Days → Follow-up #1
    → Wait 3 Days → Follow-up #2 → Wait 5 Days → Soft CTA
    → Score Lead → If score ≥ 40 → Slack Alert → Personal Outreach
```

**Setup time:** ~30 minutes
**Tools needed:** n8n · Netlify Forms or Typeform · Notion · Gmail SMTP

[→ View Template](templates/lead-funnel/) · [→ Read Setup Guide](templates/lead-funnel/README.md)

---

### 📊 Template 02 — Automated Client Reports

**What it does:** Every Monday at 9 AM, this workflow pulls data from your client's analytics, generates a formatted report using GPT-4, and emails it directly to them — automatically.

**Workflow:**
```
Cron Trigger (Monday 9AM) → Fetch GA4 Data → Fetch Search Console Data
    → Send to OpenAI → Format Report → Generate PDF
    → Email to Client → Log to Notion → Done
```

**Setup time:** ~45 minutes
**Tools needed:** n8n · Google Analytics API · OpenAI API · Gmail

[→ View Template](templates/client-reports/) · [→ Read Setup Guide](templates/client-reports/README.md)

---

## 📖 Step-by-Step Guides

### [📘 30-Minute Setup Guide](guides/setup-guide.md)
Everything you need to go from zero to running your first automation — n8n installation, credential setup, and your first live workflow.

### [🤖 Add AI to Any Workflow](guides/ai-integration.md)
How to wire OpenAI into any n8n workflow to add smart classification, content generation, data formatting, and decision-making.

### [📈 Track Everything That Matters](guides/measurement.md)
Build a lightweight analytics layer on top of your automations — know exactly what's triggering, converting, and compounding.

### [🔐 Credential Security](guides/credentials.md)
Keep your API keys and secrets safe. Environment variables, n8n's built-in credential manager, and what never to commit to GitHub.

---

## 🛠 Stack Requirements

| Tool | Purpose | Cost |
|------|---------|------|
| [n8n](https://n8n.io) | Workflow automation engine | Free (self-hosted) / $20/mo cloud |
| [OpenAI API](https://openai.com) | AI content generation & classification | Pay per use (~$0.01/run) |
| [Notion](https://notion.so) | CRM and data storage | Free |
| [ConvertKit](https://convertkit.com) | Email sequences | Free up to 1k subs |
| [Slack](https://slack.com) | Internal notifications | Free |
| [Netlify Forms](https://netlify.com) | Form capture | Free |
| [Google Analytics 4](https://analytics.google.com) | Tracking & reporting | Free |

> **Total cost to run this stack: $0–$20/month** depending on whether you self-host n8n.

---

## 🗺 Roadmap

```
Q1 2026  ✅ Lead Funnel Template
         ✅ Client Reports Template
         ✅ Setup & AI Integration Guides

Q2 2026  🚧 Content Repurpose Bot
         🚧 Lead Scoring Engine
         📐 Onboarding Flow Template

Q3 2026  📐 Re-engagement Sequence
         📐 Revenue Attribution Dashboard
         📐 Multi-channel outreach system
```

Want to see something specific? [Open an issue →](https://github.com/ashariftikhar/automation-growth-stack/issues)

---

## 🤝 Contributing

**👋 First time contributor?** Look for [issues labeled `good first issue`](https://github.com/ashariftikhar/automation-growth-stack/labels/good%20first%20issue)

This repo grows with contributions. Here's how to add your own templates or improvements:

1. **Fork the repo** — create your own copy
2. **Create a branch** — `git checkout -b template/your-template-name`
3. **Follow the template structure** — copy `/templates/_template/` as your starting point
4. **Document everything** — a template without a README won't be merged
5. **Open a Pull Request** — describe what it does and what tools it needs

**Contribution guidelines:**
- Every template needs a `workflow.json` and a `README.md`
- No paid tools as hard dependencies — keep it accessible
- Test your workflow before submitting

---

## ⭐ Support

If this stack saved you time or eliminated work you were doing manually:

<div align="center">

[![Star this repo](https://img.shields.io/badge/⭐_Star_This_Repo-1f6feb?style=for-the-badge&logo=github&logoColor=white)](https://github.com/ashariftikhar/automation-growth-stack/stargazers)
[![Fork It](https://img.shields.io/badge/🍴_Fork_It-0d1117?style=for-the-badge&logo=github&logoColor=white)](https://github.com/ashariftikhar/automation-growth-stack/fork)
[![Share It](https://img.shields.io/badge/📢_Share_It-0a66c2?style=for-the-badge&logo=linkedin&logoColor=white)](https://linkedin.com/in/ashariftikharofficial)

</div>

---

## 👤 Author

**Ashar Iftikhar** — Full Stack Developer & Automation Architect

I build web applications, AI automation systems, and digital growth infrastructure for clients and teams globally.

<div align="center">

[![Portfolio](https://img.shields.io/badge/🌐_Portfolio-0d1117?style=for-the-badge&logo=vercel&logoColor=58a6ff)](https://ashariftikhar.vercel.app/)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-0a66c2?style=for-the-badge&logo=linkedin&logoColor=white)](https://linkedin.com/in/ashariftikharofficial)
[![Email](https://img.shields.io/badge/Email-ea4335?style=for-the-badge&logo=gmail&logoColor=white)](mailto:officialashii72@gmail.com)
[![GitHub](https://img.shields.io/badge/GitHub-161b22?style=for-the-badge&logo=github&logoColor=white)](https://github.com/ashariftikhar)

</div>

---

## 📄 License

**MIT** — free for personal and commercial use. No credit required (but appreciated).

---

<div align="center">
  <img src="https://capsule-render.vercel.app/api?type=waving&color=0:0d2137,100:0d1117&height=100&section=footer" width="100%"/>
</div>

<div align="center">
  <sub>Built by <a href="https://github.com/ashariftikhar">Ashar Iftikhar</a> · Islamabad, Pakistan · 2026</sub>
  <br/>
  <sub>⭐ Star this repo to help other developers discover it</sub>
</div>
