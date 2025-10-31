import React, { useEffect, useState } from "react";
import { fetchEducation } from "../api";
import { Container, Row, Col, Card, Badge } from "react-bootstrap";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import "./Education.css";

const getSubjectIcon = (courseName) => {
  const n = courseName.toLowerCase();
  if (n.includes("computer") || n.includes("software")) return "💻";
  if (n.includes("math")) return "📐";
  if (n.includes("data") || n.includes("analysis")) return "📊";
  if (n.includes("engineering")) return "🔧";
  return "📚";
};

const Education = () => {
  const [education, setEducation] = useState(null);

  useEffect(() => {
    fetchEducation()
      .then((data) => setEducation(data))
      .catch((err) => console.error("Error fetching education:", err));
  }, []);

  return (
    <Container className="education-section py-5">
      {education && education.degree_progress && (
        <div className="degree-progress text-center mb-5">
          <div className="progress-wrapper mx-auto">
            <CircularProgressbar
              value={education.degree_progress.progress}
              text={`${education.degree_progress.progress}%`}
              styles={buildStyles({
                textColor: "#028090",
                pathColor: "#028090",
                trailColor: "#d1d5db",
              })}
            />
          </div>
          <p className="progress-label">Degree Completion</p>
        </div>
      )}

      <h2 className="section-title text-center mb-4">Academic Coursework</h2>
      <Row className="g-4">
        {education &&
          education.coursework.map((course) => (
            <Col md={6} lg={4} key={course.id}>
              <Card className="course-card shadow-sm h-100">
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <span className="icon">{getSubjectIcon(course.course_name)}</span>
                    <Badge bg="light" text="dark">
                      {new Date(course.completion_date).getFullYear()}
                    </Badge>
                  </div>
                  <Card.Title>{course.course_name}</Card.Title>
                  <Card.Subtitle className="mb-2 text-muted">
                    {course.institution}
                  </Card.Subtitle>
                  <Card.Text className="text-muted small">
                    {course.skills_gained}
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))}
      </Row>
    </Container>
  );
};

export default Education;
