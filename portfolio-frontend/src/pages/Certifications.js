import React, { useEffect, useState } from "react";
import { fetchCertifications } from "../api";
import { Container, Row, Col, Card, Modal, Button } from "react-bootstrap";
import "./Certifications.css";

const Certifications = () => {
  const [certifications, setCertifications] = useState([]);
  const [selectedCertification, setSelectedCertification] = useState(null);

  // Define an array of four HEX colors
  const colors = ['#6bab90','#e1f0c4','#55917f',];
  useEffect(() => {
    fetchCertifications()
      .then((data) => setCertifications(data))
      .catch((error) => console.error("Error fetching certifications:", error));
  }, []);

  return (
    <Container className="mt-4">
      <h3>Certifications</h3>
      <Row>
        {certifications.map((cert, index) => {
          const bgColor = colors[index % colors.length];

          return (
            <Col md={4} key={cert.id}>
              <Card
                className="mb-4 flashcard cert-card"
                style={{ backgroundColor: bgColor, color:colors }}
                onClick={() => setSelectedCertification(cert)}
              >
                <Card.Body>
                  <Card.Title>{cert.name}</Card.Title>
                  <Card.Text><strong>Issued By:</strong> {cert.organization}</Card.Text>
                  <Card.Text><strong>Date:</strong> {cert.issue_date}</Card.Text>
                  <Card.Text><strong>Skills Covered:</strong> {cert.skills_covered}</Card.Text>
                </Card.Body>
              </Card>
            </Col>
          );
        })}
      </Row>

      {selectedCertification && (
        <Modal show={true} onHide={() => setSelectedCertification(null)} size="lg" centered>
          <Modal.Header closeButton>
            <Modal.Title>{selectedCertification.name}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p><strong>Issued By:</strong> {selectedCertification.organization}</p>
            <p><strong>Issue Date:</strong> {selectedCertification.issue_date}</p>
            <p><strong>Skills Covered:</strong> {selectedCertification.skills_covered}</p>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setSelectedCertification(null)}>Close</Button>
          </Modal.Footer>
        </Modal>
      )}
    </Container>
  );
};

export default Certifications;
