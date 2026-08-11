import { useEffect, useState } from "react";

import {
  FileText,
  Sparkles,
  Search,
  GitCompare,
  ArrowRight,
  Upload,
  Clock,
  CheckCircle,
  Loader2,
} from "lucide-react";

import { Link } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

import api from "../services/api";

import { getDashboardStats } from "../services/dashboard.service";

const Dashboard = () => {
  const { user } = useAuth();

  const [papers, setPapers] = useState([]);

  const [stats, setStats] = useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  // =================================
  // LOAD PAPERS AND STATS
  // =================================

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError("");

      // Fetch stats and papers in parallel
      const [statsResponse, papersResponse] =
        await Promise.all([
          getDashboardStats(),
          api.get("/papers").catch(() => ({ data: { data: [] } })),
        ]);

      console.log(
        "DASHBOARD STATS:",
        statsResponse
      );

      // Set stats
      if (statsResponse && statsResponse.success) {
        setStats(statsResponse.data);
      }

      console.log(
        "DASHBOARD PAPERS:",
        papersResponse.data
      );

      const papersData =
        papersResponse?.data?.data ||
        papersResponse?.data ||
        [];

      setPapers(
        Array.isArray(papersData)
          ? papersData
          : []
      );

    } catch (err) {
      console.error(
        "DASHBOARD ERROR:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Unable to load dashboard data."
      );

    } finally {
      setLoading(false);
    }
  };

  // =================================
  // STATISTICS
  // =================================

  const totalPapers =
    stats?.totalPapers ??
    papers.length;

  const aiAnalyses =
    stats?.aiAnalyses ??
    papers.filter(
      (paper) =>
        paper.summaryGenerated ||
        paper.hasSummary
    ).length;

  const researchGaps =
    stats?.researchGaps ??
    papers.filter(
      (paper) =>
        paper.researchGapGenerated ||
        paper.hasResearchGap
    ).length;

  const comparisons =
    stats?.comparisons ?? 0;

  // =================================
  // RECENT PAPERS
  // =================================

  const recentPapers =
    stats?.recentPapers ??
    [...papers]
      .sort(
        (a, b) =>
          new Date(
            b.createdAt || 0
          ) -
          new Date(
            a.createdAt || 0
          )
      )
      .slice(0, 5);

  return (
    <section className="dashboard-content">

          {/* ==========================
              WELCOME
          ========================== */}

          <div className="welcome-section">

            <div>

              <span className="dashboard-label">
                SCIENTIFIC DISCOVERY PLATFORM
              </span>

              <h2>
                Welcome back,{" "}
                {user?.fullName ||
                  "Researcher"} 👋
              </h2>

              <p>
                Continue your scientific
                discovery journey with
                SciNova AI.
              </p>

            </div>

            <Link
              to="/upload"
              className="primary-button"
            >
              <Upload size={18} />

              Upload Research Paper
            </Link>

          </div>


          {/* ==========================
              ERROR
          ========================== */}

          {error && (

            <div className="dashboard-error">

              <FileText size={18} />

              {error}

            </div>

          )}


          {/* ==========================
              STATISTICS
          ========================== */}

          <div className="stats-grid">


            {/* PAPERS */}

            <div className="stat-card">

              <div className="stat-icon">
                <FileText size={22} />
              </div>

              <div>

                <span>
                  Total Papers
                </span>

                <h3>
                  {loading ? (
                    <Loader2
                      size={20}
                      className="spinner"
                    />
                  ) : (
                    totalPapers
                  )}
                </h3>

              </div>

            </div>


            {/* AI ANALYSES */}

            <div className="stat-card">

              <div className="stat-icon">
                <Sparkles size={22} />
              </div>

              <div>

                <span>
                  AI Analyses
                </span>

                <h3>
                  {loading ? (
                    <Loader2
                      size={20}
                      className="spinner"
                    />
                  ) : (
                    aiAnalyses
                  )}
                </h3>

              </div>

            </div>


            {/* RESEARCH GAPS */}

            <div className="stat-card">

              <div className="stat-icon">
                <Search size={22} />
              </div>

              <div>

                <span>
                  Research Gaps
                </span>

                <h3>
                  {loading ? (
                    <Loader2
                      size={20}
                      className="spinner"
                    />
                  ) : (
                    researchGaps
                  )}
                </h3>

              </div>

            </div>


            {/* COMPARISONS */}

            <div className="stat-card">

              <div className="stat-icon">
                <GitCompare size={22} />
              </div>

              <div>

                <span>
                  Comparisons
                </span>

                <h3>
                  {loading ? (
                    <Loader2
                      size={20}
                      className="spinner"
                    />
                  ) : (
                    comparisons
                  )}
                </h3>

              </div>

            </div>

          </div>


          {/* ==========================
              AI TOOLS
          ========================== */}

          <div className="section-header">

            <div>

              <div className="dashboard-section-title">

                <Sparkles size={19} />

                <h2>
                  AI Research Tools
                </h2>

              </div>

              <p>
                Accelerate your research
                with intelligent analysis.
              </p>

            </div>

          </div>


          <div className="feature-grid">


            {/* UPLOAD */}

            <Link
              to="/upload"
              className="feature-card"
            >

              <div className="feature-icon">
                <FileText size={24} />
              </div>

              <h3>
                Analyze Research Paper
              </h3>

              <p>
                Upload a scientific paper
                and generate AI-powered
                insights.
              </p>

              <span>
                Analyze Paper

                <ArrowRight size={16} />
              </span>

            </Link>


            {/* AI ASSISTANT */}

            <Link
              to="/papers"
              className="feature-card"
            >

              <div className="feature-icon">
                <Sparkles size={24} />
              </div>

              <h3>
                AI Research Assistant
              </h3>

              <p>
                Ask questions about your
                research papers using AI.
              </p>

              <span>
                Open Assistant

                <ArrowRight size={16} />
              </span>

            </Link>


            {/* COMPARE */}

            <Link
              to="/compare"
              className="feature-card"
            >

              <div className="feature-icon">
                <GitCompare size={24} />
              </div>

              <h3>
                Compare Papers
              </h3>

              <p>
                Compare multiple research
                papers and discover
                opportunities.
              </p>

              <span>
                Compare Research

                <ArrowRight size={16} />
              </span>

            </Link>

          </div>


          {/* ==========================
              RECENT PAPERS
          ========================== */}

          <div className="recent-section">

            <div className="section-header">

              <div>

                <div className="dashboard-section-title">

                  <Clock size={19} />

                  <h2>
                    Recent Research Papers
                  </h2>

                </div>

                <p>
                  Your recently uploaded
                  research papers.
                </p>

              </div>

              <Link
                to="/papers"
                className="view-all-link"
              >
                View All

                <ArrowRight size={16} />

              </Link>

            </div>


            {/* LOADING */}

            {loading && (

              <div className="dashboard-loading">

                <Loader2
                  size={26}
                  className="spinner"
                />

                <p>
                  Loading your papers...
                </p>

              </div>

            )}


            {/* EMPTY */}

            {!loading &&
              recentPapers.length === 0 && (

                <div className="empty-state">

                  <div className="empty-icon">

                    <FileText size={30} />

                  </div>

                  <h3>
                    No papers yet
                  </h3>

                  <p>
                    Upload your first
                    research paper to start
                    discovering insights.
                  </p>

                  <Link
                    to="/upload"
                    className="secondary-button"
                  >
                    <Upload size={16} />

                    Upload Paper
                  </Link>

                </div>

              )}


            {/* PAPERS */}

            {!loading &&
              recentPapers.length > 0 && (

                <div className="recent-papers-list">

                  {recentPapers.map(
                    (paper) => (

                      <div
                        className="recent-paper"
                        key={paper._id}
                      >

                        <div className="recent-paper-left">

                          <div className="recent-paper-icon">

                            <FileText
                              size={20}
                            />

                          </div>

                          <div>

                            <h3>

                              {paper.title ||
                                paper.fileName ||
                                "Untitled Research Paper"}

                            </h3>

                            <p>

                              {paper.createdAt
                                ? `Uploaded ${new Date(
                                    paper.createdAt
                                  ).toLocaleDateString()}`
                                : "Research Paper"}

                            </p>

                          </div>

                        </div>


                        <div className="recent-paper-right">

                          <span className="uploaded-status">

                            <CheckCircle
                              size={14}
                            />

                            Uploaded

                          </span>

                          <Link
                            to={`/papers/${paper._id}`}
                            className="view-paper-button"
                          >
                            View

                            <ArrowRight
                              size={15}
                            />
 
                          </Link>

                        </div>

                      </div>

                    )
                  )}

                </div>

              )}

          </div>

          </section>

  );
};

export default Dashboard;
