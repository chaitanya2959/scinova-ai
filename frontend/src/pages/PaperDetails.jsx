import { useEffect, useState } from "react";

import {
  FileText,
  ArrowLeft,
  Sparkles,
  Search,
  MessageSquare,
  GitCompare,
  Loader2,
  CalendarDays,
  FileType,
  CheckCircle,
  ExternalLink,
} from "lucide-react";

import {
  Link,
  useParams,
} from "react-router-dom";


import {
  getPaperById,
} from "../services/paper.service";

const PaperDetails = () => {
  const { paperId } = useParams();

  const [paper, setPaper] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    fetchPaper();
  }, [paperId]);

  const fetchPaper = async () => {
    try {
      setLoading(true);
      setError("");

      const response =
        await getPaperById(paperId);

      console.log(
        "PAPER RESPONSE:",
        response
      );

      const paperData =
        response?.data?.data ||
        response?.data ||
        response;

      setPaper(paperData);

    } catch (error) {
      console.error(
        "PAPER DETAILS ERROR:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to load paper."
      );

    } finally {
      setLoading(false);
    }
  };

  // ==========================
  // LOADING
  // ==========================

  if (loading) {
    return (
      <div className="loading-state">

        <Loader2
          size={30}
          className="spinner"
        />

        <p>
          Loading paper...
        </p>

      </div>
    );
  }

  // ==========================
  // ERROR
  // ==========================

  if (error) {
    return (
      <section className="dashboard-content">

        <div className="paper-error-box">

          <div className="error-icon">
            <FileText size={25} />
          </div>

          <div>

            <h3>
              Unable to load paper
            </h3>

            <p>
              {error}
            </p>

          </div>

        </div>

        <Link
          to="/papers"
          className="secondary-button"
        >
          <ArrowLeft size={16} />

          Back to Papers
        </Link>

      </section>
    );
  }

  return (
    <section className="dashboard-content">

          {/* ==========================
              BACK
          ========================== */}

          <Link
            to="/papers"
            className="back-link"
          >
            <ArrowLeft size={17} />

            Back to My Papers
          </Link>


          {/* ==========================
              PAPER HERO
          ========================== */}

          <div className="paper-hero">

            <div className="paper-hero-left">

              <div className="paper-detail-icon">
                <FileText size={31} />
              </div>

              <div className="paper-hero-content">

                <div className="paper-status-badge">

                  <CheckCircle size={13} />

                  Paper Uploaded

                </div>

                <h1>
                  {paper?.title ||
                    "Untitled Research Paper"}
                </h1>

                <p>
                  {paper?.description ||
                    "Scientific research paper"}
                </p>

                <div className="paper-meta">

                  {paper?.createdAt && (
                    <span>
                      <CalendarDays
                        size={14}
                      />

                      Uploaded{" "}
                      {new Date(
                        paper.createdAt
                      ).toLocaleDateString()}
                    </span>
                  )}

                  <span>
                    <FileType
                      size={14}
                    />

                    PDF Document
                  </span>

                </div>

              </div>

            </div>


            {/* OPEN PDF */}

            {paper?.fileUrl && (
              <a
                href={paper.fileUrl}
                target="_blank"
                rel="noreferrer"
                className="secondary-button"
              >
                <ExternalLink size={16} />

                Open PDF
              </a>
            )}

          </div>


          {/* ==========================
              AI HEADER
          ========================== */}

          <div className="section-header">

            <div>

              <div className="section-title-row">

                <Sparkles
                  size={20}
                />

                <h2>
                  AI Research Tools
                </h2>

              </div>

              <p>
                Analyze and explore this
                research paper using
                SciNova AI.
              </p>

            </div>

          </div>


          {/* ==========================
              AI TOOLS
          ========================== */}

          <div className="ai-tools-grid">


            {/* SUMMARY */}

            <Link
              to={`/papers/${paperId}/summary`}
              className="ai-tool-card summary-card"
            >

              <div className="ai-tool-top">

                <div className="ai-tool-icon">
                  <Sparkles size={23} />
                </div>

                <span className="tool-number">
                  01
                </span>

              </div>

              <h3>
                AI Summary
              </h3>

              <p>
                Generate an intelligent
                summary covering the
                objective, methodology,
                findings and conclusion.
              </p>

              <span className="tool-action">
                Generate Summary
                <span>→</span>
              </span>

            </Link>


            {/* RESEARCH GAP */}

            <Link
              to={`/papers/${paperId}/research-gap`}
              className="ai-tool-card gap-card"
            >

              <div className="ai-tool-top">

                <div className="ai-tool-icon">
                  <Search size={23} />
                </div>

                <span className="tool-number">
                  02
                </span>

              </div>

              <h3>
                Research Gap
              </h3>

              <p>
                Discover limitations,
                missing research areas
                and opportunities for
                future investigation.
              </p>

              <span className="tool-action">
                Find Research Gaps
                <span>→</span>
              </span>

            </Link>


            {/* CHAT */}

            <Link
              to={`/papers/${paperId}/chat`}
              className="ai-tool-card chat-card"
            >

              <div className="ai-tool-top">

                <div className="ai-tool-icon">
                  <MessageSquare
                    size={23}
                  />
                </div>

                <span className="tool-number">
                  03
                </span>

              </div>

              <h3>
                AI Research Assistant
              </h3>

              <p>
                Ask questions and
                interact with SciNova AI
                about your research paper.
              </p>

              <span className="tool-action">
                Ask AI
                <span>→</span>
              </span>

            </Link>


            {/* COMPARE */}

            <Link
              to="/compare"
              className="ai-tool-card compare-card"
            >

              <div className="ai-tool-top">

                <div className="ai-tool-icon">
                  <GitCompare
                    size={23}
                  />
                </div>

                <span className="tool-number">
                  04
                </span>

              </div>

              <h3>
                Compare Papers
              </h3>

              <p>
                Compare this paper with
                other research papers and
                identify key differences.
              </p>

              <span className="tool-action">
                Compare Papers
                <span>→</span>
              </span>

            </Link>

          </div>


          {/* ==========================
              PAPER INFORMATION
          ========================== */}

          <div className="paper-information">

            <div className="information-heading">

              <div>

                <h2>
                  Paper Information
                </h2>

                <p>
                  Basic information about
                  this research paper.
                </p>

              </div>

            </div>


            <div className="information-grid">


              <div className="info-item">

                <span>
                  Paper ID
                </span>

                <strong>
                  {paper?._id || "N/A"}
                </strong>

              </div>


              <div className="info-item">

                <span>
                  File Type
                </span>

                <strong>
                  PDF
                </strong>

              </div>


              <div className="info-item">

                <span>
                  Status
                </span>

                <strong className="status">

                  <CheckCircle
                    size={15}
                  />

                  Uploaded

                </strong>

              </div>


              <div className="info-item">

                <span>
                  Uploaded On
                </span>

                <strong>

                  {paper?.createdAt
                    ? new Date(
                        paper.createdAt
                      ).toLocaleDateString()
                    : "N/A"}

                </strong>

              </div>

            </div>

          </div>


        </section>

  );
};

export default PaperDetails;
