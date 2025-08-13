
// Student dashboard component for viewing personal details and managing clearance requests
// Displays student info, clearance status, and a form to submit clearance requests
import { useState, useEffect } from 'react';
import { Container, Row, Col, Table, Button, Form, Alert } from 'react-bootstrap';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import logo from '../assets/logo.png';
import mockStudentData from '../data/mockStudentData.json';

// StudentDashboard component
function StudentDashboard() {
  // State for logged-in student (simulated; replace with auth data), form data, and alerts
  const [student, setStudent] = useState(null);
  const [formData, setFormData] = useState({ 
    studentId: '', 
    department: '', 
    academicYear: '', 
    semester: '', 
    yearOfStudy: '' 
  });
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [errors, setErrors] = useState({});

  // Simulate logged-in student (replace with real authentication)
  useEffect(() => {
    const loggedInStudent = mockStudentData.students.find(s => s.studentId === 'BDU/CS/001/16'); // Default to first student
    if (loggedInStudent) {
      setStudent(loggedInStudent);
      setFormData({ 
        studentId: loggedInStudent.studentId, 
        department: loggedInStudent.department,
        academicYear: '',
        semester: '',
        yearOfStudy: ''
      });
    }
  }, []);

  // Add logout functionality
  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    window.location.href = "/login";
  };

  // Validate form inputs
  const validateForm = () => {
    const newErrors = {};
    if (!formData.studentId.trim()) newErrors.studentId = 'Student ID is required';
    if (!formData.department.trim()) newErrors.department = 'Department is required';
    if (!formData.academicYear.trim()) newErrors.academicYear = 'Academic Year is required';
    if (!formData.semester.trim()) newErrors.semester = 'Semester is required';
    if (!formData.yearOfStudy.trim()) newErrors.yearOfStudy = 'Year of Study is required';
    return newErrors;
  };

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: null }));
  };

  // Handle form submission for clearance request
  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setAlertMessage('Clearance request submitted successfully!');
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 3000); // Auto-hide alert after 3 seconds
    setFormData({ 
      studentId: student.studentId, 
      department: student.department,
      academicYear: '',
      semester: '',
      yearOfStudy: ''
    }); // Reset with current student data
    setErrors({});
  };

  if (!student) return <div>Loading...</div>;

  return (
    <div className="d-flex">
      <Sidebar />
      <div className="flex-grow-1">
        <Header />
        <Container className="py-4">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div className="d-flex align-items-center">
              <img src={logo} alt="Bahir Dar University Logo" width="50" className="me-3" />
              <h2>Student Dashboard</h2>
            </div>
            <div>
              <span className="me-3">{student?.studentName}</span>
              <span className="badge bg-secondary">{student?.department}</span>
              <Button variant="outline-danger" className="ms-3" onClick={handleLogout}>Logout</Button>
            </div>
          </div>
          <Row>
            <Col md={4}>
              <h3>Personal Details</h3>
              <Table striped bordered hover responsive aria-label="Personal details table">
                <tbody>
                  <tr>
                    <td>Student ID</td>
                    <td>{student.studentId}</td>
                  </tr>
                  <tr>
                    <td>Name</td>
                    <td>{student.studentName}</td>
                  </tr>
                  <tr>
                    <td>Department</td>
                    <td>{student.department}</td>
                  </tr>
                  <tr>
                    <td>Sex</td>
                    <td>{student.sex}</td>
                  </tr>
                </tbody>
              </Table>
            </Col>
            <Col md={8}>
              <h3>Clearance Status</h3>
              <Table striped bordered hover responsive aria-label="Clearance status table">
                <thead>
                  <tr>
                    <th>Request ID</th>
                    <th>Status</th>
                    <th>Date Submitted</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>REQ001</td>
                    <td>Pending</td>
                    <td>2025-07-15</td>
                  </tr>
                  <tr>
                    <td>REQ002</td>
                    <td>Approved</td>
                    <td>2025-07-10</td>
                  </tr>
                </tbody>
              </Table>
              <h3 className="mt-4">Submit Clearance Request</h3>
              {showAlert && <Alert variant="success" onClose={() => setShowAlert(false)} dismissible>{alertMessage}</Alert>}
              <Form onSubmit={handleSubmit} noValidate>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3" controlId="studentId">
                      <Form.Label>Student ID</Form.Label>
                      <Form.Control
                        type="text"
                        name="studentId"
                        value={formData.studentId}
                        onChange={handleChange}
                        required
                        aria-required="true"
                        isInvalid={!!errors.studentId}
                        aria-describedby="studentIdError"
                        disabled
                      />
                      <Form.Control.Feedback type="invalid" id="studentIdError">
                        {errors.studentId}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3" controlId="department">
                      <Form.Label>Department</Form.Label>
                      <Form.Control
                        type="text"
                        name="department"
                        value={formData.department}
                        onChange={handleChange}
                        required
                        aria-required="true"
                        isInvalid={!!errors.department}
                        aria-describedby="departmentError"
                        disabled
                      />
                      <Form.Control.Feedback type="invalid" id="departmentError">
                        {errors.department}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col md={4}>
                    <Form.Group className="mb-3" controlId="academicYear">
                      <Form.Label>Academic Year</Form.Label>
                      <Form.Control
                        type="text"
                        name="academicYear"
                        value={formData.academicYear}
                        onChange={handleChange}
                        required
                        aria-required="true"
                        isInvalid={!!errors.academicYear}
                        aria-describedby="academicYearError"
                        placeholder="e.g., 2024"
                      />
                      <Form.Control.Feedback type="invalid" id="academicYearError">
                        {errors.academicYear}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group className="mb-3" controlId="semester">
                      <Form.Label>Semester</Form.Label>
                      <Form.Select
                        name="semester"
                        value={formData.semester}
                        onChange={handleChange}
                        required
                        aria-required="true"
                        isInvalid={!!errors.semester}
                        aria-describedby="semesterError"
                      >
                        <option value="">Select Semester</option>
                        <option value="1st">1st Semester</option>
                        <option value="2nd">2nd Semester</option>
                        <option value="Summer">Summer</option>
                      </Form.Select>
                      <Form.Control.Feedback type="invalid" id="semesterError">
                        {errors.semester}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group className="mb-3" controlId="yearOfStudy">
                      <Form.Label>Year of Study</Form.Label>
                      <Form.Select
                        name="yearOfStudy"
                        value={formData.yearOfStudy}
                        onChange={handleChange}
                        required
                        aria-required="true"
                        isInvalid={!!errors.yearOfStudy}
                        aria-describedby="yearOfStudyError"
                      >
                        <option value="">Select Year</option>
                        <option value="I">I</option>
                        <option value="II">II</option>
                        <option value="III">III</option>
                        <option value="IV">IV</option>
                        <option value="V">V</option>
                      </Form.Select>
                      <Form.Control.Feedback type="invalid" id="yearOfStudyError">
                        {errors.yearOfStudy}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>
                <Button variant="primary" type="submit" className="w-100">
                  Submit Request
                </Button>
              </Form>
            </Col>
          </Row>
          <footer className="text-center mt-4 text-muted">
            <small>© {new Date().getFullYear()} Bahir Dar University. All rights reserved.</small>
          </footer>
        </Container>
      </div>
    </div>
  );
}

export default StudentDashboard;
