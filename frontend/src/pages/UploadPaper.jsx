import { useState } from "react";
import {
  Upload,
  FileText,
  CheckCircle,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import { uploadPaper } from "../services/paper.service";

const UploadPaper = () => {
  const navigate = useNavigate();

  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];

    if (!selectedFile) return;

    if (selectedFile.type !== "application/pdf") {
      setError("Please select a PDF file.");
      setFile(null);
      return;
    }

    setError("");
    setFile(selectedFile);
  };

  const removeFile = () => {
    setFile(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      setError("Please select a PDF research paper.");
      return;
    }

    if (!title.trim()) {
      setError("Please enter the paper title.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setSuccess("");

      const formData = new FormData();

      formData.append("title", title);
      formData.append("description", description);
      formData.append("paper", file);

      await uploadPaper(formData);

      setSuccess(
        "Research paper uploaded successfully!"
      );

      setTitle("");
      setDescription("");
      setFile(null);

      setTimeout(() => {
        navigate("/papers");
      }, 1200);

    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.message ||
          "Failed to upload research paper."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="dashboard-content">

          <div className="page-heading">
            <div>
              <h2>Upload Research Paper</h2>

              <p>
                Upload a scientific PDF to start
                AI-powered analysis.
              </p>
            </div>
          </div>

          <div className="upload-container">

            <form
              className="upload-card"
              onSubmit={handleSubmit}
            >

              {/* Title */}

              <div className="form-group">

                <label>
                  Research Paper Title
                </label>

                <input
                  type="text"
                  placeholder="Enter paper title"
                  value={title}
                  onChange={(e) =>
                    setTitle(e.target.value)
                  }
                />

              </div>

              {/* Description */}

              <div className="form-group">

                <label>
                  Description
                </label>

                <textarea
                  placeholder="Brief description of the research paper..."
                  value={description}
                  onChange={(e) =>
                    setDescription(e.target.value)
                  }
                  rows="4"
                />

              </div>

              {/* PDF Upload */}

              <div className="form-group">

                <label>
                  Research Paper PDF
                </label>

                {!file ? (
                  <label className="drop-zone">

                    <input
                      type="file"
                      accept=".pdf,application/pdf"
                      onChange={handleFileChange}
                      hidden
                    />

                    <div className="upload-icon">
                      <Upload size={28} />
                    </div>

                    <h3>
                      Upload your research paper
                    </h3>

                    <p>
                      Click here to select a PDF
                    </p>

                    <span>
                      PDF files only
                    </span>

                  </label>
                ) : (
                  <div className="selected-file">

                    <div className="file-left">

                      <div className="file-icon">
                        <FileText size={22} />
                      </div>

                      <div>
                        <strong>
                          {file.name}
                        </strong>

                        <span>
                          {(
                            file.size /
                            1024 /
                            1024
                          ).toFixed(2)}{" "}
                          MB
                        </span>
                      </div>

                    </div>

                    <button
                      type="button"
                      className="remove-file"
                      onClick={removeFile}
                    >
                      <X size={18} />
                    </button>

                  </div>
                )}

              </div>

              {/* Messages */}

              {error && (
                <div className="upload-error">
                  {error}
                </div>
              )}

              {success && (
                <div className="upload-success">
                  <CheckCircle size={18} />
                  {success}
                </div>
              )}

              {/* Submit */}

              <button
                type="submit"
                className="upload-submit"
                disabled={loading}
              >
                <Upload size={18} />

                {loading
                  ? "Uploading..."
                  : "Upload Research Paper"}
              </button>

            </form>

            {/* Information */}

            <div className="upload-info">

              <h3>
                What happens after upload?
              </h3>

              <div className="info-step">
                <span>1</span>
                <div>
                  <strong>
                    PDF Processing
                  </strong>
                  <p>
                    Your research paper is
                    converted into readable text.
                  </p>
                </div>
              </div>

              <div className="info-step">
                <span>2</span>
                <div>
                  <strong>
                    AI Analysis
                  </strong>
                  <p>
                    SciNova AI analyzes the
                    research content.
                  </p>
                </div>
              </div>

              <div className="info-step">
                <span>3</span>
                <div>
                  <strong>
                    Research Insights
                  </strong>
                  <p>
                    Generate summaries, gaps,
                    comparisons and AI answers.
                  </p>
                </div>
              </div>

            </div>

          </div>

        </section>

  );
};

export default UploadPaper;