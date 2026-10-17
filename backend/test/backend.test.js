import { app, server } from '../src/server.js';
import { env } from '../src/config/env.js';

let failedTests = 0;
let passedTests = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  ✓ ${message}`);
    passedTests++;
  } else {
    console.error(`  ✗ FAIL: ${message}`);
    failedTests++;
  }
}

async function runTests() {
  const baseUrl = `http://127.0.0.1:${env.PORT}`;
  console.log(`\nStarting WLUG OSD 2K26 Backend Test Suite against ${baseUrl}...\n`);

  // Wait a moment for server to bind
  await new Promise((r) => setTimeout(r, 500));

  // Test 1: GET /api/health
  console.log('1. Health Check Endpoint:');
  try {
    const res = await fetch(`${baseUrl}/api/health`);
    const data = await res.json();
    assert(res.status === 200, 'GET /api/health returns 200 OK');
    assert(data.status === 'ok', 'Response status is "ok"');
    assert(typeof data.timestamp === 'string', 'Timestamp is present');
  } catch (err) {
    assert(false, `Health check failed: ${err.message}`);
  }

  // Test 2: Validation of Malformed Payloads
  console.log('\n2. Payload Validation & Sanitization:');

  // 2a. Empty body
  try {
    const res = await fetch(`${baseUrl}/api/send-registration-email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
    });
    const data = await res.json();
    assert(res.status === 400, 'Empty payload rejected with 400');
    assert(data.success === false, 'data.success is false');
  } catch (err) {
    assert(false, `Empty payload test error: ${err.message}`);
  }

  // 2b. Invalid Name
  try {
    const res = await fetch(`${baseUrl}/api/send-registration-email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'A', // Too short
        email: 'test@example.com',
        mobile_number: '9876543210',
        year: 'Third Year',
        department: 'Computer Science and Engineering',
        college_name: 'WCE Sangli',
      }),
    });
    const data = await res.json();
    assert(res.status === 400, 'Single character name rejected with 400');
    assert(data.message.includes('name'), 'Error message mentions "name"');
  } catch (err) {
    assert(false, `Invalid name test error: ${err.message}`);
  }

  // 2c. Invalid Email
  try {
    const res = await fetch(`${baseUrl}/api/send-registration-email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Valid Name',
        email: 'not-an-email',
        mobile_number: '9876543210',
        year: 'Third Year',
        department: 'Computer Science and Engineering',
        college_name: 'WCE Sangli',
      }),
    });
    const data = await res.json();
    assert(res.status === 400, 'Malformed email rejected with 400');
    assert(data.message.includes('email'), 'Error message mentions "email"');
  } catch (err) {
    assert(false, `Invalid email test error: ${err.message}`);
  }

  // 2d. Invalid Mobile
  try {
    const res = await fetch(`${baseUrl}/api/send-registration-email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Valid Name',
        email: 'test@example.com',
        mobile_number: '12345', // Not 10 digits
        year: 'Third Year',
        department: 'Computer Science and Engineering',
        college_name: 'WCE Sangli',
      }),
    });
    const data = await res.json();
    assert(res.status === 400, 'Invalid mobile number rejected with 400');
    assert(data.message.includes('mobile'), 'Error message mentions "mobile"');
  } catch (err) {
    assert(false, `Invalid mobile test error: ${err.message}`);
  }

  // 2e. Invalid Year
  try {
    const res = await fetch(`${baseUrl}/api/send-registration-email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Valid Name',
        email: 'test@example.com',
        mobile_number: '9876543210',
        year: 'Tenth Year', // Invalid
        department: 'Computer Science and Engineering',
        college_name: 'WCE Sangli',
      }),
    });
    const data = await res.json();
    assert(res.status === 400, 'Invalid year option rejected with 400');
    assert(data.message.includes('year'), 'Error message mentions "year"');
  } catch (err) {
    assert(false, `Invalid year test error: ${err.message}`);
  }

  // 2f. Invalid Department
  try {
    const res = await fetch(`${baseUrl}/api/send-registration-email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Valid Name',
        email: 'test@example.com',
        mobile_number: '9876543210',
        year: 'First Year',
        department: 'Alchemy Department', // Invalid
        college_name: 'WCE Sangli',
      }),
    });
    const data = await res.json();
    assert(res.status === 400, 'Invalid department rejected with 400');
    assert(data.message.includes('department'), 'Error message mentions "department"');
  } catch (err) {
    assert(false, `Invalid department test error: ${err.message}`);
  }

  // Test 3: CORS Enforcement
  console.log('\n3. CORS and Origin Validation:');
  try {
    // 3a. Disallowed external origin
    const corsRes = await fetch(`${baseUrl}/api/health`, {
      headers: { Origin: 'https://evil-unauthorized-site.xyz' },
    });
    assert(
      corsRes.status === 403,
      'Unauthorized origin rejected with 403 Forbidden',
    );

    // 3b. Allowed origin
    const allowedRes = await fetch(`${baseUrl}/api/health`, {
      headers: { Origin: 'http://localhost:5173' },
    });
    assert(allowedRes.status === 200, 'Allowed origin http://localhost:5173 returns 200');
    assert(
      allowedRes.headers.get('access-control-allow-origin') === 'http://localhost:5173',
      'CORS header Access-Control-Allow-Origin present',
    );
  } catch (err) {
    assert(false, `CORS test error: ${err.message}`);
  }

  // Test 4: Rate Limiting Headers
  console.log('\n4. Rate Limiting Protection:');
  try {
    const rateRes = await fetch(`${baseUrl}/api/send-registration-email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
    });
    assert(
      rateRes.headers.has('ratelimit-limit') || rateRes.headers.has('ratelimit-remaining'),
      'Rate limit standard headers are enforced',
    );
  } catch (err) {
    assert(false, `Rate limiting test error: ${err.message}`);
  }

  // Test 5: End-to-End Email Dispatch
  console.log('\n5. End-to-End Email API Dispatch:');
  try {
    const validPayload = {
      name: 'Varad Jagtap',
      email: env.EMAIL_USER,
      mobile_number: '+919876543210',
      year: 'Third Year',
      department: 'Computer Science and Engineering',
      college_name: 'Walchand College of Engineering, Sangli',
      pass_id: 'OSD26-AUTOTEST',
    };

    const sendRes = await fetch(`${baseUrl}/api/send-registration-email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Origin: 'http://localhost:5173',
      },
      body: JSON.stringify(validPayload),
    });

    const sendData = await sendRes.json();
    assert(sendRes.status === 200, 'POST /api/send-registration-email returns 200');
    assert(sendData.success === true, 'Response indicates success = true');
    assert(sendData.passId === 'OSD26-AUTOTEST', 'Pass ID preserved in response');
  } catch (err) {
    assert(false, `Email dispatch error: ${err.message}`);
  }

  console.log(`\n========================================`);
  console.log(`TEST RESULTS: ${passedTests} passed, ${failedTests} failed`);
  console.log(`========================================\n`);

  server.close(() => {
    process.exit(failedTests > 0 ? 1 : 0);
  });
}

runTests();
