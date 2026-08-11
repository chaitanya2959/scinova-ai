import { useState } from "react";
import {
  Link,
  useNavigate,
} from "react-router-dom";

import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Sparkles,
  ArrowRight,
  Loader2,
} from "lucide-react";

import { registerUser } from "../services/auth.service";
import { useAuth } from "../context/AuthContext";

const Register = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] =
    useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setError("");
      setLoading(true);

      const response =
        await registerUser(form);

      console.log(
        "REGISTER RESPONSE:",
        response
      );

      login(response.data);

      navigate("/dashboard");

    } catch (error) {
      console.error(
        "REGISTER ERROR:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Registration failed"
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">

      {/* LEFT */}

      <div className="auth-brand-panel">

        <div className="auth-brand">

          <div className="auth-logo">
            <Sparkles size={24} />
          </div>

          <span>
            SciNova AI
          </span>

        </div>

        <div className="auth-brand-content">

          <span className="auth-small-label">
            AI RESEARCH ASSISTANT
          </span>

          <h1>
            Discover more.
            <br />
            <strong>Research smarter.</strong>
          </h1>

          <p>
            Build your scientific knowledge
            with intelligent paper analysis,
            research gap detection and AI
            assistance.
          </p>

        </div>

        <div className="auth-brand-footer">
          Your intelligent scientific research
          workspace
        </div>

      </div>


      {/* RIGHT */}

      <div className="auth-form-panel">

        <div className="auth-form-container">

          {/* MOBILE BRAND */}

          <div className="auth-mobile-brand">

            <div className="auth-logo">
              <Sparkles size={21} />
            </div>

            <strong>
              SciNova AI
            </strong>

          </div>


          {/* HEADER */}

          <div className="auth-header">

            <h2>
              Create your account
            </h2>

            <p>
              Join SciNova AI and start
              exploring scientific research.
            </p>

          </div>


          {/* ERROR */}

          {error && (

            <div className="auth-error">
              {error}
            </div>

          )}


          {/* FORM */}

          <form
            className="auth-form"
            onSubmit={handleSubmit}
          >

            {/* FULL NAME */}

            <div className="auth-field">

              <label>
                Full Name
              </label>

              <div className="auth-input-wrapper">

                <User
                  size={18}
                  className="auth-input-icon"
                />

                <input
                  type="text"
                  name="fullName"
                  placeholder="Enter your full name"
                  value={form.fullName}
                  onChange={handleChange}
                  required
                />

              </div>

            </div>


            {/* EMAIL */}

            <div className="auth-field">

              <label>
                Email Address
              </label>

              <div className="auth-input-wrapper">

                <Mail
                  size={18}
                  className="auth-input-icon"
                />

                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  value={form.email}
                  onChange={handleChange}
                  required
                />

              </div>

            </div>


            {/* PASSWORD */}

            <div className="auth-field">

              <label>
                Password
              </label>

              <div className="auth-input-wrapper">

                <Lock
                  size={18}
                  className="auth-input-icon"
                />

                <input
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  name="password"
                  placeholder="Create a password"
                  value={form.password}
                  onChange={handleChange}
                  minLength={6}
                  required
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() =>
                    setShowPassword(
                      !showPassword
                    )
                  }
                >
                  {showPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>

              </div>

              <span className="password-hint">
                Minimum 6 characters
              </span>

            </div>


            {/* REGISTER */}

            <button
              type="submit"
              className="auth-submit"
              disabled={loading}
            >

              {loading ? (

                <>
                  <Loader2
                    size={18}
                    className="spinner"
                  />

                  Creating account...

                </>

              ) : (

                <>
                  Create Account

                  <ArrowRight
                    size={18}
                  />

                </>

              )}

            </button>

          </form>


          {/* LOGIN */}

          <div className="auth-switch">

            <span>
              Already have an account?
            </span>

            <Link to="/login">
              Login
            </Link>

          </div>

        </div>

      </div>

    </div>
  );
};

export default Register;