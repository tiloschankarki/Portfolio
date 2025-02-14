import React, { useEffect, useState } from "react";
import { fetchHobbies } from "../api";
import { Container, Carousel, Card, Image } from "react-bootstrap";
import "./Hobby.css";

const Hobby = () => {
  const [hobbies, setHobbies] = useState([]);
  const colors = ['#6bab90','#e1f0c4','#55917f',];

  // Define an array of four HEX colors
  const backendURL = "https://tfolio.onrender.com/"; // Local Django Backend

  useEffect(() => {
    fetchHobbies()
      .then((data) => {
        console.log("API Response:", data); // Debug API response
        setHobbies(data);
      })
      .catch((error) => console.error("Error fetching hobbies:", error));
  }, []);

  return (
    <Container className="mt-4">
      <h3 className="text-center mb-4">Hobbies</h3>

      <Carousel interval={2000}>
        {hobbies.map((hobby, index) => {
          const bgColor = colors[index % colors.length];
          const imageUrl = hobby.image.startsWith("http") 
            ? hobby.image 
            : `${backendURL}${hobby.image}`; // Construct full image URL

          return (
            <Carousel.Item key={hobby.id}>
              <Card
                className="hobby-card-large text-center"
                style={{ backgroundColor: bgColor }}
              >
                {hobby.image && (
                  <Image
                    src={imageUrl}
                    className="hobby-image"
                    alt={hobby.title}
                    onError={(e) => { e.target.src = "/placeholder.png"; }} // Handle broken images
                  />
                )}
                <Card.Body>
                  <Card.Title>{hobby.title}</Card.Title>
                  <Card.Text>{hobby.description}</Card.Text>
                </Card.Body>
              </Card>
            </Carousel.Item>
          );
        })}
      </Carousel>
    </Container>
  );
};

export default Hobby;
