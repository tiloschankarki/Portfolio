import React, { useEffect, useState } from "react";
import { fetchEducation } from "../api";
import { Container, ListGroup, ProgressBar } from "react-bootstrap";

const Education = () => {
  const [education, setEducation] = useState(null);

  useEffect(() => {
    fetchEducation()
      .then((data) => setEducation(data))
      .catch((error) => console.error("Error fetching education:", error));
  }, []);

  return (
    <Container className="mt-4">
      <h2 className="text-center mb-4">Education</h2>
      {education ? (
        <>
          <h3>Coursework:</h3>
          <ListGroup>
            {education.coursework.map((course) => (
              <ListGroup.Item key={course.id}>
                <strong>{course.course_name}</strong> - {course.institution}
              </ListGroup.Item>
            ))}
          </ListGroup>

          <h3 className="mt-4">Degree Progress:</h3>
          {education.degree_progress ? (
            <ProgressBar now={education.degree_progress.progress} label={`${education.degree_progress.progress}%`} />
          ) : (
            <p>No degree progress available</p>
          )}
        </>
      ) : (
        <p>Loading education data...</p>
      )}
    </Container>
  );
};

export default Education;
