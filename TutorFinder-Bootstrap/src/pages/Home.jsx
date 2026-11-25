import { Link } from "react-router-dom";

const features = [
  { icon: "bi-search", title: "Easy Tutor Search", text: "Search tutors by subject, location and availability.", tone: "primary" },
  { icon: "bi-mortarboard", title: "Qualified Tutors", text: "View tutor qualifications, experience and expertise.", tone: "success" },
  { icon: "bi-cash-coin", title: "Affordable Fees", text: "Compare tutor fees and choose according to your budget.", tone: "warning" },
  { icon: "bi-star", title: "Reviews & Ratings", text: "Check ratings before choosing a tutor.", tone: "info" },
];
const steps = [
  ["Create Account", "Register as a student or tutor."],
  ["Search Tutor", "Search using subject and location."],
  ["View Profile", "Check qualifications, fees and experience."],
  ["Send Request", "Send a request and start learning."],
];

export default function Home() {
  return (
    <>
      <nav className="navbar navbar-expand-lg tf-navbar sticky-top">
        <div className="container">
          <Link className="navbar-brand tf-brand" to="/">📚 Tutor<span>Finder</span></Link>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#homeNav" aria-controls="homeNav" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon" />
          </button>
          <div className="collapse navbar-collapse" id="homeNav">
            <div className="navbar-nav ms-auto align-items-lg-center gap-lg-3">
              <NavHomeLink to="/">Home</NavHomeLink>
              <a className="nav-link fw-semibold" href="#features">Features</a>
              <a className="nav-link fw-semibold" href="#how-it-works">How It Works</a>
              <Link className="nav-link fw-semibold" to="/login">Login</Link>
              <Link className="btn btn-primary rounded-pill px-4" to="/signup">Sign Up</Link>
            </div>
          </div>
        </div>
      </nav>

      <main>
        <section className="container py-4 py-lg-5">
          <div className="tf-hero p-4 p-lg-5">
            <div className="row align-items-center g-5">
              <div className="col-lg-7">
                <span className="badge rounded-pill bg-white text-primary mb-3 px-3 py-2">🎓 PERSONALIZED LEARNING</span>
                <h1 className="display-4 fw-bold lh-sm mb-3">Find the Right Tutor <span className="d-block text-warning">For Your Learning</span></h1>
                <p className="lead text-white-50 mb-4">Connect with qualified home tutors based on subject, location, availability and fees.</p>
                <div className="d-flex flex-column flex-sm-row gap-3">
                  <Link to="/login" className="btn btn-light btn-lg text-primary fw-bold px-4"> <i className="bi bi-search me-2" />Find a Tutor</Link>
                  <Link to="/signup" className="btn btn-outline-light btn-lg fw-bold px-4"><i className="bi bi-person-workspace me-2" />Become a Tutor</Link>
                </div>
                <div className="row g-3 mt-4">
                  {[["100+", "Qualified Tutors"], ["20+", "Subjects"], ["500+", "Students"]].map(([value, label]) => (
                    <div className="col-4" key={label}><div className="border-start border-white border-opacity-25 ps-3"><div className="fs-3 fw-bold">{value}</div><div className="small text-white-50">{label}</div></div></div>
                  ))}
                </div>
              </div>
              <div className="col-lg-5">
                <div className="bg-white bg-opacity-10 border border-white border-opacity-25 rounded-4 p-4 text-center">
                  <div className="display-1 mb-3">👨‍🏫 📚 👩‍🎓</div>
                  <div className="row g-2">
                    <div className="col-6"><div className="bg-white text-dark rounded-3 p-3 fw-semibold">⭐ 4.9 Rating</div></div>
                    <div className="col-6"><div className="bg-white text-dark rounded-3 p-3 fw-semibold">🎓 Qualified</div></div>
                  </div>
                  <p className="small text-white-50 mt-3 mb-0">Find. Connect. Learn.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="container py-5">
          <div className="text-center mb-4">
            <span className="tf-section-label">OUR FEATURES</span>
            <h2 className="tf-page-title mt-2">Everything You Need to Learn Better</h2>
            <p className="tf-muted">Find the right tutor and make your learning experience easier.</p>
          </div>
          <div className="row g-4">
            {features.map((feature) => (
              <div className="col-sm-6 col-lg-3" key={feature.title}>
                <div className="card tf-soft-card h-100">
                  <div className="card-body p-4">
                    <div className={`tf-icon-box bg-${feature.tone}-subtle text-${feature.tone} mb-3`}><i className={`bi ${feature.icon}`} /></div>
                    <h3 className="h5 fw-bold">{feature.title}</h3>
                    <p className="text-secondary mb-0">{feature.text}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section id="how-it-works" className="bg-white py-5">
          <div className="container">
            <div className="text-center mb-4">
              <span className="tf-section-label">SIMPLE PROCESS</span>
              <h2 className="tf-page-title mt-2">How TutorFinder Works</h2>
              <p className="tf-muted">Get connected with the right tutor in four simple steps.</p>
            </div>
            <div className="row g-4">
              {steps.map(([title, text], index) => (
                <div className="col-6 col-lg-3" key={title}>
                  <div className="text-center h-100 p-3">
                    <div className="rounded-circle bg-primary text-white fw-bold fs-4 d-inline-flex align-items-center justify-content-center mb-3" style={{ width: 56, height: 56 }}>{index + 1}</div>
                    <h3 className="h5 fw-bold">{title}</h3>
                    <p className="text-secondary small">{text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="container py-5">
          <div className="tf-hero p-4 p-lg-5 d-flex flex-column flex-lg-row align-items-lg-center justify-content-between gap-3">
            <div><h2 className="h2 fw-bold">Ready to Start Learning?</h2><p className="mb-0 text-white-50">Find a qualified tutor who matches your learning requirements.</p></div>
            <Link to="/signup" className="btn btn-light btn-lg text-primary fw-bold px-4">Get Started <i className="bi bi-arrow-right ms-1" /></Link>
          </div>
        </section>
      </main>

      <footer className="tf-footer py-5">
        <div className="container">
          <div className="row g-4">
            <div className="col-md-6"><div className="fs-4 fw-bold text-white">📚 TutorFinder</div><p className="text-white-50">Connecting students with the right tutors.</p></div>
            <div className="col-6 col-md-3"><h3 className="h6 text-white">Quick Links</h3><div className="d-flex flex-column gap-2"><Link className="text-white-50" to="/">Home</Link><Link className="text-white-50" to="/login">Login</Link><Link className="text-white-50" to="/signup">Sign Up</Link></div></div>
            <div className="col-6 col-md-3"><h3 className="h6 text-white">Platform</h3><div className="d-flex flex-column gap-2"><a className="text-white-50" href="#features">Features</a><a className="text-white-50" href="#how-it-works">How It Works</a></div></div>
          </div>
          <hr className="border-secondary" />
          <p className="text-center small text-white-50 mb-0">© 2026 TutorFinder. All Rights Reserved.</p>
        </div>
      </footer>
    </>
  );
}

function NavHomeLink({ to, children }) {
  return <Link className="nav-link fw-semibold" to={to}>{children}</Link>;
}
