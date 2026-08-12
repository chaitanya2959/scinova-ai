import { useEffect, useState } from "react";

import {
  AlertCircle,
  ArrowLeft,
  CalendarDays,
  CheckCircle,
  FileText,
  GitCompare,
  Lightbulb,
  Loader2,
  Settings,
  Sparkles,
  Target,
} from "lucide-react";

import { Link } from "react-router-dom";

import { comparePapers } from "../services/comparison.service";
import { getMyPapers } from "../services/paper.service";

const MIN_PAPERS = 2;
const MAX_PAPERS = 3;

const ANALYSIS_SECTIONS = [
  {
    key: "objectives",
    label: "Research Objectives",
    icon: Target,
    type: "text",
  },
  {
    key: "methodologies",
    label: "Methodologies",
    icon: Settings,
    type: "text",
  },
  {
    key: "technologies",
    label: "Technologies",
    icon: Sparkles,
    type: "text",
  },
  {
    key: "findings",
    label: "Key Findings",
    icon: Lightbulb,
    type: "text",
  },
  {
    key: "limitations",
    label: "Limitations",
    icon: AlertCircle,
    type: "text",
  },
  {
    key: "similarities",
    label: "Similarities",
    icon: CheckCircle,
    type: "list",
  },
  {
    key: "differences",
    label: "Key Differences",
    icon: GitCompare,
    type: "list",
  },
  {
    key: "researchOpportunities",
    label: "Research Opportunities",
    icon: Lightbulb,
    type: "list",
  },
];

const normalizeCollectionResponse = (response) => {
  const data = response?.data?.data ?? response?.data ?? response;
  return Array.isArray(data) ? data : [];
};

const getPaperTitle = (paper) => {
  return (
    paper?.title ||
    paper?.name ||
    paper?.fileName ||
    paper?.originalName ||
    "Untitled Paper"
  );
};

const getPaperDescription = (paper) => {
  return (
    paper?.description ||
    paper?.abstract ||
    paper?.summary ||
    "Scientific research paper"
  );
};

