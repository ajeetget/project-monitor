import mongoose from "mongoose";

/* =============  1. PRE-SANCTION MEETING ================= */

const preSanctionMeetingSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: [
        "Pre-TEC",
        "TEC",
        "RAB",
        "GC",
        "ADFA/IFA/Others",
      ],
      default: "Pre-TEC",
    },

    date: {
      type: Date,
    },

    minutes: {
      type: String,
      trim: true,
    },

    remarks: {
      type: String,
      trim: true,
    },
  },
  { _id: false }
);


/* ============ 2. DELIVERABLE / MILESTONE ================ */

const deliverableSchema = new mongoose.Schema(
  {
    description: {
      type: String,
      trim: true,
    },

    targetDate: {
      type: Date,
    },

    status: {
      type: String,
      enum: [
        "Pending",
        "In Progress",
        "Achieved",
        "Delayed",
      ],
      default: "Pending",
    },

    remarks: {
      type: String,
      trim: true,
    },
  },
  { _id: false }
);


/* ============ 3. POST-SANCTION MEETING ================= */

const postSanctionMeetingSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["TEC", "RAB", "GC"],
      default: "TEC",
    },

    date: {
      type: Date,
    },

    minutes: {
      type: String,
      trim: true,
    },

    remarks: {
      type: String,
      trim: true,
    },
  },
  { _id: false }
);


/* ==============  4. MANPOWER  ================== */

const manpowerSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      trim: true,
    },

    name: {
      type: String,
      trim: true,
    },

    designation: {
      type: String,
      trim: true,
    },

    specialisation: {
      type: String,
      trim: true,
    },
  },
  { _id: false }
);


/* =========================================================
   5. PDC EXTENSION
========================================================= */

const pdcExtensionSchema = new mongoose.Schema(
  {
    date: {
      type: Date,
    },

    period: {
      type: String,
      trim: true,
    },

    revisedPDC: {
      type: Date,
    },

    remarks: {
      type: String,
      trim: true,
    },
  },
  { _id: false }
);


/* =========================================================
   6. REVISED SANCTION
========================================================= */

const revisedSanctionSchema = new mongoose.Schema(
  {
    date: {
      type: Date,
    },

    amount: {
      type: Number,
    },

    letter: {
      type: String,
      trim: true,
    },
  },
  { _id: false }
);


/* =========================================================
   7. CLOSURE MEETING
========================================================= */

const closureMeetingSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: [
        "Closure TEC",
        "Closure RAB",
        "Closure GC",
      ],
      default: "Closure TEC",
    },

    date: {
      type: Date,
    },

    minutes: {
      type: String,
      trim: true,
    },

    remarks: {
      type: String,
      trim: true,
    },
  },
  { _id: false }
);


/* =========================================================
   8. BUDGET ROW
========================================================= */

const budgetRowSchema = new mongoose.Schema(
  {
    head: {
      type: String,
      trim: true,
    },

    institute: {
      type: String,
      trim: true,
    },

    years: {
      type: [Number],
      default: [],
    },

    total: {
      type: Number,
      default: 0,
    },
  },
  { _id: false }
);


/* =========================================================
   MAIN PROJECT SCHEMA
========================================================= */

