import React, { useEffect, useState } from "react";
import { fetchProjects } from "../api";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import "./Projects.css";

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [hoveredProject, setHoveredProject] = useState(null);

  // Define an array of HEX colors
  const colors = ['#6bab90', '#e1f0c4', '#55917f'];

  useEffect(() => {
    fetchProjects()
      .then((data) => {
        console.log("API Response:", data); // Debug API response
        setProjects(data);
      })
      .catch((error) => console.error("Error fetching projects:", error));
  }, []);

  return (
    <Container className="mt-4">
      <h3>Projects</h3>
      <Row>
        {projects.map((project, index) => {
          const bgColor = colors[index % colors.length]; // Loop colors
          return (
            <Col md={4} key={project.id}>
              <Card
                className={`mb-4 flashcard project-card ${hoveredProject === project.id ? "expanded" : ""}`}
                style={{ backgroundColor: bgColor, color: "#000" }}
                onMouseEnter={() => setHoveredProject(project.id)}
                onMouseLeave={() => setHoveredProject(null)}
              >
                <Card.Body>
                  <Card.Title>{project.title}</Card.Title>
                  {/* Expand on hover to show extra details */}
                  <div className={`expanded-details ${hoveredProject === project.id ? "visible" : ""}`}>
                    <p><strong>Description:</strong> {project.description}</p>
                    <p><strong>Tech Stack:</strong> {project.tech_stack}</p>
                    <p><strong>Role:</strong> {project.role}</p>
                    <p><strong>Skills Learned:</strong> {project.skills_learned}</p>
                    <p><strong>Category:</strong> {project.category}</p>
                      <a href={project.repo_link} target="_blank" rel="noopener noreferrer">
                        <Button className="project-button">Take Me to Project</Button>
                      </a>
                
                  </div>
                </Card.Body>
              </Card>
            </Col>
          );
        })}
      </Row>
    </Container>
  );
};

export default Projects;
