/**
 * Email Normalizer & B2B Domain Extractor
 * Production n8n JavaScript Code Node Snippet
 * 
 * Part of the Ashflow Automation Growth Stack (https://ashflow.site)
 * 
 * Purpose:
 * - Sanitizes and normalizes contact emails (RFC 5322 check, lowercase, trim)
 * - Detects consumer / freemail domains (gmail, yahoo, hotmail, etc.)
 * - Flags disposable / burner email domains
 * - Extracts clean company domain and infers business brand name
 * 
 * Usage in n8n:
 * Place this inside an n8n "Code" node (Mode: "Run Once for All Items").
 * By default looks for the 'email' field on incoming items, or configure `EMAIL_FIELD`.
 */

// Common disposable email domains
const DISPOSABLE_DOMAINS = new Set([
  'tempmail.com', '10minutemail.com', 'mailinator.com', 'guerrillamail.com',
  'trashmail.com', 'throwawaymail.com', 'yopmail.com', 'getairmail.com',
  'dispostable.com', 'sharklasers.com', 'temp-mail.org', 'fakemailgenerator.com'
]);

// Common consumer / non-business freemail domains
const FREEMAIL_DOMAINS = new Set([
  'gmail.com', 'googlemail.com', 'yahoo.com', 'yahoo.co.uk', 'yahoo.ca',
  'hotmail.com', 'outlook.com', 'live.com', 'msn.com', 'icloud.com',
  'me.com', 'mac.com', 'aol.com', 'proton.me', 'protonmail.com',
  'zoho.com', 'mail.com', 'yandex.com', 'gmx.com', 'gmx.net', 'fastmail.com'
]);

// RFC 5322 simplified compliant email regex
const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;

/**
 * Capitalizes and formats brand name from domain string (e.g., 'acme-logistics' -> 'Acme Logistics')
 */
function inferCompanyName(domain) {
  if (!domain) return '';
  const root = domain.split('.')[0] || '';
  return root
    .split(/[-_]/)
    .filter(Boolean)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

/**
 * Normalizes and analyzes a single email string
 */
function normalizeEmail(rawEmail) {
  if (typeof rawEmail !== 'string') {
    return {
      email_raw: rawEmail,
      email_clean: '',
      is_valid: false,
      domain: '',
      is_free_provider: false,
      is_disposable: false,
      is_business_email: false,
      company_name_inferred: '',
      validation_error: 'Email is missing or not a string'
    };
  }

  const clean = rawEmail.trim().toLowerCase();
  
  if (!clean || !EMAIL_REGEX.test(clean)) {
    return {
      email_raw: rawEmail,
      email_clean: clean,
      is_valid: false,
      domain: '',
      is_free_provider: false,
      is_disposable: false,
      is_business_email: false,
      company_name_inferred: '',
      validation_error: 'Invalid email syntax'
    };
  }

  const parts = clean.split('@');
  const domain = parts[1] || '';
  const isDisposable = DISPOSABLE_DOMAINS.has(domain);
  const isFree = FREEMAIL_DOMAINS.has(domain);
  const isBusiness = !isDisposable && !isFree;
  const companyName = isBusiness ? inferCompanyName(domain) : '';

  return {
    email_raw: rawEmail,
    email_clean: clean,
    is_valid: true,
    domain: domain,
    is_free_provider: isFree,
    is_disposable: isDisposable,
    is_business_email: isBusiness,
    company_name_inferred: companyName,
    validation_error: null
  };
}

// n8n Runtime Adapter
function processItems(items, targetField = 'email') {
  return items.map(item => {
    const data = item.json || item;
    const rawEmail = data[targetField] || data.Email || data.contact_email || '';
    const enrichment = normalizeEmail(rawEmail);

    return {
      json: {
        ...data,
        ...enrichment
      }
    };
  });
}

// Execution context handling (works both in n8n and Node.js environments)
if (typeof $input !== 'undefined' && typeof $input.all === 'function') {
  // n8n environment
  const items = $input.all();
  return processItems(items);
} else if (typeof module !== 'undefined' && module.exports) {
  // CommonJS Node.js export for automated testing
  module.exports = {
    normalizeEmail,
    processItems,
    FREEMAIL_DOMAINS,
    DISPOSABLE_DOMAINS
  };
}
