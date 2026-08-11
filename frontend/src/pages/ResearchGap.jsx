import { useState, useEffect } from "react";

import {
  ArrowLeft,
  Sparkles,
  AlertCircle,
  Lightbulb,
  Target,
  CheckCircle,
  Loader2,
  TrendingUp,
} from "lucide-react";

import {
  Link,
  useParams,
} from "react-router-dom";

import {
  generateResearchGap,
  getResearchGap,
} from "../services/researchGap.service";

const ResearchGap = () => {
  const { paperId } = useParams();

  const [researchGap, setResearchGap] =
    useState(null);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  // Fetch existing research gap on load
  useEffect(() => {
    const fetchResearchGap = async () => {
      if (!paperId) return;

      try {
        const result = await getResearchGap(paperId);

        if (result && result.success) {
          setResearchGap(result.data);
        }
      } catch (err) {
        console.error("Error fetching research gap:", err);
        // Silently fail - research gap might not exist yet
      }
    };

    fetchResearchGap();
  }, [paperId]);

  const handleGenerate = async () => {
    console.log("RESEARCH GAP BUTTON CLICKED");

    console.log("PAPER ID:", paperId);

    if (!paperId) {
      setError("Paper ID not found.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const result =
        await generateResearchGap(paperId);

      console.log(
        "RESEARCH GAP RESULT:",
        result
      );

      if (
        result &&
        result.success
      ) {
        setResearchGap(result.data);
      } else {
        setError(
          result?.message ||
            "Research gap generation failed."
        );
      }

    } catch (err) {
      console.error(
        "RESEARCH GAP ERROR:",
        err
      );

      console.error(
        "SERVER RESPONSE:",
        err.response?.data
      );

      setError(
        err.response?.data?.message ||
          "Unable to generate research gap."
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="dashboard-content">

          {/* BACK */}

          <Link
            to={`/papers/${paperId}`}
            className="back-link"
          >
            <ArrowLeft size={17} />

            Back to Paper
          </Link>


          {/* HEADER */}

          <div className="page-heading">

            <div>

              <h2>
                Research Gap Analysis
              </h2>

              <p>
                Identify limitations,
                unexplored areas and
                future research opportunities.
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


          {/* GENERATE */}

          {!researchGap && (

            <div className="generate-card">

              <div className="generate-icon">

                <TrendingUp
                  size={32}
                />

              </div>

              <h2>
                Generate Research Gap
              </h2>

              <p>
                SciNova AI will analyze
                the research paper and
                identify research gaps,
                limitations, opportunities
                and possible future work.
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

                    Analyzing Research...

                  </>

                ) : (

                  <>
                    <Sparkles
                      size={18}
                    />

                    Generate Research Gap

                  </>

                )}

              </button>

            </div>

          )}


          {/* RESULT */}

          {researchGap && (

            <div className="summary-container">


              {/* MAIN RESEARCH GAP */}

              <div className="summary-card">

                <div className="summary-card-header">

                  <div className="summary-icon">

                    <AlertCircle
                      size={21}
                    />

                  </div>

                  <h3>
                    Identified Research Gap
                  </h3>

                </div>

                <p>
                  {researchGap.gap ||
                    "No research gap available."}
                </p>

              </div>


              {/* LIMITATIONS */}

              <div className="summary-card">

                <div className="summary-card-header">

                  <div className="summary-icon">

                    <Target
                      size={21}
                    />

                  </div>

                  <h3>
                    Research Limitations
                  </h3>

                </div>


                {Array.isArray(
                  researchGap.limitations
                ) &&
                researchGap.limitations.length >
                  0 ? (

                  <ul className="findings-list">

                    {researchGap.limitations.map(
                      (item, index) => (

                        <li key={index}>

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
                    No limitations identified.
                  </p>

                )}

              </div>


              {/* OPPORTUNITIES */}

              <div className="summary-card">

                <div className="summary-card-header">

                  <div className="summary-icon">

                    <Lightbulb
                      size={21}
                    />

                  </div>

                  <h3>
                    Research Opportunities
                  </h3>

                </div>


                {Array.isArray(
                  researchGap.opportunities
                ) &&
                researchGap.opportunities.length >
                  0 ? (

                  <ul className="findings-list">

                    {researchGap.opportunities.map(
                      (item, index) => (

                        <li key={index}>

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
                    No opportunities identified.
                  </p>

                )}

              </div>


              {/* FUTURE WORK */}

              <div className="summary-card">

                <div className="summary-card-header">

                  <div className="summary-icon">

                    <TrendingUp
                      size={21}
                    />

                  </div>

                  <h3>
                    Suggested Future Work
                  </h3>

                </div>


                {Array.isArray(
                  researchGap.futureWork
                ) &&
                researchGap.futureWork.length >
                  0 ? (

                  <ul className="findings-list">

                    {researchGap.futureWork.map(
                      (item, index) => (

                        <li key={index}>

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
                    No future work suggestions.
                  </p>

                )}

              </div>


              {/* GENERATED BY */}

              <div className="generated-by">

                Generated by{" "}

                <strong>
                  {researchGap.generatedBy ||
                    "SciNova AI"}
                </strong>

              </div>

            </div>

          )}

        </section>

  );
};

export default ResearchGap;
