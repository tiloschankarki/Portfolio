import React, { useEffect, useState } from "react";
import { fetchHobbies } from "../api";
import { Container, Row, Col, Card, Image } from "react-bootstrap";
//import "./Hobby.css";

const Hobby = () => {
  const [hobbies, setHobbies] = useState([]);

  useEffect(() => {
    fetchHobbies()
      .then((data) => {
        console.log("Fetched Hobbies:", data); // ✅ Debugging log
        setHobbies(data);
      })
      .catch((error) => console.error("Error fetching hobbies:", error));
  }, []);

  return (
    <Container className="mt-4">
      <h2 className="text-center mb-4">Hobbies</h2>
      <Row>
        {hobbies.length > 0 ? (
          hobbies.map((hobby) => (
            <Col md={4} key={hobby.id}>
              <Card className="mb-4 shadow-sm hobby-card">
                {hobby.image && <Image src={`http://127.0.0.1:8000${hobby.image}`} alt={hobby.title} fluid />}
                <Card.Body>
                  <Card.Title>{hobby.title}</Card.Title>  {/* ✅ Fixed: use `title` instead of `name` */}
                  <Card.Text>{hobby.description}</Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))
        ) : (
          <p>No hobbies found.</p>
        )}
      </Row>
    </Container>
  );
};

export default Hobby;
