import { useMemo, useRef, useState } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import "./Reports.css";

const REPORT_SECTIONS = [
  { id: "identity", label: "Project Identity" },
  { id: "preSanction", label: "Pre-Sanction Meetings & Clarifications" },
  { id: "sanction", label: "Sanction & Finance" },
  { id: "deliverables", label: "Deliverables & Milestones (after sanction)" },
  { id: "budget", label: "Budget Details" },
  { id: "postSanction", label: "Post Sanction Requirements" },
  { id: "manpower", label: "Manpower Allocation" },
  { id: "extensions", label: "Extensions & Revisions" },
  { id: "outcomes", label: "Outcomes & Dissemination" },
  { id: "closure", label: "Project Closure" },
  { id: "milestone", label: "Next Milestone" },
  { id: "remarks", label: "General Remarks" },
];

const FIELD_GROUPS = {
  identity: [
    ["Project Code", "code"],
    ["Project Title", "title"],
    ["Project Duration", "projectDuration"],
    ["Principal Investigator", "piName"],
    ["PI Institute", "piInstituteName"],
    ["Co-Principal Investigator", "coPiName"],
    ["Co-PI Institute", "coPiInstitute"],
    ["Stakeholding DRDO Labs", "stakeholdingDrdoLabs"],
    ["Stakeholding Scientist", "stakeholdingScientist"],
    ["Project Status", "projectStatus"],
  ],
  sanction: [
    ["Sanction Date", "sanctionDate"],
    ["Sanctioned Amount", "sanctionedAmount"],
    ["Sanction Letter", "sanctionLetter"],
    ["Project Start Date", "projectStartDate"],
    ["Equipment List", "equipmentList"],
    ["Initial TRL Level", "initialTrlLevel"],
  ],
  outcomes: [
    ["Technologies Developed", "technologiesDeveloped"],
    ["Patents Granted", "patentsGiven"],
    ["Patents Submitted", "patentsSubmitted"],
    ["Number of Publications", "numPublications"],
    ["Publications List", "listPublications"],
    ["Breakthrough Technology", "breakthroughTech"],
    ["EOI Date", "eoiDate"],
    ["EOI Details", "eoiDetails"],
    ["Industries Involved", "industriesInvolved"],
    ["Dissemination Date", "disseminationDate"],
    ["Dissemination Participants", "disseminationParticipants"],
    ["Workshop Conducted", "workshopConducted"],
    ["Workshop Details", "workshopDetails"],
  ],
  milestone: [
    ["Next Milestone Type", "nextMilestoneType"],
    ["Next Milestone Date", "nextMilestoneDate"],
    ["Next Milestone Description", "nextMilestoneDescription"],
  ],
  remarks: [["General Remarks", "remarks"]],
};

const ARRAY_GROUPS = {
  preSanction: {
    title: "Pre-Sanction Meetings & Clarifications",
    key: "preSanctionMeetings",
    columns: [
      ["Meeting Type", "type"],
      ["Date", "date"],
      ["Minutes", "minutes"],
      ["Remarks", "remarks"],
    ],
  },
  deliverables: {
    title: "Deliverables & Milestones",
    key: "deliverables",
    columns: [
      ["Description", "description"],
      ["Target Date", "targetDate"],
      ["Status", "status"],
      ["Remarks", "remarks"],
    ],
  },
  budget: {
    title: "Budget Details",
    key: "budgetRows",
    columns: [
      ["Budget Head", "head"],
      ["Institute", "institute"],
      ["Year-wise Amounts", "years"],
      ["Total", "total"],
    ],
  },
  postSanction: {
    title: "Post Sanction Requirements",
    key: "postSanctionMeetings",
    columns: [
      ["Meeting Type", "type"],
      ["Date", "date"],
      ["Minutes", "minutes"],
      ["Remarks", "remarks"],
    ],
  },
  manpower: {
    title: "Manpower Allocation",
    key: "manpower",
    columns: [
      ["Category", "category"],
      ["Name", "name"],
      ["Designation", "designation"],
      ["Specialisation", "specialisation"],
    ],
  },
  extensions: {
    title: "Extensions",
    key: "pdcExtensions",
    columns: [
      ["Date", "date"],
      ["Period", "period"],
      ["Revised PDC", "revisedPDC"],
      ["Remarks", "remarks"],
    ],
    extra: [
      ["Revised Sanction Date", "date"],
      ["Revised Sanction Amount", "amount"],
      ["Revised Sanction Letter", "letter"],
    ],
    extraKey: "revisedSanctions",
  },
  closure: {
    title: "Project Closure",
    key: "closureMeetings",
    columns: [
      ["Meeting Type", "type"],
      ["Date", "date"],
      ["Minutes", "minutes"],
      ["Remarks", "remarks"],
    ],
    fields: [
      ["Technical Closure Date", "techCloseDate"],
      ["Technical Closure Remarks", "techCloseRemarks"],
      ["Financial Closure Date", "finCloseDate"],
      ["Financial Closure Remarks", "finCloseRemarks"],
      ["Administrative Closure Date", "admCloseDate"],
      ["Administrative Closure Remarks", "admCloseRemarks"],
      ["Lab Recommendation Received", "labRecReceived"],
      ["Lab Recommendation Comments", "labRecComments"],
      ["Lab Recommendation Reason", "labRecReason"],
      ["Final TRL", "finalTRL"],
    ],
  },
};

