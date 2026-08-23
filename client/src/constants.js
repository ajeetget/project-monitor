export const STAGE_DEFS = [
  { key: "new", label: "Not Started", color: "stage-new" },
  { key: "committee", label: "Committee Review", color: "stage-committee" },
  {
    key: "sanctioned",
    label: "Sanctioned (Fund Pending)",
    color: "stage-sanctioned",
  },
  { key: "active", label: "Active / Ongoing", color: "stage-active" },
  {
    key: "techclose",
    label: "Technical Closure Done",
    color: "stage-techclose",
  },
  { key: "finclose", label: "Financial Closure Done", color: "stage-finclose" },
  { key: "closed", label: "Fully Closed", color: "stage-closed" },
];

export function stageDef(key) {
  return STAGE_DEFS.find((s) => s.key === key) || STAGE_DEFS[0];
}

export const BUDGET_HEADS = [
  "Staff",
  "Equipment (including spares)",
  "Operation and Maintenance of Equipment",
  "Expendables",
  "Workshop",
  "Travel",
  "Contingencies",
  "Visiting Faculty / Research Consultant",
];

export const TRL_OPTIONS = [
  "TRL 1 — Basic principles observed",
  "TRL 2 — Technology concept formulated",
  "TRL 3 — Experimental proof of concept",
  "TRL 4 — Validated in lab",
  "TRL 5 — Validated in relevant environment",
  "TRL 6 — Demonstrated in relevant environment",
  "TRL 7 — Demonstrated in operational environment",
  "TRL 8 — System complete and qualified",
  "TRL 9 — Actual system proven in operation",
].map((label) => ({ value: label.split(" —")[0], label }));

export const DELIVERABLE_STATUSES = [
  "Pending",
  "In Progress",
  "Achieved",
  "Delayed",
];

export const MEETING_TYPES_PRE = [
  "Pre-TEC",
  "TEC",
  "RAB",
  "GC",
  "ADFA",
  "IFA",
  "Other",
];
export const MEETING_TYPES_POST = ["TEC", "RAB", "GC"];
export const MEETING_TYPES_CLOSURE = [
  "Closure TEC",
  "Closure RAB",
  "Closure GC",
];
export const MANPOWER_CATEGORIES = [
  "JRF",
  "SRF",
  "RA",
  "Project Assistant",
  "Project Associate",
  "Technician",
  "Other",
];

export const NEXT_MILESTONE_TYPES = [
  "",
  "Pre-TEC",
  "TEC",
  "RAB",
  "GC",
  "Fund Release",
  "Technical Closure",
  "Financial Closure",
  "Administrative Closure",
  "Other",
];

