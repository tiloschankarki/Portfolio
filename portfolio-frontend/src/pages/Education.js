import React, { useEffect, useState } from "react";
import { fetchEducation } from "../api";
import { Container, Table } from "react-bootstrap";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import "./Education.css";

// Function to get subject icons based on the course name
const getSubjectIcon = (courseName) => {
  if (courseName.toLowerCase().includes("computer") || courseName.toLowerCase().includes("software")) return "💻";
  if (courseName.toLowerCase().includes("math")) return "📐";
  if (courseName.toLowerCase().includes("data") || courseName.toLowerCase().includes("analysis")) return "📊";
  if (courseName.toLowerCase().includes("engineering")) return "🔧";
  return "📚"; // Default icon
};

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
      {/* Degree Progress Circular Bar */}
      <div className="d-flex justify-content-end">
        {education && education.degree_progress && (
          <div className="progress-container">
            <CircularProgressbar
              value={education.degree_progress.progress}
              text={`${education.degree_progress.progress}%`}
              styles={buildStyles({
                textColor: "#322806",
                pathColor: "#23aa27",
                trailColor: "#987602",
                textSize: "16px",
              })}
            />
            <p className="progress-label">Degree Completion</p>
          </div>
        )}
      </div>

      {/* Fun & Interactive Coursework Table */}
      <h2 className="text-center">Coursework</h2>
      <div className="table-container">
        <Table className="fun-table" bordered hover>
          <thead>
            <tr>
              <th>#</th>
              <th>Course Name</th>
              <th>Institution</th>
              <th>Completion Date</th>
              <th>Skills Gained</th>
            </tr>
          </thead>
          <tbody>
            {education &&
              education.coursework.map((course, index) => (
                <tr key={course.id} className="table-row">
                  <td>{getSubjectIcon(course.course_name)}</td>
                  <td>{course.course_name}</td>
                  <td>{course.institution}</td>
                  <td>{new Date(course.completion_date).toLocaleDateString()}</td>
                  <td>{course.skills_gained}</td>
                </tr>
              ))}
          </tbody>
        </Table>
      </div>
    </Container>
  );
};

export default Education;