const formatDate = (value) => {
  if (!value) {
    return "Recently uploaded";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Recently uploaded";
  }

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const toListItems = (value) => {
  if (Array.isArray(value)) {
    return value.map((item) => String(item).trim()).filter(Boolean);
  }

  if (typeof value === "string") {
    return value
      .split(/\n+/)
      .map((item) =>
        item.replace(/^[-*]\s*/, "").replace(/^\u2022\s*/, "").trim()
      )
      .filter(Boolean);
  }

  return [];
};

const toParagraphs = (value) => {
  if (typeof value !== "string") {
    return [];
  }

  return value
    .split(/\n+/)
    .map((item) => item.trim())
    .filter(Boolean);
};

const ComparePapers = () => {
  const [papers, setPapers] = useState([]);
  const [selectedPapers, setSelectedPapers] = useState([]);
  const [comparison, setComparison] = useState(null);
  const [loadingPapers, setLoadingPapers] = useState(true);
  const [loadingCompare, setLoadingCompare] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadPapers = async () => {
      try {
        setLoadingPapers(true);
        setError("");

        const response = await getMyPapers();
        const paperData = normalizeCollectionResponse(response);
        setPapers(paperData);
      } catch (err) {
        console.error("Failed to load papers for comparison:", err);
        setError(err.response?.data?.message || "Unable to load papers.");
      } finally {
        setLoadingPapers(false);
      }
    };

    loadPapers();
  }, []);

  const handleSelectPaper = (paperId) => {
    if (loadingCompare) {
      return;
    }

    setError("");

    setSelectedPapers((current) => {
      if (current.includes(paperId)) {
        return current.filter((id) => id !== paperId);
      }

      if (current.length >= MAX_PAPERS) {
        setError(`You can select up to ${MAX_PAPERS} papers.`);
        return current;
      }

      return [...current, paperId];
    });
  };

  const handleCompare = async () => {
    if (loadingCompare) {
      return;
    }

    if (selectedPapers.length < MIN_PAPERS) {
      setError(`Please select at least ${MIN_PAPERS} papers.`);
      return;
    }

    try {
      setLoadingCompare(true);
      setError("");

      const response = await comparePapers(selectedPapers);
      const result = response?.data?.data ?? response?.data ?? response;

      if (!result) {
        throw new Error("Comparison data was not returned.");
      }

      if (result.success === false) {
        throw new Error(result.message || "Comparison failed.");
      }

      const comparisonData =
        result?.data && typeof result.data === "object" && !Array.isArray(result.data)
          ? result.data
          : result;

      setComparison(comparisonData);
    } catch (err) {
      console.error("Comparison error:", err);
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to compare papers."
      );
    } finally {
      setLoadingCompare(false);
    }
  };

  const handleReset = () => {
    setSelectedPapers([]);
    setComparison(null);
    setError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const getSelectedIndex = (paperId) => selectedPapers.indexOf(paperId);

  const selectedPaperMeta = selectedPapers
    .map((paperId) => papers.find((paper) => paper._id === paperId))
    .filter(Boolean);

  const renderComparisonValue = (sectionKey, sectionType) => {
    const value = comparison?.[sectionKey];

    if (sectionType === "list") {
      const items = toListItems(value);

      if (items.length === 0) {
        return (
          <p className="analysis-empty">
            The backend did not return this section.
          </p>
        );
      }

      return (
        <ul className="analysis-list">
          {items.map((item, index) => (
            <li key={`${sectionKey}-${index}`}>
              <span className="analysis-bullet" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      );
    }

    const paragraphs = toParagraphs(value);

    if (paragraphs.length === 0) {
      if (typeof value === "string" && value.trim()) {
        return <p className="analysis-text">{value.trim()}</p>;
      }

      return (
        <p className="analysis-empty">
          The backend did not return this section.
        </p>
      );
    }

    return (
      <div className="analysis-paragraphs">
        {paragraphs.map((paragraph, index) => (
          <p key={`${sectionKey}-${index}`}>{paragraph}</p>
        ))}
      </div>
    );
  };

  return (
    <section className="dashboard-content comparison-page">
      <Link to="/papers" className="back-link">
        <ArrowLeft size={17} />
        Back to Papers
      </Link>

      <div className="comparison-header">
        <div className="comparison-title">
          <div className="comparison-icon">
            <GitCompare size={26} />
          </div>

          <div>
            <h1>Compare Research Papers</h1>
            <p>
              Select two or three research papers and let SciNova AI compare
              their objectives, methodologies, findings and future potential.
            </p>
          </div>
        </div>

        <div className="ai-badge">
          <Sparkles size={16} />
          SciNova AI
        </div>
      </div>

      {error && (
        <div className="comparison-error">
          <AlertCircle size={18} />
          {error}
        </div>
      )}

      {!comparison ? (
        <div className="comparison-selection">
          <div className="selection-header">
            <div>
              <h2>Select Research Papers</h2>
              <p>Choose 2 or 3 papers from your library to start the analysis.</p>
            </div>

            <div className="selection-count">
              {selectedPapers.length}/{MAX_PAPERS} Selected
            </div>
          </div>

          {loadingPapers ? (
            <div className="loading-papers">
              <Loader2 size={24} className="spinner" />
              Loading your papers...
            </div>
          ) : papers.length === 0 ? (
            <div className="empty-papers">
              <FileText size={36} />
              <h3>No research papers found</h3>
              <p>Upload research papers before comparing them.</p>
              <Link to="/upload" className="primary-button">
                Upload Paper
              </Link>
            </div>
          ) : (
            <>
              <div className="paper-selection-grid">
                {papers.map((paper) => {
                  const selectedIndex = getSelectedIndex(paper._id);
                  const selected = selectedIndex !== -1;

                  return (
                    <button
                      type="button"
                      key={paper._id}
                      onClick={() => handleSelectPaper(paper._id)}
                      className={`paper-select-card ${selected ? "selected" : ""}`}
                      aria-pressed={selected}
                    >
                      <div className="paper-select-icon">
                        <FileText size={22} />
                      </div>

                      <div className="paper-select-content">
                        <div className="paper-select-topline">
                          <h3>{getPaperTitle(paper)}</h3>

                          {selected && (
                            <span className="paper-select-badge">
                              Paper {selectedIndex + 1}
                            </span>
                          )}
                        </div>

                        <p className="paper-select-description">
                          {getPaperDescription(paper)}
                        </p>

                        <div className="paper-select-footer">
                          <span className="paper-select-date">
                            <CalendarDays size={14} />
                            {formatDate(paper.createdAt || paper.uploadedAt)}
                          </span>
                        </div>
                      </div>

                      <div className="selection-check">
                        {selected ? (
                          <CheckCircle size={22} />
                        ) : (
                          <span aria-hidden="true" />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="comparison-actions">
                <p>
                  {selectedPapers.length < MIN_PAPERS
                    ? `Select at least ${MIN_PAPERS} papers to continue.`
                    : `${selectedPapers.length} papers ready for comparison.`}
                </p>

                <button
                  type="button"
                  className="primary-button compare-button"
                  onClick={handleCompare}
                  disabled={
                    selectedPapers.length < MIN_PAPERS ||
                    loadingCompare ||
                    loadingPapers
                  }
                >
                  {loadingCompare ? (
                    <>
                      <Loader2 size={18} className="spinner" />
                      Analyzing Papers...
                    </>
                  ) : (
                    <>
                      <Sparkles size={18} />
                      Compare with AI
                    </>
                  )}
                </button>
              </div>
            </>
          )}
        </div>
      ) : (
        <div className="comparison-result">
          <div className="result-header">
            <div>
              <span className="result-label">AI ANALYSIS</span>
              <h2>AI Research Comparison</h2>
              <p>
                SciNova AI analyzed the selected research papers and identified
                their key similarities, differences, findings and future research
                opportunities.
              </p>
            </div>

            <button type="button" className="secondary-button" onClick={handleReset}>
              Compare Again
            </button>
          </div>

          <div className="selected-paper-chips">
            {selectedPaperMeta.map((paper, index) => (
              <span key={paper._id} className="selected-paper-chip">
                <span className="selected-paper-index">{index + 1}</span>
                <FileText size={14} />
                <span className="selected-paper-title">{getPaperTitle(paper)}</span>
              </span>
            ))}
          </div>

          <div className="analysis-grid">
            {ANALYSIS_SECTIONS.map((section) => {
              const Icon = section.icon;

              return (
                <article key={section.key} className="analysis-card">
                  <div className="analysis-card-header">
                    <div className="analysis-card-icon">
                      <Icon size={18} />
                    </div>

                    <div>
                      <h3>{section.label}</h3>
                    </div>
                  </div>

                  <div className="analysis-card-body">
                    {renderComparisonValue(section.key, section.type)}
                  </div>
                </article>
              );
            })}
          </div>

          <div className="comparison-generated">
            <Sparkles size={15} />
            Generated by <strong>{comparison?.generatedBy || "SciNova AI"}</strong>
          </div>
        </div>
      )}
    </section>
  );
};

export default ComparePapers;
