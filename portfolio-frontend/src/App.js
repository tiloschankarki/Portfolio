import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { Navbar, Nav, Container, Button } from "react-bootstrap";
import Education from "./pages/Education";
import Projects from "./pages/Projects";
import Blog from "./pages/Blog";
import Certifications from "./pages/Certifications";
import Contact from "./pages/Contact";
import Hobby from "./pages/Hobby";
import "./App.css"; // Import new CSS for styling
import "@fortawesome/fontawesome-free/css/all.min.css";


function HomePage() {
  return (
    <div className="hero-section">
      <Container className="text-center">
        {/* 🌟 Profile Picture (Circular Avatar) */}
        <img src="/profile.jpeg" alt="Profile" className="hero-avatar" />

        <h1 className="hero-title">Hey, I'm Tiloschan Karki 👋</h1>
        <p className="hero-subtitle">A passionate developer crafting amazing projects.</p>
        <p className="hero-description">I am a junior majoring in Computer Science at Texas State University, experiencing innovation through computers.</p>

        {/* Social Icons */}
        <div className="social-links">
          <a href="https://github.com/tiloschankarki" target="_blank" rel="noopener noreferrer">
            <i className="fab fa-github"></i>
          </a>
          <a href="https://linkedin.com/in/tiloschankarki" target="_blank" rel="noopener noreferrer">
            <i className="fab fa-linkedin"></i>
          </a>
          <a href="TiloschanResume.pdf" target="_blank">
            <i className="fas fa-file-alt"></i>
          </a>
        </div>

        <Button variant="outline-dark" className="cta-button" as={Link} to="/projects">
          View My Work 🚀
        </Button>
      </Container>
    </div>
  );
}


function App() {
  return (
    <Router>
      {/* Modern Navbar */}
      <Navbar className="custom-navbar" expand="lg">
        <Container>
          <Navbar.Brand as={Link} to="/">Tfolio</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              <Nav.Link as={Link} to="/education">Education</Nav.Link>
              <Nav.Link as={Link} to="/projects">Projects</Nav.Link>
              <Nav.Link as={Link} to="/blog">Blog</Nav.Link>
              <Nav.Link as={Link} to="/certifications">Certifications</Nav.Link>
              <Nav.Link as={Link} to="/hobby">Hobby</Nav.Link>
              <Nav.Link as={Link} to="/contact">Contact</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Hero Section */}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/education" element={<Education />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/certifications" element={<Certifications />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/hobby" element={<Hobby />} />
      </Routes>
    </Router>
  );
}

export default App;
