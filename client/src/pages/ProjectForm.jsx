import React, {
  useEffect,
  useState,
} from "react";

import "./ProjectForm.css";

// =========================================================
// COMPONENTS
// =========================================================

import ProjectIdentity from "../components/project-form/ProjectIdentity";
import PreSanction from "../components/project-form/PreSanction";
import SanctionFinance from "../components/project-form/SanctionFinance";
import Deliverables from "../components/project-form/Deliverables";
import BudgetDetails from "../components/project-form/BudgetDetails";
import PostSanction from "../components/project-form/PostSanction";
import Manpower from "../components/project-form/Manpower";
import Extensions from "../components/project-form/Extensions";
import Outcomes from "../components/project-form/Outcomes";
import Closure from "../components/project-form/Closure";
import NextMilestone from "../components/project-form/NextMilestone";
import GeneralRemarks from "../components/project-form/GeneralRemarks";

// =========================================================
// INITIAL FORM DATA
// =========================================================

const initialFormData = {
  // =======================================================
  // 1. PROJECT IDENTITY
  // =======================================================

  code: "",
  title: "",
  verticalId: "",
  projectDuration: "",
  piName: "",
  piInstituteName: "",
  coPiName: "",
  coPiInstitute: "",
  stakeholdingDrdoLabs: "",
  stakeholdingScientist: "",
  projectStatus: "",

  // =======================================================
  // 2. PRE-SANCTION
  // =======================================================

  initialTrlLevel: "",

  preSanctionMeetings: [
    {
      type: "Pre-TEC",
      date: "",
      minutes: "",
      remarks: "",
    },
  ],

  // =======================================================
  // 3. SANCTION & FINANCE
  // =======================================================

  sanctionDate: "",
  sanctionedAmount: "",
  sanctionLetter: "",
  projectStartDate: "",
  equipmentList: "",

  // =======================================================
  // 4. DELIVERABLES
  // =======================================================

  deliverables: [
    {
      description: "",
      targetDate: "",
      status: "Pending",
      remarks: "",
    },
  ],

  pertGanttLink: "",

  // =======================================================
  // 5. BUDGET
  // =======================================================

  budgetYears: 1,

  budgetRows: [
    {
      head: "Manpower",
      institute: "",
      options: [
        "Manpower",
        "Equipment",
        "Consumables",
        "Travel",
        "Contingency",
        "Other",
      ],
      years: [0],
      total: 0,
    },
  ],

  // =======================================================
  // 6. POST-SANCTION
  // =======================================================

  postSanctionMeetings: [
    {
      type: "TEC",
      date: "",
      minutes: "",
      remarks: "",
    },
  ],

  // =======================================================
  // 7. MANPOWER
  // =======================================================

  numResearchers: 0,

  manpower: [
    {
      category: "",
      name: "",
      designation: "",
      specialisation: "",
    },
  ],

  // =======================================================
  // 8. EXTENSIONS
  // =======================================================

  pdcExtensions: [
    {
      date: "",
      period: "",
      revisedPDC: "",
      remarks: "",
    },
  ],

  revisedSanctions: [
    {
      date: "",
      amount: "",
      letter: "",
    },
  ],

  // =======================================================
  // 9. OUTCOMES
  // =======================================================

  technologiesDeveloped: "",
  patentsGiven: "",
  patentsSubmitted: "",

  numPublications: 0,

  listPublications: "",

  breakthroughTech: "",

  eoiDate: "",
  eoiDetails: "",

  industriesInvolved: "",

  disseminationDate: "",
  disseminationParticipants: "",

  workshopConducted: undefined,
  workshopDetails: "",

  // =======================================================
  // 10. CLOSURE
  // =======================================================

  closureMeetings: [
    {
      type: "Closure TEC",
      date: "",
      minutes: "",
      remarks: "",
    },
  ],

  techCloseDate: "",
  techCloseRemarks: "",

  finCloseDate: "",
  finCloseRemarks: "",

  admCloseDate: "",
  admCloseRemarks: "",

  labRecReceived: undefined,
  labRecComments: "",
  labRecReason: "",

  finalTRL: "",

  // =======================================================
  // 11. NEXT MILESTONE
  // =======================================================

  nextMilestoneType: "",
  nextMilestoneDate: "",
  nextMilestoneDescription: "",

  // =======================================================
  // 12. GENERAL REMARKS
  // =======================================================

  remarks: "",
};

// =========================================================
// PROJECT FORM
// =========================================================

