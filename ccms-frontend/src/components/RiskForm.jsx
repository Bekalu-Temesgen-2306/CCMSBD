

import { useState } from 'react';
import { Modal, Button, Form, Alert } from 'react-bootstrap';

// RiskForm component
function RiskForm({ show, onHide, onSubmit }) {
  // State for form data, alerts, and errors
  const [formData, setFormData] = useState({
    description: '',
    severity: 'Low',
    status: 'Open',
  });
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [errors, setErrors] = useState({});

  // Validate form inputs
  const validateForm = () => {
    const newErrors = {};
    if (!formData.description.trim()) newErrors.description = 'Risk description is required';
    return newErrors;
  };

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: null }));
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    if (onSubmit) {
      onSubmit(formData);
      setAlertMessage('Risk submitted successfully!');
      setShowAlert(true);
      setTimeout(() => {
        setShowAlert(false);
        onHide(); // Close modal after success
        setFormData({ description: '', severity: 'Low', status: 'Open' }); // Reset form
        setErrors({});
      }, 3000); // Auto-hide alert after 3 seconds
    }
  };

  return (
    <Modal
      show={show}
      onHide={onHide}
      centered
      aria-labelledby="risk-form-modal-title"
      backdrop="static"
      keyboard
    >
      <Modal.Header closeButton style={{ backgroundColor: '#003087', color: '#ffffff' }}>
        <Modal.Title id="risk-form-modal-title">Submit Risk Report</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {showAlert && (
          <Alert variant="success" onClose={() => setShowAlert(false)} dismissible className="mb-3">
            {alertMessage}
          </Alert>
        )}
        <Form onSubmit={handleSubmit} noValidate>
          <Form.Group className="mb-3" controlId="description">
            <Form.Label>Risk Description</Form.Label>
            <Form.Control
              as="textarea"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              aria-required="true"
              isInvalid={!!errors.description}
              aria-describedby="descriptionError"
              rows={3}
            />
            <Form.Control.Feedback type="invalid" id="descriptionError">
              {errors.description}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-3" controlId="severity">
            <Form.Label>Severity</Form.Label>
            <Form.Select
              name="severity"
              value={formData.severity}
              onChange={handleChange}
              aria-required="true"
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </Form.Select>
          </Form.Group>
          <Form.Group className="mb-3" controlId="status">
            <Form.Label>Status</Form.Label>
            <Form.Select
              name="status"
              value={formData.status}
              onChange={handleChange}
              aria-required="true"
            >
              <option value="Open">Open</option>
              <option value="In Progress">In Progress</option>
              <option value="Closed">Closed</option>
            </Form.Select>
          </Form.Group>
          <div className="d-flex justify-content-end gap-2">
            <Button variant="secondary" onClick={onHide}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Submit
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
}

export default RiskForm;

