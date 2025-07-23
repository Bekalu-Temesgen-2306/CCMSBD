// ClearanceDashboard.jsx
import { useState } from 'react';
import { Card, Button, Alert, Row, Col } from 'react-bootstrap';
import ClearanceForm from "../components/ClearanceForm";
 // Import the modal form
import logo from '../assets/logo.png';

function ClearanceDashboard({ currentUser }) {
  const [showFormModal, setShowFormModal] = useState(false);

  const handleOpenForm = () => setShowFormModal(true);
  const handleCloseForm = () => setShowFormModal(false);

  return (
    <div style={{ backgroundColor: '#f5f8ff', minHeight: '100vh', padding: '2rem' }}>
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div className="d-flex align-items-center">
          <img src={logo} alt="BDU Logo" width="100" className="me-3"  style={{borderRadius:'50%'}}/>
          <div>
            <h3 className="mb-0">Campus Clearance Managment System(CCMS)</h3>
            <small className="text-muted">Bahir Dar University</small>
          </div>
        </div>
        <div>
          <span className="me-3">{currentUser?.name}</span>
          <span className="badge bg-secondary">{currentUser?.department}</span>
          <Button variant="outline-danger" className="ms-3">Logout</Button>
        </div>
      </div>

      <Row >
        {/* Welcome Section */}
        <Col md={8} style={{ borderColor:'#2A9DD5'}}>
          <Card className="mb-4 shadow-sm">
            <Card.Body>
              <h4>👋 Welcome, {currentUser?.name || 'Student'}</h4>
              <p>Manage your university clearance process digitally. Complete your clearance request to ensure a smooth transition.</p>
              <Row style={{display:'block'}}>
                <Col md={6} style={{margin:'auto'}}>
                  <Alert variant="info" className="py-2">
                    <strong>Quick & Efficient</strong>
                    <p className="mb-0">No more long queues. Complete your clearance digitally in minutes.</p>
                  </Alert>
                </Col>
                
                <Row style={{width:'52%' , margin:'auto'}} >
                  <Alert variant="success" className="py-2">
                    <strong>Real-time Status</strong>
                    <p className="mb-0">Track your clearance status and get instant notifications.</p>
                  </Alert>
                </Row>
              </Row>
            </Card.Body>
          </Card>
        </Col>

        {/* Status Section */}
        <Col md={4}>
          <Card className="mb-4 shadow-sm">
            <Card.Body>
              <h5>Your Status</h5>
              <p><strong>Student ID:</strong> {currentUser?.id || 'N/A'}</p>
              <p><strong>Department:</strong> {currentUser?.department || 'N/A'}</p>
              <p><strong>Clearance Status:</strong> <span className="badge bg-warning">Pending</span></p>
            </Card.Body>
          </Card>

          <Card className="shadow-sm">
            <Card.Body>
              <h5>Need Help?</h5>
              <p>If you encounter any issues or have questions about the clearance process, contact:</p>
              <p><strong>University Registrar</strong><br /> registrar@bdu.edu.et<br /> +251-58-220-0000</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Clearance Request */}
      <Card className="shadow-sm clearanceRequest " style={{ width: '100%', borderColor:'#2A9DD5',borderWidth:'4px'}}>
        <Card.Body>
          <h5>📄 Clearance Request</h5>
          <p>Start your digital clearance process. Ensure all your university obligations are cleared before graduation or departure.</p>
          <Alert variant="warning" className="py-2">
            <strong>Important Notice:</strong> Complete this clearance form properly to maintain a healthy relationship with the university. This is required for official transcripts, enrollment letters, and readmission considerations.
          </Alert>
          <div className="text-center">
            <Button style={{backgroundColor:'#2A9DD5'}}
              variant="primary"
              size="lg"
              onClick={handleOpenForm}
            >
              📄 Start Clearance Request
            </Button>
          </div>
        </Card.Body>
      </Card>

      {/* Popup Modal for Clearance Form */}
      <ClearanceForm
        show={showFormModal}
        handleClose={handleCloseForm}
        studentId={currentUser?.id}
      />
    </div>
  );
}

export default ClearanceDashboard;