const ProjectForm = () => {
  // =======================================================
  // CURRENT STEP
  // =======================================================

  const [currentStep, setCurrentStep] =
    useState(0);

  // =======================================================
  // FORM DATA
  // =======================================================

  const [formData, setFormData] =
    useState(initialFormData);

  // =======================================================
  // VERTICALS
  // =======================================================

  const [verticals, setVerticals] =
    useState([]);

  // =======================================================
  // FETCH VERTICALS
  // =======================================================

  const fetchVerticals = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/verticals"
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to fetch verticals"
        );
      }

     

      setVerticals(
        Array.isArray(data) ? data : []
      );
    } catch (error) {
      console.error(
        "FETCH VERTICALS ERROR:",
        error
      );
    }
  };

  // =======================================================
  // LOAD VERTICALS WHEN FORM LOADS
  // =======================================================

  useEffect(() => {
    fetchVerticals();
  }, []);

  // =======================================================
  // COMMON INPUT CHANGE
  // =======================================================

  const handleChange = (e) => {
    const {
      name,
      value,
    } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =======================================================
  // PRE-SANCTION MEETINGS
  // =======================================================

  const handleMeetingChange = (
    index,
    field,
    value
  ) => {
    setFormData((prev) => {
      const updatedMeetings = [
        ...prev.preSanctionMeetings,
      ];

      updatedMeetings[index] = {
        ...updatedMeetings[index],
        [field]: value,
      };

      return {
        ...prev,
        preSanctionMeetings:
          updatedMeetings,
      };
    });
  };

  const addPreSanctionMeetingRow = () => {
    setFormData((prev) => ({
      ...prev,

      preSanctionMeetings: [
        ...prev.preSanctionMeetings,
        {
          type: "Pre-TEC",
          date: "",
          minutes: "",
          remarks: "",
        },
      ],
    }));
  };

  const removeMeeting = (index) => {
    setFormData((prev) => ({
      ...prev,

      preSanctionMeetings:
        prev.preSanctionMeetings.filter(
          (_, meetingIndex) =>
            meetingIndex !== index
        ),
    }));
  };

  // =======================================================
  // DELIVERABLES
  // =======================================================

  const handleDeliverableChange = (
    index,
    field,
    value
  ) => {
    setFormData((prev) => {
      const updatedDeliverables = [
        ...prev.deliverables,
      ];

      updatedDeliverables[index] = {
        ...updatedDeliverables[index],
        [field]: value,
      };

      return {
        ...prev,
        deliverables:
          updatedDeliverables,
      };
    });
  };

  const addDeliverableRow = () => {
    setFormData((prev) => ({
      ...prev,

      deliverables: [
        ...prev.deliverables,
        {
          description: "",
          targetDate: "",
          status: "Pending",
          remarks: "",
        },
      ],
    }));
  };

  const removeDeliverableRow = (
    index
  ) => {
    setFormData((prev) => ({
      ...prev,

      deliverables:
        prev.deliverables.filter(
          (_, deliverableIndex) =>
            deliverableIndex !== index
        ),
    }));
  };

  // =======================================================
  // BUDGET
  // =======================================================

  const changeBudgetYears = (
    change
  ) => {
    setFormData((prev) => {
      const newYears = Math.max(
        1,
        prev.budgetYears + change
      );

      const updatedRows =
        prev.budgetRows.map((row) => {
          const updatedYears = [
            ...row.years,
          ];

          if (
            newYears >
            updatedYears.length
          ) {
            while (
              updatedYears.length <
              newYears
            ) {
              updatedYears.push(0);
            }
          } else {
            updatedYears.length =
              newYears;
          }

          return {
            ...row,

            years: updatedYears,

            total:
              updatedYears.reduce(
                (sum, value) =>
                  sum +
                  Number(
                    value || 0
                  ),
                0
              ),
          };
        });

      return {
        ...prev,

        budgetYears: newYears,

        budgetRows: updatedRows,
      };
    });
  };

  const addBudgetRow = () => {
    setFormData((prev) => ({
      ...prev,

      budgetRows: [
        ...prev.budgetRows,

        {
          head: "Manpower",
          institute: "",

          options: [
            "Manpower",
            "Equipment",
            "Consumables",
            "Travel",
            "Contingency",
            "Other",
          ],

          years: Array(
            prev.budgetYears
          ).fill(0),

          total: 0,
        },
      ],
    }));
  };

  const removeBudgetRow = (
    rowIndex
  ) => {
    setFormData((prev) => ({
      ...prev,

      budgetRows:
        prev.budgetRows.filter(
          (_, index) =>
            index !== rowIndex
        ),
    }));
  };

  const handleBudgetHeadChange = (
    rowIndex,
    value
  ) => {
    setFormData((prev) => {
      const updatedRows = [
        ...prev.budgetRows,
      ];

      updatedRows[rowIndex] = {
        ...updatedRows[rowIndex],
        head: value,
      };

      return {
        ...prev,
        budgetRows: updatedRows,
      };
    });
  };

  const handleBudgetInstituteChange = (
    rowIndex,
    value
  ) => {
    setFormData((prev) => {
      const updatedRows = [
        ...prev.budgetRows,
      ];

      updatedRows[rowIndex] = {
        ...updatedRows[rowIndex],
        institute: value,
      };

      return {
        ...prev,
        budgetRows: updatedRows,
      };
    });
  };

  const handleBudgetValueChange = (
    rowIndex,
    yearIndex,
    value
  ) => {
    setFormData((prev) => {
      const updatedRows = [
        ...prev.budgetRows,
      ];

      const updatedYears = [
        ...updatedRows[rowIndex].years,
      ];

      updatedYears[yearIndex] =
        value === ""
          ? ""
          : Number(value);

      const total =
        updatedYears.reduce(
          (sum, amount) =>
            sum +
            Number(amount || 0),
          0
        );

      updatedRows[rowIndex] = {
        ...updatedRows[rowIndex],

        years: updatedYears,

        total,
      };

      return {
        ...prev,
        budgetRows: updatedRows,
      };
    });
  };

  const getYearTotal = (
    yearIndex
  ) => {
    return formData.budgetRows.reduce(
      (total, row) =>
        total +
        Number(
          row.years[yearIndex] || 0
        ),
      0
    );
  };

  const getGrandTotal = () => {
    return formData.budgetRows.reduce(
      (grandTotal, row) =>
        grandTotal +
        Number(row.total || 0),
      0
    );
  };

  // =======================================================
  // POST-SANCTION
  // =======================================================

  const handlePostMeetingChange = (
    index,
    field,
    value
  ) => {
    setFormData((prev) => {
      const updatedMeetings = [
        ...prev.postSanctionMeetings,
      ];

      updatedMeetings[index] = {
        ...updatedMeetings[index],
        [field]: value,
      };

      return {
        ...prev,
        postSanctionMeetings:
          updatedMeetings,
      };
    });
  };

  const addPostSanctionMeetingRow =
    () => {
      setFormData((prev) => ({
        ...prev,

        postSanctionMeetings: [
          ...prev.postSanctionMeetings,

          {
            type: "TEC",
            date: "",
            minutes: "",
            remarks: "",
          },
        ],
      }));
    };

  const removePostMeeting = (
    index
  ) => {
    setFormData((prev) => ({
      ...prev,

      postSanctionMeetings:
        prev.postSanctionMeetings.filter(
          (_, meetingIndex) =>
            meetingIndex !== index
        ),
    }));
  };

  // =======================================================
  // MANPOWER
  // =======================================================

  const handleManpowerChange = (
    index,
    field,
    value
  ) => {
    setFormData((prev) => {
      const updatedManpower = [
        ...prev.manpower,
      ];

      updatedManpower[index] = {
        ...updatedManpower[index],
        [field]: value,
      };

      return {
        ...prev,
        manpower: updatedManpower,
      };
    });
  };

  const addManpowerRow = () => {
    setFormData((prev) => ({
      ...prev,

      manpower: [
        ...prev.manpower,

        {
          category: "Researcher",
          name: "",
          designation: "",
          specialisation: "",
        },
      ],
    }));
  };

  const removeManpowerRow = (
    index
  ) => {
    setFormData((prev) => ({
      ...prev,

      manpower:
        prev.manpower.filter(
          (_, manpowerIndex) =>
            manpowerIndex !== index
        ),
    }));
  };

  // =======================================================
  // EXTENSIONS - PDC
  // =======================================================

  const handlePdcExtensionChange = (
    index,
    field,
    value
  ) => {
    setFormData((prev) => {
      const updated = [
        ...prev.pdcExtensions,
      ];

      updated[index] = {
        ...updated[index],
        [field]: value,
      };

      return {
        ...prev,
        pdcExtensions: updated,
      };
    });
  };

  const addPdcExtensionRow = () => {
    setFormData((prev) => ({
      ...prev,

      pdcExtensions: [
        ...prev.pdcExtensions,

        {
          date: "",
          period: "",
          revisedPDC: "",
          remarks: "",
        },
      ],
    }));
  };

  const removePdcExtension = (
    index
  ) => {
    setFormData((prev) => ({
      ...prev,

      pdcExtensions:
        prev.pdcExtensions.filter(
          (_, i) => i !== index
        ),
    }));
  };

  // =======================================================
  // EXTENSIONS - REVISED SANCTION
  // =======================================================

  const handleRevisedSanctionChange =
    (index, field, value) => {
      setFormData((prev) => {
        const updated = [
          ...prev.revisedSanctions,
        ];

        updated[index] = {
          ...updated[index],
          [field]: value,
        };

        return {
          ...prev,
          revisedSanctions: updated,
        };
      });
    };

  const addRevisedSanctionRow =
    () => {
      setFormData((prev) => ({
        ...prev,

        revisedSanctions: [
          ...prev.revisedSanctions,

          {
            date: "",
            amount: "",
            letter: "",
          },
        ],
      }));
    };

  const removeRevisedSanction = (
    index
  ) => {
    setFormData((prev) => ({
      ...prev,

      revisedSanctions:
        prev.revisedSanctions.filter(
          (_, i) => i !== index
        ),
    }));
  };

  // =======================================================
  // CLOSURE MEETINGS
  // =======================================================

  const handleClosureMeetingChange =
    (index, field, value) => {
      setFormData((prev) => {
        const updatedMeetings = [
          ...prev.closureMeetings,
        ];

        updatedMeetings[index] = {
          ...updatedMeetings[index],
          [field]: value,
        };

        return {
          ...prev,
          closureMeetings:
            updatedMeetings,
        };
      });
    };

  const addClosureMeetingRow =
    () => {
      setFormData((prev) => ({
        ...prev,

        closureMeetings: [
          ...prev.closureMeetings,

          {
            type: "Closure TEC",
            date: "",
            minutes: "",
            remarks: "",
          },
        ],
      }));
    };

  const removeClosureMeeting = (
    index
  ) => {
    setFormData((prev) => ({
      ...prev,

      closureMeetings:
        prev.closureMeetings.filter(
          (_, i) => i !== index
        ),
    }));
  };

  // =======================================================
  // FORM SECTIONS
  // =======================================================

  const steps = [
    {
      title: "Project Identity",
      component: ProjectIdentity,
    },

    {
      title: "Pre-Sanction",
      component: PreSanction,
    },

    {
      title: "Sanction Finance",
      component: SanctionFinance,
    },

    {
      title: "Deliverables",
      component: Deliverables,
    },

    {
      title: "Budget Details",
      component: BudgetDetails,
    },

    {
      title: "Post-Sanction",
      component: PostSanction,
    },

    {
      title: "Manpower",
      component: Manpower,
    },

    {
      title: "Extensions",
      component: Extensions,
    },

    {
      title: "Outcomes",
      component: Outcomes,
    },

    {
      title: "Closure",
      component: Closure,
    },

    {
      title: "Next Milestone",
      component: NextMilestone,
    },

    {
      title: "General Remarks",
      component: GeneralRemarks,
    },
  ];

  // =======================================================
  // CURRENT SECTION
  // =======================================================

  const CurrentSection =
    steps[currentStep].component;

  // =======================================================
  // NEXT
  // =======================================================

  const handleNext = () => {
    if (
      currentStep <
      steps.length - 1
    ) {
      setCurrentStep(
        (prev) => prev + 1
      );
    }
  };

  // =======================================================
  // PREVIOUS
  // =======================================================

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(
        (prev) => prev - 1
      );
    }
  };

  // =======================================================
  // SUBMIT
  // =======================================================

  const handleSubmit = async () => {
   
    try {
      const response =
        await fetch(
          "http://localhost:5000/api/projects",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify(
              formData
            ),
          }
        );

     
      const result =
        await response.json();      

      if (!response.ok) {
        throw new Error(
          result.message ||
            "Failed to create project"
        );
      }

      // Clear project form
      setFormData(
        initialFormData
      );

      // Go to first step
      setCurrentStep(0);

      alert(
        "Project created successfully!"
      );
    } catch (error) {
      console.error(
        "SUBMIT ERROR:",
        error
      );

      alert(
        error.message
      );
    }
  };

  // =======================================================
  // JSX
  // =======================================================

  return (
    <div className="project-form-container">

      {/* ===================================================
          TITLE
      =================================================== */}

      <h1 className="project-form-title">
        Project Form
      </h1>

      {/* ===================================================
          STEPPER
      =================================================== */}

      <div className="project-stepper">

        {steps.map(
          (step, index) => (
            <div
              key={step.title}
              className="project-step"
              onClick={() =>
                setCurrentStep(index)
              }
            >

              <div
                className={`project-step-number ${
                  currentStep ===
                  index
                    ? "project-step-active"
                    : ""
                } ${
                  currentStep > index
                    ? "project-step-completed"
                    : ""
                }`}
              >
                {index + 1}
              </div>

              <div
                className={`project-step-title ${
                  currentStep ===
                  index
                    ? "project-step-title-active"
                    : ""
                }`}
              >
                {step.title}
              </div>

            </div>
          )
        )}

      </div>

      {/* ===================================================
          FORM
      =================================================== */}

      <form
        onSubmit={(e) =>
          e.preventDefault()
        }
      >

        {/* CURRENT SECTION */}

        <div className="project-form-content">

          <CurrentSection
            /* =============================================
               COMMON
            ============================================= */

            formData={
              formData
            }

            handleChange={
              handleChange
            }

            /* =============================================
               VERTICALS
            ============================================= */

            verticals={
              verticals
            }

            /* =============================================
               PRE-SANCTION
            ============================================= */

            handleMeetingChange={
              handleMeetingChange
            }

            addPreSanctionMeetingRow={
              addPreSanctionMeetingRow
            }

            removeMeeting={
              removeMeeting
            }

            /* =============================================
               DELIVERABLES
            ============================================= */

            handleDeliverableChange={
              handleDeliverableChange
            }

            addDeliverableRow={
              addDeliverableRow
            }

            removeDeliverableRow={
              removeDeliverableRow
            }

            /* =============================================
               BUDGET
            ============================================= */

            budgetYears={
              formData.budgetYears
            }

            budgetRows={
              formData.budgetRows
            }

            changeBudgetYears={
              changeBudgetYears
            }

            addBudgetRow={
              addBudgetRow
            }

            removeBudgetRow={
              removeBudgetRow
            }

            handleBudgetHeadChange={
              handleBudgetHeadChange
            }

            handleBudgetInstituteChange={
              handleBudgetInstituteChange
            }

            handleBudgetValueChange={
              handleBudgetValueChange
            }

            getYearTotal={
              getYearTotal
            }

            getGrandTotal={
              getGrandTotal
            }

            /* =============================================
               POST-SANCTION
            ============================================= */

            handlePostMeetingChange={
              handlePostMeetingChange
            }

            addPostSanctionMeetingRow={
              addPostSanctionMeetingRow
            }

            removePostMeeting={
              removePostMeeting
            }

            /* =============================================
               MANPOWER
            ============================================= */

            handleManpowerChange={
              handleManpowerChange
            }

            addManpowerRow={
              addManpowerRow
            }

            removeManpowerRow={
              removeManpowerRow
            }

            /* =============================================
               EXTENSIONS
            ============================================= */

            handlePdcExtensionChange={
              handlePdcExtensionChange
            }

            addPdcExtensionRow={
              addPdcExtensionRow
            }

            removePdcExtension={
              removePdcExtension
            }

            handleRevisedSanctionChange={
              handleRevisedSanctionChange
            }

            addRevisedSanctionRow={
              addRevisedSanctionRow
            }

            removeRevisedSanction={
              removeRevisedSanction
            }

            /* =============================================
               CLOSURE
            ============================================= */

            handleClosureMeetingChange={
              handleClosureMeetingChange
            }

            addClosureMeetingRow={
              addClosureMeetingRow
            }

            removeClosureMeeting={
              removeClosureMeeting
            }
          />

        </div>

        {/* =================================================
            FORM ACTIONS
        ================================================= */}

        <div className="project-form-actions">

          {/* PREVIOUS */}

          <button
            type="button"
            onClick={
              handlePrevious
            }
            disabled={
              currentStep === 0
            }
          >
            Previous
          </button>

          {/* NEXT / SUBMIT */}

          {currentStep <
          steps.length - 1 ? (
            <button
              type="button"
              onClick={
                handleNext
              }
            >
              Next
            </button>
          ) : (
            <button
              type="button"
              onClick={
                handleSubmit
              }
            >
              Submit
            </button>
          )}

        </div>
      </form>
    </div>
  );
};

export default ProjectForm;