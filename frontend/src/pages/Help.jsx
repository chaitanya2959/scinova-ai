import { useState } from "react";

import {
  Search,
  ChevronDown,
  ChevronUp,
  Send,
  HelpCircle,
  MessageSquare,
} from "lucide-react";

import { createSupportTicket } from "../services/support.service";

const Help = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedFaq, setExpandedFaq] = useState(null);

  // Contact form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [formMessage, setFormMessage] = useState(null);

  const faqs = [
    {
      id: 1,
      question: "How do I upload a research paper?",
      answer:
        "Navigate to the 'Upload Paper' section from the sidebar. Click the upload area or drag and drop your PDF file. The system will automatically process and index your paper for AI analysis.",
    },
    {
      id: 2,
      question: "How do I generate an AI summary?",
      answer:
        "Open any paper from 'My Papers' and click on 'AI Summary' in the contextual menu, then select 'Generate Summary'. The AI will analyze the paper and provide a comprehensive summary.",
    },
    {
      id: 3,
      question: "How does Research Gap work?",
      answer:
        "Research Gap analysis identifies underexplored areas in your paper's field. Open a paper, go to 'Research Gap' from the AI tools menu, and the system will analyze existing literature to suggest potential research opportunities.",
    },
    {
      id: 4,
      question: "How do I compare papers?",
      answer:
        "Go to 'Compare Papers' from the sidebar, select two or more papers from your library, and click 'Compare'. The system will analyze similarities, differences, and key insights across the selected papers.",
    },
    {
      id: 5,
      question: "How do I use AI Research Assistant?",
      answer:
        "Open any paper and select 'AI Research Assistant' from the AI tools. You can ask questions about the paper, request clarifications, or dive deeper into specific sections. The AI has full context of the paper content.",
    },
    {
      id: 6,
      question: "How do I change my password?",
      answer:
        "Go to Settings from the sidebar or navbar, scroll to the 'Security' section, enter your current password and new password, then click 'Change Password'.",
    },
    {
      id: 7,
      question: "How do I delete my account?",
      answer:
        "Navigate to Settings, scroll to the 'Account' section, and click 'Delete Account' in the Danger Zone. You'll need to confirm this action as it's irreversible.",
    },
  ];

  const filteredFaqs = faqs.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleFaq = (id) => {
    setExpandedFaq(expandedFaq === id ? null : id);
  };

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setFormMessage(null);

    try {
      await createSupportTicket({ name, email, subject, message });
      setFormMessage({ type: "success", text: "Support request submitted successfully" });
      setName("");
      setEmail("");
      setSubject("");
      setMessage("");
    } catch (error) {
      setFormMessage({
        type: "error",
        text: error.response?.data?.message || "Failed to submit support request",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="help-page">
      <div className="page-header">
        <h1>Help & Support</h1>
        <p>Find answers or contact the SciNova AI support team</p>
      </div>

      <div className="help-container">
        {/* Search Help */}
        <div className="help-card search-card">
          <div className="card-header">
            <Search size={20} />
            <h2>Search Help</h2>
          </div>
          <div className="search-input-container">
            <Search size={18} className="search-icon" />
            <input
              type="text"
              placeholder="Search help articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* FAQ Section */}
        <div className="help-card faq-card">
          <div className="card-header">
            <HelpCircle size={20} />
            <h2>Frequently Asked Questions</h2>
          </div>
          <div className="faq-list">
            {filteredFaqs.length > 0 ? (
              filteredFaqs.map((faq) => (
                <div key={faq.id} className="faq-item">
                  <button
                    className="faq-question"
                    onClick={() => toggleFaq(faq.id)}
                  >
                    <span>{faq.question}</span>
                    {expandedFaq === faq.id ? (
                      <ChevronUp size={20} />
                    ) : (
                      <ChevronDown size={20} />
                    )}
                  </button>
                  {expandedFaq === faq.id && (
                    <div className="faq-answer">
                      <p>{faq.answer}</p>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <p className="no-results">No help articles found matching your search.</p>
            )}
          </div>
        </div>

        {/* Contact Support Section */}
        <div className="help-card contact-card">
          <div className="card-header">
            <MessageSquare size={20} />
            <h2>Contact Support</h2>
          </div>
          <form onSubmit={handleContactSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label>Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  required
                />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@example.com"
                  required
                />
              </div>
            </div>
            <div className="form-group">
              <label>Subject</label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="What's this about?"
                required
              />
            </div>
            <div className="form-group">
              <label>Message</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Describe your issue or question in detail..."
                rows="6"
                required
              />
            </div>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? (
                "Sending..."
              ) : (
                <>
                  <Send size={16} />
                  Send Message
                </>
              )}
            </button>
            {formMessage && (
              <div className={`message ${formMessage.type}`}>
                {formMessage.text}
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Help;