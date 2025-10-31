import React, { useEffect, useState } from "react";
import { fetchProjects } from "../api";
import { Container, Row, Col, Card, Badge } from "react-bootstrap";
import "./Projects.css";

const Projects = () => {
  const [projects, setProjects] = useState([]);

  const colors = ["#028090", "#f45b69", "#b8e0d2", "#456990"]; // accent bar palette

  useEffect(() => {
    fetchProjects()
      .then((data) => {
        console.log("API Response:", data);
        setProjects(data);
      })
      .catch((error) => console.error("Error fetching projects:", error));
  }, []);

  return (
    <Container className="projects-container py-5">
      <h2 className="page-title mb-4">Featured Projects</h2>
      <Row className="g-4">
        {projects.map((project, index) => {
          const accentColor = colors[index % colors.length];
          return (
            <Col md={4} sm={6} xs={12} key={project.id}>
              <Card className="project-card shadow-sm h-100">
                {/* Accent color bar */}
                <div className="accent-bar" style={{ backgroundColor: accentColor }}></div>
                <Card.Body>
                  <Card.Title className="fw-semibold mb-2">{project.title}</Card.Title>
                  <Card.Text className="text-muted small mb-3">
                    {project.description?.slice(0, 100)}...
                  </Card.Text>

                  <div className="tech-stack mb-3">
                    {project.tech_stack &&
                      project.tech_stack.split(",").map((tech, i) => (
                        <Badge bg="light" text="dark" key={i} className="me-1 mb-1 tech-badge">
                          {tech.trim()}
                        </Badge>
                      ))}
                  </div>

                  {project.repo_link && (
                    <a
                      href={project.repo_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="view-btn"
                    >
                      View Project ↗
                    </a>
                  )}
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
