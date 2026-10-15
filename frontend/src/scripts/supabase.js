/**
 * Supabase Client & REST API integration for WLUG OSD 2026.
 * Uses native fetch to connect to Supabase PostgREST API without heavy external dependencies.
 */

const SUPABASE_URL = (import.meta.env.VITE_SUPABASE_URL || '').trim().replace(/\/+$/, '');
const SUPABASE_ANON_KEY = (import.meta.env.VITE_SUPABASE_ANON_KEY || '').trim();
const SUPABASE_TABLE = (import.meta.env.VITE_SUPABASE_TABLE || 'registrations').trim();

// --- Diagnostic: confirm env is loaded by Vite (safe: never logs key values) ---
console.log('[Supabase] VITE_SUPABASE_URL present:', Boolean(import.meta.env.VITE_SUPABASE_URL));
console.log('[Supabase] VITE_SUPABASE_ANON_KEY present:', Boolean(import.meta.env.VITE_SUPABASE_ANON_KEY));
console.log('[Supabase] Table:', SUPABASE_TABLE);

/**
 * Checks whether valid Supabase environment variables are provided.
 * @returns {boolean}
 */
export function isSupabaseConfigured() {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    console.warn('[Supabase] Not configured: missing URL or key. Using mock fallback.');
    return false;
  }
  // Check if placeholder strings are still in place
  if (
    SUPABASE_URL.includes('your-project-id') ||
    SUPABASE_ANON_KEY.includes('your-anon') ||
    SUPABASE_ANON_KEY.includes('your-key')
  ) {
    console.warn('[Supabase] Not configured: placeholder values detected. Using mock fallback.');
    return false;
  }
  console.log('[Supabase] Configured correctly. Will use live Supabase.');
  return true;
}

/**
 * Inserts a new registration record into Supabase.
 * @param {Object} data - { name, email, year, department, prn }
 * @returns {Promise<Object>}
 */
export async function insertRegistrationToSupabase(data) {
  if (!isSupabaseConfigured()) {
    throw new Error(
      'Supabase is not configured. Please add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your .env file.'
    );
  }

  const endpoint = `${SUPABASE_URL}/rest/v1/${SUPABASE_TABLE}`;

  // Generate unique pass ID
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  const passId = `OSD26-${randomSuffix}`;

  const payload = {
    name: data.name.trim(),
    email: data.email.trim(),
    year: data.year.trim(),
    department: data.department.trim(),
    prn: data.prn.trim(),
    pass_id: passId,
  };

  console.log('[Supabase] Inserting into table:', SUPABASE_TABLE);
  console.log('[Supabase] Payload keys:', Object.keys(payload));

  let response;
  try {
    response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        // return=minimal → PostgREST returns 204 with no body.
        // This avoids a post-insert SELECT which would require a SELECT RLS policy
        // for the anon role. The pass ID is generated client-side so we don't
        // need the inserted row echoed back.
        Prefer: 'return=minimal',
      },
      body: JSON.stringify(payload),
    });
  } catch {
    throw new Error('Network error connecting to Supabase. Please check your internet connection.');
  }

  if (!response.ok) {
    let errorDetail = '';
    let errorCode = '';
    try {
      const errJson = await response.json();
      errorDetail = errJson.message || errJson.details || errJson.hint || '';
      errorCode = errJson.code || '';
      console.error('[Supabase] Insert error:', { status: response.status, code: errorCode, message: errorDetail });
    } catch {
      // ignore json parse error
    }

    // RLS denial — code 42501 or HTTP 401/403
    if (errorCode === '42501' || response.status === 401 || response.status === 403) {
      throw new Error(
        'Database permission error: Row Level Security is blocking this insert. ' +
        'Run the SQL policy in your Supabase SQL Editor to allow anonymous registrations.'
      );
    }

    if (response.status === 409 || errorDetail.toLowerCase().includes('duplicate')) {
      throw new Error('This PRN or Email ID is already registered for Open Source Day 2026.');
    }

    if (response.status === 404) {
      throw new Error(
        `Table "${SUPABASE_TABLE}" was not found in Supabase. Please create the table in your Supabase SQL editor.`
      );
    }

    throw new Error(
      errorDetail || `Registration failed with server status ${response.status}. Please try again.`
    );
  }

  // 204 No Content — insert succeeded, no row returned (expected with return=minimal)
  console.log('[Supabase] Insert successful, status:', response.status);

  return {
    success: true,
    passId,
    timestamp: new Date().toISOString(),
    participant: {
      name: payload.name,
      email: payload.email,
      year: payload.year,
      department: payload.department,
      prn: payload.prn,
    },
  };
}
