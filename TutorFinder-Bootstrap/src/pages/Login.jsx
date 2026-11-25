import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const benefits = [
  { icon: "bi-mortarboard", title: "Qualified Tutors", text: "Learn from experienced tutors" },
  { icon: "bi-search", title: "Easy Tutor Search", text: "Find tutors by subject and location" },
  { icon: "bi-star", title: "Trusted Reviews", text: "Explore tutor ratings" },
];
const homeByRole = { student: "/student", tutor: "/tutor", admin: "/admin" };

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(event) {
    event.preventDefault();
    setError("");
    const result = login(email.trim(), password);
    if (!result.ok) {
      setError(result.error || result.message || "Unable to log in.");
      return;
    }
    const target = homeByRole[result.user.role];
    if (!target) {
      setError("Invalid user role.");
      return;
    }
    navigate(target);
  }

  return (
    <div className="min-vh-100 d-flex flex-column">
      <nav className="navbar tf-navbar">
        <div className="container">
          <Link className="navbar-brand tf-brand" to="/">📚 Tutor<span>Finder</span></Link>
          <Link to="/signup" className="btn btn-outline-primary">Create account</Link>
        </div>
      </nav>
      <main className="container flex-grow-1 d-flex align-items-center py-5">
        <div className="row g-0 tf-soft-card overflow-hidden w-100 mx-auto" style={{ maxWidth: 1000 }}>
          <section className="col-lg-5 tf-hero p-4 p-lg-5 rounded-0">
            <div className="display-4 mb-3">🎓</div>
            <h1 className="display-6 fw-bold">Welcome Back!</h1>
            <p className="text-white-50 mb-4">Find the perfect tutor for your learning journey.</p>
            <div className="d-grid gap-4 mt-4">
              {benefits.map((benefit) => (
                <div className="d-flex gap-3 align-items-center" key={benefit.title}>
                  <div className="tf-icon-box bg-white bg-opacity-10"><i className={`bi ${benefit.icon}`} /></div>
                  <div><div className="fw-bold">{benefit.title}</div><small className="text-white-50">{benefit.text}</small></div>
                </div>
              ))}
            </div>
          </section>
          <section className="col-lg-7 bg-white p-4 p-md-5">
            <div className="mb-4"><span className="tf-section-label">YOUR ACCOUNT</span><h2 className="h2 fw-bold mt-2 mb-1">Login</h2><p className="text-secondary">Login to your TutorFinder account.</p></div>
            {error && <div className="alert alert-danger" role="alert">{error}</div>}
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label fw-semibold" htmlFor="loginEmail">Email Address</label>
                <div className="input-group"><span className="input-group-text bg-light"><i className="bi bi-envelope" /></span><input className="form-control" type="email" id="loginEmail" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} required /></div>
              </div>
              <div className="mb-3">
                <label className="form-label fw-semibold" htmlFor="loginPassword">Password</label>
                <div className="input-group"><span className="input-group-text bg-light"><i className="bi bi-lock" /></span><input className="form-control" type="password" id="loginPassword" placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} required /></div>
              </div>
              <button type="submit" className="btn btn-primary btn-lg w-100 fw-bold mt-2">Login <i className="bi bi-arrow-right ms-2" /></button>
            </form>
            <p className="text-center text-secondary mt-4 mb-2">Don't have an account? <Link className="fw-bold" to="/signup">Create Account</Link></p>
            <p className="text-center mb-0"><Link to="/" className="text-secondary small"><i className="bi bi-arrow-left me-1" />Back to Home</Link></p>
          </section>
        </div>
      </main>
      <footer className="tf-footer py-3 text-center small text-white-50">© 2026 TutorFinder | Connecting Students with Tutors</footer>
    </div>
  );
}
