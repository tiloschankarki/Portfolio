import React, { useEffect, useState } from "react";
import { fetchBlogPosts } from "../api";
import { Container, Row, Col, Card, Modal, Button, Badge } from "react-bootstrap";
import "./Blog.css";

const Blog = () => {
  const [blogs, setBlogs] = useState([]);
  const [selectedBlog, setSelectedBlog] = useState(null);

  const colors = ["#028090", "#f45b69", "#b8e0d2", "#456990"];

  useEffect(() => {
    fetchBlogPosts()
      .then((data) => setBlogs(data))
      .catch((error) => console.error("Error fetching blog posts:", error));
  }, []);

  return (
    <Container className="blog-section py-5">
      <h2 className="section-title text-center mb-4">Blog & Articles</h2>

      <Row className="g-4">
        {blogs.map((blog, index) => {
          const accentColor = colors[index % colors.length];
          return (
            <Col md={6} lg={4} key={blog.id}>
              <Card className="blog-card shadow-sm h-100">
                <div className="accent-bar" style={{ backgroundColor: accentColor }}></div>
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <Badge bg="light" text="dark">
                      {blog.category || "General"}
                    </Badge>
                    <span className="read-time">⏱ {blog.reading_time} min</span>
                  </div>
                  <Card.Title>{blog.title}</Card.Title>
                  <Card.Text className="text-muted small mb-3">
                    {blog.description?.slice(0, 100)}...
                  </Card.Text>
                  <Button
                    variant="link"
                    className="read-btn p-0"
                    onClick={() => setSelectedBlog(blog)}
                  >
                    Read More →
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          );
        })}
      </Row>

      {selectedBlog && (
        <Modal show onHide={() => setSelectedBlog(null)} size="lg" centered>
          <Modal.Header closeButton>
            <Modal.Title>{selectedBlog.title}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>
              <strong>Published:</strong>{" "}
              {new Date(selectedBlog.date).toLocaleDateString()}
            </p>
            <p>{selectedBlog.content}</p>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setSelectedBlog(null)}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </Container>
  );
};

export default Blog;
