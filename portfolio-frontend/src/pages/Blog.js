import React, { useEffect, useState } from "react";
import { fetchBlogPosts } from "../api";
import { Container, Row, Col, Card } from "react-bootstrap";

const Blog = () => {
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    fetchBlogPosts()
      .then((data) => setBlogs(data))
      .catch((error) => console.error("Error fetching blog posts:", error));
  }, []);

  return (
    <Container className="mt-4">
      <h2 className="text-center mb-4">Blog</h2>
      <Row>
        {blogs.map((blog) => (
          <Col md={6} key={blog.id}>
            <Card className="mb-4 shadow-sm">
              <Card.Body>
                <Card.Title>{blog.title}</Card.Title>
                <Card.Text>{blog.content}</Card.Text>
                <Card.Footer>
                  <small className="text-muted">Published: {blog.date}</small>
                </Card.Footer>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default Blog;
