# 🗺️ Google Maps Email Scraper

**Scrape business emails from Google Maps search results — no paid APIs required.**

## What It Does

This workflow searches Google Maps for any business category (dentists, lawyers, restaurants, etc.), extracts website URLs from the results, visits each site, scrapes email addresses, and saves them to a Google Sheet.

**Workflow:**
```
Manual Trigger → Scrape Google Maps → Extract URLs → Filter Google URLs
    → Remove Duplicates → Limit Results → Loop Over Items
    → Scrape Each Site → Extract Emails → Filter Empties
    → Remove Duplicates → Save to Google Sheets
```

## Use Cases

- Lead generation for local businesses
- Building outreach lists for marketing campaigns
- Competitor research and analysis
- Building contact databases for sales teams

## Setup Time

**~20 minutes**

## Requirements

| Tool | Purpose | Cost |
|------|---------|------|
| [n8n](https://n8n.io) | Workflow automation | Free (self-hosted) / $20/mo |
| [Google Sheets](https://sheets.google.com) | Data storage | Free |

## Setup Instructions

### 1. Import the Workflow

1. Open your n8n instance
2. Click **Workflows** → **Import from File**
3. Select `workflow.json` from this folder
4. The workflow will appear in your n8n dashboard

### 2. Configure Google Sheets

1. Create a new Google Sheet with a column header named `emails`
2. In n8n, click on the **Add to Sheet** node
3. Click **Create New Credential** for Google Sheets OAuth2
4. Follow the OAuth flow to connect your Google account
5. Select your spreadsheet and sheet name
6. Save the workflow

### 3. Customize Your Search

1. Click on the **Scrape Google Maps** node
2. Change the URL to your target search:
   ```
   https://www.google.com/maps/search/[CITY]+[BUSINESS_TYPE]
   ```
   Examples:
   - `https://www.google.com/maps/search/calgary+dentists`
   - `https://www.google.com/maps/search/new+york+restaurants`
   - `https://www.google.com/maps/search/london+lawyers`

### 4. Adjust Limits (Optional)

The **Limit** node is set to process 10 results by default. To scrape more:
1. Click the **Limit** node
2. Change `maxItems` to your desired number
3. Note: Higher numbers = longer execution time

### 5. Test the Workflow

1. Click **Execute Workflow** or **Test workflow**
2. Watch the nodes execute in sequence
3. Check your Google Sheet for scraped emails
4. Verify results and adjust as needed

## How It Works

1. **Scrape Google Maps** — Fetches HTML from Google Maps search results
2. **Extract URLs** — Uses regex to pull all website URLs from the page
3. **Filter Google URLs** — Removes Google-owned domains (schema.org, google.com, etc.)
4. **Remove Duplicates** — Eliminates duplicate URLs
5. **Limit** — Caps the number of sites to scrape (prevents long execution)
6. **Loop Over Items** — Processes each website one at a time
7. **Scrape Site** — Visits each business website and fetches HTML
8. **Extract Emails** — Uses regex to find email addresses in the HTML
9. **Filter Out Empties** — Removes results with no emails found
10. **Remove Duplicates (2)** — Eliminates duplicate email addresses
11. **Add to Sheet** — Appends emails to your Google Sheet

## Customization Options

### Change Output Destination

Instead of Google Sheets, you can:
- Replace the final node with **Airtable**, **Notion**, or **PostgreSQL**
- Send results to **Slack** or **Email**
- Save to a **CSV file** using the Write Binary File node

### Add More Data Points

Modify the **Extract Emails** node to also capture:
- Phone numbers: `/\d{3}[-.]?\d{3}[-.]?\d{4}/g`
- Social media links: `/https?:\/\/(www\.)?(facebook|twitter|linkedin)\.com\/[^\s]+/g`

### Increase Speed

- Remove the **Wait** nodes (may trigger rate limits)
- Increase batch size in **Loop Over Items**
- Use a proxy service for the HTTP requests

## Limitations

- Google Maps HTML structure may change (requires workflow updates)
- Some websites block scraping or don't display emails publicly
- Rate limiting may occur with high volumes
- Not all businesses list emails on their websites

## Troubleshooting

**No emails found:**
- Check if the websites actually display emails publicly
- Verify the regex pattern in **Extract Emails** node
- Some sites use contact forms instead of email addresses

**Workflow times out:**
- Reduce the **Limit** value
- Increase **Wait** time between requests
- Process in smaller batches

**Google Sheets not updating:**
- Verify OAuth credentials are connected
- Check sheet name and column headers match
- Ensure the sheet isn't protected or read-only

## Legal & Ethical Considerations

- Respect robots.txt and website terms of service
- Use scraped data responsibly and comply with GDPR/privacy laws
- Don't spam or send unsolicited emails
- Consider rate limiting to avoid overloading servers

## Next Steps

- Combine with the [Lead Funnel](../lead-funnel/) template to auto-enroll scraped leads
- Add AI classification to score lead quality
- Build a re-engagement sequence for cold outreach

## Support

Issues or questions? [Open an issue](https://github.com/ashariftikhar/automation-growth-stack/issues) or reach out on [LinkedIn](https://linkedin.com/in/ashariftikharofficial).

---

**License:** MIT — Free for personal and commercial use.
