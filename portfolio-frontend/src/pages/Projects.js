import React, { useEffect, useState } from "react";
import { fetchProjects } from "../api";
import { Container, Row, Col, Card } from "react-bootstrap";
import "./Projects.css";

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [hoveredProject, setHoveredProject] = useState(null);

  // Define an array of four HEX colors
  const colors = ['#e1f0c4','#6bab90','#55917f','#5e4c5a','#694838' ];
  
  useEffect(() => {
    fetchProjects()
      .then((data) => {
        console.log("API Response:", data); // Debug API response
        setProjects(data);
      })
      .catch((error) => console.error("Error fetching projects:", error));
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
      <h2>Projects</h2>
      <Row>
        {projects.map((project, index) => {
          const bgColor = colors[index % colors.length]; // Loop colors
          const textColor = getTextColor(bgColor); // Get suitable text color

          return (
            <Col md={4} key={project.id}>
              <Card
                className={`mb-4 flashcard project-card ${hoveredProject === project.id ? "expanded" : ""}`}
                style={{ backgroundColor: bgColor, color: textColor }}
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
