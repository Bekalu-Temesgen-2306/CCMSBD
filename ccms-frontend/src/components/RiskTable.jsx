

import { useState, useEffect } from 'react';
import { Table, Button, Form } from 'react-bootstrap';
import mockRiskData from '../mockRiskData.json';

// RiskTable component
function RiskTable({ onEdit, onDelete }) {
  // State for sorting, filtering, and table data
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [filterText, setFilterText] = useState('');
  const [risks, setRisks] = useState(mockRiskData.risks);

  // Handle sorting
  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });

    const sortedRisks = [...risks].sort((a, b) => {
      if (a[key] < b[key]) return direction === 'asc' ? -1 : 1;
      if (a[key] > b[key]) return direction === 'asc' ? 1 : -1;
      return 0;
    });
    setRisks(sortedRisks);
  };

  // Handle filtering
  const handleFilter = (e) => {
    const text = e.target.value.toLowerCase();
    setFilterText(text);
    setRisks(
      mockRiskData.risks.filter((risk) =>
        risk.description.toLowerCase().includes(text) ||
        risk.severity.toLowerCase().includes(text) ||
        risk.status.toLowerCase().includes(text)
      )
    );
  };

  // Reset to original data on mount
  useEffect(() => {
    setRisks(mockRiskData.risks);
  }, []);

  return (
    <div>
      <Form.Group className="mb-3" controlId="filterRisks">
        <Form.Label>Filter Risks</Form.Label>
        <Form.Control
          type="text"
          value={filterText}
          onChange={handleFilter}
          placeholder="Enter keyword..."
          aria-label="Filter risks by description, severity, or status"
        />
      </Form.Group>
      <Table striped bordered hover responsive aria-label="Risk management table">
        <thead>
          <tr style={{ backgroundColor: '#003087', color: '#ffffff' }}>
            <th
              aria-sort={sortConfig.key === 'id' ? sortConfig.direction : null}
              onClick={() => handleSort('id')}
              style={{ cursor: 'pointer' }}
            >
              ID
            </th>
            <th
              aria-sort={sortConfig.key === 'description' ? sortConfig.direction : null}
              onClick={() => handleSort('description')}
              style={{ cursor: 'pointer' }}
            >
              Description
            </th>
            <th
              aria-sort={sortConfig.key === 'severity' ? sortConfig.direction : null}
              onClick={() => handleSort('severity')}
              style={{ cursor: 'pointer' }}
            >
              Severity
            </th>
            <th
              aria-sort={sortConfig.key === 'status' ? sortConfig.direction : null}
              onClick={() => handleSort('status')}
              style={{ cursor: 'pointer' }}
            >
              Status
            </th>
            <th
              aria-sort={sortConfig.key === 'dateSubmitted' ? sortConfig.direction : null}
              onClick={() => handleSort('dateSubmitted')}
              style={{ cursor: 'pointer' }}
            >
              Date Submitted
            </th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {risks.map((risk) => (
            <tr key={risk.id}>
              <td>{risk.id}</td>
              <td>{risk.description}</td>
              <td>
                <span
                  className={`badge ${risk.severity === 'Low' ? 'bg-success' : risk.severity === 'Medium' ? 'bg-warning text-dark' : 'bg-danger'}`}
                >
                  {risk.severity}
                </span>
              </td>
              <td>
                <span
                  className={`badge ${risk.status === 'Closed' ? 'bg-success' : risk.status === 'In Progress' ? 'bg-warning text-dark' : 'bg-secondary'}`}
                >
                  {risk.status}
                </span>
              </td>
              <td>{risk.dateSubmitted}</td>
              <td>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => onEdit && onEdit(risk)}
                  className="me-2"
                >
                  Edit
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => onDelete && onDelete(risk.id)}
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}

export default RiskTable;
