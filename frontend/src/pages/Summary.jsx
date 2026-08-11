import { useState, useEffect } from "react";

import {
  ArrowLeft,
  Sparkles,
  Target,
  Settings,
  Lightbulb,
  CheckCircle,
  Loader2,
} from "lucide-react";

import {
  Link,
  useParams,
} from "react-router-dom";

import {
  generateSummary,
  getSummary,
} from "../services/ai.service";

const Summary = () => {

  const { paperId } = useParams();

  const [summary, setSummary] =
    useState(null);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  // Fetch existing summary on load
  useEffect(() => {
    const fetchSummary = async () => {
      if (!paperId) return;

      try {
        const result = await getSummary(paperId);

        if (result && result.success) {
          setSummary(result.data);
        }
      } catch (err) {
        console.error("Error fetching summary:", err);
        // Silently fail - summary might not exist yet
      }
    };

    fetchSummary();
  }, [paperId]);

  const handleGenerate = async () => {

    console.log(
      "BUTTON CLICKED"
    );

    console.log(
      "PAPER ID:",
      paperId
    );

    if (!paperId) {

      setError(
        "Paper ID not found."
      );

      return;
    }

    try {

      setLoading(true);

      setError("");

      const result =
        await generateSummary(
          paperId
        );

      console.log(
        "RESULT:",
        result
      );

      if (
        result &&
        result.success
      ) {

        setSummary(
          result.data
        );

      } else {

        setError(
          result?.message ||
            "Summary generation failed."
        );
      }

    } catch (err) {

      console.error(
        "SUMMARY ERROR:",
        err
      );

      console.error(
        "SERVER RESPONSE:",
        err.response?.data
      );

      setError(
        err.response?.data?.message ||
          "Unable to generate summary."
      );

    } finally {

      setLoading(false);

    }
  };

  return (

    <section className="dashboard-content">

          <Link
            to={`/papers/${paperId}`}
            className="back-link"
          >

            <ArrowLeft size={17} />

            Back to Paper

          </Link>


          {/* PAGE HEADER */}

          <div className="page-heading">

            <div>

              <h2>
                AI Research Summary
              </h2>

              <p>
                Generate an AI-powered
                summary of your research
                paper.
              </p>

            </div>

            <div className="ai-badge">

              <Sparkles size={16} />

              SciNova AI

            </div>

          </div>


          {/* ERROR */}

          {error && (

            <div
              style={{
                padding: "15px",
                marginBottom: "20px",
                background: "#fff1f1",
                color: "#d32f2f",
                borderRadius: "8px",
              }}
            >

              {error}

            </div>

          )}


          {/* BEFORE GENERATION */}

          {!summary && (

            <div className="generate-card">

              <div className="generate-icon">

                <Sparkles
                  size={32}
                />

              </div>


              <h2>
                Generate AI Summary
              </h2>


              <p>

                SciNova AI will analyze
                your research paper and
                generate objective,
                methodology, findings
                and conclusion.

              </p>


              <button
                type="button"
                className="primary-button generate-button"
                onClick={handleGenerate}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2
                      size={18}
                      className="spinner"
                    />
                      Analyzing Paper...
                  </>
                ) : (
                  <>
                  <Sparkles size={18} />

                    Generate Summary
                  </>
                )}
              </button>

            </div>

          )}


          {/* SUMMARY RESULT */}

          {summary && (

            <div className="summary-container">


              {/* OBJECTIVE */}

              <div className="summary-card">

                <div className="summary-card-header">

                  <div className="summary-icon">

                    <Target size={21} />

                  </div>

                  <h3>
                    Research Objective
                  </h3>

                </div>

                <p>

                  {summary.objective ||
                    "No objective available."}

                </p>

              </div>


              {/* METHODOLOGY */}

              <div className="summary-card">

                <div className="summary-card-header">

                  <div className="summary-icon">

                    <Settings size={21} />

                  </div>

                  <h3>
                    Methodology
                  </h3>

                </div>

                <p>

                  {summary.methodology ||
                    "No methodology available."}

                </p>

              </div>


              {/* KEY FINDINGS */}

              <div className="summary-card">

                <div className="summary-card-header">

                  <div className="summary-icon">

                    <Lightbulb size={21} />

                  </div>

                  <h3>
                    Key Findings
                  </h3>

                </div>


                {Array.isArray(
                  summary.keyFindings
                ) &&
                summary.keyFindings.length >
                  0 ? (

                  <ul className="findings-list">

                    {summary.keyFindings.map(
                      (finding, index) => (

                        <li
                          key={index}
                        >

                          <CheckCircle
                            size={17}
                          />

                          <span>
                            {finding}
                          </span>

                        </li>

                      )
                    )}

                  </ul>

                ) : (

                  <p>
                    No key findings
                    generated.
                  </p>

                )}

              </div>


              {/* FUTURE DIRECTIONS */}

              <div className="summary-card">

                <div className="summary-card-header">

                  <div className="summary-icon">

                    <Lightbulb size={21} />

                  </div>

                  <h3>
                    Future Directions
                  </h3>

                </div>


                {Array.isArray(
                  summary.futureDirections
                ) &&
                summary.futureDirections.length >
                  0 ? (

                  <ul className="findings-list">

                    {summary.futureDirections.map(
                      (item, index) => (

                        <li
                          key={index}
                        >

                          <CheckCircle
                            size={17}
                          />

                          <span>
                            {item}
                          </span>

                        </li>

                      )
                    )}

                  </ul>

                ) : (

                  <p>
                    No future directions
                    generated.
                  </p>

                )}

              </div>


              {/* CONCLUSION */}

              <div className="summary-card">

                <div className="summary-card-header">

                  <div className="summary-icon">

                    <CheckCircle
                      size={21}
                    />

                  </div>

                  <h3>
                    Conclusion
                  </h3>

                </div>

                <p>

                  {summary.conclusion ||
                    "No conclusion available."}

                </p>

              </div>


              <div className="generated-by">

                Generated by{" "}

                <strong>
                  {summary.generatedBy ||
                    "SciNova AI"}
                </strong>

              </div>

            </div>

          )}

        </section>

  );
};

export default Summary;
