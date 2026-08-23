
import { useEffect, useState } from 'react';
import { ProjectsAPI } from '../api';

const FORM_SECTIONS = [
  { id: 'identity', label: 'Project Identity' },
  { id: 'pre_sanction', label: 'Pre-Sanction Meetings' },
  { id: 'sanction_finance', label: 'Sanction & Finance' },
  { id: 'deliverables', label: 'Deliverables & Milestones' },
  { id: 'budget', label: 'Budget Details' },
  { id: 'post_sanction', label: 'Post Sanction' },
  { id: 'manpower', label: 'Manpower' },
  { id: 'extensions', label: 'Extensions & Revisions' },
  { id: 'outcomes', label: 'Outcomes & Dissemination' },
  { id: 'closure', label: 'Closure' },
  { id: 'next_milestone', label: 'Next Milestone' },
  { id: 'remarks', label: 'General Remarks' }
];

const INITIAL_FORM_STATE = {
// 1. Project Identity
  title: '',
  code: '',
  verticalId: '',
  piName: '',
  copiName: '',
  
// 2. Pre-Sanction
  // preSanctionNotes: '',
  // clarificationDate: '',
   preSanctionMeetings: [],

// 3. Sanction & Finance
  sanctionNumber: '',
  sanctionDate: '',
  totalSanctionedAmount: 0,
  fundingAgency: '',

// 4. Deliverables & Milestones
 deliverables: [],
  pertGanttLink: "",

// 5. Budget Details


// 6. Post Sanction
postSanctionMeetings: [],

// 7. Manpower
  numResearchers: "",
manpower: [],

// 8. Extensions & Revisions
pdcExtensions: [],
revisedSanctions: [],

// 9. Outcomes & Dissemination
technologiesDeveloped: "",
patentsGiven: "",
patentsSubmitted: "",
numPublications: "",
listPublications: "",
breakthroughTech: "",
eoiDate: "",
eoiDetails: "",
industriesInvolved: "",
disseminationDate: "",
disseminationParticipants: "",
workshopConducted: "",
workshopDetails: "",

// 10. Closure
 closureMeetings: [],

techCloseDate: "",
techCloseRemarks: "",

finCloseDate: "",
finCloseRemarks: "",

admCloseDate: "",
admCloseRemarks: "",

labRecReceived: "",
labRecComments: "",
labRecReason: "",

finalTRL: "",

// 11. Next Milestone
nextMilestoneType: "",
nextMilestoneDate: "",
nextMilestoneDescription: "",

// 12. General Remarks
  remarks: ''
};


const DEFAULT_ROWS = [
  "Equipment",
  "Consumables",
  "Travel",
  "Manpower",
  "Contingency",
  "Overheads",
];
const MANPOWER_CATEGORIES = [
  "JRF",
  "SRF",
  "Research Associate",
  "Project Associate-I",
  "Project Associate-II",
  "Project Scientist",
  "Project Assistant",
  "Technical Staff",
  "Other",
];

export default function ProjectForm({ projectId, projects = [], verticals = [], onDone, onCancel }) {
  const [activeTab, setActiveTab] = useState('identity');
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const [budgetYears, setBudgetYears] = useState(1);


// const [budgetRows, setBudgetRows] = useState(
//   DEFAULT_ROWS.map((head) => ({
//     head,
//     institute: "",
//     years: [""],
//     total: 0,
//   }))
// );



const [budgetRows, setBudgetRows] = useState([
  {
    head: "Staff",
    options: [
      "Staff",
      "Visiting Faculty / Research Consultant",
    ],
    institute: "",
    years: [""],
    total: 0,
  },
  {
    head: "Equipment (including spares)",
    options: [
      "Equipment (including spares)",
      "Operation and Maintenance of Equipment",
    ],
    institute: "",
    years: [""],
    total: 0,
  },
  {
    head: "Expendables",
    options: [
      "Expendables",
      "Workshop",
      "Travel",
      "Contingencies",
    ],
    institute: "",
    years: [""],
    total: 0,
  },
]);


  // Load project details if editing
  useEffect(() => {
    if (projectId && projects.length > 0) {
      const existing = projects.find((p) => String(p.id) === String(projectId));
      if (existing) {
        setFormData({ ...INITIAL_FORM_STATE, ...existing });
      }
    }
  }, [projectId, projects]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      if (projectId) {
        await ProjectsAPI.update(projectId, formData);
      } else {
        await ProjectsAPI.create(formData);
      }
      onDone();
    } catch (err) {
      console.error(err);
      setError('Failed to save project. Please check backend connection.');
    } finally {
      setSaving(false);
    }
  };


  //  const addPreSanctionMeetingRow = () => {
  //   setMeetings((prev) => [
  //     ...prev,
  //     {
  //       type: "Pre-TEC",
  //       date: "",
  //       minutes: "",
  //       remarks: "",
  //     },
  //   ]);
  // };



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

const handleMeetingChange = (index, field, value) => {
  const updatedMeetings = [...formData.preSanctionMeetings];

  updatedMeetings[index] = {
    ...updatedMeetings[index],
    [field]: value,
  };

  setFormData((prev) => ({
    ...prev,
    preSanctionMeetings: updatedMeetings,
  }));
};

const removeMeeting = (index) => {
  setFormData((prev) => ({
    ...prev,
    preSanctionMeetings: prev.preSanctionMeetings.filter(
      (_, i) => i !== index
    ),
  }));
};


