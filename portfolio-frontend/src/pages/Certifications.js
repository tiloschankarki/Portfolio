import React, { useEffect, useState } from "react";
import { fetchCertifications } from "../api";
import { Container, Row, Col, Card } from "react-bootstrap";

const Certifications = () => {
  const [certifications, setCertifications] = useState([]);

  useEffect(() => {
    fetchCertifications()
      .then((data) => {
        console.log("Fetched Certifications:", data); // ✅ Debugging log
        setCertifications(data);
      })
      .catch((error) => console.error("Error fetching certifications:", error));
  }, []);

  return (
    <Container className="mt-4">
      <h2 className="text-center mb-4">Certifications</h2>
      <Row>
        {certifications.length > 0 ? (
          certifications.map((cert) => (
            <Col md={4} key={cert.id}>
              <Card className="mb-4 shadow-sm">
                <Card.Body>
                  <Card.Title>{cert.name}</Card.Title>
                  <Card.Text><strong>Organization:</strong> {cert.organization}</Card.Text>  {/* ✅ Fixed field */}
                  <Card.Text><strong>Issue Date:</strong> {new Date(cert.issue_date).toLocaleDateString()}</Card.Text> {/* ✅ Date formatting */}
                  <Card.Text><strong>Skills Covered:</strong> {cert.skills_covered}</Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))
        ) : (
          <p>No certifications found.</p>
        )}
      </Row>
    </Container>
  );
};

export default Certifications;
