import { useState, useEffect } from "react";

import {
  ArrowLeft,
  Send,
  Sparkles,
  User,
  Loader2,
  MessageCircle,
  FileText,
  Lightbulb,
} from "lucide-react";

import {
  Link,
  useParams,
} from "react-router-dom";


import {
  askQuestion,
  getChatHistory,
} from "../services/chat.service";

const Chat = () => {
  const { paperId } = useParams();

  const [question, setQuestion] =
    useState("");

  const [messages, setMessages] =
    useState([]);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  // Load chat history on mount
  useEffect(() => {
    const loadChatHistory = async () => {
      if (!paperId) return;

      try {
        const result = await getChatHistory(paperId);

        if (result && result.success) {
          const historyMessages = result.data.map(
            (entry) => [
              {
                type: "user",
                text: entry.question,
              },
              {
                type: "ai",
                text: entry.answer,
              },
            ]
          ).flat();

          setMessages(historyMessages);
        }
      } catch (err) {
        console.error("Error loading chat history:", err);
        // Silently fail - no history yet
      }
    };

    loadChatHistory();
  }, [paperId]);

  const suggestedQuestions = [
    "What is the main objective of this paper?",
    "What methodology is used?",
    "What are the key findings?",
    "What are the limitations?",
  ];

  const handleAsk = async (e) => {
    e.preventDefault();

    if (!question.trim() || loading) {
      return;
    }

    const currentQuestion =
      question.trim();

    try {
      setLoading(true);
      setError("");

      setMessages((prev) => [
        ...prev,
        {
          type: "user",
          text: currentQuestion,
        },
      ]);

      setQuestion("");

      const result =
        await askQuestion(
          paperId,
          currentQuestion
        );

      if (result.success) {
        setMessages((prev) => [
          ...prev,
          {
            type: "ai",
            text: result.data.answer,
          },
        ]);
      } else {
        setError(
          result.message ||
            "Failed to generate answer."
        );
      }

    } catch (err) {
      console.error(
        "Chat Error:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Unable to connect to SciNova AI."
      );

    } finally {
      setLoading(false);
    }
  };

  const handleSuggestion = (
    questionText
  ) => {
    setQuestion(questionText);
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

          <div className="chat-page-header">

            <div className="chat-title-section">

              <div className="chat-ai-icon">
                <Sparkles size={25} />
              </div>

              <div>

                <h1>
                  Research Assistant
                </h1>

                <p>
                  Ask questions and explore
                  insights from your research paper.
                </p>

              </div>

            </div>


            <div className="ai-status">

              <span className="status-dot"></span>

              AI Online

            </div>

          </div>


          {/* ERROR */}

          {error && (
            <div className="chat-error">
              {error}
            </div>
          )}


          {/* CHAT CARD */}

          <div className="chat-wrapper">


            {/* CHAT TOP BAR */}

            <div className="chat-topbar">

              <div className="paper-info">

                <div className="paper-icon">
                  <FileText size={20} />
                </div>

                <div>

                  <strong>
                    Research Paper
                  </strong>

                  <span>
                    AI-powered paper analysis
                  </span>

                </div>

              </div>


              <div className="chat-badge">

                <Sparkles size={14} />

                SciNova AI

              </div>

            </div>


            {/* MESSAGES */}

            <div className="chat-messages">

              {messages.length === 0 ? (

                <div className="chat-welcome">

                  <div className="welcome-icon">
                    <MessageCircle
                      size={30}
                    />
                  </div>

                  <h2>
                    How can I help you?
                  </h2>

                  <p>
                    Ask SciNova AI anything
                    about this research paper.
                  </p>


                  {/* SUGGESTIONS */}

                  <div className="suggestion-section">

                    <div className="suggestion-title">

                      <Lightbulb size={15} />

                      Try asking

                    </div>


                    <div className="suggestion-grid">

                      {suggestedQuestions.map(
                        (item, index) => (

                          <button
                            key={index}
                            type="button"
                            className="suggestion-card"
                            onClick={() =>
                              handleSuggestion(
                                item
                              )
                            }
                          >

                            <span>
                              {item}
                            </span>

                            <ArrowLeft
                              size={15}
                              className="suggestion-arrow"
                            />

                          </button>

                        )
                      )}

                    </div>

                  </div>

                </div>

              ) : (

                messages.map(
                  (message, index) => (

                    <div
                      key={index}
                      className={`chat-row ${
                        message.type ===
                        "user"
                          ? "user-row"
                          : "ai-row"
                      }`}
                    >

                      {/* AVATAR */}

                      <div
                        className={`message-avatar ${
                          message.type ===
                          "user"
                            ? "user-avatar"
                            : "ai-avatar"
                        }`}
                      >

                        {message.type ===
                        "user" ? (
                          <User size={17} />
                        ) : (
                          <Sparkles
                            size={17}
                          />
                        )}

                      </div>


                      {/* MESSAGE */}

                      <div
                        className={`message-content ${
                          message.type ===
                          "user"
                            ? "user-content"
                            : "ai-content"
                        }`}
                      >

                        <span className="message-label">

                          {message.type ===
                          "user"
                            ? "You"
                            : "SciNova AI"}

                        </span>

                        <div className="message-bubble">

                          {message.text}

                        </div>

                      </div>

                    </div>

                  )
                )

              )}


              {/* LOADING */}

              {loading && (

                <div className="chat-row ai-row">

                  <div className="message-avatar ai-avatar">

                    <Sparkles size={17} />

                  </div>

                  <div className="message-content ai-content">

                    <span className="message-label">
                      SciNova AI
                    </span>

                    <div className="message-bubble thinking">

                      <Loader2
                        size={17}
                        className="spinner"
                      />

                      <span>
                        Analyzing your question...
                      </span>

                    </div>

                  </div>

                </div>

              )}

            </div>


            {/* INPUT */}

            <div className="chat-input-wrapper">

              <form
                onSubmit={handleAsk}
                className="chat-input-box"
              >

                <input
                  type="text"
                  value={question}
                  onChange={(e) =>
                    setQuestion(
                      e.target.value
                    )
                  }
                  placeholder="Ask anything about this research paper..."
                  disabled={loading}
                />

                <button
                  type="submit"
                  disabled={
                    loading ||
                    !question.trim()
                  }
                  className="send-button"
                >

                  {loading ? (
                    <Loader2
                      size={19}
                      className="spinner"
                    />
                  ) : (
                    <Send size={19} />
                  )}

                </button>

              </form>

              <p className="input-hint">
                SciNova AI can help summarize,
                explain, and analyze the paper.
              </p>

            </div>

          </div>

        </section>

  );
};

export default Chat;