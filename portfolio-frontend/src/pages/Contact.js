import React, { useState } from "react";
import axios from "axios";
import { Container, Form, Button, Alert, Spinner } from "react-bootstrap";
import "./Contact.css";

const Contact = () => {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [charCount, setCharCount] = useState(0);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (e.target.name === "message") {
      setCharCount(e.target.value.length);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess(false);
    setError("");
    setLoading(true);

    try {
      await axios.post("http://127.0.0.1:8000/api/contact/", formData);
      setSuccess(true);
      setFormData({ name: "", email: "", message: "" });
      setCharCount(0);
    } catch (error) {
      setError("Failed to send message.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="contact-container">
      <h2 className="text-center mb-4">📩 Get in Touch</h2>

      {success && <Alert variant="success">✅ Message sent successfully!</Alert>}
      {error && <Alert variant="danger">❌ {error}</Alert>}

      <Form className="contact-form" onSubmit={handleSubmit}>
        <Form.Group className="form-group">
          <Form.Control
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="form-input"
          />
          <Form.Label className={formData.name ? "floating-label active" : "floating-label"}>Name</Form.Label>
        </Form.Group>

        <Form.Group className="form-group">
          <Form.Control
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="form-input"
          />
          <Form.Label className={formData.email ? "floating-label active" : "floating-label"}>Email</Form.Label>
        </Form.Group>

        <Form.Group className="form-group">
          <Form.Control
            as="textarea"
            name="message"
            value={formData.message}
            onChange={handleChange}
            required
            className="form-input"
            rows={4}
            maxLength={500}
          />
          <Form.Label className={formData.message ? "floating-label active" : "floating-label"}>Message</Form.Label>
          <small className="char-count">{charCount}/500</small>
        </Form.Group>

        <Button className="submit-button" type="submit" disabled={loading}>
          {loading ? <Spinner animation="border" size="sm" /> : "Send Message"}
        </Button>
      </Form>
    </Container>
  );
};

export default Contact;
