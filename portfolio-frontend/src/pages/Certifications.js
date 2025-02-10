import React, { useEffect, useState } from "react";
import { fetchCertifications } from "../api";
import { Container, Row, Col, Card } from "react-bootstrap";

const Certifications = () => {
  const [certifications, setCertifications] = useState([]);

  useEffect(() => {
    fetchCertifications()
      .then((data) => setCertifications(data))
      .catch((error) => console.error("Error fetching certifications:", error));
  }, []);

  return (
    <Container className="mt-4">
      <h2 className="text-center mb-4">Certifications</h2>
      <Row>
        {certifications.map((cert) => (
          <Col md={4} key={cert.id}>
            <Card className="mb-4 shadow-sm">
              <Card.Body>
                <Card.Title>{cert.name}</Card.Title>
                <Card.Text>
                  <strong>Issued by:</strong> {cert.issuer}<br />
                  <strong>Date:</strong> {cert.date}
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default Certifications;
