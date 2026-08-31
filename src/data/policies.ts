import { PolicyDocument, RoleType, RetrievedChunk } from "../types";

export const ROLES: RoleType[] = [
  "Employee (General Access)",
  "Compliance Officer",
  "Engineering",
  "People & HR",
];

export const DOCUMENTS: PolicyDocument[] = [
  {
    id: "expense",
    name: "Expense & Reimbursement Policy",
    category: "Finance & Operations",
    roles: [
      "Employee (General Access)",
      "Compliance Officer",
      "Engineering",
      "People & HR",
    ],
    paragraphs: [
      "All business expenses must be submitted within 30 days of the transaction date. Expenses submitted after this window require written approval from a director-level manager and Finance.",
      "Meals during business travel are reimbursed up to $75 per day. Alcohol is not reimbursable except at client-facing events pre-approved by a manager.",
      "Airfare must be booked in economy class for flights under 6 hours. Business class requires VP approval and applies only to flights over 6 hours.",
      "Reimbursement requests missing an itemized receipt will be capped at $25 regardless of the actual amount spent, per finance audit requirements.",
    ],
  },
  {
    id: "privacy",
    name: "Data Privacy & Security Policy",
    category: "Security & Legal",
    roles: [
      "Employee (General Access)",
      "Compliance Officer",
      "Engineering",
      "People & HR",
    ],
    paragraphs: [
      "Customer financial data must never be stored on local devices, personal cloud drives, or unencrypted USB media. All customer data resides only in approved company systems.",
      "Any suspected data exposure, including a lost device containing customer records, must be reported to the Security team within 1 hour of discovery, not end of day.",
      "Access to production customer data requires a documented business justification and expires automatically after 90 days unless renewed by a manager.",
      "Employees may not use personal email or messaging apps to transmit any document containing customer account numbers, balances, or transaction history.",
    ],
  },
  {
    id: "remote",
    name: "Remote Work Policy",
    category: "Human Resources",
    roles: [
      "Employee (General Access)",
      "Compliance Officer",
      "Engineering",
      "People & HR",
    ],
    paragraphs: [
      "Employees may work remotely up to 3 days per week. Fully remote arrangements require director approval and are reviewed quarterly.",
      "All remote work must be performed on company-issued or company-managed devices. Personal devices may not access internal systems under any circumstance.",
      "Employees working remotely from outside their home country for more than 10 consecutive business days must notify People & HR in advance for tax and legal compliance reasons.",
      "Video presence is required for all client-facing meetings regardless of work location, unless the client has explicitly agreed otherwise.",
    ],
  },
  {
    id: "incident",
    name: "Incident Response Plan",
    category: "Engineering & Compliance",
    roles: ["Compliance Officer", "Engineering"],
    paragraphs: [
      "A Severity 1 incident is defined as any event causing customer-facing system downtime, unauthorized access to customer financial data, or regulatory reporting failure.",
      "Upon declaring a Severity 1 incident, the on-call engineer must page the Incident Commander and notify Compliance within 15 minutes, before root cause is known.",
      "Compliance is responsible for determining whether an incident triggers a regulatory disclosure obligation, which must happen independently of the technical remediation timeline.",
      "A written post-incident review is required within 5 business days of resolution for any Severity 1 or Severity 2 incident, including a corrective action owner and due date.",
    ],
  },
];

const STOPWORDS = new Set([
  "the", "a", "an", "is", "are", "of", "to", "in", "on", "for", "and", "or",
  "what", "how", "do", "does", "i", "my", "can", "should", "when", "need",
  "this", "that", "it", "be", "at", "as", "with", "if", "not", "who",
  "which", "was", "were", "tell", "me", "about", "there", "any"
]);

export function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((t) => t.length > 2 && !STOPWORDS.has(t));
}

export function retrieveChunks(
  question: string,
  accessibleDocs: PolicyDocument[],
  topN = 3
): RetrievedChunk[] {
  const qTokens = tokenize(question);
  const scored: RetrievedChunk[] = [];

  accessibleDocs.forEach((doc) => {
    doc.paragraphs.forEach((para, idx) => {
      const pTokens = new Set(tokenize(para));
      let score = 0;
      qTokens.forEach((t) => {
        if (pTokens.has(t)) score += 1;
      });
      if (score > 0) {
        scored.push({
          docName: doc.name,
          paraIndex: idx + 1,
          text: para,
          score,
        });
      }
    });
  });

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, topN);
}

export const SAMPLE_QUESTIONS = [
  "How many days can I work remotely?",
  "What counts as a Severity 1 incident?",
  "What is the daily meal reimbursement limit?",
  "How fast must a data breach be reported?",
  "Can I fly business class on flights under 6 hours?",
  "Can I work from abroad without notifying HR?",
];
