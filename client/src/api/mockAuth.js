/**
 * mockAuth.js — Naami Demo Endpoints
 * Simulates API calls with realistic delays & dummy data.
 * Replace with real API calls once backend is ready.
 */

const MOCK_DELAY = (ms = 1200) => new Promise((r) => setTimeout(r, ms));

/* ─── Dummy registered users store ─── */
const MOCK_USERS = [
  {
    id: 'u1',
    username: 'ritesh_iitb',
    name: 'Ritesh Sharma',
    collegeEmail: 'ritesh@iitb.ac.in',
    gmail: 'ritesh.sharma@gmail.com',
    phone: '9876543210',
    college: 'IIT Bombay',
    course: 'B.Tech Computer Science',
    year: '3rd Year',
    avatar: null,
    verified: true,
    badges: ['College Verified 🎓'],
    eventsHosted: 4,
    eventsAttended: 12,
    rating: 4.8,
    joinedAt: '2025-08-01',
  },
];

/* ─── Inline session helpers ─── */
export const getSession = () => {
  try { return JSON.parse(localStorage.getItem('naami_session')); }
  catch { return null; }
};

export const setSession = (user) =>
  localStorage.setItem('naami_session', JSON.stringify(user));

export const clearSession = () =>
  localStorage.removeItem('naami_session');

/* ─────────────────────────────────────────────────────────
   1. SEND OTP  →  POST /auth/send-otp
   Validates the email looks like a college domain (.ac.in or .edu)
──────────────────────────────────────────────────────────── */
export const sendOtp = async (email) => {
  await MOCK_DELAY(1000);

  const collegePattern = /\.(ac\.in|edu\.in|edu)$/i;
  if (!collegePattern.test(email)) {
    throw new Error('Please use a valid college email (e.g. name@college.ac.in)');
  }

  // Simulate the OTP being "7429" for any valid college email in demo mode
  console.log(`[MOCK] OTP sent to ${email}: 7429`);
  return { success: true, message: `OTP sent to ${email}` };
};

/* ─────────────────────────────────────────────────────────
   2. VERIFY OTP  →  POST /auth/verify-otp
──────────────────────────────────────────────────────────── */
export const verifyOtp = async (email, otp) => {
  await MOCK_DELAY(900);

  if (otp !== '7429') {
    throw new Error('Invalid OTP. Hint: use 7429 for demo.');
  }
  return { success: true, verified: true };
};

/* ─────────────────────────────────────────────────────────
   3. SIGN UP  →  POST /auth/signup
──────────────────────────────────────────────────────────── */
export const signUp = async (formData) => {
  await MOCK_DELAY(1400);

  // Check username uniqueness
  const taken = MOCK_USERS.some(
    (u) => u.username.toLowerCase() === formData.username.toLowerCase()
  );
  if (taken) throw new Error('Username is already taken.');

  // Check email uniqueness
  const emailTaken = MOCK_USERS.some(
    (u) => u.collegeEmail.toLowerCase() === formData.collegeEmail.toLowerCase()
  );
  if (emailTaken) throw new Error('An account with this email already exists.');

  const newUser = {
    id: `u${Date.now()}`,
    username: formData.username,
    name: formData.name,
    collegeEmail: formData.collegeEmail,
    gmail: formData.gmail,
    phone: formData.phone,
    college: formData.college,
    course: formData.course,
    year: formData.year,
    avatar: formData.avatar || null,
    verified: true,
    badges: ['College Verified 🎓'],
    eventsHosted: 0,
    eventsAttended: 0,
    rating: null,
    joinedAt: new Date().toISOString().split('T')[0],
  };

  MOCK_USERS.push(newUser);
  setSession(newUser);

  return { success: true, user: newUser };
};

/* ─────────────────────────────────────────────────────────
   4. LOGIN  →  POST /auth/login
──────────────────────────────────────────────────────────── */
export const login = async (collegeEmail, password) => {
  await MOCK_DELAY(1100);

  const collegePattern = /\.(ac\.in|edu\.in|edu)$/i;
  if (!collegePattern.test(collegeEmail)) {
    throw new Error('Sign in with your college email (e.g. name@college.ac.in)');
  }

  // Demo: any registered college email with password "demo123" works
  const user = MOCK_USERS.find(
    (u) => u.collegeEmail.toLowerCase() === collegeEmail.toLowerCase()
  );

  if (!user || password !== 'demo123') {
    throw new Error('Invalid credentials. Demo password: demo123');
  }

  setSession(user);
  return { success: true, user };
};

/* ─────────────────────────────────────────────────────────
   5. CHECK USERNAME AVAILABILITY  →  GET /auth/check-username
──────────────────────────────────────────────────────────── */
export const checkUsername = async (username) => {
  await MOCK_DELAY(500);
  const taken = MOCK_USERS.some(
    (u) => u.username.toLowerCase() === username.toLowerCase()
  );
  return { available: !taken };
};

/* ─── Static college list for autocomplete ─── */
export const COLLEGE_LIST = [
  'IIT Bombay', 'IIT Delhi', 'IIT Madras', 'IIT Kanpur', 'IIT Kharagpur',
  'IIT Roorkee', 'IIT Guwahati', 'BITS Pilani', 'BITS Goa', 'BITS Hyderabad',
  'NIT Trichy', 'NIT Warangal', 'NIT Surathkal', 'NIT Calicut',
  'VIT Vellore', 'Manipal Institute of Technology', 'SRM University',
  'Delhi University', 'Jadavpur University', 'Anna University',
  'Pune University', 'IIIT Hyderabad', 'IIIT Delhi', 'Amity University',
  'Thapar University', 'Symbiosis Institute of Technology',
];

export const COURSE_LIST = [
  'B.Tech Computer Science', 'B.Tech Electronics', 'B.Tech Mechanical',
  'B.Tech Civil', 'B.Tech Electrical', 'B.Tech Chemical',
  'B.E. Computer Engineering', 'BCA', 'B.Sc Computer Science',
  'B.Sc Electronics', 'MBA', 'M.Tech Computer Science',
  'M.Tech Data Science', 'MCA', 'B.Des', 'B.Arch',
  'BBA', 'B.Com', 'B.A.', 'M.Sc',
];

export const YEAR_LIST = ['1st Year', '2nd Year', '3rd Year', '4th Year', '5th Year', 'Alumni'];
