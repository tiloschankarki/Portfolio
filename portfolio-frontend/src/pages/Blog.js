import React, { useEffect, useState } from "react";
import { fetchBlogPosts } from "../api";
import { Container, Row, Col, Card, Modal, Button } from "react-bootstrap";
import "./Blog.css";

const Blog = () => {
  const [blogs, setBlogs] = useState([]);
  const [selectedBlog, setSelectedBlog] = useState(null);

  // Define color palette for feature cards (looping)
  const colors = ['#55917f','#694838','#5e4c5a','#e1f0c4','#6bab90' ];
  ;

  useEffect(() => {
    fetchBlogPosts()
      .then((data) => setBlogs(data))
      .catch((error) => console.error("Error fetching blog posts:", error));
  }, []);

  return (
    <Container className="mt-4">
      <h2 className="text-center mb-4">Blog</h2>
      <Row>
        {blogs.map((blog, index) => {
          const bgColor = colors[index % colors.length]; // Loop colors

          return (
            <Col md={6} key={blog.id}>
              <Card
                className="mb-4 blog-card"
                style={{ backgroundColor: bgColor }}
                onClick={() => setSelectedBlog(blog)}
              >
                <Card.Body>
                  <div className="blog-header">
                    <Card.Title className="blog-title">{blog.title}</Card.Title>
                    <span className="reading-time">⏳ {blog.reading_time} min</span>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          );
        })}
      </Row>

      {/* Full-Screen Modal for Blog Reading */}
      {selectedBlog && (
        <Modal show={true} onHide={() => setSelectedBlog(null)} size="lg" centered>
          <Modal.Header closeButton>
            <Modal.Title>{selectedBlog.title}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p><strong>Published:</strong> {selectedBlog.date}</p>
            <p>{selectedBlog.content}</p>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setSelectedBlog(null)}>Close</Button>
          </Modal.Footer>
        </Modal>
      )}
    </Container>
  );
};

export default Blog;