//Deliverable
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

const handleDeliverableChange = (index, field, value) => {
  const updated = [...formData.deliverables];

  updated[index] = {
    ...updated[index],
    [field]: value,
  };

  setFormData((prev) => ({
    ...prev,
    deliverables: updated,
  }));
};

const removeDeliverableRow = (index) => {
  setFormData((prev) => ({
    ...prev,
    deliverables: prev.deliverables.filter((_, i) => i !== index),
  }));
};

// Budget section

const changeBudgetYears = (change) => {
  const newYears = Math.max(1, budgetYears + change);

  setBudgetYears(newYears);

  setBudgetRows((prev) =>
    prev.map((row) => {
      let years = [...row.years];

      if (change > 0) {
        years.push("");
      } else {
        years = years.slice(0, newYears);
      }

      return {
        ...row,
        years,
      };
    })
  );
};

const addBudgetRow = () => {
  setBudgetRows((prev) => [
    ...prev,
    {
      head: "",
      institute:"",
      years: Array(budgetYears).fill(""),
      total: "",
    },
  ]);
};

const handleBudgetHeadChange = (index, value) => {
  const updated = [...budgetRows];
  updated[index].head = value;
  setBudgetRows(updated);
};

const handleBudgetValueChange = (rowIndex, yearIndex, value) => {
  const updated = [...budgetRows];

  updated[rowIndex].years[yearIndex] = value;

  updated[rowIndex].total = updated[rowIndex].years.reduce(
    (sum, val) => sum + (parseFloat(val) || 0),
    0
  );

  setBudgetRows(updated);
};

const handleBudgetInstituteChange = (index, value) => {
  const updated = [...budgetRows];
  updated[index].institute = value;
  setBudgetRows(updated);
};

const removeBudgetRow = (index) => {
  setBudgetRows((prev) => prev.filter((_, i) => i !== index));
};

const getYearTotal = (yearIndex) => {
  return budgetRows.reduce(
    (sum, row) => sum + (parseFloat(row.years[yearIndex]) || 0),
    0
  );
};

const getGrandTotal = () => {
  return budgetRows.reduce(
    (sum, row) => sum + (parseFloat(row.total) || 0),
    0
  );
};

//postSanctionMeetings

