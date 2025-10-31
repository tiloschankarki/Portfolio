import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Button, Image } from "react-bootstrap";
import { fetchProjects, fetchHobbies, fetchCertifications } from "../api";
import "./LandingPage.css";

const LandingPage = () => {
  const [projects, setProjects] = useState([]);
  const [hobbies, setHobbies] = useState([]);
  const [certs, setCerts] = useState([]);

  useEffect(() => {
    fetchProjects().then((data) => setProjects(data.slice(0, 3))); // limit to 3
    fetchHobbies().then((data) => setHobbies(data.slice(0, 2))); // limit to 2
    fetchCertifications().then((data) => setCerts(data.slice(0, 2))); // limit to 2
  }, []);

  return (
    <div className="landing-page">
      {/* HERO SECTION */}
      <section className="hero-section">
        <Container className="text-center">
          <Row className="align-items-center">
            <Col md={6}>
              <h1 className="hero-title">Hi, I’m <span className="highlight">Tiloschan Karki</span></h1>
              <p className="hero-subtitle">
                A Computer Science major passionate about building intelligent, scalable, and human-centered software.
              </p>
              <Button href="/projects" className="primary-btn">Explore My Work</Button>
            </Col>
            <Col md={6}>
              <div className="hero-image-wrapper">
                <Image
                  src="/profile.jpg"
                  alt="Tiloschan Karki"
                  className="hero-image"
                  roundedCircle
                />
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* PROJECTS PREVIEW */}
      <section className="preview-section">
        <Container>
          <div className="section-header">
            <h2>Featured Projects</h2>
            <p>Some of the work I’ve done — from hackathons to academic projects.</p>
          </div>
          <Row className="g-4">
            {projects.map((proj) => (
              <Col md={4} key={proj.id}>
                <Card className="preview-card">
                  <Card.Body>
                    <Card.Title>{proj.title}</Card.Title>
                    <Card.Text>{proj.description?.slice(0, 100)}...</Card.Text>
                    <Button href="/projects" variant="link" className="learn-btn">Learn More →</Button>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* CERTIFICATIONS PREVIEW */}
      <section className="preview-section alt-bg">
        <Container>
          <div className="section-header">
            <h2>Certifications</h2>
            <p>Credentials that validate my skills and dedication to continuous learning.</p>
          </div>
          <Row className="g-4">
            {certs.map((cert) => (
              <Col md={6} key={cert.id}>
                <Card className="preview-card">
                  <Card.Body>
                    <Card.Title>{cert.name}</Card.Title>
                    <Card.Subtitle className="text-muted mb-2">{cert.organization}</Card.Subtitle>
                    <Button href="/certifications" variant="link" className="learn-btn">View More →</Button>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* HOBBIES PREVIEW */}
      <section className="preview-section">
        <Container>
          <div className="section-header">
            <h2>Hobbies & Interests</h2>
            <p>When I’m not coding, I’m usually exploring creative outlets that keep me inspired.</p>
          </div>
          <Row className="g-4">
            {hobbies.map((hobby) => (
              <Col md={6} key={hobby.id}>
                <Card className="preview-card">
                  <Card.Img variant="top" src={hobby.image} className="hobby-img" />
                  <Card.Body>
                    <Card.Title>{hobby.title}</Card.Title>
                    <Card.Text>{hobby.description?.slice(0, 100)}...</Card.Text>
                    <Button href="/hobby" variant="link" className="learn-btn">See More →</Button>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* CTA SECTION */}
      <section className="cta-section">
        <Container className="text-center">
          <h2>Let’s Build Something Amazing Together</h2>
          <p>Have an idea or opportunity? I’d love to collaborate.</p>
          <Button href="/contact" className="primary-btn">Get In Touch</Button>
        </Container>
      </section>
    </div>
  );
};

export default LandingPage;
