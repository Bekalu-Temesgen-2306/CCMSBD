import { useState, useEffect } from 'react';
import {
  Modal,
  Button,
  Form,
  Row,
  Col,
  Alert,
  Spinner,
} from 'react-bootstrap';
import logo from '../assets/logo.png';
import seal from '../assets/seal.png';

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

import mockStudentData from '../data/mockStudentData.json'; // adjust path
import mockRiskData from '../data/mockRiskData.json';       // adjust path

function ClearanceForm({ show, handleClose }) {
  const [formData, setFormData] = useState({
    studentName: '',
    fatherName: '',
    grandFatherName: '', // Added Grandfather name
    sex: 'Male',
    studentId: '',
    department: '',
    academicYear: '',
    semester: '',
    yearOfStudy: '',
    reason: '',
    otherReason: '',
    date: '',
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);
  const [pdfPreview, setPdfPreview] = useState(false);

  // Auto-fill current date on modal open
  useEffect(() => {
    if (show) {
      const nowISO = new Date().toISOString().slice(0, 16);
      setFormData((prev) => ({ ...prev, date: nowISO }));
    }
  }, [show]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: null });
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.studentName.trim())
      newErrors.studentName = 'Student Name is required.';
    if (!formData.fatherName.trim())
      newErrors.fatherName = 'Father\'s Name is required.';
    if (!formData.grandFatherName.trim())
      newErrors.grandFatherName = 'Grandfather\'s Name is required.';
    if (!formData.studentId.trim())
      newErrors.studentId = 'Student ID is required.';
    if (!formData.department.trim())
      newErrors.department = 'Department is required.';
    if (!formData.academicYear.trim())
      newErrors.academicYear = 'Academic Year is required.';
    if (!formData.semester)
      newErrors.semester = 'Semester selection is required.';
    if (!formData.yearOfStudy)
      newErrors.yearOfStudy = 'Year of Study is required.';
    if (!formData.reason)
      newErrors.reason = 'Reason for Clearance is required.';
    if (formData.reason === 'Other' && !formData.otherReason.trim())
      newErrors.otherReason = 'Please specify the reason.';
    if (!formData.date)
      newErrors.date = 'Date of Application is required.';

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const generatePDF = () => {
    const doc = new jsPDF('p', 'mm', 'a4');

    // Gold border
    doc.setDrawColor(212, 175, 55);
    doc.setLineWidth(3);
    doc.rect(10, 10, 190, 277, 'S');

    // Transparent watermark BDU Logo
    doc.setGState(new doc.GState({ opacity: 0.1 }));
    doc.addImage(logo, 'PNG', 30, 80, 150, 150);
    doc.setGState(new doc.GState({ opacity: 1 }));

    // BDU Logo at top
    doc.addImage(logo, 'PNG', 80, 15, 50, 25);

    // Title
    doc.setFontSize(20);
    doc.setTextColor(33, 37, 41);
    doc.setFont('times', 'bold');
    doc.text('Bahir Dar University', 105, 55, null, null, 'center');

    doc.setFontSize(16);
    doc.setFont('times', 'italic');
    doc.text('Clearance Certificate', 105, 65, null, null, 'center');

    // Student details table
    autoTable(doc, {
      startY: 80,
      head: [['Field', 'Details']],
      body: [
        ['Student Name', formData.studentName],
        ["Father's Name", formData.fatherName],
        ['Grandfather Name', formData.grandFatherName],
        ['Sex', formData.sex],
        ['Student ID', formData.studentId],
        ['Department', formData.department],
        ['Academic Year', formData.academicYear],
        ['Semester', formData.semester],
        ['Year of Study', formData.yearOfStudy],
        ['Reason for Clearance', formData.reason === 'Other' ? formData.otherReason : formData.reason],
        ['Date of Application', new Date(formData.date).toLocaleString()],
      ],
      styles: {
        fontSize: 12,
        cellPadding: 4,
        textColor: [0, 0, 0],
        lineColor: [212, 175, 55],
        lineWidth: 0.2,
      },
      headStyles: {
        fillColor: [33, 150, 243],
        textColor: [255, 255, 255],
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245],
      },
      margin: { left: 20, right: 20 },
    });

    // Signature line and Seal
    doc.setFontSize(14);
    doc.setFont('times', 'normal');
    doc.text('_____________________________', 30, 260);
    doc.text('Registrar Signature', 30, 265);

    doc.addImage(seal, 'PNG', 140, 230, 50, 50);

    return doc;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      setStatus({
        type: 'danger',
        message: '❌ Please correct the highlighted fields before submitting.',
      });
      return;
    }

    setLoading(true);

    setTimeout(() => {
      const studentExists = mockStudentData.students.find(
        (student) =>
          student.studentId.trim().toLowerCase() ===
          formData.studentId.trim().toLowerCase()
      );

      setLoading(false);

      if (!studentExists) {
        setStatus({
          type: 'danger',
          message: '❌ Student ID not found. Please check and try again.',
        });
        setPdfPreview(false);
        return;
      }

      const riskEntry = mockRiskData.risks.find(
        (entry) =>
          entry.studentId.trim().toLowerCase() ===
          formData.studentId.trim().toLowerCase()
      );

      if (riskEntry) {
        setStatus({
          type: 'danger',
          message: `❌ Clearance denied: ${riskEntry.case}. Please contact the registrar.`,
        });
        setPdfPreview(false);
        return;
      }

      setStatus({
        type: 'success',
        message: '🎉 You are cleared! You can preview and download your clearance certificate.',
      });
      setPdfPreview(true);
    }, 2000);
  };

  return (
    <Modal
      show={show}
      onHide={handleClose}
      fullscreen
      backdrop="static"
      keyboard={false}
      centered
      className="modern-form-modal"
    >
      <Modal.Header closeButton className="bg-primary text-white">
        <Modal.Title className="d-flex align-items-center gap-3">
          <img src={logo} alt="BDU Logo" width="60" />
          <div>
            <h4 className="mb-0 fw-bold">
              Regular Undergraduate Student's Clearance Sheet
            </h4>
            <small>Bahir Dar University</small>
          </div>
        </Modal.Title>
      </Modal.Header>

      <Modal.Body className="p-4 bg-light">
        <Alert variant="info" className="mb-4 shadow rounded">
          <strong>Important:</strong> Please complete and submit this form properly.
        </Alert>

        <Form onSubmit={handleSubmit} className="p-4 bg-white rounded shadow-sm border">
          <h5 className="fw-bold border-bottom pb-2 mb-3 text-primary">Personal Information</h5>

          {/* Student Name */}
          <Row className="mb-3">
            <Col md={6} className="mb-3">
              <Form.Group controlId="studentName">
                <Form.Label className="fw-bold">Student Name *</Form.Label>
                <Form.Control
                  type="text"
                  name="studentName"
                  value={formData.studentName}
                  onChange={handleChange}
                  isInvalid={!!errors.studentName}
                  placeholder="John Doe"
                  required
                />
                <Form.Control.Feedback type="invalid">
                  {errors.studentName}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>

            {/* Father Name */}
            <Col md={6} className="mb-3">
              <Form.Group controlId="fatherName">
                <Form.Label className="fw-bold">Father’s Name *</Form.Label>
                <Form.Control
                  type="text"
                  name="fatherName"
                  value={formData.fatherName}
                  onChange={handleChange}
                  isInvalid={!!errors.fatherName}
                  placeholder="Father Name"
                  required
                />
                <Form.Control.Feedback type="invalid">
                  {errors.fatherName}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>

          {/* Grandfather Name */}
          <Row className="mb-3">
            <Col md={6} className="mb-3">
              <Form.Group controlId="grandFatherName">
                <Form.Label className="fw-bold">Grandfather’s Name *</Form.Label>
                <Form.Control
                  type="text"
                  name="grandFatherName"
                  value={formData.grandFatherName}
                  onChange={handleChange}
                  isInvalid={!!errors.grandFatherName}
                  placeholder="Grandfather Name"
                  required
                />
                <Form.Control.Feedback type="invalid">
                  {errors.grandFatherName}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>

            {/* Sex */}
            <Col md={6} className="mb-3">
              <Form.Group controlId="sex">
                <Form.Label className="fw-bold">Sex *</Form.Label>
                <div>
                  <Form.Check
                    inline
                    type="radio"
                    name="sex"
                    value="Male"
                    label="Male"
                    checked={formData.sex === 'Male'}
                    onChange={handleChange}
                  />
                  <Form.Check
                    inline
                    type="radio"
                    name="sex"
                    value="Female"
                    label="Female"
                    checked={formData.sex === 'Female'}
                    onChange={handleChange}
                  />
                </div>
              </Form.Group>
            </Col>
          </Row>

          {/* Student ID */}
          <Row className="mb-3">
            <Col md={3} className="mb-3">
              <Form.Group controlId="studentId">
                <Form.Label className="fw-bold">Student ID *</Form.Label>
                <Form.Control
                  type="text"
                  name="studentId"
                  value={formData.studentId}
                  onChange={handleChange}
                  isInvalid={!!errors.studentId}
                  placeholder="STU001"
                  required
                />
                <Form.Control.Feedback type="invalid">
                  {errors.studentId}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>

            {/* Department */}
            <Col md={3} className="mb-3">
              <Form.Group controlId="department">
                <Form.Label className="fw-bold">Department *</Form.Label>
                <Form.Control
                  type="text"
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  isInvalid={!!errors.department}
                  placeholder="Computer Science"
                  required
                />
                <Form.Control.Feedback type="invalid">
                  {errors.department}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>

            {/* Academic Year */}
            <Col md={3} className="mb-3">
              <Form.Group controlId="academicYear">
                <Form.Label className="fw-bold">Academic Year *</Form.Label>
                <Form.Control
                  type="text"
                  name="academicYear"
                  value={formData.academicYear}
                  onChange={handleChange}
                  isInvalid={!!errors.academicYear}
                  placeholder="e.g., 2016"
                  required
                />
                <Form.Control.Feedback type="invalid">
                  {errors.academicYear}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>

            {/* Semester */}
            <Col md={3} className="mb-3">
              <Form.Group controlId="semester">
                <Form.Label className="fw-bold">Semester *</Form.Label>
                <Form.Select
                  name="semester"
                  value={formData.semester}
                  onChange={handleChange}
                  isInvalid={!!errors.semester}
                  required
                >
                  <option value="">Select semester</option>
                  <option value="1st">1st</option>
                  <option value="2nd">2nd</option>
                </Form.Select>
                <Form.Control.Feedback type="invalid">
                  {errors.semester}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>

          {/* Year of Study */}
          <Row className="mb-3">
            <Col md={3} className="mb-3">
              <Form.Group controlId="yearOfStudy">
                <Form.Label className="fw-bold">Year of Study *</Form.Label>
                <Form.Select
                  name="yearOfStudy"
                  value={formData.yearOfStudy}
                  onChange={handleChange}
                  isInvalid={!!errors.yearOfStudy}
                  required
                >
                  <option value="">Select year</option>
                  <option value="I">I</option>
                  <option value="II">II</option>
                  <option value="III">III</option>
                  <option value="IV">IV</option>
                </Form.Select>
                <Form.Control.Feedback type="invalid">
                  {errors.yearOfStudy}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>

            {/* Reason for Clearance */}
            <Col md={9} className="mb-3">
              <Form.Label className="fw-bold">Reason for Clearance *</Form.Label>
              <div>
                {[
                  'End of Academic Year',
                  'Graduation',
                  'Academic Dismissal',
                  'Withdrawing for Health/Family Reasons',
                  'Disciplinary Case',
                  'Other',
                ].map((reasonOption) => (
                  <Form.Check
                    inline
                    type="radio"
                    key={reasonOption}
                    label={reasonOption === 'Other' ? 'Other (please specify)' : reasonOption}
                    name="reason"
                    value={reasonOption}
                    checked={formData.reason === reasonOption}
                    onChange={handleChange}
                    required
                  />
                ))}
              </div>
              {errors.reason && (
                <div className="text-danger mt-1">{errors.reason}</div>
              )}

              {/* Show input for 'Other' reason */}
              {formData.reason === 'Other' && (
                <Form.Control
                  type="text"
                  name="otherReason"
                  value={formData.otherReason}
                  onChange={handleChange}
                  isInvalid={!!errors.otherReason}
                  placeholder="Please specify other reason"
                  className="mt-2"
                  required
                />
              )}
              <Form.Control.Feedback type="invalid">
                {errors.otherReason}
              </Form.Control.Feedback>
            </Col>
          </Row>

          {/* Date of Application */}
          <Form.Group className="mb-4" controlId="date">
            <Form.Label className="fw-bold">Date of Application *</Form.Label>
            <Form.Control
              type="datetime-local"
              name="date"
              value={formData.date}
              onChange={handleChange}
              isInvalid={!!errors.date}
              required
            />
            <Form.Control.Feedback type="invalid">
              {errors.date}
            </Form.Control.Feedback>
          </Form.Group>

          <div className="d-flex justify-content-end gap-2">
            <Button variant="secondary" onClick={handleClose} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" disabled={loading}>
              {loading ? (
                <>
                  <Spinner animation="border" size="sm" className="me-2" />
                  Submitting...
                </>
              ) : (
                'Submit Clearance Request'
              )}
            </Button>
          </div>
        </Form>

        {status && (
          <Alert
            variant={status.type === 'success' ? 'success' : 'danger'}
            className="mt-4 shadow rounded d-flex align-items-center gap-3 p-3"
            style={{
              maxWidth: '600px',
              margin: '30px auto',
              fontSize: '1.1rem',
              borderLeft: `5px solid ${status.type === 'success' ? '#28a745' : '#dc3545'}`,
              transition: 'all 0.3s ease',
            }}
          >
            <div
              style={{
                fontSize: '2.5rem',
                color: status.type === 'success' ? '#28a745' : '#dc3545',
                userSelect: 'none',
              }}
            >
              {status.type === 'success' ? '✅' : '❌'}
            </div>

            <div className="flex-grow-1">
              <strong>{status.type === 'success' ? 'Success!' : 'Error!'}</strong>
              <p className="mb-0">{status.message}</p>

              {/* PDF Buttons */}
              {pdfPreview && status.type === 'success' && (
                <div className="mt-3 d-flex gap-2">
                  <Button
                    variant="info"
                    onClick={() => generatePDF().output('dataurlnewwindow')}
                  >
                    👀 Preview PDF
                  </Button>
                  <Button
                    variant="success"
                    onClick={() => {
                      const pdfDoc = generatePDF();
                      pdfDoc.save(`${formData.studentId}_ClearanceCertificate.pdf`);
                    }}
                  >
                    📥 Download PDF
                  </Button>
                </div>
              )}
            </div>
          </Alert>
        )}
      </Modal.Body>
    </Modal>
  );
}

export default ClearanceForm;
