import { useState, useEffect } from 'react';
import { Form, Button, Container, Card, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';

// ✅ Import mock data
import studentsData from '../data/mockStudentData.json';
import officialsData from '../data/mockOfficialsData.json';
import adminsData from '../data/mockMainAdminData.json';

function Login({ setCurrentUser, setIsAuthenticated }) {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    document.getElementById('usernameInput').focus();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError(null); // Clear error if user starts typing again
  };

  const validateForm = () => {
    if (!formData.username.trim()) return 'Username is required';
    if (!formData.password.trim()) return 'Password is required';
    return null;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    // 🔥 Check in students data
    const student = studentsData.students.find(
      (s) =>
        s.username === formData.username && s.password === formData.password
    );

    if (student) {
      const userData = {
        role: 'student',
        id: student.studentId,
        name: student.studentName,
        department: student.department,
      };

      setCurrentUser(userData);
      setIsAuthenticated(true);
      localStorage.setItem('currentUser', JSON.stringify(userData));
      navigate('/clearance-dashboard');
      return;
    }

    // 🔥 Check in officials data
    const official = officialsData.officials.find(
      (o) =>
        o.username === formData.username && o.password === formData.password
    );

    if (official) {
      const userData = {
        role: official.role, // department_official or admin
        id: official.officialId,
        firstName: official.firstName,
        lastName: official.lastName,
        name: `${official.firstName} ${official.lastName}`,
        department: official.department,
        profession: official.profession,
        email: official.email,
        phone: official.phone
      };

      setCurrentUser(userData);
      setIsAuthenticated(true);
      localStorage.setItem('currentUser', JSON.stringify(userData));

      if (official.role === 'department_official') {
        navigate('/department-admin');
      } else if (official.role === 'admin') {
        navigate('/main-admin');
      }
      return;
    }

    // 🔥 Check in admins data
    const admin = adminsData.admins.find(
      (a) =>
        a.username === formData.username && a.password === formData.password
    );

    if (admin) {
      const userData = {
        role: 'admin',
        id: admin.adminId,
        name: admin.name,
        email: admin.email,
      };

      setCurrentUser(userData);
      setIsAuthenticated(true);
      localStorage.setItem('currentUser', JSON.stringify(userData));
      navigate('/main-admin');
      return;
    }

    // ❌ If no match
    setError('Invalid username or password');
  };

  return (
    <Container
      className="d-flex justify-content-center align-items-center" id='CCMSLOGINPAGE'
      // style={{ minHeight: '100vh', backgroundColor: '#f0f4f8' , boxShadow:'0 0 10px 20px #2A9DD5'}}
    >
      <Card className="p-4 shadow-sm" id='loginfirst'  >
        <Card.Header className="text-center text-white p-3">
          <img src={logo} alt="Bahir Dar University Logo" width="100" className="mb-2" style={{borderRadius:'50%'}}/>
          <h2 className="mb-0" style={{color:'#2A9DD5'}}>CCMS Login</h2>
        </Card.Header>
        <Card.Body>
          {error && (
            <Alert variant="danger" className="mb-3">
              {error}
            </Alert>
          )}
          <Form onSubmit={handleSubmit} noValidate>
            <Form.Group className="mb-3" controlId="usernameInput">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
                placeholder="Enter username"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="Enter password"
              />
            </Form.Group>
            <Button type="submit" variant="primary" className="w-100 py-2" style={{ backgroundColor:'#2A9DD5'}}>
              Login
            </Button>
          </Form>
        </Card.Body>
        <Card.Footer className="text-center text-muted">
          <small>© {new Date().getFullYear()} Bahir Dar University. All rights reserved.</small>
        </Card.Footer>
      </Card>
    </Container>
  );
}

export default Login;
