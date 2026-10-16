/**
 * Phone Validator & E.164 Normalizer
 * Production n8n JavaScript Code Node Snippet
 * 
 * Part of the Ashflow Automation Growth Stack (https://ashflow.site)
 * 
 * Purpose:
 * - Sanitizes raw phone numbers from webforms, webhooks, or scrapers
 * - Normalizes numbers to global ITU-T E.164 format (e.g., +14035550192)
 * - Identifies international country calling code
 * - Validates length and structural integrity
 * 
 * Usage in n8n:
 * Place this inside an n8n "Code" node (Mode: "Run Once for All Items").
 * Checks `phone`, `Phone`, `telephone`, or `contact_phone` fields by default.
 */

// Default country dialing code to apply if number is formatted locally (e.g. 1 for US/Canada)
const DEFAULT_COUNTRY_CODE = '1';

// Known country calling codes for quick prefix matching
const KNOWN_COUNTRY_CODES = [
  '1', '44', '61', '49', '33', '34', '39', '81', '86', '91', '971', '966', '55', '52', '31', '41', '46', '64', '65', '27'
];

/**
 * Normalizes a raw phone number into standard E.164 format (+[country code][number])
 */
function normalizePhone(rawPhone, defaultCountryCode = DEFAULT_COUNTRY_CODE) {
  if (typeof rawPhone !== 'string' && typeof rawPhone !== 'number') {
    return {
      phone_raw: rawPhone,
      phone_e164: '',
      phone_national: '',
      country_code: '',
      is_valid_phone: false,
      phone_validation_error: 'Phone input is missing or empty'
    };
  }

  const str = String(rawPhone).trim();
  if (!str) {
    return {
      phone_raw: rawPhone,
      phone_e164: '',
      phone_national: '',
      country_code: '',
      is_valid_phone: false,
      phone_validation_error: 'Phone string is empty'
    };
  }

  const hasLeadingPlus = str.startsWith('+');
  const hasLeadingDoubleZero = str.startsWith('00');
  
  // Extract all digit characters
  let digits = str.replace(/\D/g, '');

  if (!digits || digits.length < 7) {
    return {
      phone_raw: rawPhone,
      phone_e164: '',
      phone_national: '',
      country_code: '',
      is_valid_phone: false,
      phone_validation_error: 'Phone number has too few digits (minimum 7)'
    };
  }

  let countryCode = '';
  let nationalNumber = '';

  if (hasLeadingPlus || hasLeadingDoubleZero) {
    // Strip leading 00 if international prefix
    if (hasLeadingDoubleZero) {
      digits = digits.slice(2);
    }
    
    // Match against known country codes sorted by descending length
    const matchedCode = KNOWN_COUNTRY_CODES
      .sort((a, b) => b.length - a.length)
      .find(code => digits.startsWith(code));

    if (matchedCode) {
      countryCode = matchedCode;
      nationalNumber = digits.slice(matchedCode.length);
    } else {
      // Fallback: assume first 1-3 digits are country code
      countryCode = digits.slice(0, 3);
      nationalNumber = digits.slice(3);
    }
  } else {
    // Local format without leading + or 00
    if (defaultCountryCode === '1' && digits.length === 10) {
      // Standard North American 10-digit number (e.g. 4035550192)
      countryCode = '1';
      nationalNumber = digits;
      digits = '1' + digits;
    } else if (defaultCountryCode === '1' && digits.length === 11 && digits.startsWith('1')) {
      // North American with leading 1 (e.g. 14035550192)
      countryCode = '1';
      nationalNumber = digits.slice(1);
    } else if (digits.startsWith('0') && digits.length > 8) {
      // Common international local format with trunk prefix 0 (e.g., 07123456789 in UK)
      countryCode = defaultCountryCode;
      nationalNumber = digits.replace(/^0+/, '');
      digits = defaultCountryCode + nationalNumber;
    } else {
      countryCode = defaultCountryCode;
      nationalNumber = digits;
      digits = defaultCountryCode + digits;
    }
  }

  // ITU-T E.164 maximum is 15 digits
  if (digits.length < 8 || digits.length > 15) {
    return {
      phone_raw: rawPhone,
      phone_e164: '+' + digits,
      phone_national: nationalNumber,
      country_code: countryCode ? '+' + countryCode : '',
      is_valid_phone: false,
      phone_validation_error: `Invalid E.164 length (${digits.length} digits). Must be between 8 and 15 digits.`
    };
  }

  const e164 = '+' + digits;

  return {
    phone_raw: rawPhone,
    phone_e164: e164,
    phone_national: nationalNumber,
    country_code: '+' + countryCode,
    is_valid_phone: true,
    phone_validation_error: null
  };
}

// n8n Runtime Adapter
function processItems(items, targetField = 'phone') {
  return items.map(item => {
    const data = item.json || item;
    const rawPhone = data[targetField] || data.Phone || data.telephone || data.contact_phone || data.mobile || '';
    const enrichment = normalizePhone(rawPhone);

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
    normalizePhone,
    processItems,
    KNOWN_COUNTRY_CODES
  };
}
