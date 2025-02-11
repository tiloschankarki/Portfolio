import React, { useEffect, useState } from "react";
import { fetchHobbies } from "../api";
import { Container, Carousel, Card, Image } from "react-bootstrap";
import "./Hobby.css";

const Hobby = () => {
  const [hobbies, setHobbies] = useState([]);
  const colors = ['#e1f0c4','#6bab90','#694A38','#55917f','#5e4c5a'];

  // Define an array of four HEX colors
  const backendURL = "http://127.0.0.1:8000"; // Local Django Backend

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
      <h2 className="text-center mb-4">Hobbies</h2>

      <Carousel interval={2000}>
        {hobbies.map((hobby, index) => {
          const bgColor = colors[index % colors.length];
          const imageUrl = hobby.image.startsWith("http") 
            ? hobby.image 
            : `${backendURL}${hobby.image}`; // Construct full image URL

          console.log("Final Image URL:", imageUrl); // Debugging

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