export const FIELD_DEFS = [
  // ================  // PROJECT IDENTITY  // ==============

  {
    key: "code",
    label: "Project ID",
    type: "text",
  },

  {
    key: "title",
    label: "Project Title",
    type: "text",
  },

  {
    key: "verticalId",
    label: "Vertical",
    type: "text",
  },

  {
    key: "projectDuration",
    label: "Project Duration",
    type: "text",
  },

  {
    key: "projectStatus",
    label: "Project Status",
    type: "text",
  },

  {
    key: "stakeholdingDrdoLabs",
    label: "Stakeholding DRDO Lab(s)",
    type: "text",
  },

  {
    key: "stakeholdingScientist",
    label: "Stakeholding Scientist",
    type: "text",
  },

  {
    key: "piName",
    label: "Principal Investigator (PI)",
    type: "text",
  },

  {
    key: "piInstituteName",
    label: "PI Institute Name",
    type: "text",
  },

  {
    key: "coPiName",
    label: "CO-PI(s)",
    type: "text",
  },

  {
    key: "coPiInstitute",
    label: "Co-PI Institute",
    type: "text",
  },

  // ==========================================
  // PRE-SANCTION
  // ==========================================

  {
    key: "initialTrlLevel",
    label: "Initial TRL Level",
    type: "text",
  },

  // ==========================================
  // SANCTION & FINANCE
  // ==========================================

  {
    key: "sanctionDate",
    label: "Date of Sanction",
    type: "date",
  },

  {
    key: "sanctionedAmount",
    label: "Sanctioned Amount",
    type: "number",
  },

  {
    key: "sanctionLetter",
    label: "Sanction Letter",
    type: "text",
  },

  {
    key: "projectStartDate",
    label: "Project Start Date",
    type: "date",
  },

  {
    key: "equipmentList",
    label: "Equipment List",
    type: "text",
  },

  // ==========================================
  // MANPOWER
  // ==========================================

  {
    key: "numResearchers",
    label: "Number of Researchers",
    type: "number",
  },

  // ==========================================
  // OUTCOMES
  // ==========================================

  {
    key: "technologiesDeveloped",
    label: "Technologies Developed",
    type: "text",
  },

  {
    key: "patentsGiven",
    label: "Patents Given",
    type: "text",
  },

  {
    key: "patentsSubmitted",
    label: "Patents Submitted",
    type: "text",
  },

  {
    key: "numPublications",
    label: "Number of Publications",
    type: "number",
  },

  {
    key: "listPublications",
    label: "List of Publications",
    type: "text",
  },

  {
    key: "breakthroughTech",
    label: "Breakthrough Technology Developed",
    type: "text",
  },

  {
    key: "eoiDate",
    label: "EOI Issued Date",
    type: "date",
  },

  {
    key: "eoiDetails",
    label: "EOI Issued Details",
    type: "text",
  },

  {
    key: "industriesInvolved",
    label: "Industries Involved",
    type: "text",
  },

  {
    key: "disseminationDate",
    label: "Date of Dissemination",
    type: "date",
  },

  {
    key: "disseminationParticipants",
    label: "Dissemination Participants",
    type: "text",
  },

  {
    key: "workshopConducted",
    label: "Workshop Conducted",
    type: "text",
  },

  {
    key: "workshopDetails",
    label: "Workshop Details",
    type: "text",
  },

  // =============  // CLOSURE ====================

  {
    key: "techCloseDate",
    label: "Technical Closure Date",
    type: "date",
  },

  {
    key: "techCloseRemarks",
    label: "Technical Closure Remarks",
    type: "text",
  },

  {
    key: "finCloseDate",
    label: "Financial Closure Date",
    type: "date",
  },

  {
    key: "finCloseRemarks",
    label: "Financial Closure Remarks",
    type: "text",
  },

  {
    key: "admCloseDate",
    label: "Administrative Closure Date",
    type: "date",
  },

  {
    key: "admCloseRemarks",
    label: "Administrative Closure Remarks",
    type: "text",
  },

  {
    key: "labRecReceived",
    label: "Lab Recommendation Received",
    type: "text",
  },

  {
    key: "labRecComments",
    label: "Lab Recommendation Comments",
    type: "text",
  },

  {
    key: "labRecReason",
    label: "Lab Recommendation Reason",
    type: "text",
  },

  {
    key: "finalTRL",
    label: "Final TRL Level",
    type: "text",
  },

  // ===============  // OTHER // =======

  {
    key: "pertGanttLink",
    label: "PERT/GANTT Chart",
    type: "text",
  },

  {
    key: "nextMilestoneType",
    label: "Next Milestone Type",
    type: "text",
  },

  {
    key: "nextMilestoneDate",
    label: "Next Milestone Date",
    type: "date",
  },

  {
    key: "nextMilestoneDescription",
    label: "Next Milestone Description",
    type: "text",
  },

  {
    key: "remarks",
    label: "General Remarks",
    type: "text",
  },
];

export const REPORT_COLUMNS = FIELD_DEFS.map((f) => ({
  key: f.key,
  label: f.label,
}));

// export const REPORT_COLUMNS = FIELD_DEFS.map((f) => ({
//   key: f.key,
//   label: f.label,
// }));
