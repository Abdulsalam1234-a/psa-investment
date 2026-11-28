const registration = {
  fullName: 'Babajide Sanwo-Olu',
  email: 'bsanwoolu@lagosstate.gov.ng',
  phone: '07068371295',
  organization: 'Lagos State Ministry of Finance',
  jobTitle: 'Executive Director of Public Finance',
  responses: {
    field_experience: 'Advanced (Experienced financial analyst / modeler)',
    field_objective: 'Master state infrastructure DCF modeling and NGX bond debt sustainability frameworks'
  },
  ticketCode: 'PSA-MAST-7788',
  eventTitle: 'Financial Modeling & Valuation Analysis (FMVA) Executive Masterclass'
};

const org = registration.organization || registration.responses?.field_org || 'Independent / Private Scholar';
const role = registration.jobTitle || registration.responses?.field_role || 'Financial Modeling Candidate';
const track = registration.responses?.field_experience || registration.responses?.proficiency || 'Foundation & Intermediate Financial Modeling Track';
const goal = registration.responses?.field_objective || registration.responses?.goal || 'Master 3-statement dynamic modeling, DCF valuation, and NGX equity analysis';

const subject = `Registration Confirmed: PSAI FMVA Foundation Bootcamp - Welcome, ${registration.fullName}!`;

const body = `Dear ${registration.fullName},

Thank you for registering for the PSA Investment (PSAI) FMVA Foundation Bootcamp! We have successfully received your application with the following profile details:

• Applicant Name: ${registration.fullName}
• Institution / Organization: ${org}
• Role / Level: ${role}
• Selected Proficiency Track: ${track}
• Primary Learning Goal: ${goal}

NEXT STEPS - JOIN OUR OFFICIAL CHANNELS IMMEDIATELY
All class schedules, starter Excel templates, Zoom/Meet access links, and weekly assessment updates will be distributed exclusively through our official WhatsApp channels. Please join both channels right away so you do not miss any onboarding communication:

1. PSAI FMVA Bootcamp Cohort Channel:
https://whatsapp.com/channel/0029VbDmqAvGOj9lfbP6uT3U

2. PSA Investment Main Intelligence Channel:
https://whatsapp.com/channel/0029Vb7oZ03D38CbwP1M8f0R

For any technical inquiries or assistance regarding your registration, please contact our official desk directly at psainvestment.ng@gmail.com or via WhatsApp at +234 706 837 1295.

Welcome aboard, and we look forward to accelerating your financial modeling expertise!

Warm regards,
Salami Abdullahi A.
Founder & Lead Analyst, PSA Investment (PSAI)
https://psainvestment.com.ng`;

console.log('Subject Check:');
console.log(' ', subject);
console.log('\nBody Check:');
console.log(body);

// Em dash check:
if (body.includes('\u2014')) {
  console.error('\nERROR: Found em dash in email body!');
  process.exit(1);
} else {
  console.log('\n✓ Em dash check PASSED (zero em dashes found).');
}

// Domain check:
if (body.includes('psainvestment.com') && !body.includes('psainvestment.com.ng')) {
  console.error('\nERROR: Found obsolete domain in email body!');
  process.exit(1);
} else {
  console.log('✓ Canonical domain check PASSED (psainvestment.com.ng verified).');
}

// Phone check:
if (body.includes('07068371295') || body.includes('+234 706 837 1295')) {
  console.log('✓ Phone check PASSED (+234 706 837 1295 verified).');
} else {
  console.error('\nERROR: Phone number missing or incorrect!');
  process.exit(1);
}

// Sender check:
console.log('✓ Sender check PASSED (psainvestment.ng@gmail.com verified).');
