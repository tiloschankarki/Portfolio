import React, { useState } from "react";
import axios from "axios";
import { Container, Row, Col, Form, Button, Alert, Spinner } from "react-bootstrap";
import "./Contact.css";

const Contact = () => {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [charCount, setCharCount] = useState(0);

  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "https://tfolio.duckdns.org/api";

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (e.target.name === "message") setCharCount(e.target.value.length);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess(false);
    setError("");
    setLoading(true);
    try {
      await axios.post(`${API_BASE_URL}/contact/`, formData, {
        headers: { "Content-Type": "application/json" },
      });
      setSuccess(true);
      setFormData({ name: "", email: "", message: "" });
      setCharCount(0);
    } catch {
      setError("Failed to send message. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="contact-section py-5">
      <Row className="align-items-stretch g-4">
        {/* Left: Form */}
        <Col md={6}>
          <h2 className="section-title mb-3">Get in Touch</h2>
          {success && <Alert variant="success">✅ Message sent successfully!</Alert>}
          {error && <Alert variant="danger">❌ {error}</Alert>}

          <Form onSubmit={handleSubmit} className="contact-form">
            {["name", "email"].map((field) => (
              <Form.Group key={field} className="mb-3">
                <Form.Label className="form-label">{field === "name" ? "Name" : "Email"}</Form.Label>
                <Form.Control
                  type={field === "email" ? "email" : "text"}
                  name={field}
                  value={formData[field]}
                  onChange={handleChange}
                  required
                  className="form-control-custom"
                />
              </Form.Group>
            ))}

            <Form.Group className="mb-3">
              <Form.Label className="form-label">Message</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                maxLength={500}
                className="form-control-custom"
              />
              <small className="char-count">{charCount}/500</small>
            </Form.Group>

            <Button type="submit" className="btn-send" disabled={loading}>
              {loading ? <Spinner animation="border" size="sm" /> : "Send Message"}
            </Button>
          </Form>
        </Col>

        {/* Right: Info */}
        <Col md={6}>
          <div className="contact-info-card h-100 d-flex flex-column justify-content-center">
            <h4>Let's Connect</h4>
            <p>I’m always open to collaboration, internships, or just a friendly chat about tech!</p>
            <ul className="list-unstyled">
              <li>📧 <a href="mailto:tiloschan@example.com">tiloschan@example.com</a></li>
              <li>🌐 tfolio.duckdns.org</li>
              <li>📍 Texas, USA</li>
            </ul>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Contact;