function displayValue(value) {
  if (value === null || value === undefined || value === "") return "—";
  if (typeof value === "boolean") return value ? "Yes" : "No";
  if (Array.isArray(value)) {
    if (!value.length) return "—";
    return value.map((item) => (
      item && typeof item === "object"
        ? Object.entries(item).map(([key, val]) => `${key}: ${displayValue(val)}`).join("; ")
        : displayValue(item)
    )).join(", ");
  }
  if (typeof value === "object") {
    return Object.entries(value)
      .map(([key, val]) => `${key}: ${displayValue(val)}`)
      .join("; ");
  }
  return String(value);
}

function getVerticalId(project) {
  const value = project?.verticalId ?? project?.vertical;
  if (value && typeof value === "object") {
    return value._id ?? value.id ?? "";
  }
  return value ?? "";
}

function getVerticalName(verticals, id) {
  const vertical = verticals.find((item) => {
    const itemId = typeof item === "string" ? item : item?._id ?? item?.id;
    return String(itemId ?? item) === String(id);
  });
  if (!vertical) return "Selected Vertical";
  return typeof vertical === "string"
    ? vertical
    : vertical.name || "Unnamed Vertical";
}

function ValueTable({ rows }) {
  return (
    <table className="report-preview-table">
      <tbody>
        {rows.map(([label, value]) => (
          <tr key={label}>
            <th>{label}</th>
            <td>{displayValue(value)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function ArrayTable({ items, columns }) {
  const safeItems = Array.isArray(items) ? items : [];
  if (!safeItems.length) {
    return <p className="report-empty-value">No records added.</p>;
  }

  return (
    <div className="report-table-scroll">
      <table className="report-preview-table report-data-table">
        <thead>
          <tr>{columns.map(([label]) => <th key={label}>{label}</th>)}</tr>
        </thead>
        <tbody>
          {safeItems.map((item, index) => (
            <tr key={item?._id || item?.id || index}>
              {columns.map(([label, key]) => (
                <td key={key}>{displayValue(item?.[key])}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function Reports({ projects = [], verticals = [] }) {
  const [selectedVertical, setSelectedVertical] = useState("");
  const [selectedSections, setSelectedSections] = useState([]);
  const [showPreview, setShowPreview] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false);
  const reportRef = useRef(null);

  const safeProjects = useMemo(() => {
    if (Array.isArray(projects)) return projects;
    if (Array.isArray(projects?.projects)) return projects.projects;
    if (Array.isArray(projects?.data)) return projects.data;
    return [];
  }, [projects]);

  const safeVerticals = useMemo(
    () => Array.isArray(verticals) ? verticals : [],
    [verticals]
  );

  const allSelected = selectedSections.length === REPORT_SECTIONS.length;

  const matchingProjects = useMemo(() => {
    if (!selectedVertical) return [];
    return safeProjects.filter(
      (project) => String(getVerticalId(project)) === String(selectedVertical)
    );
  }, [safeProjects, selectedVertical]);

  const toggleSection = (id) => {
    setSelectedSections((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id]
    );
  };

  const toggleAllSections = () => {
    setSelectedSections(allSelected ? [] : REPORT_SECTIONS.map((item) => item.id));
  };

  const handleGenerate = () => {
    if (!selectedVertical) {
      window.alert("Please select a vertical.");
      return;
    }
    if (!selectedSections.length) {
      window.alert("Please select at least one project form section.");
      return;
    }
    setShowPreview(true);
  };

  const downloadPdf = async () => {
    if (!reportRef.current) return;
    setPdfLoading(true);
    try {
      const canvas = await html2canvas(reportRef.current, {
        scale: 2,
        backgroundColor: "#ffffff",
        useCORS: true,
        windowWidth: reportRef.current.scrollWidth,
      });

      const pdf = new jsPDF("p", "mm", "a4");
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const image = canvas.toDataURL("image/png");
      const imageHeight = (canvas.height * pageWidth) / canvas.width;
      let heightLeft = imageHeight;
      let position = 0;

      pdf.addImage(image, "PNG", 0, position, pageWidth, imageHeight);
      heightLeft -= pageHeight;

      while (heightLeft > 0) {
        position = heightLeft - imageHeight;
        pdf.addPage();
        pdf.addImage(image, "PNG", 0, position, pageWidth, imageHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`project-report-${new Date().toISOString().slice(0, 10)}.pdf`);
    } catch (error) {
      console.error("Failed to generate PDF:", error);
      window.alert("Could not generate the PDF. Please try again.");
    } finally {
      setPdfLoading(false);
    }
  };

  const printReport = () => {
    if (!reportRef.current) return;
    const printWindow = window.open("", "_blank", "width=1000,height=800");
    if (!printWindow) {
      window.alert("Please allow pop-ups in your browser to print the report.");
      return;
    }

    const styles = Array.from(document.querySelectorAll("style, link[rel='stylesheet']"))
      .map((node) => node.outerHTML)
      .join("\n");

    printWindow.document.open();
    printWindow.document.write(`
      <!doctype html>
      <html>
        <head>
          <title>Project Report</title>
          ${styles}
          <style>
            body { background: white !important; color: #172033 !important; padding: 24px; font-family: Arial, sans-serif; }
            .report-preview-content { max-width: none !important; padding: 0 !important; overflow: visible !important; }
            .report-preview-table { width: 100%; border-collapse: collapse; }
            .report-preview-table th, .report-preview-table td { border: 1px solid #d7dce5; padding: 8px; text-align: left; vertical-align: top; overflow-wrap: anywhere; }
            .report-preview-table th { background: #f1f5f9; }
            .report-section { break-inside: avoid; }
            .report-table-scroll { overflow: visible !important; }
            @page { size: A4; margin: 14mm; }
          </style>
        </head>
        <body>${reportRef.current.innerHTML}</body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.onload = () => {
      printWindow.print();
      printWindow.close();
    };
  };

  const verticalName = getVerticalName(safeVerticals, selectedVertical);

  return (
    <div className="reports-page">
      <div className="reports-page-heading">
        <div>
          <span className="reports-eyebrow">PROJECT MONITORING</span>
          <h1>Report Generator</h1>
          <p>Select a vertical and the sections you want to include in your report.</p>
        </div>
      </div>

      <section className="reports-card">
        <div className="reports-step-heading">
          <span className="reports-step-number">1</span>
          <div>
            <h2>Select Vertical</h2>
            <p>Choose the project vertical for this report.</p>
          </div>
        </div>

        <label className="reports-label" htmlFor="report-vertical">Vertical</label>
        <select
          id="report-vertical"
          className="reports-select"
          value={selectedVertical}
          onChange={(event) => setSelectedVertical(event.target.value)}
        >
          <option value="">Select a vertical</option>
          {safeVerticals.map((vertical) => {
            const id = typeof vertical === "string" ? vertical : vertical?._id ?? vertical?.id;
            const name = typeof vertical === "string" ? vertical : vertical?.name ?? "Unnamed Vertical";
            if (id === undefined || id === null || id === "") return null;
            return <option key={id} value={String(id)}>{name}</option>;
          })}
        </select>
        {selectedVertical && (
          <p className="reports-hint">
            {matchingProjects.length} project{matchingProjects.length === 1 ? "" : "s"} found in {verticalName}.
          </p>
        )}
      </section>

      <section className="reports-card">
        <div className="reports-sections-header">
          <div className="reports-step-heading">
            <span className="reports-step-number">2</span>
            <div>
              <h2>Project Form Sections</h2>
              <p>Choose which sections should appear in the report preview.</p>
            </div>
          </div>
          <button className="reports-button reports-button-secondary" type="button" onClick={toggleAllSections}>
            {allSelected ? "Deselect All" : "Select All"}
          </button>
        </div>

        <div className="reports-section-grid">
          {REPORT_SECTIONS.map((section, index) => {
            const checked = selectedSections.includes(section.id);
            return (
              <label className={`reports-section-option ${checked ? "is-selected" : ""}`} key={section.id}>
                <input type="checkbox" checked={checked} onChange={() => toggleSection(section.id)} />
                <span className="reports-checkbox-custom" aria-hidden="true">{checked ? "✓" : ""}</span>
                <span className="reports-section-index">{String(index + 1).padStart(2, "0")}</span>
                <span className="reports-section-label">{section.label}</span>
              </label>
            );
          })}
        </div>
        <div className="reports-selection-summary">
          <span>{selectedSections.length} of {REPORT_SECTIONS.length} sections selected</span>
          <div className="reports-progress-track">
            <span style={{ width: `${(selectedSections.length / REPORT_SECTIONS.length) * 100}%` }} />
          </div>
        </div>
      </section>

      <section className="reports-generate-card">
        <div className="reports-step-heading">
          <span className="reports-step-number">3</span>
          <div>
            <h2>Generate Report</h2>
            <p>Preview your selected sections, then download or print the report.</p>
          </div>
        </div>
        <button className="reports-button reports-button-primary" type="button" onClick={handleGenerate}>
          <span aria-hidden="true">▤</span> Generate Report
        </button>
      </section>

      {showPreview && (
        <div className="reports-modal-backdrop" role="presentation" onMouseDown={(event) => {
          if (event.target === event.currentTarget) setShowPreview(false);
        }}>
          <section className="reports-modal" role="dialog" aria-modal="true" aria-labelledby="reports-preview-title">
            <header className="reports-modal-header">
              <div>
                <span className="reports-eyebrow">REPORT PREVIEW</span>
                <h2 id="reports-preview-title">{verticalName}</h2>
                <p>{matchingProjects.length} matching project{matchingProjects.length === 1 ? "" : "s"} · {selectedSections.length} selected sections</p>
              </div>
              <button className="reports-close-button" type="button" onClick={() => setShowPreview(false)} aria-label="Close preview">×</button>
            </header>

            <div className="reports-preview-scroll">
              <div className="report-preview-content" ref={reportRef}>
                <div className="report-document-heading">
                  <div className="report-document-mark">PM</div>
                  <div>
                    <p className="report-document-kicker">PROJECT MONITORING SYSTEM</p>
                    <h1>Project Report</h1>
                    <p>Vertical: <strong>{verticalName}</strong></p>
                    <p>Generated on: {new Date().toLocaleDateString()}</p>
                  </div>
                </div>

                {matchingProjects.length === 0 ? (
                  <div className="report-no-projects">
                    <strong>No projects found for this vertical.</strong>
                    <p>Choose another vertical or check that projects have a matching verticalId.</p>
                  </div>
                ) : matchingProjects.map((project, projectIndex) => (
                  <article className="report-project" key={project._id || project.id || projectIndex}>
                    <div className="report-project-heading">
                      <span>PROJECT {String(projectIndex + 1).padStart(2, "0")}</span>
                      <h2>{displayValue(project.title || project.projectTitle || project.name)}</h2>
                      <p>Project Code: {displayValue(project.code)}</p>
                    </div>

                    {selectedSections.map((sectionId) => {
                      const section = REPORT_SECTIONS.find((item) => item.id === sectionId);
                      if (!section) return null;

                      if (FIELD_GROUPS[sectionId]) {
                        return (
                          <section className="report-section" key={sectionId}>
                            <h3>{section.label}</h3>
                            <ValueTable rows={FIELD_GROUPS[sectionId].map(([label, key]) => [label, project[key]])} />
                          </section>
                        );
                      }

                      const config = ARRAY_GROUPS[sectionId];
                      if (!config) return null;

                      return (
                        <section className="report-section" key={sectionId}>
                          <h3>{section.label}</h3>
                          {config.fields && (
                            <ValueTable rows={config.fields.map(([label, key]) => [label, project[key]])} />
                          )}
                          <ArrayTable items={project[config.key]} columns={config.columns} />
                          {config.extraKey && (
                            <>
                              <h4 className="report-subsection-heading">Revised Sanctions</h4>
                              <ArrayTable items={project[config.extraKey]} columns={[
                                ["Date", "date"],
                                ["Amount", "amount"],
                                ["Letter", "letter"],
                              ]} />
                            </>
                          )}
                        </section>
                      );
                    })}
                  </article>
                ))}
              </div>
            </div>

            <footer className="reports-modal-footer">
              <button className="reports-button reports-button-secondary" type="button" onClick={() => setShowPreview(false)}>Close</button>
              <div className="reports-modal-actions">
                <button className="reports-button reports-button-secondary" type="button" onClick={printReport}>Print</button>
                <button className="reports-button reports-button-primary" type="button" onClick={downloadPdf} disabled={pdfLoading}>
                  {pdfLoading ? "Preparing PDF…" : "↓ Download PDF"}
                </button>
              </div>
            </footer>
          </section>
        </div>
      )}
    </div>
  );
}