const projectSchema = new mongoose.Schema(
  {
    /* =====================================================
       1. PROJECT IDENTITY
    ===================================================== */

    code: {
      type: String,
      trim: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    verticalId: {
      type: String,
      trim: true,
    },

    projectDuration: {
      type: String,
      trim: true,
    },

    piName: {
      type: String,
      trim: true,
    },

    piInstituteName: {
      type: String,
      trim: true,
    },

    coPiName: {
      type: String,
      trim: true,
    },

    coPiInstitute: {
      type: String,
      trim: true,
    },

    stakeholdingDrdoLabs: {
      type: String,
      trim: true,
    },

    stakeholdingScientist: {
      type: String,
      trim: true,
    },

    projectStatus: {
      type: String,
      trim: true,
    },


    /* =====================================================
       2. PRE-SANCTION
    ===================================================== */

    initialTrlLevel: {
      type: String,
      trim: true,
    },

    preSanctionMeetings: {
      type: [preSanctionMeetingSchema],
      default: [],
    },


    /* =====================================================
       3. SANCTION & FINANCE
    ===================================================== */

    sanctionDate: {
      type: Date,
    },

    sanctionedAmount: {
      type: Number,
    },

    sanctionLetter: {
      type: String,
      trim: true,
    },

    projectStartDate: {
      type: Date,
    },

    equipmentList: {
      type: String,
      trim: true,
    },


    /* =====================================================
       4. DELIVERABLES & MILESTONES
    ===================================================== */

    deliverables: {
      type: [deliverableSchema],
      default: [],
    },

    pertGanttLink: {
      type: String,
      trim: true,
    },


    /* =====================================================
       5. BUDGET DETAILS
    ===================================================== */

    budgetYears: {
      type: Number,
      default: 1,
    },

    budgetRows: {
      type: [budgetRowSchema],
      default: [],
    },


/* ==================== 6. POST SANCTI =================== */

    postSanctionMeetings: {
      type: [postSanctionMeetingSchema],
      default: [],
    },


/* =============  7. MANPOWER  ================== */
    numResearchers: {
      type: Number,
      default: 0,
    },

    manpower: {
      type: [manpowerSchema],
      default: [],
    },

/* =========== 8. EXTENSIONS & REVISIONS =============== */
    pdcExtensions: {
      type: [pdcExtensionSchema],
      default: [],
    },

    revisedSanctions: {
      type: [revisedSanctionSchema],
      default: [],
    },

/* ========== 9. OUTCOMES & DISSEMINATION  ============== */
    technologiesDeveloped: {
      type: String,
      trim: true,
    }, 
    patentsGiven: {
      type: String,
      trim: true,
    },
    patentsSubmitted: {
      type: String,
      trim: true,
    },
    numPublications: {
      type: Number,
      default: 0,
    },
    listPublications: {
      type: String,
      trim: true,
    },
    breakthroughTech: {
      type: String,
      trim: true,
    },
    eoiDate: {
      type: Date,
    },
    eoiDetails: {
      type: String,
      trim: true,
    },
    industriesInvolved: {
      type: String,
      trim: true,
    },
    disseminationDate: {
      type: Date,
    },
    disseminationParticipants: {
      type: String,
      trim: true,
    },
    workshopConducted: {
        type: String,
        enum: ["Yes", "No"],
        default: undefined,
    },
    workshopDetails: {
      type: String,
      trim: true,
    },


/* ============= 10. PROJECT CLOSURE =============== */

    closureMeetings: {
      type: [closureMeetingSchema],
      default: [],
    },

    techCloseDate: {
      type: Date,
    },

    techCloseRemarks: {
      type: String,
      trim: true,
    },

    finCloseDate: {
      type: Date,
    },

    finCloseRemarks: {
      type: String,
      trim: true,
    },

    admCloseDate: {
      type: Date,
    },

    admCloseRemarks: {
      type: String,
      trim: true,
    },

    labRecReceived: {
        type: String,
        enum: ["Yes", "No"],
        default: undefined,
    },

    labRecComments: {
      type: String,
      trim: true,
    },

    labRecReason: {
      type: String,
      trim: true,
    },

    finalTRL: {
      type: String,
      trim: true,
    },


    /* ============= 11. NEXT MILESTONE ============== */

    nextMilestoneType: {
      type: String,
      trim: true,
    },

    nextMilestoneDate: {
      type: Date,
    },

    nextMilestoneDescription: {
      type: String,
      trim: true,
    },


/* ============ 12. GENERAL REMARKS =============== */

    remarks: {
      type: String,
      trim: true,
    },
  },

  {
    timestamps: true,
  }
);


/* =================  MODEL ================== */

const Project = mongoose.model("Project", projectSchema);

export default Project;