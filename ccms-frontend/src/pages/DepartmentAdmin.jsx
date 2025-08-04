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
  Alert,
  Badge
} from "react-bootstrap";
import { PencilSquare, Trash, Search } from "react-bootstrap-icons";
import { FiLogOut } from 'react-icons/fi';
import logo from "../assets/logo.png";

// ✅ Import mock data
import mockRiskData from "../data/mockRiskData.json";
import mockStudentData from "../data/mockStudentData.json";

function DepartmentAdmin({ currentUser }) {
  const [riskStudents, setRiskStudents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formMode, setFormMode] = useState("add"); // "add" or "edit"
  const [editingIndex, setEditingIndex] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [riskCase, setRiskCase] = useState("");
  const [formError, setFormError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDepartment, setFilterDepartment] = useState("");

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

  // Filter students based on search term and department
  const filteredStudents = mockStudentData.students.filter(student => {
    const matchesSearch = student.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.studentId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = !filterDepartment || student.department === filterDepartment;
    return matchesSearch && matchesDepartment;
  });

  // Get unique departments for filter
  const departments = [...new Set(mockStudentData.students.map(student => student.department))];

  const openAddModal = () => {
    setFormMode("add");
    setSelectedStudent(null);
    setRiskCase("");
    setFormError(null);
    setShowModal(true);
  };

  const openEditModal = (index) => {
    setFormMode("edit");
    setEditingIndex(index);
    const student = riskStudents[index];
    setSelectedStudent({
      firstName: student.firstName,
      lastName: student.lastName,
      studentId: student.studentId,
      department: student.department
    });
    setRiskCase(student.riskCase || student.case || "");
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setFormError(null);
    setSelectedStudent(null);
    setRiskCase("");
  };

  const handleStudentSelect = (student) => {
    setSelectedStudent(student);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();

    if (!selectedStudent) {
      setFormError("Please select a student first.");
      return;
    }

    if (!riskCase.trim()) {
      setFormError("Please enter the risk case.");
      return;
    }

    const newRiskEntry = {
      firstName: selectedStudent.firstName,
      lastName: selectedStudent.lastName,
      studentId: selectedStudent.studentId,
      department: selectedStudent.department,
      riskCase: riskCase.trim(),
      addedBy: currentUser?.name 
        ? `${currentUser.name} (${currentUser.department || 'No Dept'})`
        : `${currentUser?.firstName || ''} ${currentUser?.lastName || ''} (${currentUser?.department || 'No Dept'})`.trim() || "Unknown Official",
      addedOn: new Date().toISOString().split('T')[0]
    };

    if (formMode === "add") {
      setRiskStudents((prev) => [...prev, newRiskEntry]);
    } else if (formMode === "edit") {
      const updatedStudents = [...riskStudents];
      updatedStudents[editingIndex] = newRiskEntry;
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

  // Check if student is already in risk list
  const isStudentInRisk = (studentId) => {
    return riskStudents.some(risk => risk.studentId === studentId);
  };

  return (
    <Container fluid className="p-4" style={{ backgroundColor: "#f8f9fc", minHeight: "100vh" }}>
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div className="d-flex align-items-center">
          <img src={logo} alt="BDU Logo" width="50" className="me-3" />
          <div>
            <h3 className="mb-0">Officials Admin Panel</h3>
            <small className="text-muted">Risk Management Panel</small>
          </div>
        </div>
        <div className="d-flex flex-column align-items-end">
          <span className="fw-semibold text-primary">
            👤 {currentUser?.name || `${currentUser?.firstName || ''} ${currentUser?.lastName || ''}`.trim() || "Department Official"} - {currentUser?.department || "Department Official"}
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
                <th>First Name</th>
                <th>Last Name</th>
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
                  <td>{student.riskCase || student.case}</td>
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
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {formMode === "add" ? "Add Student to Risk" : "Edit Student Risk Information"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {formError && <Alert variant="danger">{formError}</Alert>}
          
          {formMode === "add" && (
            <>
              {/* Search and Filter Section */}
              <Row className="mb-3">
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Search Students</Form.Label>
                    <div className="input-group">
                      <span className="input-group-text">
                        <Search />
                      </span>
                      <Form.Control
                        type="text"
                        placeholder="Search by name or ID..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Filter by Department</Form.Label>
                    <Form.Select
                      value={filterDepartment}
                      onChange={(e) => setFilterDepartment(e.target.value)}
                    >
                      <option value="">All Departments</option>
                      {departments.map(dept => (
                        <option key={dept} value={dept}>{dept}</option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>

              {/* Student Selection Section */}
              <div className="mb-3">
                <h6>Select a Student:</h6>
                <div style={{ maxHeight: "300px", overflowY: "auto" }}>
                  <Row>
                    {filteredStudents.map((student) => (
                      <Col md={6} key={student.studentId} className="mb-2">
                        <Card 
                          className={`cursor-pointer ${selectedStudent?.studentId === student.studentId ? 'border-primary bg-light' : ''} ${isStudentInRisk(student.studentId) ? 'border-warning' : ''}`}
                          onClick={() => !isStudentInRisk(student.studentId) && handleStudentSelect(student)}
                          style={{ cursor: isStudentInRisk(student.studentId) ? 'not-allowed' : 'pointer' }}
                        >
                          <Card.Body className="p-3">
                            <div className="d-flex justify-content-between align-items-start">
                              <div>
                                <h6 className="mb-1">{student.studentName}</h6>
                                <small className="text-muted">ID: {student.studentId}</small><br />
                                <small className="text-muted">{student.department}</small>
                              </div>
                              {isStudentInRisk(student.studentId) && (
                                <Badge bg="warning" text="dark">Already in Risk</Badge>
                              )}
                              {selectedStudent?.studentId === student.studentId && (
                                <Badge bg="primary">Selected</Badge>
                              )}
                            </div>
                          </Card.Body>
                        </Card>
                      </Col>
                    ))}
                  </Row>
                </div>
              </div>
            </>
          )}

          {/* Selected Student Display */}
          {selectedStudent && (
            <Alert variant="info" className="mb-3">
              <strong>Selected Student:</strong><br />
              Name: {selectedStudent.firstName} {selectedStudent.lastName}<br />
              ID: {selectedStudent.studentId}<br />
              Department: {selectedStudent.department}
            </Alert>
          )}

          {/* Risk Case Input */}
          <Form.Group className="mb-3">
            <Form.Label>Risk Case Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={4}
              value={riskCase}
              onChange={(e) => setRiskCase(e.target.value)}
              placeholder="Describe the risk case or issue with this student..."
              required
            />
          </Form.Group>

          <Button 
            type="button" 
            variant="danger" 
            className="w-100"
            onClick={handleFormSubmit}
            disabled={!selectedStudent || !riskCase.trim()}
          >
            {formMode === "add" ? "Add Student to Risk" : "Update Risk Information"}
          </Button>
        </Modal.Body>
      </Modal>
    </Container>
  );
}

export default DepartmentAdmin;
