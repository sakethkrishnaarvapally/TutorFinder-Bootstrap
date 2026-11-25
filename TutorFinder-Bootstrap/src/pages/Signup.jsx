import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const initialForm = {
  name: "", email: "", password: "", confirm: "", role: "student",
  subject: "", qualification: "", experience: "", location: "",
  fee: "", availability: "",
};

export default function Signup() {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((previous) => ({ ...previous, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setError("");

    if (form.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (form.password !== form.confirm) {
      setError("Passwords do not match.");
      return;
    }
    if (form.role === "tutor" && (!form.subject || !form.qualification || !form.experience || !form.location || !form.fee || !form.availability)) {
      setError("Please complete all tutor profile fields.");
      return;
    }

    const result = signup(form);
    if (!result.ok) {
      setError(result.error || "Unable to create your account.");
      return;
    }

    window.alert(form.role === "tutor" ? "Tutor account created! Wait for admin approval." : "Account created! Please log in.");
    navigate("/login");
  };

  return (
    <div className="min-vh-100 d-flex flex-column">
      <nav className="navbar tf-navbar">
        <div className="container">
          <Link className="navbar-brand tf-brand" to="/">📚 Tutor<span>Finder</span></Link>
          <Link to="/login" className="btn btn-outline-primary">Login</Link>
        </div>
      </nav>
      <main className="container py-5 flex-grow-1">
        <div className="row justify-content-center">
          <div className="col-lg-9 col-xl-8">
            <div className="card tf-soft-card border-0">
              <div className="card-body p-4 p-md-5">
                <div className="text-center mb-4">
                  <span className="tf-section-label">JOIN TUTORFINDER</span>
                  <h1 className="tf-page-title mt-2 mb-1">Create Your Account</h1>
                  <p className="text-secondary mb-0">Join as a student or a tutor.</p>
                </div>
                {error && <div className="alert alert-danger">{error}</div>}
                <form onSubmit={handleSubmit}>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label fw-semibold" htmlFor="signupName">Full name</label>
                      <input className="form-control" id="signupName" name="name" value={form.name} onChange={handleChange} placeholder="Enter your name" required />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-semibold" htmlFor="signupEmail">Email address</label>
                      <input className="form-control" type="email" id="signupEmail" name="email" value={form.email} onChange={handleChange} placeholder="Enter your email" required />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-semibold" htmlFor="signupRole">I am a</label>
                      <select className="form-select" id="signupRole" name="role" value={form.role} onChange={handleChange}>
                        <option value="student">Student</option>
                        <option value="tutor">Tutor</option>
                      </select>
                    </div>
                    {form.role === "tutor" && (
                      <>
                        <div className="col-12"><hr /><h2 className="h5 fw-bold">Tutor Profile Details</h2></div>
                        <div className="col-md-6"><label className="form-label fw-semibold">Subject</label><input className="form-control" name="subject" value={form.subject} onChange={handleChange} placeholder="e.g. Mathematics" required /></div>
                        <div className="col-md-6"><label className="form-label fw-semibold">Qualification</label><input className="form-control" name="qualification" value={form.qualification} onChange={handleChange} placeholder="e.g. M.Sc Mathematics" required /></div>
                        <div className="col-md-6"><label className="form-label fw-semibold">Experience</label><input className="form-control" name="experience" value={form.experience} onChange={handleChange} placeholder="e.g. 3 Years" required /></div>
                        <div className="col-md-6"><label className="form-label fw-semibold">Location</label><input className="form-control" name="location" value={form.location} onChange={handleChange} placeholder="e.g. Hyderabad" required /></div>
                        <div className="col-md-6"><label className="form-label fw-semibold">Fee per hour (₹)</label><input className="form-control" type="number" min="1" name="fee" value={form.fee} onChange={handleChange} placeholder="e.g. 500" required /></div>
                        <div className="col-md-6"><label className="form-label fw-semibold">Availability</label><select className="form-select" name="availability" value={form.availability} onChange={handleChange} required><option value="">Select availability</option><option>Morning</option><option>Afternoon</option><option>Evening</option><option>Weekend</option></select></div>
                      </>
                    )}
                    <div className="col-md-6"><label className="form-label fw-semibold" htmlFor="signupPassword">Password</label><input className="form-control" type="password" id="signupPassword" name="password" value={form.password} onChange={handleChange} placeholder="At least 6 characters" required /></div>
                    <div className="col-md-6"><label className="form-label fw-semibold" htmlFor="signupConfirm">Confirm password</label><input className="form-control" type="password" id="signupConfirm" name="confirm" value={form.confirm} onChange={handleChange} placeholder="Re-enter your password" required /></div>
                  </div>
                  <button type="submit" className="btn btn-primary btn-lg w-100 mt-4 fw-bold">Create account <i className="bi bi-arrow-right ms-2" /></button>
                </form>
                <p className="text-center text-secondary mt-4 mb-0">Already have an account? <Link to="/login" className="fw-bold">Log in</Link></p>
                <p className="text-center mt-2 mb-0"><Link to="/" className="small text-secondary">Back to home</Link></p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <footer className="tf-footer py-3 text-center small text-white-50">© 2026 TutorFinder. All Rights Reserved.</footer>
    </div>
  );
}
