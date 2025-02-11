import React, { useEffect, useState } from "react";
import { fetchCertifications } from "../api";
import { Container, Row, Col, Card, Modal, Button } from "react-bootstrap";
import "./Certifications.css";

const Certifications = () => {
  const [certifications, setCertifications] = useState([]);
  const [selectedCertification, setSelectedCertification] = useState(null);

  // Define an array of four HEX colors
  const colors = ['#e1f0c4','#6bab90','#55917f','#5e4c5a' ];
  useEffect(() => {
    fetchCertifications()
      .then((data) => setCertifications(data))
      .catch((error) => console.error("Error fetching certifications:", error));
  }, []);

  // Function to determine text color based on background brightness
  const getTextColor = (bgColor) => {
    const hex = bgColor.replace("#", "");
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);

    // Calculate brightness using the luminance formula
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness > 128 ? "#000000" : "#FFFFFF"; // Use black for bright colors, white for dark colors
  };

  return (
    <Container className="mt-4">
      <h2>Certifications</h2>
      <Row>
        {certifications.map((cert, index) => {
          const bgColor = colors[index % colors.length];
          const textColor = getTextColor(bgColor);

          return (
            <Col md={4} key={cert.id}>
              <Card
                className="mb-4 flashcard cert-card"
                style={{ backgroundColor: bgColor, color: textColor }}
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