const addPostSanctionMeetingRow = () => {
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

const handlePostMeetingChange = (index, field, value) => {
  const updated = [...formData.postSanctionMeetings];

  updated[index] = {
    ...updated[index],
    [field]: value,
  };

  setFormData((prev) => ({
    ...prev,
    postSanctionMeetings: updated,
  }));
};

const removePostMeeting = (index) => {
  setFormData((prev) => ({
    ...prev,
    postSanctionMeetings: prev.postSanctionMeetings.filter(
      (_, i) => i !== index
    ),
  }));
};

//manpower
const addManpowerRow = () => {
  setFormData((prev) => ({
    ...prev,
    manpower: [
      ...prev.manpower,
      {
        category: "JRF",
        name: "",
        designation: "",
        specialisation: "",
      },
    ],
  }));
};

const handleManpowerChange = (index, field, value) => {
  const updated = [...formData.manpower];

  updated[index] = {
    ...updated[index],
    [field]: value,
  };

  setFormData((prev) => ({
    ...prev,
    manpower: updated,
  }));
};

const removeManpowerRow = (index) => {
  setFormData((prev) => ({
    ...prev,
    manpower: prev.manpower.filter((_, i) => i !== index),
  }));
};

// Extension and revesion
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

const handlePdcExtensionChange = (index, field, value) => {
  const updated = [...formData.pdcExtensions];

  updated[index] = {
    ...updated[index],
    [field]: value,
  };

  setFormData((prev) => ({
    ...prev,
    pdcExtensions: updated,
  }));
};

const removePdcExtension = (index) => {
  setFormData((prev) => ({
    ...prev,
    pdcExtensions: prev.pdcExtensions.filter((_, i) => i !== index),
  }));
};


const addRevisedSanctionRow = () => {
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

const handleRevisedSanctionChange = (index, field, value) => {
  const updated = [...formData.revisedSanctions];

  updated[index] = {
    ...updated[index],
    [field]: value,
  };

  setFormData((prev) => ({
    ...prev,
    revisedSanctions: updated,
  }));
};

const removeRevisedSanction = (index) => {
  setFormData((prev) => ({
    ...prev,
    revisedSanctions: prev.revisedSanctions.filter((_, i) => i !== index),
  }));
};

//closure
const addClosureMeetingRow = () => {
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

const handleClosureMeetingChange = (index, field, value) => {
  const updated = [...formData.closureMeetings];

  updated[index] = {
    ...updated[index],
    [field]: value,
  };

  setFormData((prev) => ({
    ...prev,
    closureMeetings: updated,
  }));
};

const removeClosureMeeting = (index) => {
  setFormData((prev) => ({
    ...prev,
    closureMeetings: prev.closureMeetings.filter((_, i) => i !== index),
  }));
};
  return (
    <div className="project-form-container" style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Top Header & Quick Save */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>{projectId ? 'Edit Project' : 'Create New Project'}</h2>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button type="button" className="btn btn-secondary" onClick={onCancel}>
            Cancel
          </button>
          <button   type="button"   className="btn btn-primary"   onClick={handleSave}  disabled={saving}>
            {saving ? "Saving..." : "💾 Save Project"} </button>
        </div>
      </div>

      {error && (
        <div style={{ padding: '10px 15px', background: '#ffe6e6', color: '#d32f2f', borderRadius: '4px', marginBottom: '20px' }}>
          ⚠️ {error}
        </div>
      )}

      {/* Navigation Tabs Bar */}
      <div style={{ display: 'flex', overflowX: 'auto', borderBottom: '2px solid #ddd', marginBottom: '20px', gap: '5px' }}>
        {FORM_SECTIONS.map((sec, idx) => (
          <button
            key={sec.id}
            type="button"
            onClick={() => setActiveTab(sec.id)}
            style={{
              padding: '10px 15px',
              border: 'none',
              background: activeTab === sec.id ? '#1976d2' : '#f5f5f5',
              color: activeTab === sec.id ? '#fff' : '#333',
              borderRadius: '4px 4px 0 0',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              fontWeight: activeTab === sec.id ? 'bold' : 'normal'
            }}
          >
            {idx + 1}. {sec.label}
          </button>
        ))}
      </div>

      {/* Form Content Body */}
      <form onSubmit={handleSave} style={{ background: '#fff', padding: '25px', borderRadius: '8px', border: '1px solid #e0e0e0' }}>
        {/* 1. Project Identity */}
        {activeTab === 'identity' && (
          <div className="form-section">
            <h3>1. Project Identity</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
             
              <div>
                <label>Project ID / Code </label>
                <input type="text" name="code" value={formData.code} onChange={handleChange} style={{ width: '100%', padding: '8px' }} />
              </div>
               <div>
                <label>Project Title *</label>
                <input type="text" name="title" value={formData.title} onChange={handleChange} required style={{ width: '100%', padding: '8px' }} />
              </div>
              <div>
                <label>Vertical</label>
                <select name="verticalId" value={formData.verticalId} onChange={handleChange} style={{ width: '100%', padding: '8px' }}>
                  <option value="">Select Vertical...</option>
                  {verticals.map((v) => (
                    <option key={v.id} value={v.id}>{v.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label>Project Duration</label>
                <input type="text" name="piName" value={formData.piName} onChange={handleChange} style={{ width: '100%', padding: '8px' }} />
              </div>
              <div>
                <label>Principal Investigator (PI)</label>
                <input type="text" name="piName" value={formData.piName} onChange={handleChange} style={{ width: '100%', padding: '8px' }} />
              </div>
               <div>
                <label>PI Institute Name</label>
                <input type="text" name="piName" value={formData.piName} onChange={handleChange} style={{ width: '100%', padding: '8px' }} />
              </div>
               <div>
                <label>CO-PI(s)</label>
                <input type="text" name="piName" value={formData.piName} onChange={handleChange} style={{ width: '100%', padding: '8px' }} />
              </div>             
               <div>
                <label>Co-PI Institute</label>
                <input type="text" name="piName" value={formData.piName} onChange={handleChange} style={{ width: '100%', padding: '8px' }} />
              </div>
               <div>
                <label>Stakeholding DRDO Lab(s)</label>
                <input type="text" name="piName" value={formData.piName} onChange={handleChange} style={{ width: '100%', padding: '8px' }} />
              </div>              
               <div>
                <label>Stakeholding Scientist</label>
                <input type="text" name="piName" value={formData.piName} onChange={handleChange} style={{ width: '100%', padding: '8px' }} />
              </div>

              <div>
                <label>Project Status</label>
                <select name="verticalId" value={formData.verticalId} onChange={handleChange} style={{ width: '100%', padding: '8px' }}>
                  <option value="">Not Specified...</option>
                  {verticals.map((v) => (
                    <option key={v.id} value={v.id}>{v.name}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}

        {/* 2. Pre-Sanction Meetings / Clarifications */}
        {activeTab === 'pre_sanction' && (
          <div className="form-section">
            <h3>2. Pre-Sanction Meetings & Clarifications</h3>
            <div style={{ display: 'grid', gap: '15px' }}>

              <div>
                <label>Initial TRL Level</label>
                <select name="verticalId" value={formData.verticalId} onChange={handleChange} style={{ width: '100%', padding: '8px' }}>
                  <option value="">-Not Specified-</option>
                  {verticals.map((v) => (
                    <option key={v.id} value={v.id}>{v.name}</option>
                  ))}
                </select>
              </div>
              <p style={{fontSize:"12px"}}>Add each Pre-TEC, TEC, RAB, GC meeting, or ADFA/IFA/Others item held before sanction, with its date and minutes/link — add as many as needed:</p>
              <div>
                {formData.preSanctionMeetings.map((meeting, index) => (
                  <div
                    key={index}
                    className="msub-row"
                    style={{
                      display: "grid",
                      gridTemplateColumns: "180px 180px 1fr 1fr auto",
                      gap: "10px",
                      marginBottom: "10px",
                      alignItems: "center",
                    }}
                  >
                    <select
                      value={meeting.type}
                      onChange={(e) =>
                        handleMeetingChange(index, "type", e.target.value)
                      }
                    >
                      <option value="Pre-TEC">Pre-TEC</option>
                      <option value="TEC">TEC</option>
                      <option value="RAB">RAB</option>
                      <option value="GC">GC</option>
                      <option value="ADFA/IFA/Others">ADFA/IFA/Others</option>
                    </select>

                    <input
                      type="date"
                      value={meeting.date}
                      onChange={(e) =>
                        handleMeetingChange(index, "date", e.target.value)
                      }
                    />

                    <input
                      type="text"
                      placeholder="Minutes / File Path"
                      value={meeting.minutes}
                      onChange={(e) =>
                        handleMeetingChange(index, "minutes", e.target.value)
                      }
                    />

                    <input
                      type="text"
                      placeholder="Remarks"
                      value={meeting.remarks}
                      onChange={(e) =>
                        handleMeetingChange(index, "remarks", e.target.value)
                      }
                    />

                    <button
                      type="button"
                      className="btn btn-danger"
                      onClick={() => removeMeeting(index)}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
               <button  type="button"  className="btn-ghost"  onClick={addPreSanctionMeetingRow}>
                + Add Committee Meeting</button>             
            </div>
          </div>
        )}

        {/* 3. Sanction & Finance */}
        {activeTab === 'sanction_finance' && (
          <div className="form-section">
            <h3>3. Sanction & Finance</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}> 
             
              <div>
                <label>Sanction Date</label>
                <input type="date" name="sanctionDate" value={formData.sanctionDate} onChange={handleChange} style={{ width: '100%', padding: '8px' }} />
              </div>
              <div>
                <label>Sanctioned Amount (₹)</label>
                <input type="text" name="sanctionNumber" value={formData.sanctionNumber} onChange={handleChange} style={{ width: '100%', padding: '8px' }} />
              </div>             
              

               <div>
                <label>Sanction Letter (local file path)</label>
                <input type="text" name="fundingAgency" value={formData.fundingAgency} onChange={handleChange} style={{ width: '100%', padding: '8px' }} />
              </div>

              <div>
                <label>Project Start Date / 1st Fund Release Date</label>
                <input type="date" name="sanctionDate" value={formData.sanctionDate} onChange={handleChange} style={{ width: '100%', padding: '8px' }} />
              </div>
              
            </div>
             <div>
                <label>Equipment List</label>
                <textarea name="preSanctionNotes" rows="4" 
                placeholder='One item per line, e.g. UV-Vis Spectrophotometer Rotary Evaporator' 
                value={formData.preSanctionNotes} 
                onChange={handleChange} 
                style={{ width: '100%', padding: '8px' }} />
              </div>
          </div>
        )}

        {/* 4. Deliverables & Milestones (after sanction) */}
        {activeTab === 'deliverables' && (
          <div className="form-section">
            <h3>4. Deliverables & Milestones (after sanction)</h3>
            <p style={{ color: '#666', fontSize:"12px" }}>
              List each deliverable or milestone with its target date and current status. 
              A visual timeline is auto-generated from this list in the project view. </p>
            
            {formData.deliverables.map((item, index) => (

              <div
                key={index}
                className="msub-row"
                style={{
                  display: "grid",
                  gridTemplateColumns: "1.6fr 130px 130px 1.2fr 32px",
                  gap: "10px",
                  marginBottom: "10px",
                  alignItems: "center",
                }}
              >

                <input
                  type="text"
                  placeholder="Deliverable / milestone description"
                  value={item.description}
                  onChange={(e) =>
                    handleDeliverableChange(
                      index,
                      "description",
                      e.target.value
                    )
                  }
                />

                <input
                  type="date"
                  value={item.targetDate}
                  onChange={(e) =>
                    handleDeliverableChange(
                      index,
                      "targetDate",
                      e.target.value
                    )
                  }
                />

                <select
                  value={item.status}
                  onChange={(e) =>
                    handleDeliverableChange(
                      index,
                      "status",
                      e.target.value
                    )
                  }
                >
                  <option value="Pending">Pending</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Achieved">Achieved</option>
                  <option value="Delayed">Delayed</option>
                </select>

                <input
                  type="text"
                  placeholder="Remarks"
                  value={item.remarks}
                  onChange={(e) =>
                    handleDeliverableChange(
                      index,
                      "remarks",
                      e.target.value
                    )
                  }
                />

                <button
                  type="button"
                  className="icon-btn"
                  onClick={() => removeDeliverableRow(index)}
                >
                  ✕
                </button>

              </div>

            ))}
            <button type="button" className="btn btn-ghost btn-sm"
              onClick={addDeliverableRow} > + Add Deliverable / Milestone </button>
            <div
              className="form-grid"
              style={{marginTop: "16px", borderTop: "1px solid #ddd",  paddingTop: "14px", }} >
              <div className="field span3">
                <label>PERT / GANTT Chart (local file path)</label>
                <input  type="text"   name="pertGanttLink"     value={formData.pertGanttLink}
                  onChange={handleChange}
                  placeholder="e.g. D:\RD-Projects\Charts\Gantt_014.xlsx or .mpp / .pdf"
                />
              </div>
            </div>  
          </div>
        )}

        {/* 5. Budget Details */}
        {activeTab === 'budget' && (
          <div className="budget-section">
            <h4>Budget Details</h4>
            <div className="budget-toolbar">
                <span className="budget-label">  Budget Years (expand up to project duration): </span>
                <button   type="button"  className="btn-year"  onClick={() => changeBudgetYears(-1)}> − Year  </button>

                <span className="year-count">  {budgetYears} Year{budgetYears > 1 && "s"}  </span>
                <button  type="button"  className="btn-year"  onClick={() => changeBudgetYears(1)} >
                    + Year </button>
                <button type="button"  className="btn-add"  onClick={addBudgetRow}>  + Add Row </button>
            </div>

            <p className="budget-note"> Budget Sanction Details (₹ in Lakhs) </p>

            <div className="table-wrapper">
                <table className="budget-table">
                    <thead>
                        <tr>
                            <th>Expenditure Head</th>
                            <th style={{ minWidth: "140px" }}>Institute</th>

                            {Array.from({ length: budgetYears }).map((_, i) => (
                                <th key={i}>Year {i + 1}</th>
                            ))}

                            <th>Total</th>

                            <th></th>
                        </tr>
                    </thead>

                    <tbody>

                        {budgetRows.map((row, rowIndex) => (

                            <tr key={rowIndex}>

                                <td>
                                     <select  style={{width:"100%"}}  value={row.head}
                                      onChange={(e) =>  handleBudgetHeadChange(rowIndex, e.target.value) } >
                                      {row.options.map((option) => (
                                        <option key={option} value={option}>
                                          {option}
                                        </option>
                                      ))}
                                    </select>
                                </td>

                                <td>
                                <input  type="text" value={row.institute}
                                  onChange={(e) => handleBudgetInstituteChange( rowIndex,   e.target.value ) }
                                />
                              </td>

                                {row.years.map((value, yearIndex) => (

                                    <td key={yearIndex}>
                                        <input type="number"  value={value}
                                            onChange={(e) =>
                                                handleBudgetValueChange( rowIndex,  yearIndex,  e.target.value)
                                            } />
                                    </td>
                                ))}

                                <td>{row.total}</td>
                                <td>
                                    <button  type="button"  className="btn-delete"
                                        onClick={() => removeBudgetRow(rowIndex) }>  ✕  </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                    <tfoot>
                      <tr
                        style={{
                          background: "#f5f5f5",
                          fontWeight: "bold",
                        }}
                      >
                        <td>Grand Total</td>

                        {/* Institute column */}
                        <td></td>

                        {/* Year-wise Grand Total */}
                        {Array.from({ length: budgetYears }).map((_, y) => (
                          <td key={y}>
                            {getYearTotal(y).toFixed(2)}
                          </td>
                        ))}

                        {/* Overall Grand Total */}
                        <td>{getGrandTotal().toFixed(2)}</td>

                        <td></td>
                      </tr>
                    </tfoot>
                </table>
            </div>

            <p className="budget-footer">
                Default rows cover the standard expenditure heads. Add extra rows if the same head 
                needs to be split across more than one institute.
            </p>

          </div>
        )}

        {/* 6. Post Sanction */}
        {activeTab === 'post_sanction' && (
          <div className="form-section">
            <h3>6. Post Sanction Requirements</h3>
            <div style={{ display: 'grid', gap: '15px' }}>
              <p  style={{  marginBottom: "8px",  fontSize: "13px",  color: "#666",  }} >
                Add each TEC, RAB, or GC meeting held after sanction, 
                with its date and minutes — add as many as needed per committee.
              </p>
              {formData.postSanctionMeetings.map((meeting, index) => (
                <div  key={index}  className="msub-row"
                  style={{  display: "grid", gridTemplateColumns: "180px 170px 1fr 1fr auto",
                    gap: "10px",  marginBottom: "10px", alignItems: "center", }}>
                  <select
                    value={meeting.type}
                    onChange={(e) =>
                      handlePostMeetingChange( index, "type", e.target.value ) } >
                    <option value="TEC">TEC</option>
                    <option value="RAB">RAB</option>
                    <option value="GC">GC</option>
                  </select>

                  <input   type="date"  value={meeting.date}
                    onChange={(e) =>  handlePostMeetingChange(  index,  "date",  e.target.value ) }  />

                  <input  type="text"   placeholder="Local file path"   value={meeting.minutes}
                    onChange={(e) => handlePostMeetingChange( index,  "minutes", e.target.value ) }  />

                  <input  type="text"   placeholder="Remarks"  value={meeting.remarks}
                    onChange={(e) => handlePostMeetingChange( index, "remarks",  e.target.value ) }  />

                  <button  type="button" className="icon-btn"
                    onClick={() => removePostMeeting(index)}>  ✕  </button>
                </div>
              ))}
              <button  type="button" className="btn btn-ghost btn-sm"
                onClick={addPostSanctionMeetingRow} >  + Add Committee Meeting  </button>
            </div>
          </div>
        )}

        {/* 7. Manpower */}
        {activeTab === 'manpower' && (
          <div className="form-section">
            <h3>7. Manpower Allocation</h3>
            <p style={{ color: '#666' }}>Track researchers, JRFs, and technicians allocated to this project.</p>
           
            <div style={{display: "grid", gridTemplateColumns: "250px",  marginBottom: "15px", }} >
              <div>
                <label>Number of Researchers</label>
                <input    type="number"    name="numResearchers"  value={formData.numResearchers}
                  onChange={handleChange}    placeholder="e.g. 4" />
              </div>
            </div>

            <p style={{fontSize: "13px",  color: "#666",  marginBottom: "10px", }} >
              Manpower engaged under the project — add one row per person.
            </p>

            <div  style={{overflowX: "auto", border: "1px solid #ddd",  borderRadius: "8px", }} >
              <table className="budget-table">
                <thead>
                  <tr>
                    <th>Category</th>
                    <th>Name</th>
                    <th>Designation</th>
                    <th>Area of Specialisation</th>
                    <th></th>
                  </tr>
                </thead>

                <tbody>
                  {formData.manpower.map((member, index) => (

                    <tr key={index}>
                      <td>
                        <select value={member.category}
                          onChange={(e) =>
                            handleManpowerChange(index,  "category",   e.target.value  ) } >
                          {MANPOWER_CATEGORIES.map((item) => (
                            <option  key={item}  value={item} >  {item}  </option>
                          ))}
                        </select>
                      </td>

                      <td>
                        <input type="text"  value={member.name}  placeholder="Name"
                          onChange={(e) =>
                            handleManpowerChange( index,  "name",  e.target.value ) } />
                      </td>

                      <td>
                        <input type="text"  value={member.designation}  placeholder="Designation"
                          onChange={(e) =>
                            handleManpowerChange( index, "designation",  e.target.value) } />
                      </td>

                      <td>
                        <input type="text"  value={member.specialisation} placeholder="Area of Specialisation"
                          onChange={(e) =>
                            handleManpowerChange( index, "specialisation",  e.target.value )
                          }
                        />
                      </td>

                      <td>
                        <button  type="button" className="icon-btn"
                          onClick={() => removeManpowerRow(index)}>  ✕ </button>
                      </td>
                    </tr>

                  ))}

                </tbody>

              </table>
            </div>

            <button type="button" className="btn btn-ghost btn-sm"  style={{ marginTop: "10px" }} 
            onClick={addManpowerRow}> + Add Manpower </button>
          </div>
        )}

        {/* 8. Extensions & Revisions */}
        {activeTab === 'extensions' && (
          <div className="form-section">
            <h3>8. Extensions & Revisions</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '15px' }}>              
              <p style={{ marginBottom: "8px", fontSize: "13px", color: "#666", }} >
                PDC Extension(s) (if any) — add one row per extension </p>

              {formData.pdcExtensions.map((ext, index) => (
                <div key={index} className="msub-row"
                  style={{ display: "grid",  gridTemplateColumns: "130px 150px 130px 1.3fr 32px",
                    gap: "10px", marginBottom: "10px", }} >
                  <input type="date"value={ext.date}
                    onChange={(e) => handlePdcExtensionChange(index, "date", e.target.value) } />

                  <input type="text" placeholder="Period of extension"  value={ext.period}
                    onChange={(e) => handlePdcExtensionChange(index, "period", e.target.value)}/>
                  <input type="date"  value={ext.revisedPDC}
                    onChange={(e) => handlePdcExtensionChange(  index, "revisedPDC",  e.target.value )} />

                  <input  type="text"  placeholder="Remarks"   value={ext.remarks}
                    onChange={(e) => handlePdcExtensionChange( index,  "remarks",  e.target.value ) } />

                  <button  type="button"  className="icon-btn"  onClick={() => removePdcExtension(index)}>
                    ✕
                  </button>
                </div>
              ))}

              <button type="button" className="btn btn-ghost btn-sm" onClick={addPdcExtensionRow} >
                + Add PDC Extension
              </button>

              <div  style={{margin: "18px 0 8px", borderTop: "1px solid #ddd",  paddingTop: "14px",
                  fontSize: "13px", color: "#666", }}  >
                Revised Sanction(s) (if any) — add one row per revision
              </div>

              {formData.revisedSanctions.map((rev, index) => (
                <div key={index}  className="msub-row"
                  style={{ display: "grid", gridTemplateColumns: "140px 160px 1.6fr 32px",    gap: "10px",
                    marginBottom: "10px",  }} >
                  <input  type="date"   value={rev.date}
                    onChange={(e) =>  handleRevisedSanctionChange(index, "date", e.target.value) } />

                  <input   type="number" step="0.01" placeholder="Revised amount (₹)"
                    value={rev.amount}
                    onChange={(e) => handleRevisedSanctionChange( index, "amount",  e.target.value ) } />

                  <input type="text" placeholder="Local file path to revised sanction letter"
                    value={rev.letter}
                    onChange={(e) => handleRevisedSanctionChange( index,  "letter", e.target.value ) } />

                  <button type="button" className="icon-btn"
                    onClick={() => removeRevisedSanction(index)}>  ✕   </button>
                </div>
              ))}

              <button  type="button"  className="btn btn-ghost btn-sm"
                onClick={addRevisedSanctionRow}
              > + Add Revised Sanction </button>  
            </div>
          </div>
        )}

        {/* 9. Outcomes & Dissemination */}
        {activeTab === 'outcomes' && (
          <div className="form-section">
            <h3>9. Outcomes & Dissemination</h3>
            <div> 

              <div className="form-grid">
                <div className="field span3">
                  <label>Technologies Developed Under the Project</label>
                  <textarea
                    name="technologiesDeveloped"
                    value={formData.technologiesDeveloped}
                    onChange={handleChange}
                    placeholder={`One per line, e.g. Low-cost membrane fabrication process Predictive maintenance ML model`}
                  />
                </div>

                <div className="field">
                  <label>Patents Given</label>
                  <textarea
                    name="patentsGiven"
                    value={formData.patentsGiven}
                    onChange={handleChange}
                    placeholder={`One per line, e.g. IN202441012345 — granted 2025`}
                  />
                </div>

                <div className="field">
                  <label>Patents Submitted</label>
                  <textarea
                    name="patentsSubmitted"
                    value={formData.patentsSubmitted}
                    onChange={handleChange}
                    placeholder={`One per line, e.g. Application filed Mar 2026`}
                  />
                </div>

                <div className="field">
                  <label>Number of Publications</label>
                  <input
                    type="number"
                    name="numPublications"
                    value={formData.numPublications}
                    onChange={handleChange}
                    placeholder="e.g. 6"
                  />
                </div>

                <div className="field span3">
                  <label>List of Publications</label>
                  <textarea
                    name="listPublications"
                    value={formData.listPublications}
                    onChange={handleChange}
                    placeholder={`One per line, e.g. Sharma et al., 'Title', Journal Name, 2025`}
                  />
                </div>

                <div className="field span3">
                  <label>Any Breakthrough Technology Developed</label>
                  <textarea
                    name="breakthroughTech"
                    value={formData.breakthroughTech}
                    onChange={handleChange}
                    placeholder="Describe any breakthrough technology arising from the project"
                  />
                </div>

                <div className="field">
                  <label>
                    EOI Issued Date <span className="muted">(if any)</span>
                  </label>
                  <input
                    type="date"
                    name="eoiDate"
                    value={formData.eoiDate}
                    onChange={handleChange}
                  />
                </div>

                <div className="field span2">
                  <label>EOI Issued Details</label>
                  <input
                    type="text"
                    name="eoiDetails"
                    value={formData.eoiDetails}
                    onChange={handleChange}
                    placeholder="e.g. EOI issued to 5 industry partners for tech transfer"
                  />
                </div>

                <div className="field span3">
                  <label>Industries Involved</label>
                  <input
                    type="text"
                    name="industriesInvolved"
                    value={formData.industriesInvolved}
                    onChange={handleChange}
                    placeholder="e.g. Tata Steel, L&T, Reliance Industries"
                  />
                </div>

                <div className="field">
                  <label>Date of Dissemination</label>
                  <input
                    type="date"
                    name="disseminationDate"
                    value={formData.disseminationDate}
                    onChange={handleChange}
                  />
                </div>

                <div className="field span2">
                  <label>Details of Dissemination Participants</label>
                  <textarea
                    name="disseminationParticipants"
                    value={formData.disseminationParticipants}
                    onChange={handleChange}
                    placeholder="Who attended / target audience / numbers"
                  />
                </div>

                <div className="field">
                  <label>Workshop Conducted</label>
                  <select
                    name="workshopConducted"
                    value={formData.workshopConducted}
                    onChange={handleChange}>
                    <option value="">— Not specified —</option>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </select>
                </div>

                <div className="field span2">
                  <label>Workshop Details</label>
                  <input   type="text"   name="workshopDetails"
                    value={formData.workshopDetails}
                    onChange={handleChange}
                    placeholder="e.g. 2-day workshop, 40 participants, Jan 2026"
                  />
                </div>

              </div>
              
            </div>
          </div>
        )}

        {/* 10. Closure */}
        {activeTab === 'closure' && (
          <div className="form-section">
            <h3>10. Project Closure</h3>
              <p className="small muted" style={{ marginBottom: 8 }}>
                Closure-stage committee meetings (approval of closure) — add as many as needed:
              </p>
            <div style={{ display: 'grid', gap: '15px' }}>
              {formData.closureMeetings.map((meeting, index) => (
                <div  key={index}   className="msub-row"
                  style={{ isplay: "grid",  gridTemplateColumns: "170px 140px 1fr 1fr 40px",
                    gap: "10px",  marginBottom: "10px", }}>
                  <select   value={meeting.type}
                    onChange={(e) => handleClosureMeetingChange(index, "type", e.target.value)} >
                    <option value="Closure TEC">Closure TEC</option>
                    <option value="Closure RAB">Closure RAB</option>
                    <option value="Closure GC">Closure GC</option>
                  </select>

                  <input  type="date" value={meeting.date}
                    onChange={(e) =>  handleClosureMeetingChange(index, "date", e.target.value) } />

                  <input   type="text"   placeholder="Local file path to minutes"
                    value={meeting.minutes}
                    onChange={(e) => handleClosureMeetingChange(index, "minutes", e.target.value) } />

                  <input   type="text"   placeholder="Remarks"   value={meeting.remarks}
                    onChange={(e) =>  handleClosureMeetingChange(index, "remarks", e.target.value) } />

                  <button type="button"   className="icon-btn"  onClick={() => removeClosureMeeting(index)}>   ✕</button>
                </div>
              ))}

              <button type="button" className="btn btn-ghost btn-sm"
                onClick={addClosureMeetingRow} >  + Add Closure Committee Meeting </button>

              <div className="small muted"
                style={{  margin: "14px 0 8px",  borderTop: "1px solid #ddd",  paddingTop: "12px", }} >
                Closure milestones </div>

              <div className="form-grid">
                <div className="field">
                  <label>Technical Closure Date</label>
                  <input type="date"   name="techCloseDate" value={formData.techCloseDate}  onChange={handleChange} />
                </div>

                <div className="field span2">
                  <label>Technical Closure Remarks</label>
                  <input name="techCloseRemarks" value={formData.techCloseRemarks} onChange={handleChange} />
                </div>

                <div className="field">
                  <label>Financial Closure Date</label>
                  <input  type="date" name="finCloseDate" value={formData.finCloseDate}  onChange={handleChange} />
                </div>

                <div className="field span2">
                  <label>Financial Closure Remarks</label>
                  <input name="finCloseRemarks" value={formData.finCloseRemarks}  onChange={handleChange} />
                </div>

                <div className="field">
                  <label>Administrative Closure Date</label>
                  <input type="date"   name="admCloseDate"  value={formData.admCloseDate}  onChange={handleChange} />
                </div>

                <div className="field span2">
                  <label>Administrative Closure Remarks</label>
                  <input  name="admCloseRemarks"   value={formData.admCloseRemarks}  onChange={handleChange} />
                </div>
              </div>

              <div className="small muted"
                style={{ margin: "14px 0 8px", borderTop: "1px solid #ddd",  paddingTop: "12px", }} >
                Lab Recommendation </div>

              <div className="form-grid">
                <div className="field">
                  <label>Lab Recommendation Received</label>
                  <select    name="labRecReceived"  value={formData.labRecReceived}    onChange={handleChange} >
                    <option value="">— Not specified —</option>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </select>
                </div>

                {formData.labRecReceived === "Yes" && (
                  <div className="field span2">
                    <label>Comments of the Lab</label>
                    <input  name="labRecComments"  value={formData.labRecComments}  onChange={handleChange}
                      placeholder="Lab's recommendation comments" />
                  </div>
                )}

                {formData.labRecReceived === "No" && (
                  <div className="field span2">
                    <label>Reason for Not Getting</label>
                    <input    name="labRecReason" value={formData.labRecReason}    onChange={handleChange}
                      placeholder="Reason recommendation was not received" />
                  </div>
                )}

              </div>

              <div className="small muted"
                style={{  margin: "14px 0 8px",  borderTop: "1px solid #ddd", paddingTop: "12px", }} >
                Technology readiness at closure
              </div>

              <div className="form-grid">
                <div className="field">
                  <label>Final TRL Level</label>
                  <select   name="finalTRL"  value={formData.finalTRL}  onChange={handleChange} >
                    <option value="">— Not specified —</option>
                    <option value="TRL 1">TRL 1 — Basic principles observed</option>
                    <option value="TRL 2">TRL 2 — Technology concept formulated</option>
                    <option value="TRL 3">TRL 3 — Experimental proof of concept</option>
                    <option value="TRL 4">TRL 4 — Validated in lab</option>
                    <option value="TRL 5">TRL 5 — Validated in relevant environment</option>
                    <option value="TRL 6">TRL 6 — Demonstrated in relevant environment</option>
                    <option value="TRL 7">TRL 7 — Demonstrated in operational environment</option>
                    <option value="TRL 8">TRL 8 — System complete and qualified</option>
                    <option value="TRL 9">TRL 9 — Actual system proven in operation</option>
                  </select>

                </div>

              </div>              
              
            </div>
          </div>
        )}

        {/* 11. Next Milestone (for dashboard reminders) */}
        {activeTab === 'next_milestone' && (
          <div className="form-section">
            <h3>11. Next Milestone (Dashboard Reminder)</h3>
            <p style={{ color: '#666' }}>This upcoming milestone will automatically reflect on your main dashboard calendar and reminder list.</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px' }}>

             
             
                <div>
                  <label>Type</label>
                  <select style={{width:"100%"}}  name="nextMilestoneType" value={formData.nextMilestoneType}
                    onChange={handleChange}>
                    <option value="">—</option>
                    <option value="Pre-TEC">Pre-TEC</option>
                    <option value="TEC">TEC</option>
                    <option value="RAB">RAB</option>
                    <option value="GC">GC</option>
                    <option value="Fund Release">Fund Release</option>
                    <option value="Technical Closure">Technical Closure</option>
                    <option value="Financial Closure">Financial Closure</option>
                    <option value="Administrative Closure">
                      Administrative Closure
                    </option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label>Date</label>
                  <input
                    type="date"
                    name="nextMilestoneDate"
                    value={formData.nextMilestoneDate}
                    onChange={handleChange}
                    style={{width:"100%"}}
                  />
                </div>

                <div>
                  <label>Description</label>
                  <input
                  style={{width:"100%"}}
                    type="text"
                    name="nextMilestoneDescription"
                    value={formData.nextMilestoneDescription}
                    onChange={handleChange}
                    placeholder="Short note"
                  />
                </div>
             
            </div>
          </div>
        )}

        {/* 12. General Remarks */}
        {activeTab === 'remarks' && (
          <div className="form-section">
            <h3>12. General Remarks</h3>
            <div>
              <label>Additional Notes / Remarks</label>
              <textarea name="remarks" rows="5" value={formData.remarks} onChange={handleChange} placeholder="Any other project observations..." style={{ width: '100%', padding: '8px' }} />
            </div>
          </div>
        )}

        {/* Form Bottom Step Navigation */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '30px', paddingTop: '15px', borderTop: '1px solid #eee' }}>
          <button
            type="button"
            className="btn btn-secondary"
            disabled={FORM_SECTIONS.findIndex((s) => s.id === activeTab) === 0}
            onClick={() => {
              const currentIdx = FORM_SECTIONS.findIndex((s) => s.id === activeTab);
              setActiveTab(FORM_SECTIONS[currentIdx - 1].id);
            }}
          >
            ← Previous Section
          </button>

          {FORM_SECTIONS.findIndex((s) => s.id === activeTab) < FORM_SECTIONS.length - 1 ? (
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => {
                const currentIdx = FORM_SECTIONS.findIndex((s) => s.id === activeTab);
                setActiveTab(FORM_SECTIONS[currentIdx + 1].id);
              }}
            >
              Next Section →
            </button>
          ) : (
            <button type="submit" className="btn btn-success" disabled={saving}>
              {saving ? 'Saving Project...' : '💾 Finalize & Save Project'}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}