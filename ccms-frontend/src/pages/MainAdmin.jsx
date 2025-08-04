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
  Nav,
  InputGroup
} from "react-bootstrap";
import { PencilSquare, Trash, Search, Download, Phone } from "react-bootstrap-icons";
import * as XLSX from 'xlsx';
import logo from "../assets/logo.png";

// ✅ Import mock data
import mockOfficials from "../data/mockOfficialsData.json";
import mockRiskData from "../data/mockRiskData.json";

function MainAdmin({ currentUser }) {
  const [activeTab, setActiveTab] = useState("officials"); // "officials" | "risks"
  const [officials, setOfficials] = useState([]);
  const [risks, setRisks] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formMode, setFormMode] = useState("add"); // "add" or "edit"
  const [editingIndex, setEditingIndex] = useState(null);
  const [officialForm, setOfficialForm] = useState({
    officialId: "",
    firstName: "",
    lastName:"",
    profession: "",
    education: "",
    department: "",
 
    email: "",
    phone:"",
    username: "",
    password: "",
  });
  const [formError, setFormError] = useState(null);

  const [summary, setSummary] = useState({
    totalOfficials: 0,
    studentsAtRisk: 0,
    clearanceRequests: 0,
  });

  const [officialSearch, setOfficialSearch] = useState(""); // 🔥 Search input for officials
  const [riskSearch, setRiskSearch] = useState(""); // 🔥 Search input for risks

  // ✅ Load data from localStorage or fallback JSON
  useEffect(() => {
    const storedOfficials = JSON.parse(localStorage.getItem("officials"));
    const storedRisks = JSON.parse(localStorage.getItem("risks"));

    if (storedOfficials && storedOfficials.length > 0) {
      setOfficials(storedOfficials);
    } else {
      setOfficials(mockOfficials.officials);
      localStorage.setItem("officials", JSON.stringify(mockOfficials.officials));
    }

    if (storedRisks && storedRisks.length > 0) {
      setRisks(storedRisks);
    } else {
      setRisks(mockRiskData.risks);
      localStorage.setItem("risks", JSON.stringify(mockRiskData.risks));
    }

    setSummary({
      totalOfficials: (storedOfficials || mockOfficials.officials).length,
      studentsAtRisk: (storedRisks || mockRiskData.risks).length,
      clearanceRequests: 24, // Static for now
    });
  }, []);

  // ✅ Persist updates to localStorage
  useEffect(() => {
    localStorage.setItem("officials", JSON.stringify(officials));
    localStorage.setItem("risks", JSON.stringify(risks));
    setSummary((prev) => ({
      ...prev,
      totalOfficials: officials.length,
      studentsAtRisk: risks.length,
    }));
  }, [officials, risks]);

  const openAddModal = () => {
    setFormMode("add");
    setOfficialForm({
      officialId: "",
      firstName: "",
      lastName:"",
      profession: "",
      education: "",
      department: "",
   
      email: "",
      phone:"",
      username: "",
      password: "",
    });
    setShowModal(true);
  };

  const openEditModal = (index) => {
    setFormMode("edit");
    setEditingIndex(index);
    setOfficialForm(officials[index]);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setFormError(null);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setOfficialForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();

    if (
      !officialForm.officialId.trim() ||
      !officialForm.firstName.trim() ||
      !officialForm.lastName.trim() ||

      !officialForm.profession.trim() ||
      !officialForm.education.trim() ||
      !officialForm.department.trim() ||
      !officialForm.phone.trim() ||
      !officialForm.email.trim() ||
      !officialForm.username.trim() ||
      !officialForm.password.trim()
    ) {
      setFormError("Please fill in all required fields.");
      return;
    }

    if (formMode === "add") {
      setOfficials((prev) => [...prev, officialForm]);
    } else if (formMode === "edit") {
      const updatedOfficials = [...officials];
      updatedOfficials[editingIndex] = officialForm;
      setOfficials(updatedOfficials);
    }

    closeModal();
  };

  const handleDelete = (index) => {
    if (window.confirm("Are you sure you want to delete this official?")) {
      const updatedList = [...officials];
      updatedList.splice(index, 1);
      setOfficials(updatedList);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    window.location.href = "/login";
  };

  // ✅ Filtered lists based on search inputs
  const filteredOfficials = officials.filter((official) =>
    Object.values(official)
      .join(" ")
      .toLowerCase()
      .includes(officialSearch.toLowerCase())
  );

  const filteredRisks = risks.filter((risk) =>
    Object.values(risk)
      .join(" ")
      .toLowerCase()
      .includes(riskSearch.toLowerCase())
  );

  // ✅ Export filtered data to CSV
  const exportFilteredToCSV = (data, filename) => {
    if (data.length === 0) {
      alert("No data to export.");
      return;
    }

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [
        Object.keys(data[0]).join(","), // headers
        ...data.map((row) => Object.values(row).join(",")),
      ].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", filename);
    document.body.appendChild(link); // Required for Firefox
    link.click();
    document.body.removeChild(link);
  };

  // ✅ Export filtered data to Excel
  const exportFilteredToExcel = (data, filename) => {
    if (data.length === 0) {
      alert("No data to export.");
      return;
    }

    try {
      // Create a new workbook
      const workbook = XLSX.utils.book_new();
      
      // Convert data to worksheet
      const worksheet = XLSX.utils.json_to_sheet(data);
      
      // Add worksheet to workbook
      XLSX.utils.book_append_sheet(workbook, worksheet, "Data");
      
      // Generate Excel file
      XLSX.writeFile(workbook, `${filename}.xlsx`);
    } catch (error) {
      console.error("Error exporting to Excel:", error);
      alert("Error exporting to Excel. Please try again.");
    }
  };

  return (
    <Container
      fluid
      className="p-4"
      style={{ backgroundColor: "#f8f9fc", minHeight: "100vh" }}
    >
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div className="d-flex align-items-center">
          <img src={logo} alt="BDU Logo" width="50" className="me-3" />
          <div>
            <h3 className="mb-0">Admin Panel</h3>
            <small className="text-muted">
              Campus Clearance Management System
            </small>
          </div>
        </div>
        <div className="d-flex flex-column align-items-end">
          <span className="fw-semibold text-primary">
            👤 {currentUser?.firstName || "Admin User"} ({currentUser?.role || "Main Administrator"})
          </span>
          <Button
            variant="outline-danger"
            size="sm"
            className="mt-1"
            onClick={handleLogout}
          >
            Logout
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <Row className="mb-4">
        <Col md={4}>
          <Card className="text-center shadow-sm">
            <Card.Body>
              <h5>Total Officials</h5>
              <div className="display-4 fw-bold">{summary.totalOfficials}</div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="text-center shadow-sm">
            <Card.Body>
              <h5>Students at Risk</h5>
              <div className="display-4 fw-bold text-danger">
                {summary.studentsAtRisk}
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="text-center shadow-sm">
            <Card.Body>
              <h5>Clearance Requests</h5>
              <div className="display-4 fw-bold text-success">
                {summary.clearanceRequests}
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Tabs */}
      <Nav
        variant="tabs"
        activeKey={activeTab}
        onSelect={(key) => setActiveTab(key)}
      >
        <Nav.Item>
          <Nav.Link eventKey="officials">Department Officials</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="risks">Risk Tables Overview</Nav.Link>
        </Nav.Item>
      </Nav>

      {/* Officials Table */}
      {activeTab === "officials" && (
        <Card className="mt-3 shadow-sm">
          <Card.Body>
            {/* Search bar */}
            <div className="d-flex justify-content-between align-items-center mb-3">
              <InputGroup style={{ width: "300px" }}>
                <InputGroup.Text>
                  <Search />
                </InputGroup.Text>
                <Form.Control
                  placeholder="Search officials..."
                  value={officialSearch}
                  onChange={(e) => setOfficialSearch(e.target.value)}
                />
              </InputGroup>
              <div>
                <Button
                  variant="success"
                  className="me-2"
                  onClick={() =>
                    exportFilteredToCSV(filteredOfficials, "filtered_officials.csv")
                  }
                >
                  <Download className="me-1" /> Download CSV
                </Button>
                <Button
                  variant="info"
                  className="me-2"
                  onClick={() =>
                    exportFilteredToExcel(filteredOfficials, "filtered_officials")
                  }
                >
                  <Download className="me-1" /> Export Excel
                </Button>
                <Button variant="primary" onClick={openAddModal}>
                  + Add Official
                </Button>
              </div>
            </div>
            <Table striped bordered hover responsive>
              <thead className="table-light">
                <tr>
                  <th>Official ID</th>
                  <th>FirstName</th>
                  <th>LastName</th>
                  <th>Profession</th>
                  <th>Education</th>
                  <th>Department</th>
                  <th>Email</th>
                  <th>Phone</th>
                 
                  <th>Username</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredOfficials.length > 0 ? (
                  filteredOfficials.map((official, index) => (
                    <tr key={index}>
                      <td>{official.officialId}</td>
                      <td>{official.firstName}</td>
                      <td>{official.lastName}</td>
                      <td>{official.profession}</td>
                      <td>{official.education}</td>
                      <td>{official.department}</td>
                      <td> {official.email}</td>
                      <td>
                        {official.phone}</td>
                      <td>{official.username}</td>
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
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="text-center">
                      No matching officials found.
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      )}

      {/* Risk Table */}
      {activeTab === "risks" && (
        <Card className="mt-3 shadow-sm">
          <Card.Body>
            {/* Search bar */}
            <div className="d-flex justify-content-between align-items-center mb-3">
              <InputGroup style={{ width: "300px" }}>
                <InputGroup.Text>
                  <Search />
                </InputGroup.Text>
                <Form.Control
                  placeholder="Search risk students..."
                  value={riskSearch}
                  onChange={(e) => setRiskSearch(e.target.value)}
                />
              </InputGroup>
              <div>
                <Button
                  variant="success"
                  className="me-2"
                  onClick={() =>
                    exportFilteredToCSV(filteredRisks, "filtered_risk_students.csv")
                  }
                >
                  <Download className="me-1" /> Download CSV
                </Button>
                <Button
                  variant="info"
                  onClick={() =>
                    exportFilteredToExcel(filteredRisks, "filtered_risk_students")
                  }
                >
                  <Download className="me-1" /> Export Excel
                </Button>
              </div>
            </div>
            <h5>Risk Tables Overview</h5>
            <Table striped bordered hover responsive>
              <thead className="table-light">
                <tr>
                  <th>First Name</th>
                  <th>Last Name</th>
                  <th>Student ID</th>
                  <th>Department</th>
                  <th>Risk Case</th>
                  <th>Added by</th>
                </tr>
              </thead>
              <tbody>
                {filteredRisks.length > 0 ? (
                  filteredRisks.map((risk, index) => (
                    <tr key={index}>
                      <td>{risk.firstName}</td>
                      <td>{risk.lastName}</td>
                      <td>{risk.studentId}</td>
                      <td>{risk.department}</td>
                      <td>{risk.riskCase || risk.case}</td>
                      <td>{risk.addedBy}</td>

                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center">
                      No matching risk students found.
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      )}

      {/* Add/Edit Official Modal */}
      <Modal
        show={showModal}
        onHide={closeModal}
        centered
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {formMode === "add" ? "Add Official" : "Edit Official"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {formError && <Alert variant="danger">{formError}</Alert>}
          <Form onSubmit={handleFormSubmit}>
            {/* Form fields same as before */}
            <Form.Group className="mb-3" controlId="officialIdInput">
              <Form.Label>Official ID</Form.Label>
              <Form.Control
                type="text"
                name="officialId"
                value={officialForm.officialId}
                onChange={handleFormChange}
                placeholder="e.g., OFF001"
                required
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="nameInput">
              <Form.Label>First Name</Form.Label>
              <Form.Control
                type="text"
                name="firstName"
                value={officialForm.firstName}
                onChange={handleFormChange}
                placeholder="Enter full name"
                required
              />
            </Form.Group>

             <Form.Group className="mb-3" controlId="nameInput">
              <Form.Label>Last Name</Form.Label>
              <Form.Control
                type="text"
                name="lastName"
                value={officialForm.lastName}
                onChange={handleFormChange}
                placeholder="Enter full name"
                required
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="professionInput">
              <Form.Label>Profession</Form.Label>
              <Form.Control
                type="text"
                name="profession"
                value={officialForm.profession}
                onChange={handleFormChange}
                placeholder="Enter profession"
                required
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="educationInput">
              <Form.Label>Education</Form.Label>
              <Form.Control
                type="text"
                name="education"
                value={officialForm.education}
                onChange={handleFormChange}
                placeholder="e.g., Masters, Bachelor"
                required
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="departmentInput">
              <Form.Label>Department</Form.Label>
              <Form.Control
                type="text"
                name="department"
                value={officialForm.department}
                onChange={handleFormChange}
                placeholder="Enter department"
                required
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="emailInput">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={officialForm.email}
                onChange={handleFormChange}
                placeholder="Enter email"
                required
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="usernameInput">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                name="username"
                value={officialForm.username}
                onChange={handleFormChange}
                placeholder="Enter username"
                required
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="passwordInput">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                name="password"
                value={officialForm.password}
                onChange={handleFormChange}
                placeholder="Enter password"
                required
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="contactInput">
              <Form.Label>Phone</Form.Label>
              <Form.Control
                type="number"
                name="phone"
                value={officialForm.phone}
                onChange={handleFormChange}
                placeholder="Enter phone number"
                required
              />
            </Form.Group>

            
            <Button type="submit" variant="primary" className="w-100">
              {formMode === "add" ? "Add Official" : "Update Official"}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
}

export default MainAdmin;
