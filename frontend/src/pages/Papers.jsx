import { useEffect, useState } from "react";

import {
  FileText,
  Eye,
  Search,
  Loader2,
  Trash2,
} from "lucide-react";

import { Link } from "react-router-dom";

import {
  getMyPapers,
  deletePaper,
} from "../services/paper.service";

const Papers = () => {
  const [papers, setPapers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  const [deleteConfirm, setDeleteConfirm] =
    useState(null);

  useEffect(() => {
    fetchPapers();
  }, []);

  const fetchPapers = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getMyPapers();

      /*
       * Handles common API response formats:
       * response.data
       * response.data.data
       */
      const paperData =
        response?.data?.data ||
        response?.data ||
        [];

      setPapers(
        Array.isArray(paperData)
          ? paperData
          : []
      );

    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.message ||
          "Failed to load papers"
      );

    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (paperId) => {
    try {
      setLoading(true);
      setError("");

      await deletePaper(paperId);

      // Remove from local state
      setPapers(
        papers.filter(
          (p) => p._id !== paperId
        )
      );

      setDeleteConfirm(null);

    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.message ||
          "Failed to delete paper"
      );

    } finally {
      setLoading(false);
    }
  };

  const filteredPapers = papers.filter((paper) =>
    (
      paper.title ||
      paper.name ||
      ""
    )
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <section className="dashboard-content">

          <div className="page-heading">

            <div>
              <h2>My Research Papers</h2>

              <p>
                Manage and analyze your uploaded
                scientific papers.
              </p>
            </div>

            <Link
              to="/upload"
              className="primary-button"
            >
              Upload Paper
            </Link>

          </div>

          {/* Search */}

          <div className="search-box">

            <Search size={18} />

            <input
              type="text"
              placeholder="Search papers..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
            />

          </div>

          {/* Error */}

          {error && (
            <div className="error-box">
              {error}
            </div>
          )}

          {/* Loading */}

          {loading ? (
            <div className="loading-state">

              <Loader2
                size={30}
                className="spinner"
              />

              <p>
                Loading research papers...
              </p>

            </div>
          ) : filteredPapers.length === 0 ? (

            /* Empty */

            <div className="empty-state">

              <FileText size={45} />

              <h3>
                No research papers found
              </h3>

              <p>
                Upload your first scientific
                paper to start your research.
              </p>

              <Link
                to="/upload"
                className="secondary-button"
              >
                Upload Paper
              </Link>

            </div>

          ) : (

            /* Papers */

            <div className="papers-grid">

              {filteredPapers.map((paper) => (

                <div
                  className="paper-card"
                  key={paper._id}
                >

                  <div className="paper-icon">
                    <FileText size={25} />
                  </div>

                  <div className="paper-info">

                    <h3>
                      {paper.title ||
                        paper.name ||
                        "Untitled Paper"}
                    </h3>

                    <p>
                      {paper.description ||
                        "Scientific research paper"}
                    </p>

                    <span>
                      {paper.createdAt
                        ? new Date(
                            paper.createdAt
                          ).toLocaleDateString()
                        : "Recently uploaded"}
                    </span>

                  </div>

                  <div className="paper-actions">

                    <Link
                      to={`/papers/${paper._id}`}
                      className="view-button"
                    >
                      <Eye size={17} />
                      View
                    </Link>

                    <button
                      type="button"
                      className="delete-button"
                      onClick={() =>
                        setDeleteConfirm(paper._id)
                      }
                    >
                      <Trash2 size={17} />
                    </button>

                  </div>

                  {/* DELETE CONFIRMATION MODAL */}

                  {deleteConfirm === paper._id && (
                    <div className="delete-modal-overlay">
                      <div className="delete-modal">

                        <h3>
                          Delete Paper
                        </h3>

                        <p>
                          Are you sure you want
                          to delete this paper?
                          This action cannot be undone.
                        </p>

                        <div className="delete-modal-actions">

                          <button
                            type="button"
                            className="cancel-button"
                            onClick={() =>
                              setDeleteConfirm(null)
                            }
                          >
                            Cancel
                          </button>

                          <button
                            type="button"
                            className="confirm-delete-button"
                            onClick={() =>
                              handleDelete(
                                paper._id
                              )
                            }
                          >
                            Delete
                          </button>

                        </div>

                      </div>
                    </div>
                  )}

                </div>

              ))}

            </div>
          )}

        </section>

  );
};

export default Papers;
