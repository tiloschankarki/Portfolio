import React, { useEffect, useState } from "react";
import { fetchHobbies } from "../api";
import { Container, Row, Col, Card } from "react-bootstrap";

const Hobby = () => {
  const [hobbies, setHobbies] = useState([]);

  useEffect(() => {
    fetchHobbies()
      .then((data) => setHobbies(data))
      .catch((error) => console.error("Error fetching hobbies:", error));
  }, []);

  return (
    <Container className="mt-4">
      <h2 className="text-center mb-4">Hobbies</h2>
      <Row>
        {hobbies.map((hobby) => (
          <Col md={4} key={hobby.id}>
            <Card className="mb-4 shadow-sm">
              <Card.Body>
                <Card.Title>{hobby.name}</Card.Title>
                <Card.Text>{hobby.description}</Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default Hobby;
