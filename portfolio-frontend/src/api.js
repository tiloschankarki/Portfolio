import axios from "axios";

const API_BASE_URL = "https://tfolio.duckdns.org/api";  // Ensure this matches Django's URLs

export const fetchProjects = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/projects/`);
    return response.data;
  } catch (error) {
    console.error("Error fetching projects:", error.response ? error.response.data : error.message);
    return [];
  }
};

export const fetchCertifications = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/certifications/`);
    return response.data;
  } catch (error) {
    console.error("Error fetching certifications:", error.response ? error.response.data : error.message);
    return [];
  }
};

export const fetchBlogPosts = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/blog/`);
    return response.data;
  } catch (error) {
    console.error("Error fetching blog posts:", error.response ? error.response.data : error.message);
    return [];
  }
};

export const fetchEducation = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/education/`);
    return response.data;
  } catch (error) {
    console.error("Error fetching education:", error.response ? error.response.data : error.message);
    return [];
  }
};

export const fetchHobbies = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/hobbies/`);
    return response.data;
  } catch (error) {
    console.error("Error fetching hobbies:", error.response ? error.response.data : error.message);
    return [];
  }
};
