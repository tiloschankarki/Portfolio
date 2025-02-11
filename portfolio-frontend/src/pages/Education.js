import React, { useEffect, useState } from "react";
import { fetchEducation } from "../api";
import { Container, Table, ProgressBar } from "react-bootstrap";

const Education = () => {
  const [education, setEducation] = useState(null);

  useEffect(() => {
    fetchEducation()
      .then((data) => {
        setEducation(data);
      })
      .catch((error) => console.error("Error fetching education:", error));
  }, []);

  return (
    <Container className="mt-4">
      <h2 className="text-center mb-4">Education</h2>

      {education ? (
        <>
          <h3>Coursework:</h3>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Course Name</th>
                <th>Institution</th>
                <th>Completion Date</th>
                <th>Skills Gained</th>  {/* ✅ Ensure skills are displayed */}
              </tr>
            </thead>
            <tbody>
              {education.coursework.map((course) => (
                <tr key={course.id}>
                  <td>{course.course_name}</td>
                  <td>{course.institution}</td>
                  <td>{new Date(course.completion_date).toLocaleDateString()}</td>
                  <td>{course.skills_gained}</td>  {/* ✅ Displaying skills gained */}
                </tr>
              ))}
            </tbody>
          </Table>

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
