import React, { useEffect, useState } from "react";
import { fetchProjects } from "../api";
import { Container, Row, Col, Card, Image } from "react-bootstrap";
//import "./Projects.css";

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);

  useEffect(() => {
    fetchProjects()
      .then((data) => {
        console.log("Fetched Projects:", data); // ✅ Debugging log
        setProjects(data);
      })
      .catch((error) => console.error("Error fetching projects:", error));
  }, []);

  return (
    <Container className="mt-4">
      <h2 className="text-center mb-4">Projects</h2>
      <Row>
        {projects.length > 0 ? (
          projects.map((project) => (
            <Col md={4} key={project.id}>
              <Card 
                className={`mb-4 shadow-sm project-card ${selectedProject === project.id ? "expanded" : ""}`} 
                onClick={() => setSelectedProject(selectedProject === project.id ? null : project.id)}
              >
                {project.image && <Image src={`http://127.0.0.1:8000${project.image}`} alt={project.title} fluid />}
                <Card.Body>
                  <Card.Title>{project.title}</Card.Title>
                  
                  {selectedProject === project.id ? (
                    <>
                      <Card.Text><strong>Description:</strong> {project.description}</Card.Text>  {/* ✅ Fixed */}
                      <Card.Text><strong>Tech Stack:</strong> {project.tech_stack}</Card.Text>
                      <Card.Text><strong>Role:</strong> {project.role}</Card.Text>
                      <Card.Text><strong>Skills Learned:</strong> {project.skills_learned}</Card.Text>
                      <Card.Text><strong>Created:</strong> {new Date(project.created_at).toLocaleDateString()}</Card.Text>
                    </>
                  ) : (
                    <Card.Text className="short-description">{project.description.substring(0, 50)}...</Card.Text>
                  )}

                </Card.Body>
              </Card>
            </Col>
          ))
        ) : (
          <p>No projects found.</p>
        )}
      </Row>
    </Container>
  );
};

export default Projects;
