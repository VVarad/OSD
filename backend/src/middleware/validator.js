const EMAIL_REGEX =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;

const VALID_YEARS = ['First Year', 'Second Year', 'Third Year', 'Fourth Year'];

const VALID_DEPARTMENTS = [
  'Computer Science and Engineering',
  'Information Technology',
  'Electronics Engineering',
  'Electrical Engineering',
  'Mechanical Engineering',
  'Civil Engineering',
  'Artificial Intelligence and Machine Learning',
  'Robotics and Automation',
];

/**
 * Normalizes Indian mobile number to 10 digits consistently.
 * Accepts 10-digit number with optional +91, 91, or 0 prefix.
 */
export function normalizeMobileNumber(value) {
  if (typeof value !== 'string') return '';
  const cleaned = value.trim().replace(/[\s\-()]/g, '');
  const match = cleaned.match(/^(?:\+91|91|0)?([6-9]\d{9})$/);
  return match ? match[1] : cleaned;
}

/**
 * Express middleware to validate incoming registration email payload.
 */
export function validateRegistrationPayload(req, res, next) {
  if (!req.body || typeof req.body !== 'object') {
    return res.status(400).json({
      success: false,
      message: 'Invalid request body. JSON object expected.',
    });
  }

  const { name, email, year, department } = req.body;
  const rawMobile = req.body.mobile_number ?? req.body.mobile;
  const rawCollege = req.body.college_name ?? req.body.college;
  const passId = req.body.pass_id ?? req.body.passId;

  // Validate Name
  if (typeof name !== 'string' || name.trim().length < 2 || name.trim().length > 100) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed: "name" must be between 2 and 100 characters.',
    });
  }

  // Validate Email
  if (
    typeof email !== 'string' ||
    email.trim().length === 0 ||
    email.trim().length > 254 ||
    !EMAIL_REGEX.test(email.trim())
  ) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed: A valid recipient email address is required.',
    });
  }

  // Validate Mobile Number
  const normalizedMobile = normalizeMobileNumber(typeof rawMobile === 'string' ? rawMobile : '');
  const mobileRegex = /^[6-9]\d{9}$/;
  if (!mobileRegex.test(normalizedMobile)) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed: A valid 10-digit Indian mobile number is required.',
    });
  }

  // Validate Year
  if (typeof year !== 'string' || !VALID_YEARS.includes(year.trim())) {
    return res.status(400).json({
      success: false,
      message: `Validation failed: "year" must be one of: ${VALID_YEARS.join(', ')}.`,
    });
  }

  // Validate Department
  if (typeof department !== 'string' || !VALID_DEPARTMENTS.includes(department.trim())) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed: Please select a valid department at WCE Sangli.',
    });
  }

  // Validate College Name
  if (
    typeof rawCollege !== 'string' ||
    rawCollege.trim().length < 2 ||
    rawCollege.trim().length > 150
  ) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed: "college_name" must be between 2 and 150 characters.',
    });
  }

  // Sanitize and attach validated data to req
  req.validatedData = {
    name: name.trim(),
    email: email.trim().toLowerCase(),
    mobile_number: normalizedMobile,
    year: year.trim(),
    department: department.trim(),
    college_name: rawCollege.trim(),
    pass_id:
      typeof passId === 'string' && passId.trim()
        ? passId.trim().slice(0, 50)
        : `OSD26-${Math.floor(1000 + Math.random() * 9000)}`,
  };

  next();
}
