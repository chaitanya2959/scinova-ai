import { useEffect, useState } from "react";

import {
  ArrowLeft,
  Sparkles,
  FileText,
  CheckCircle,
  AlertCircle,
  Lightbulb,
  Settings,
  Target,
  Loader2,
  GitCompare,
} from "lucide-react";

import {
  Link,
} from "react-router-dom";


import {
  comparePapers,
} from "../services/comparison.service";

import api from "../services/api";

const ComparePapers = () => {
  const [papers, setPapers] = useState([]);

  const [selectedPapers, setSelectedPapers] =
    useState([]);

  const [comparison, setComparison] =
    useState(null);

  const [loadingPapers, setLoadingPapers] =
    useState(true);

  const [loadingCompare, setLoadingCompare] =
    useState(false);

  const [error, setError] =
    useState("");

  // ============================
  // LOAD PAPERS
  // ============================

  useEffect(() => {
    const loadPapers = async () => {
      try {
        setLoadingPapers(true);
        setError("");

        /*
          Change this endpoint only if
          your existing Papers API uses
          a different URL.
        */

        const response =
          await api.get("/papers");

        console.log(
          "Papers:",
          response.data
        );

        if (response.data?.success) {
          setPapers(
            response.data.data || []
          );
        } else {
          setPapers(
            response.data?.data || []
          );
        }

      } catch (err) {
        console.error(
          "LOAD PAPERS ERROR:",
          err
        );

        setError(
          err.response?.data?.message ||
            "Unable to load papers."
        );

      } finally {
        setLoadingPapers(false);
      }
    };

    loadPapers();
  }, []);

  // ============================
  // SELECT PAPER
  // ============================

  const handleSelectPaper = (paperId) => {
    setError("");

    if (
      selectedPapers.includes(paperId)
    ) {
      setSelectedPapers(
        selectedPapers.filter(
          (id) => id !== paperId
        )
      );

      return;
    }

    if (selectedPapers.length >= 3) {
      setError(
        "You can compare maximum 3 papers."
      );

      return;
    }

    setSelectedPapers([
      ...selectedPapers,
      paperId,
    ]);
  };

  // ============================
  // COMPARE
  // ============================

  const handleCompare = async () => {
    if (selectedPapers.length < 2) {
      setError(
        "Please select at least 2 papers."
      );

      return;
    }

    try {
      setLoadingCompare(true);
      setError("");

      const result =
        await comparePapers(
          selectedPapers
        );

      console.log(
        "COMPARISON RESULT:",
        result
      );

      if (result.success) {
        setComparison(
          result.data
        );
      } else {
        setError(
          result.message ||
            "Comparison failed."
        );
      }

    } catch (err) {
      console.error(
        "COMPARISON ERROR:",
        err
      );

      console.error(
        "SERVER RESPONSE:",
        err.response?.data
      );

      setError(
        err.response?.data?.message ||
          "Unable to compare papers."
      );

    } finally {
      setLoadingCompare(false);
    }
  };

  // ============================
  // RESET
  // ============================

  const handleReset = () => {
    setSelectedPapers([]);
    setComparison(null);
    setError("");
  };

  // ============================
  // GET PAPER NAME
  // ============================

  const getPaperTitle = (paperId) => {
    const paper = papers.find(
      (item) =>
        item._id === paperId
    );

    return (
      paper?.title ||
      paper?.fileName ||
      "Research Paper"
    );
  };

  // ============================
  // RESULT HELPER
  // ============================

  const getComparisonValue = (
    section,
    paperId
  ) => {
    if (!comparison?.[section]) {
      return "No information available.";
    }

    const paperIndex =
      selectedPapers.indexOf(
        paperId
      );

    if (paperIndex === -1) {
      return "No information available.";
    }

    if (
      paperIndex === 0 &&
      comparison[section].paper1
    ) {
      return comparison[section].paper1;
    }

    if (
      paperIndex === 1 &&
      comparison[section].paper2
    ) {
      return comparison[section].paper2;
    }

    if (
      paperIndex === 2 &&
      comparison[section].paper3
    ) {
      return comparison[section].paper3;
    }

    return "No information available.";
  };

  return (
    <section className="dashboard-content">

          {/* BACK */}

          <Link
            to="/papers"
            className="back-link"
          >
            <ArrowLeft size={17} />

            Back to Papers
          </Link>


          {/* HEADER */}

          <div className="comparison-header">

            <div className="comparison-title">

              <div className="comparison-icon">
                <GitCompare size={26} />
              </div>

              <div>

                <h1>
                  Compare Research Papers
                </h1>

                <p>
                  Compare up to three papers
                  and discover similarities,
                  differences and research gaps.
                </p>

              </div>

            </div>

            <div className="ai-badge">

              <Sparkles size={16} />

              SciNova AI

            </div>

          </div>


          {/* ERROR */}

          {error && (

            <div className="comparison-error">

              <AlertCircle size={18} />

              {error}

            </div>

          )}


          {/* PAPER SELECTION */}

          {!comparison && (

            <div className="comparison-selection">

              <div className="selection-header">

                <div>

                  <h2>
                    Select Research Papers
                  </h2>

                  <p>
                    Choose 2 or 3 papers to
                    compare.
                  </p>

                </div>

                <div className="selection-count">

                  {selectedPapers.length}/3 Selected

                </div>

              </div>


              {loadingPapers ? (

                <div className="loading-papers">

                  <Loader2
                    size={25}
                    className="spinner"
                  />

                  Loading your papers...

                </div>

              ) : papers.length === 0 ? (

                <div className="empty-papers">

                  <FileText size={35} />

                  <h3>
                    No research papers found
                  </h3>

                  <p>
                    Upload research papers
                    before comparing them.
                  </p>

                  <Link
                    to="/upload"
                    className="primary-button"
                  >
                    Upload Paper
                  </Link>

                </div>

              ) : (

                <div className="paper-selection-grid">

                  {papers.map(
                    (paper) => {

                      const selected =
                        selectedPapers.includes(
                          paper._id
                        );

                      return (

                        <button
                          type="button"
                          key={paper._id}
                          onClick={() =>
                            handleSelectPaper(
                              paper._id
                            )
                          }
                          className={`paper-select-card ${
                            selected
                              ? "selected"
                              : ""
                          }`}
                        >

                          <div className="paper-select-icon">

                            <FileText
                              size={22}
                            />

                          </div>


                          <div className="paper-select-content">

                            <h3>

                              {paper.title ||
                                paper.fileName ||
                                "Research Paper"}

                            </h3>

                            <p>

                              {paper.author ||
                                "Scientific Research Paper"}

                            </p>

                          </div>


                          <div className="selection-check">

                            {selected ? (

                              <CheckCircle
                                size={22}
                              />

                            ) : (

                              <span></span>

                            )}

                          </div>

                        </button>

                      );
                    }
                  )}

                </div>

              )}


              {/* ACTION */}

              {papers.length > 0 && (

                <div className="comparison-actions">

                  <p>

                    {selectedPapers.length < 2
                      ? "Select at least 2 papers to continue."
                      : `${selectedPapers.length} papers ready for comparison.`}

                  </p>

                  <button
                    type="button"
                    className="primary-button compare-button"
                    onClick={
                      handleCompare
                    }
                    disabled={
                      selectedPapers.length <
                        2 ||
                      loadingCompare
                    }
                  >

                    {loadingCompare ? (

                      <>
                        <Loader2
                          size={18}
                          className="spinner"
                        />

                        Comparing...

                      </>

                    ) : (

                      <>
                        <Sparkles
                          size={18}
                        />

                        Compare Papers

                      </>

                    )}

                  </button>

                </div>

              )}

            </div>

          )}


          {/* COMPARISON RESULT */}

          {comparison && (

            <div className="comparison-result">

              {/* RESULT HEADER */}

              <div className="result-header">

                <div>

                  <span className="result-label">
                    AI ANALYSIS
                  </span>

                  <h2>
                    Paper Comparison
                  </h2>

                  <p>
                    SciNova AI compared the
                    selected research papers.
                  </p>

                </div>

                <button
                  type="button"
                  className="secondary-button"
                  onClick={handleReset}
                >
                  Compare Again
                </button>

              </div>


              {/* PAPER HEADERS */}

              <div
                className="comparison-table"
                style={{
                  gridTemplateColumns:
                    `200px repeat(${selectedPapers.length}, 1fr)`,
                }}
              >

                <div className="comparison-label-cell">
                  Research Papers
                </div>

                {selectedPapers.map(
                  (paperId, index) => (

                    <div
                      key={paperId}
                      className="comparison-paper-header"
                    >

                      <div className="paper-number">
                        Paper {index + 1}
                      </div>

                      <h3>
                        {getPaperTitle(
                          paperId
                        )}
                      </h3>

                    </div>

                  )
                )}


                {/* OBJECTIVE */}

                <div className="comparison-label-cell">

                  <Target size={18} />

                  Objective

                </div>

                {selectedPapers.map(
                  (paperId) => (

                    <div
                      key={`objective-${paperId}`}
                      className="comparison-cell"
                    >
                      {getComparisonValue(
                        "objective",
                        paperId
                      )}
                    </div>

                  )
                )}


                {/* METHODOLOGY */}

                <div className="comparison-label-cell">

                  <Settings size={18} />

                  Methodology

                </div>

                {selectedPapers.map(
                  (paperId) => (

                    <div
                      key={`methodology-${paperId}`}
                      className="comparison-cell"
                    >
                      {getComparisonValue(
                        "methodology",
                        paperId
                      )}
                    </div>

                  )
                )}


                {/* FINDINGS */}

                <div className="comparison-label-cell">

                  <Lightbulb size={18} />

                  Key Findings

                </div>

                {selectedPapers.map(
                  (paperId) => (

                    <div
                      key={`findings-${paperId}`}
                      className="comparison-cell"
                    >
                      {getComparisonValue(
                        "keyFindings",
                        paperId
                      )}
                    </div>

                  )
                )}


                {/* RESEARCH GAP */}

                <div className="comparison-label-cell">

                  <AlertCircle size={18} />

                  Research Gap

                </div>

                {selectedPapers.map(
                  (paperId) => (

                    <div
                      key={`gap-${paperId}`}
                      className="comparison-cell"
                    >
                      {getComparisonValue(
                        "researchGap",
                        paperId
                      )}
                    </div>

                  )
                )}

              </div>


              {/* GENERATED BY */}

              <div className="comparison-generated">

                <Sparkles size={15} />

                Generated by{" "}

                <strong>
                  {comparison.generatedBy ||
                    "SciNova AI"}
                </strong>

              </div>

            </div>

          )}

        </section>

  );
};

export default ComparePapers;