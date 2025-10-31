import React, { useEffect, useState } from "react";
import { fetchHobbies } from "../api";
import { Container, Row, Col, Card, Image } from "react-bootstrap";
import "./Hobby.css";

const Hobby = () => {
  const [hobbies, setHobbies] = useState([]);
  const colors = ["#028090", "#f45b69", "#b8e0d2", "#456990"];
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "https://tfolio.duckdns.org/api";

  useEffect(() => {
    fetchHobbies()
      .then((data) => setHobbies(data))
      .catch((error) => console.error("Error fetching hobbies:", error));
  }, []);

  return (
    <Container className="hobbies-section py-5">
      <h2 className="section-title mb-4 text-center">Hobbies & Interests</h2>
      <Row className="g-4">
        {hobbies.map((hobby, index) => {
          const accentColor = colors[index % colors.length];
          const imageUrl = hobby.image.startsWith("http")
            ? hobby.image
            : `${API_BASE_URL}/static/${hobby.image.replace(/^\/|static\//g, "")}`;

          return (
            <Col md={6} lg={4} key={hobby.id}>
              <Card className="hobby-card shadow-sm h-100">
                <div
                  className="accent-bar"
                  style={{ backgroundColor: accentColor }}
                ></div>
                {hobby.image && (
                  <Image
                    src={imageUrl}
                    className="hobby-img-top"
                    alt={hobby.title}
                    onError={(e) => {
                      e.target.src = "/placeholder.png";
                    }}
                  />
                )}
                <Card.Body>
                  <Card.Title>{hobby.title}</Card.Title>
                  <Card.Text>{hobby.description}</Card.Text>
                </Card.Body>
              </Card>
            </Col>
          );
        })}
      </Row>
    </Container>
  );
};

export default Hobby;
