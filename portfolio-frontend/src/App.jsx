import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { Navbar, Nav, Container } from "react-bootstrap";
import LandingPage from "./pages/LandingPage";
import Education from "./pages/Education";
import Projects from "./pages/Projects";
import Blog from "./pages/Blog";
import Certifications from "./pages/Certifications";
import Contact from "./pages/Contact";
import Hobby from "./pages/Hobby";
import "./App.css";

function App() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <Router>
      {/* Navbar */}
      <Navbar
        expand="lg"
        style={{
          backgroundColor: "#011627",
          fontFamily: "'Archivo', sans-serif",
          position: "fixed",
          top: 0,
          width: "100%",
          zIndex: 1000,
          transition: "box-shadow 0.3s ease-in-out",
          boxShadow: isScrolled ? "0 2px 12px rgba(0,0,0,0.3)" : "none",
        }}
      >
        <Container>
          <Navbar.Brand
            as={Link}
            to="/"
            style={{
              color: "white",
              fontWeight: "700",
              textDecoration: "none",
              fontSize: "1.5rem",
            }}
          >
            Tfolio
          </Navbar.Brand>

          <Navbar.Toggle aria-controls="navbar-nav" style={{ backgroundColor: "white" }} />

          <Navbar.Collapse id="navbar-nav">
            <Nav className="ms-auto">
              {["Education", "Projects", "Blog", "Certifications", "Hobby", "Contact"].map(
                (item) => (
                  <Nav.Link
                    key={item}
                    as={Link}
                    to={`/${item.toLowerCase()}`}
                    style={{
                      color: "white",
                      fontWeight: "500",
                      textDecoration: "none",
                      marginLeft: "20px",
                    }}
                    onMouseEnter={(e) => (e.target.style.color = "#41EAD4")}
                    onMouseLeave={(e) => (e.target.style.color = "white")}
                  >
                    {item}
                  </Nav.Link>
                )
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Routes */}
      <div style={{ marginTop: "90px" }}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/education" element={<Education />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/certifications" element={<Certifications />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/hobby" element={<Hobby />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
