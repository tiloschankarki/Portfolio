import React, { useEffect, useState } from "react";
import { fetchCertifications } from "../api";
import { Container, Row, Col, Card, Modal, Button, Badge } from "react-bootstrap";
import "./Certifications.css";

const Certifications = () => {
  const [certifications, setCertifications] = useState([]);
  const [selectedCertification, setSelectedCertification] = useState(null);

  const colors = ["#028090", "#f45b69", "#b8e0d2", "#456990"];

  useEffect(() => {
    fetchCertifications()
      .then((data) => setCertifications(data))
      .catch((error) => console.error("Error fetching certifications:", error));
  }, []);

  return (
    <Container className="certifications-section py-5">
      <h2 className="section-title text-center mb-4">Certifications</h2>
      <Row className="g-4">
        {certifications.map((cert, index) => {
          const accentColor = colors[index % colors.length];
          return (
            <Col md={6} lg={4} key={cert.id}>
              <Card
                className="cert-card shadow-sm h-100"
                onClick={() => setSelectedCertification(cert)}
              >
                <div
                  className="accent-bar"
                  style={{ backgroundColor: accentColor }}
                ></div>
                <Card.Body>
                  <Card.Title>{cert.name}</Card.Title>
                  <Card.Subtitle className="text-muted mb-2">
                    {cert.organization}
                  </Card.Subtitle>
                  <Card.Text className="small text-muted">
                    {cert.issue_date && (
                      <span>
                        <strong>Date:</strong>{" "}
                        {new Date(cert.issue_date).toLocaleDateString()}
                      </span>
                    )}
                  </Card.Text>

                  {/* Skills badges */}
                  {cert.skills_covered && (
                    <div className="skills-section">
                      {cert.skills_covered.split(",").map((skill, i) => (
                        <Badge bg="light" text="dark" className="me-1 mb-1" key={i}>
                          {skill.trim()}
                        </Badge>
                      ))}
                    </div>
                  )}

                  <Button variant="link" className="view-details-btn p-0 mt-2">
                    View Details →
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          );
        })}
      </Row>

      {/* Modal */}
      {selectedCertification && (
        <Modal
          show={true}
          onHide={() => setSelectedCertification(null)}
          size="lg"
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title>{selectedCertification.name}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>
              <strong>Issued By:</strong> {selectedCertification.organization}
            </p>
            <p>
              <strong>Issue Date:</strong>{" "}
              {new Date(selectedCertification.issue_date).toLocaleDateString()}
            </p>
            <p>
              <strong>Skills Covered:</strong> {selectedCertification.skills_covered}
            </p>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => setSelectedCertification(null)}
            >
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </Container>
  );
};

export default Certifications;
