import { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Table,
  Modal,
  Form,
  Alert
} from "react-bootstrap";
import { PencilSquare, Trash } from "react-bootstrap-icons";
import { FiLogOut } from 'react-icons/fi'; // or BiLogOut from 'react-icons/bi'
import logo from "../assets/logo.png";

// ✅ Import mock data (only as fallback if no localStorage data)
import mockRiskData from "../data/mockRiskData.json";

function DepartmentAdmin({ currentUser }) {
  const [riskStudents, setRiskStudents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formMode, setFormMode] = useState("add"); // "add" or "edit"
  const [editingIndex, setEditingIndex] = useState(null);
  const [studentForm, setStudentForm] = useState({
    firstName: "",
    lastName: "",
    studentId: "",
    department: "",
    riskCase: "",
    addedBy: currentUser?.firstName 
  ? `${currentUser.firstName} (${currentUser.department || 'No Dept'})`
  : "Official"
  });
  const [formError, setFormError] = useState(null);

  // ✅ Load risk data from localStorage (or fallback to JSON)
  useEffect(() => {
    const savedData = JSON.parse(localStorage.getItem("riskStudents"));
    if (savedData && savedData.length > 0) {
      setRiskStudents(savedData);
    } else {
      setRiskStudents(mockRiskData.risks);
    }
  }, []);

  // ✅ Save riskStudents to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("riskStudents", JSON.stringify(riskStudents));
  }, [riskStudents]);

  const openAddModal = () => {
    setFormMode("add");
    setStudentForm({
      firstName: "",
      lastName: "",
      studentId: "",
      department: "",
      riskCase: "",
     addedBy: currentUser?.firstName 
  ? `${currentUser.firstName} (${currentUser.department || 'No Dept'})`
  : "Official"
    });
    setShowModal(true);
  };

  const openEditModal = (index) => {
    setFormMode("edit");
    setEditingIndex(index);
    setStudentForm(riskStudents[index]);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setFormError(null);
    setStudentForm({
      firstName: "",
      lastName: "",
      studentId: "",
      department: "",
      riskCase: "",
      addedBy: currentUser?.firstName 
  ? `${currentUser.firstName} (${currentUser.department || 'No Dept'})`
  : "Official"
    });
  };

const handleFormChange = (e) => {
  const { name, value } = e.target;
  setStudentForm((prev) => ({ ...prev, [name]: value }));
  setFormError(null);
};

  const handleFormSubmit = (e) => {
    e.preventDefault();

    if (
      !studentForm.firstName.trim() ||
      !studentForm.lastName.trim() ||
      !studentForm.studentId.trim() ||
      !studentForm.department.trim() ||
      !studentForm.riskCase.trim()
    ) {
      setFormError("Please fill in all required fields.");
      return;
    }

    if (formMode === "add") {
      setRiskStudents((prev) => [...prev, studentForm]);
    } else if (formMode === "edit") {
      const updatedStudents = [...riskStudents];
      updatedStudents[editingIndex] = studentForm;
      setRiskStudents(updatedStudents);
    }

    closeModal();
  };

  const handleDelete = (index) => {
    if (window.confirm("Are you sure you want to remove this student from risk?")) {
      const updatedList = [...riskStudents];
      updatedList.splice(index, 1);
      setRiskStudents(updatedList);
    }
  };

  return (
    <Container fluid className="p-4" style={{ backgroundColor: "#f8f9fc", minHeight: "100vh" }}>
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div className="d-flex align-items-center">
          <img src={logo} alt="BDU Logo" width="50" className="me-3" />
          <div>
            <h3 className="mb-0">Officals Admin Panel</h3>
            <small className="text-muted">Risk Management Panel</small>
          </div>
        </div>
        <div className="d-flex flex-column align-items-end">
          <span className="fw-semibold text-primary">
            👤 Role: {currentUser?.department || "Department Official"}
          </span>
          <Button
            variant="outline-danger"
            size="sm"
            className="mt-1"
            onClick={() => {
              localStorage.removeItem("currentUser");
              window.location.href = "/login";
            }}
          >
            <FiLogOut style={{ marginRight: '5px' }} /> Logout
          </Button>
        </div>
      </div>

      {/* Students at Risk Summary */}
      <Card className="mb-4 shadow-sm">
        <Card.Body className="d-flex justify-content-between align-items-center">
          <div>
            <h5 className="mb-1">Students at Risk in {currentUser?.department || "Department Official"}</h5>
            <p className="text-muted mb-0">Students with pending issues</p>
          </div>
          <div className="display-4 text-danger fw-bold">{riskStudents.length}</div>
          <div className="ms-3 fs-1 text-danger">⚠️</div>
        </Card.Body>
      </Card>

      {/* Risk Table Management */}
      <Card className="mb-4 shadow-sm">
        <Card.Body>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="mb-0">Risk Table Management</h5>
            <Button variant="danger" onClick={openAddModal}>
              + Add Student to Risk
            </Button>
          </div>
          <Table striped bordered hover responsive>
            <thead className="table-light">
              <tr>
                <th>FirstName</th>
                <th>LastName</th>
                <th>Student ID</th>
                <th>Department</th>
                <th>Risk Case</th>
                <th>Added By</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {riskStudents.map((student, index) => (
                <tr key={index}>
                  <td>{student.firstName}</td>
                  <td>{student.lastName}</td>
                  <td>{student.studentId}</td>
                  <td>{student.department}</td>
                  <td>{student.riskCase}</td>
                  <td>{student.addedBy}</td>
                  <td>
                    <Button
                      size="sm"
                      variant="outline-primary"
                      className="me-2"
                      onClick={() => openEditModal(index)}
                    >
                      <PencilSquare />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline-danger"
                      onClick={() => handleDelete(index)}
                    >
                      <Trash />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      {/* Add/Edit Student Modal */}
      <Modal
        show={showModal}
        onHide={closeModal}
        centered
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {formMode === "add" ? "Add Student to Risk" : "Edit Student Information"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {formError && <Alert variant="danger">{formError}</Alert>}
          <Form onSubmit={handleFormSubmit}>
            <Form.Group className="mb-3" controlId="nameInput">
              <Form.Label>First Name</Form.Label>
              <Form.Control
                type="text"
                name="firstName"
                value={studentForm.firstName}
                onChange={handleFormChange}
                placeholder="Enter student's full name"
                required
              />
            </Form.Group>
             <Form.Group className="mb-3" controlId="nameInput">
              <Form.Label>Last Name</Form.Label>
              <Form.Control
                type="text"
                name="lastName"
                value={studentForm.lastName}
                onChange={handleFormChange}
                placeholder="Enter student's full name"
                required
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="studentIdInput">
              <Form.Label>Student ID</Form.Label>
              <Form.Control
                type="text"
                name="studentId"
                value={studentForm.studentId}
                onChange={handleFormChange}
                placeholder="BDU1504556"
                required
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="departmentInput">
              <Form.Label>Department</Form.Label>
              <Form.Control
                type="text"
                name="department"
                value={studentForm.department}
                onChange={handleFormChange}
                placeholder="Enter department"
                required
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="riskCaseInput">
              <Form.Label>Risk Case</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="riskCase"
                value={studentForm.riskCase}
                onChange={handleFormChange}
                placeholder="Describe the risk case"
                required
              />
            </Form.Group>
            <Button type="submit" variant="danger" className="w-100">
              {formMode === "add" ? "Add Student" : "Update Student"}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
}

export default DepartmentAdmin;
