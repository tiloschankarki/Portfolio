import React, { useEffect, useState } from "react";
import { fetchProjects } from "../api";
import { Container, Row, Col, Card } from "react-bootstrap";  // ✅ Import Bootstrap components

const Projects = () => {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    fetchProjects()
      .then((data) => setProjects(data))
      .catch((error) => console.error("Error fetching projects:", error));
  }, []);

  return (
    <Container className="mt-4">
      <h2 className="text-center mb-4">Projects</h2>
      <Row>
        {projects.map((project) => (
          <Col md={4} key={project.id}>
            <Card className="mb-4 shadow-sm">
              <Card.Body>
                <Card.Title>{project.title}</Card.Title>
                <Card.Text>{project.description}</Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default Projects;
