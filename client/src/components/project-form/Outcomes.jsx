import React from "react";

const Outcomes = ({
  formData,
  handleChange,
}) => {
  return (
    <div className="form-section">

      <h3>9. Outcomes & Dissemination</h3>

      <div>

        <div className="form-grid">

          {/* =================================
              TECHNOLOGIES DEVELOPED
          ================================= */}

          <div className="field span3">

            <label>
              Technologies Developed Under the Project
            </label>

            <textarea
              name="technologiesDeveloped"
              value={
                formData.technologiesDeveloped || ""
              }
              onChange={handleChange}
              placeholder={`One per line, e.g. Low-cost membrane fabrication process
Predictive maintenance ML model`}
            />

          </div>

          {/* =================================
              PATENTS GIVEN
          ================================= */}

          <div className="field">

            <label>
              Patents Given
            </label>

            <textarea
              name="patentsGiven"
              value={formData.patentsGiven || ""}
              onChange={handleChange}
              placeholder={`One per line, e.g. IN202441012345 — granted 2025`}
            />

          </div>

          {/* =================================
              PATENTS SUBMITTED
          ================================= */}

          <div className="field">

            <label>
              Patents Submitted
            </label>

            <textarea
              name="patentsSubmitted"
              value={
                formData.patentsSubmitted || ""
              }
              onChange={handleChange}
              placeholder={`One per line, e.g. Application filed Mar 2026`}
            />

          </div>

          {/* =================================
              NUMBER OF PUBLICATIONS
          ================================= */}

          <div className="field">

            <label>
              Number of Publications
            </label>

            <input
              type="number"
              name="numPublications"
              value={
                formData.numPublications || ""
              }
              onChange={handleChange}
              placeholder="e.g. 6"
            />

          </div>

          {/* =================================
              LIST OF PUBLICATIONS
          ================================= */}

          <div className="field span3">

            <label>
              List of Publications
            </label>

            <textarea
              name="listPublications"
              value={
                formData.listPublications || ""
              }
              onChange={handleChange}
              placeholder={`One per line, e.g. Sharma et al., 'Title', Journal Name, 2025`}
            />

          </div>

          {/* =================================
              BREAKTHROUGH TECHNOLOGY
          ================================= */}

          <div className="field span3">

            <label>
              Any Breakthrough Technology Developed
            </label>

            <textarea
              name="breakthroughTech"
              value={
                formData.breakthroughTech || ""
              }
              onChange={handleChange}
              placeholder="Describe any breakthrough technology arising from the project"
            />

          </div>

          {/* =================================
              EOI ISSUED DATE
          ================================= */}

          <div className="field">

            <label>
              EOI Issued Date{" "}
              <span className="muted">
                (if any)
              </span>
            </label>

            <input
              type="date"
              name="eoiDate"
              value={formData.eoiDate || ""}
              onChange={handleChange}
            />

          </div>

          {/* =================================
              EOI DETAILS
          ================================= */}

          <div className="field span2">

            <label>
              EOI Issued Details
            </label>

            <input
              type="text"
              name="eoiDetails"
              value={formData.eoiDetails || ""}
              onChange={handleChange}
              placeholder="e.g. EOI issued to 5 industry partners for tech transfer"
            />

          </div>

          {/* =================================
              INDUSTRIES INVOLVED
          ================================= */}

          <div className="field span3">

            <label>
              Industries Involved
            </label>

            <input
              type="text"
              name="industriesInvolved"
              value={
                formData.industriesInvolved || ""
              }
              onChange={handleChange}
              placeholder="e.g. Tata Steel, L&T, Reliance Industries"
            />

          </div>

          {/* =================================
              DISSEMINATION DATE
          ================================= */}

          <div className="field">

            <label>
              Date of Dissemination
            </label>

            <input
              type="date"
              name="disseminationDate"
              value={
                formData.disseminationDate || ""
              }
              onChange={handleChange}
            />

          </div>

          {/* =================================
              DISSEMINATION PARTICIPANTS
          ================================= */}

          <div className="field span2">

            <label>
              Details of Dissemination Participants
            </label>

            <textarea
              name="disseminationParticipants"
              value={
                formData.disseminationParticipants || ""
              }
              onChange={handleChange}
              placeholder="Who attended / target audience / numbers"
            />

          </div>

          {/* =================================
              WORKSHOP CONDUCTED
          ================================= */}

          <div className="field">

            <label>
              Workshop Conducted
            </label>

            <select
              name="workshopConducted"
              value={
                formData.workshopConducted || ""
              }
              onChange={handleChange}
            >

              <option value="">
                — Not specified —
              </option>

              <option value="Yes">
                Yes
              </option>

              <option value="No">
                No
              </option>

            </select>

          </div>

          {/* =================================
              WORKSHOP DETAILS
          ================================= */}

          <div className="field span2">

            <label>
              Workshop Details
            </label>

            <input
              type="text"
              name="workshopDetails"
              value={
                formData.workshopDetails || ""
              }
              onChange={handleChange}
              placeholder="e.g. 2-day workshop, 40 participants, Jan 2026"
            />

          </div>

        </div>

      </div>

    </div>
  );
};

export default Outcomes;