import React, {
  useEffect,
  useState,
} from "react";

import {
  useParams,
  useNavigate,
} from "react-router-dom";

import "./ProjectForm.css";

// ====================== nCOMPONENTS ======================================

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
// DEFAULT BUDGET OPTIONS
// =========================================================

const DEFAULT_BUDGET_OPTIONS = [
  "Manpower",
  "Equipment",
  "Consumables",
  "Travel",
  "Contingency",
  "Other",
];

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
      options: DEFAULT_BUDGET_OPTIONS,
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
// DATE FORMATTER
// MongoDB Date / ISO Date -> YYYY-MM-DD
// =========================================================

const formatDateForInput = (value) => {
  if (!value) {
    return "";
  }

  // Already YYYY-MM-DD
  if (
    typeof value === "string" &&
    /^\d{4}-\d{2}-\d{2}$/.test(value)
  ) {
    return value;
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const year = date.getFullYear();

  const month = String(
    date.getMonth() + 1
  ).padStart(2, "0");

  const day = String(
    date.getDate()
  ).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

// =========================================================
// PROJECT FORM
// =========================================================

const ProjectForm = () => {

  // =======================================================
  // ROUTER
  // =======================================================

  const {
    id,
  } = useParams();

  const navigate =
    useNavigate();

  // =======================================================
  // EDIT MODE
  // =======================================================

  const isEditMode =
    Boolean(id);

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
  // LOADING
  // =======================================================

  const [loading, setLoading] =
    useState(false);

  // =======================================================
  // SAVING
  // =======================================================

  const [saving, setSaving] =
    useState(false);

  // =======================================================
  // FETCH VERTICALS
  // =======================================================

  const fetchVerticals = async () => {

    try {

      const response =
        await fetch(
          "http://localhost:5000/api/verticals"
        );

      const data =
        await response.json();

      if (!response.ok) {

        throw new Error(
          data.message ||
            "Failed to fetch verticals"
        );
      }

      setVerticals(
        Array.isArray(data)
          ? data
          : []
      );

    } catch (error) {

      console.error(
        "FETCH VERTICALS ERROR:",
        error
      );

    }
  };

  // =======================================================
  // LOAD PROJECT FOR EDIT
  // =======================================================

  const loadProjectForEdit =
    async (projectId) => {

      try {

        setLoading(true);

        console.log(
          "================================="
        );

        console.log(
          "EDIT PROJECT"
        );

        console.log(
          "PROJECT ID:",
          projectId
        );

        console.log(
          "================================="
        );

        const response =
          await fetch(
            `http://localhost:5000/api/projects/${projectId}`
          );

        const result =
          await response.json();

        console.log(
          "GET PROJECT RESPONSE:",
          result
        );

        if (!response.ok) {

          throw new Error(
            result.message ||
              "Failed to load project"
          );
        }

        // ---------------------------------------------------
        // Your API may return:
        //
        // { success: true, data: {...} }
        //
        // or directly:
        //
        // {...}
        // ---------------------------------------------------

        const project =
          result.data ||
          result.project ||
          result;

        if (!project) {

          throw new Error(
            "Project data not found"
          );
        }

        // ===================================================
        // NORMALIZE PROJECT
        // ===================================================

        const formattedProject = {

          // Start with defaults
          ...initialFormData,

          // Existing project
          ...project,

          // =================================================
          // DATE FIELDS
          // =================================================

          sanctionDate:
            formatDateForInput(
              project.sanctionDate
            ),

          projectStartDate:
            formatDateForInput(
              project.projectStartDate
            ),

          eoiDate:
            formatDateForInput(
              project.eoiDate
            ),

          disseminationDate:
            formatDateForInput(
              project.disseminationDate
            ),

          techCloseDate:
            formatDateForInput(
              project.techCloseDate
            ),

          finCloseDate:
            formatDateForInput(
              project.finCloseDate
            ),

          admCloseDate:
            formatDateForInput(
              project.admCloseDate
            ),

          nextMilestoneDate:
            formatDateForInput(
              project.nextMilestoneDate
            ),

          // =================================================
          // PRE-SANCTION
          // =================================================

          preSanctionMeetings:
            Array.isArray(
              project.preSanctionMeetings
            )
              ? project.preSanctionMeetings.map(
                  (meeting) => ({
                    ...meeting,

                    date:
                      formatDateForInput(
                        meeting.date
                      ),
                  })
                )
              : initialFormData.preSanctionMeetings,

          // =================================================
          // DELIVERABLES
          // =================================================

          deliverables:
            Array.isArray(
              project.deliverables
            )
              ? project.deliverables.map(
                  (item) => ({
                    ...item,

                    targetDate:
                      formatDateForInput(
                        item.targetDate
                      ),
                  })
                )
              : initialFormData.deliverables,

          // =================================================
          // BUDGET
          // =================================================

          budgetYears:
            Number(
              project.budgetYears
            ) || 1,

          budgetRows:
            Array.isArray(
              project.budgetRows
            )
              ? project.budgetRows.map(
                  (row) => ({

                    head:
                      row.head ||
                      "Manpower",

                    institute:
                      row.institute ||
                      "",

                    options:
                      Array.isArray(
                        row.options
                      )
                        ? row.options
                        : DEFAULT_BUDGET_OPTIONS,

                    years:
                      Array.isArray(
                        row.years
                      )
                        ? row.years
                        : [0],

                    total:
                      Number(
                        row.total || 0
                      ),

                  })
                )
              : initialFormData.budgetRows,

          // =================================================
          // POST-SANCTION
          // =================================================

          postSanctionMeetings:
            Array.isArray(
              project.postSanctionMeetings
            )
              ? project.postSanctionMeetings.map(
                  (meeting) => ({
                    ...meeting,

                    date:
                      formatDateForInput(
                        meeting.date
                      ),
                  })
                )
              : initialFormData.postSanctionMeetings,

          // =================================================
          // MANPOWER
          // =================================================

          manpower:
            Array.isArray(
              project.manpower
            )
              ? project.manpower
              : initialFormData.manpower,

          // =================================================
          // PDC EXTENSIONS
          // =================================================

          pdcExtensions:
            Array.isArray(
              project.pdcExtensions
            )
              ? project.pdcExtensions.map(
                  (extension) => ({
                    ...extension,

                    date:
                      formatDateForInput(
                        extension.date
                      ),

                    revisedPDC:
                      formatDateForInput(
                        extension.revisedPDC
                      ),
                  })
                )
              : initialFormData.pdcExtensions,

          // =================================================
          // REVISED SANCTIONS
          // =================================================

          revisedSanctions:
            Array.isArray(
              project.revisedSanctions
            )
              ? project.revisedSanctions.map(
                  (sanction) => ({
                    ...sanction,

                    date:
                      formatDateForInput(
                        sanction.date
                      ),
                  })
                )
              : initialFormData.revisedSanctions,

          // =================================================
          // CLOSURE MEETINGS
          // =================================================

          closureMeetings:
            Array.isArray(
              project.closureMeetings
            )
              ? project.closureMeetings.map(
                  (meeting) => ({
                    ...meeting,

                    date:
                      formatDateForInput(
                        meeting.date
                      ),
                  })
                )
              : initialFormData.closureMeetings,
        };

        // ===================================================
        // DEBUG
        // ===================================================

        console.log(
          "================================="
        );

        console.log(
          "PROJECT LOADED:"
        );

        console.log(
          formattedProject
        );

        console.log(
          "SANCTION DATE:",
          formattedProject.sanctionDate
        );

        console.log(
          "PROJECT START DATE:",
          formattedProject.projectStartDate
        );

        console.log(
          "PRE-SANCTION:",
          formattedProject.preSanctionMeetings
        );

        console.log(
          "DELIVERABLES:",
          formattedProject.deliverables
        );

        console.log(
          "BUDGET:",
          formattedProject.budgetRows
        );

        console.log(
          "================================="
        );

        // ===================================================
        // SET FORM DATA
        // ===================================================

        setFormData(
          formattedProject
        );

        setCurrentStep(0);

      } catch (error) {

        console.error(
          "LOAD PROJECT ERROR:",
          error
        );

        alert(
          error.message ||
            "Failed to load project"
        );

      } finally {

        setLoading(false);

      }
    };

  // =======================================================
  // INITIAL LOAD
  // =======================================================

  useEffect(() => {

    fetchVerticals();

    if (isEditMode) {

      loadProjectForEdit(id);

    }

  }, [id, isEditMode]);

  // =======================================================
  // COMMON INPUT CHANGE
  // =======================================================

  const handleChange = (e) => {

    const {
      name,
      value,
    } = e.target;

    setFormData(
      (prev) => ({
        ...prev,
        [name]: value,
      })
    );
  };

  // =======================================================
  // PRE-SANCTION MEETINGS
  // =======================================================

  const handleMeetingChange = (
    index,
    field,
    value
  ) => {

    setFormData(
      (prev) => {

        const updatedMeetings =
          [
            ...(prev.preSanctionMeetings ||
              []),
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
      }
    );
  };

  const addPreSanctionMeetingRow =
    () => {

      setFormData(
        (prev) => ({
          ...prev,

          preSanctionMeetings: [
            ...(prev.preSanctionMeetings ||
              []),

            {
              type: "Pre-TEC",
              date: "",
              minutes: "",
              remarks: "",
            },
          ],
        })
      );
    };

  const removeMeeting = (
    index
  ) => {

    setFormData(
      (prev) => ({
        ...prev,

        preSanctionMeetings:
          (
            prev.preSanctionMeetings ||
            []
          ).filter(
            (_, meetingIndex) =>
              meetingIndex !== index
          ),
      })
    );
  };

  // =======================================================
  // DELIVERABLES
  // =======================================================

  const handleDeliverableChange = (
    index,
    field,
    value
  ) => {

    setFormData(
      (prev) => {

        const updatedDeliverables =
          [
            ...(prev.deliverables ||
              []),
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
      }
    );
  };

  const addDeliverableRow = () => {

    setFormData(
      (prev) => ({
        ...prev,

        deliverables: [
          ...(prev.deliverables ||
            []),

          {
            description: "",
            targetDate: "",
            status: "Pending",
            remarks: "",
          },
        ],
      })
    );
  };

  const removeDeliverableRow = (
    index
  ) => {

    setFormData(
      (prev) => ({
        ...prev,

        deliverables:
          (
            prev.deliverables ||
            []
          ).filter(
            (_, deliverableIndex) =>
              deliverableIndex !== index
          ),
      })
    );
  };

  // =======================================================
  // BUDGET YEARS
  // =======================================================

  const changeBudgetYears = (
    change
  ) => {

    setFormData(
      (prev) => {

        const currentYears =
          Number(
            prev.budgetYears
          ) || 1;

        const newYears =
          Math.max(
            1,
            currentYears + change
          );

        const currentRows =
          Array.isArray(
            prev.budgetRows
          )
            ? prev.budgetRows
            : [];

        const updatedRows =
          currentRows.map(
            (row) => {

              const updatedYears =
                Array.isArray(
                  row.years
                )
                  ? [
                      ...row.years,
                    ]
                  : [];

              if (
                newYears >
                updatedYears.length
              ) {

                while (
                  updatedYears.length <
                  newYears
                ) {

                  updatedYears.push(
                    0
                  );

                }

              } else {

                updatedYears.length =
                  newYears;

              }

              return {
                ...row,

                options:
                  Array.isArray(
                    row.options
                  )
                    ? row.options
                    : DEFAULT_BUDGET_OPTIONS,

                years:
                  updatedYears,

                total:
                  updatedYears.reduce(
                    (
                      sum,
                      value
                    ) =>
                      sum +
                      Number(
                        value || 0
                      ),
                    0
                  ),
              };
            }
          );

        return {
          ...prev,

          budgetYears:
            newYears,

          budgetRows:
            updatedRows,
        };
      }
    );
  };

  // =======================================================
  // ADD BUDGET ROW
  // =======================================================

  const addBudgetRow = () => {

    setFormData(
      (prev) => {

        const years =
          Number(
            prev.budgetYears
          ) || 1;

        return {
          ...prev,

          budgetRows: [
            ...(prev.budgetRows ||
              []),

            {
              head: "Manpower",

              institute: "",

              options:
                DEFAULT_BUDGET_OPTIONS,

              years:
                Array(
                  years
                ).fill(0),

              total: 0,
            },
          ],
        };
      }
    );
  };

  // =======================================================
  // REMOVE BUDGET ROW
  // =======================================================

  const removeBudgetRow = (
    rowIndex
  ) => {

    setFormData(
      (prev) => ({
        ...prev,

        budgetRows:
          (
            prev.budgetRows ||
            []
          ).filter(
            (_, index) =>
              index !== rowIndex
          ),
      })
    );
  };

  // =======================================================
  // BUDGET HEAD
  // =======================================================

  const handleBudgetHeadChange = (
    rowIndex,
    value
  ) => {

    setFormData(
      (prev) => {

        const updatedRows = [
          ...(prev.budgetRows ||
            []),
        ];

        updatedRows[rowIndex] = {
          ...updatedRows[rowIndex],

          options:
            Array.isArray(
              updatedRows[rowIndex]
                ?.options
            )
              ? updatedRows[
                  rowIndex
                ].options
              : DEFAULT_BUDGET_OPTIONS,

          head: value,
        };

        return {
          ...prev,
          budgetRows:
            updatedRows,
        };
      }
    );
  };

  // =======================================================
  // BUDGET INSTITUTE
  // =======================================================

  const handleBudgetInstituteChange = (
    rowIndex,
    value
  ) => {

    setFormData(
      (prev) => {

        const updatedRows = [
          ...(prev.budgetRows ||
            []),
        ];

        updatedRows[rowIndex] = {
          ...updatedRows[rowIndex],

          institute:
            value,
        };

        return {
          ...prev,
          budgetRows:
            updatedRows,
        };
      }
    );
  };

  // =======================================================
  // BUDGET VALUE
  // =======================================================

  const handleBudgetValueChange = (
    rowIndex,
    yearIndex,
    value
  ) => {

    setFormData(
      (prev) => {

        const updatedRows = [
          ...(prev.budgetRows ||
            []),
        ];

        const currentRow =
          updatedRows[
            rowIndex
          ] || {
            head: "Manpower",
            institute: "",
            options:
              DEFAULT_BUDGET_OPTIONS,
            years: [],
            total: 0,
          };

        const updatedYears =
          Array.isArray(
            currentRow.years
          )
            ? [
                ...currentRow.years,
              ]
            : [];

        updatedYears[
          yearIndex
        ] =
          value === ""
            ? ""
            : Number(value);

        const total =
          updatedYears.reduce(
            (
              sum,
              amount
            ) =>
              sum +
              Number(
                amount || 0
              ),
            0
          );

        updatedRows[rowIndex] = {
          ...currentRow,

          options:
            Array.isArray(
              currentRow.options
            )
              ? currentRow.options
              : DEFAULT_BUDGET_OPTIONS,

          years:
            updatedYears,

          total,
        };

        return {
          ...prev,
          budgetRows:
            updatedRows,
        };
      }
    );
  };

  // =======================================================
  // YEAR TOTAL
  // =======================================================

  const getYearTotal = (
    yearIndex
  ) => {

    const rows =
      Array.isArray(
        formData.budgetRows
      )
        ? formData.budgetRows
        : [];

    return rows.reduce(
      (
        total,
        row
      ) => {

        const years =
          Array.isArray(
            row.years
          )
            ? row.years
            : [];

        return (
          total +
          Number(
            years[
              yearIndex
            ] || 0
          )
        );
      },
      0
    );
  };

  // =======================================================
  // GRAND TOTAL
  // =======================================================

  const getGrandTotal = () => {

    const rows =
      Array.isArray(
        formData.budgetRows
      )
        ? formData.budgetRows
        : [];

    return rows.reduce(
      (
        grandTotal,
        row
      ) =>
        grandTotal +
        Number(
          row.total || 0
        ),
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

    setFormData(
      (prev) => {

        const updatedMeetings =
          [
            ...(prev.postSanctionMeetings ||
              []),
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
      }
    );
  };

  const addPostSanctionMeetingRow =
    () => {

      setFormData(
        (prev) => ({
          ...prev,

          postSanctionMeetings: [
            ...(prev.postSanctionMeetings ||
              []),

            {
              type: "TEC",
              date: "",
              minutes: "",
              remarks: "",
            },
          ],
        })
      );
    };

  const removePostMeeting = (
    index
  ) => {

    setFormData(
      (prev) => ({
        ...prev,

        postSanctionMeetings:
          (
            prev.postSanctionMeetings ||
            []
          ).filter(
            (_, meetingIndex) =>
              meetingIndex !== index
          ),
      })
    );
  };

  // =======================================================
  // MANPOWER
  // =======================================================

  const handleManpowerChange = (
    index,
    field,
    value
  ) => {

    setFormData(
      (prev) => {

        const updatedManpower =
          [
            ...(prev.manpower ||
              []),
          ];

        updatedManpower[index] = {
          ...updatedManpower[index],
          [field]: value,
        };

        return {
          ...prev,

          manpower:
            updatedManpower,
        };
      }
    );
  };

  const addManpowerRow = () => {

    setFormData(
      (prev) => ({
        ...prev,

        manpower: [
          ...(prev.manpower ||
            []),

          {
            category:
              "Researcher",
            name: "",
            designation: "",
            specialisation:
              "",
          },
        ],
      })
    );
  };

  const removeManpowerRow = (
    index
  ) => {

    setFormData(
      (prev) => ({
        ...prev,

        manpower:
          (
            prev.manpower ||
            []
          ).filter(
            (_, manpowerIndex) =>
              manpowerIndex !==
              index
          ),
      })
    );
  };

  // =======================================================
  // PDC EXTENSIONS
  // =======================================================

  const handlePdcExtensionChange = (
    index,
    field,
    value
  ) => {

    setFormData(
      (prev) => {

        const updated =
          [
            ...(prev.pdcExtensions ||
              []),
          ];

        updated[index] = {
          ...updated[index],
          [field]: value,
        };

        return {
          ...prev,

          pdcExtensions:
            updated,
        };
      }
    );
  };

  const addPdcExtensionRow = () => {

    setFormData(
      (prev) => ({
        ...prev,

        pdcExtensions: [
          ...(prev.pdcExtensions ||
            []),

          {
            date: "",
            period: "",
            revisedPDC: "",
            remarks: "",
          },
        ],
      })
    );
  };

  const removePdcExtension = (
    index
  ) => {

    setFormData(
      (prev) => ({
        ...prev,

        pdcExtensions:
          (
            prev.pdcExtensions ||
            []
          ).filter(
            (_, i) =>
              i !== index
          ),
      })
    );
  };

  // =======================================================
  // REVISED SANCTION
  // =======================================================

  const handleRevisedSanctionChange =
    (
      index,
      field,
      value
    ) => {

      setFormData(
        (prev) => {

          const updated =
            [
              ...(prev.revisedSanctions ||
                []),
            ];

          updated[index] = {
            ...updated[index],
            [field]: value,
          };

          return {
            ...prev,

            revisedSanctions:
              updated,
          };
        }
      );
    };

  const addRevisedSanctionRow =
    () => {

      setFormData(
        (prev) => ({
          ...prev,

          revisedSanctions: [
            ...(prev.revisedSanctions ||
              []),

            {
              date: "",
              amount: "",
              letter: "",
            },
          ],
        })
      );
    };

  const removeRevisedSanction = (
    index
  ) => {

    setFormData(
      (prev) => ({
        ...prev,

        revisedSanctions:
          (
            prev.revisedSanctions ||
            []
          ).filter(
            (_, i) =>
              i !== index
          ),
      })
    );
  };

  // =======================================================
  // CLOSURE MEETINGS
  // =======================================================

  const handleClosureMeetingChange =
    (
      index,
      field,
      value
    ) => {

      setFormData(
        (prev) => {

          const updatedMeetings =
            [
              ...(prev.closureMeetings ||
                []),
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
        }
      );
    };

  const addClosureMeetingRow =
    () => {

      setFormData(
        (prev) => ({
          ...prev,

          closureMeetings: [
            ...(prev.closureMeetings ||
              []),

            {
              type: "Closure TEC",
              date: "",
              minutes: "",
              remarks: "",
            },
          ],
        })
      );
    };

  const removeClosureMeeting = (
    index
  ) => {

    setFormData(
      (prev) => ({
        ...prev,

        closureMeetings:
          (
            prev.closureMeetings ||
            []
          ).filter(
            (_, i) =>
              i !== index
          ),
      })
    );
  };

  // =======================================================
  // FORM STEPS
  // =======================================================

  const steps = [
    {
      title: "Project Identity",
      component:
        ProjectIdentity,
    },

    {
      title: "Pre-Sanction",
      component:
        PreSanction,
    },

    {
      title:
        "Sanction Finance",
      component:
        SanctionFinance,
    },

    {
      title:
        "Deliverables",
      component:
        Deliverables,
    },

    {
      title:
        "Budget Details",
      component:
        BudgetDetails,
    },

    {
      title:
        "Post-Sanction",
      component:
        PostSanction,
    },

    {
      title:
        "Manpower",
      component:
        Manpower,
    },

    {
      title:
        "Extensions",
      component:
        Extensions,
    },

    {
      title:
        "Outcomes",
      component:
        Outcomes,
    },

    {
      title:
        "Closure",
      component:
        Closure,
    },

    {
      title:
        "Next Milestone",
      component:
        NextMilestone,
    },

    {
      title:
        "General Remarks",
      component:
        GeneralRemarks,
    },
  ];

  // =======================================================
  // CURRENT SECTION
  // =======================================================

  const CurrentSection =
    steps[
      currentStep
    ].component;

  // =======================================================
  // NEXT
  // =======================================================

  const handleNext = () => {

    if (
      currentStep <
      steps.length - 1
    ) {

      setCurrentStep(
        (prev) =>
          prev + 1
      );

    }
  };

  // =======================================================
  // PREVIOUS
  // =======================================================

  const handlePrevious = () => {

    if (
      currentStep > 0
    ) {

      setCurrentStep(
        (prev) =>
          prev - 1
      );

    }
  };

  // =======================================================
  // SUBMIT / UPDATE
  // =======================================================

  const handleSubmit =
    async () => {

      try {

        setSaving(true);

        console.log(
          "================================="
        );

        console.log(
          isEditMode
            ? "UPDATING PROJECT"
            : "CREATING PROJECT"
        );

        console.log(
          "PROJECT ID:",
          id
        );

        console.log(
          "FORM DATA:",
          formData
        );

        console.log(
          "================================="
        );

        // -------------------------------------------------
        // EDIT = PUT
        // CREATE = POST
        // -------------------------------------------------

        const url =
          isEditMode
            ? `http://localhost:5000/api/projects/${id}`
            : "http://localhost:5000/api/projects";

        const method =
          isEditMode
            ? "PUT"
            : "POST";

        const response =
          await fetch(
            url,
            {
              method,

              headers: {
                "Content-Type":
                  "application/json",
              },

              body:
                JSON.stringify(
                  formData
                ),
            }
          );

        const result =
          await response.json();

        console.log(
          "SAVE RESPONSE:",
          result
        );

        if (!response.ok) {

          throw new Error(
            result.message ||
              (
                isEditMode
                  ? "Failed to update project"
                  : "Failed to create project"
              )
          );
        }

        // =================================================
        // SUCCESS
        // =================================================

        alert(
          isEditMode
            ? "Project updated successfully!"
            : "Project created successfully!"
        );

        // =================================================
        // AFTER EDIT
        // =================================================

        if (isEditMode) {

          // Go back to projects list
          navigate(
            "/projects"
          );

          return;
        }

        // =================================================
        // AFTER CREATE
        // =================================================

        setFormData(
          initialFormData
        );

        setCurrentStep(0);

      } catch (error) {

        console.error(
          "SAVE PROJECT ERROR:",
          error
        );

        alert(
          error.message ||
            "Failed to save project"
        );

      } finally {

        setSaving(false);

      }
    };

  // =======================================================
  // LOADING SCREEN
  // =======================================================

  if (loading) {

    return (
      <div
        className="project-form-container"
      >

        <h1
          className="project-form-title"
        >
          Project Form
        </h1>

        <div
          style={{
            padding: "40px",
            textAlign: "center",
          }}
        >
          Loading project...
        </div>

      </div>
    );
  }

  // =======================================================
  // JSX
  // =======================================================

  return (

    <div
      className="project-form-container"
    >

      {/* ===================================================
          TITLE
      =================================================== */}

      <h1
        className="project-form-title"
      >
        {isEditMode
          ? "Edit Project"
          : "Project Form"}
      </h1>

      {/* ===================================================
          EDIT MODE INDICATOR
      =================================================== */}

      {isEditMode && (

        <div
          style={{
            marginBottom: "15px",
            padding: "10px 15px",
            background: "#f5f5f5",
            borderRadius: "6px",
          }}
        >
          Editing Project ID:{" "}
          <strong>
            {id}
          </strong>
        </div>

      )}

      {/* ===================================================
          STEPPER
      =================================================== */}

      <div
        className="project-stepper"
      >

        {steps.map(
          (
            step,
            index
          ) => (

            <div
              key={
                step.title
              }
              className="project-step"
              onClick={() =>
                setCurrentStep(
                  index
                )
              }
            >

              <div
                className={
                  `project-step-number ${
                    currentStep ===
                    index
                      ? "project-step-active"
                      : ""
                  } ${
                    currentStep >
                    index
                      ? "project-step-completed"
                      : ""
                  }`
                }
              >
                {index + 1}
              </div>

              <div
                className={
                  `project-step-title ${
                    currentStep ===
                    index
                      ? "project-step-title-active"
                      : ""
                  }`
                }
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

        {/* =================================================
            CURRENT SECTION
        ================================================= */}

        <div
          className="project-form-content"
        >

          <CurrentSection

            /* COMMON */

            formData={
              formData
            }

            handleChange={
              handleChange
            }

            /* VERTICALS */

            verticals={
              verticals
            }

            /* PRE-SANCTION */

            handleMeetingChange={
              handleMeetingChange
            }

            addPreSanctionMeetingRow={
              addPreSanctionMeetingRow
            }

            removeMeeting={
              removeMeeting
            }

            /* DELIVERABLES */

            handleDeliverableChange={
              handleDeliverableChange
            }

            addDeliverableRow={
              addDeliverableRow
            }

            removeDeliverableRow={
              removeDeliverableRow
            }

            /* BUDGET */

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

            /* POST-SANCTION */

            handlePostMeetingChange={
              handlePostMeetingChange
            }

            addPostSanctionMeetingRow={
              addPostSanctionMeetingRow
            }

            removePostMeeting={
              removePostMeeting
            }

            /* MANPOWER */

            handleManpowerChange={
              handleManpowerChange
            }

            addManpowerRow={
              addManpowerRow
            }

            removeManpowerRow={
              removeManpowerRow
            }

            /* EXTENSIONS */

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

            /* CLOSURE */

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

        <div
          className="project-form-actions"
        >

          {/* PREVIOUS */}

          <button
            type="button"
            onClick={
              handlePrevious
            }
            disabled={
              currentStep === 0 ||
              saving
            }
          >
            Previous
          </button>

          {/* NEXT */}

          {currentStep <
          steps.length - 1 ? (

            <button
              type="button"
              onClick={
                handleNext
              }
              disabled={
                saving
              }
            >
              Next
            </button>

          ) : (

            /* SUBMIT / UPDATE */

            <button
              type="button"
              onClick={
                handleSubmit
              }
              disabled={
                saving
              }
            >
              {saving
                ? "Saving..."
                : isEditMode
                ? "Update Project"
                : "Submit"}
            </button>

          )}

        </div>

      </form>

    </div>
  );
};

export default ProjectForm;