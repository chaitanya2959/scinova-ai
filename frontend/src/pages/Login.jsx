import { useState } from "react";
import {
  Link,
  useNavigate,
} from "react-router-dom";

import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  Sparkles,
  ArrowRight,
  Loader2,
} from "lucide-react";

import { loginUser } from "../services/auth.service";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({
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
        await loginUser(form);

      console.log(
        "LOGIN RESPONSE:",
        response
      );

      login(response.data);

      navigate("/dashboard");

    } catch (error) {
      console.error(
        "LOGIN ERROR:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Invalid email or password"
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">

      {/* LEFT SIDE */}

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
            SCIENTIFIC DISCOVERY PLATFORM
          </span>

          <h1>
            Accelerate your
            <br />
            <strong>scientific research.</strong>
          </h1>

          <p>
            Analyze research papers,
            discover research gaps and
            explore scientific knowledge
            with AI.
          </p>

        </div>

        <div className="auth-brand-footer">
          AI-powered research intelligence
        </div>

      </div>


      {/* RIGHT SIDE */}

      <div className="auth-form-panel">

        <div className="auth-form-container">

          {/* MOBILE LOGO */}

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
              Welcome back
            </h2>

            <p>
              Sign in to continue your
              research journey.
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
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={handleChange}
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

            </div>


            {/* LOGIN BUTTON */}

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

                  Logging in...

                </>

              ) : (

                <>
                  Login

                  <ArrowRight
                    size={18}
                  />

                </>

              )}

            </button>

          </form>


          {/* REGISTER */}

          <div className="auth-switch">

            <span>
              Don't have an account?
            </span>

            <Link to="/register">
              Create Account
            </Link>

          </div>

        </div>

      </div>

    </div>
  );
};

export default Login;