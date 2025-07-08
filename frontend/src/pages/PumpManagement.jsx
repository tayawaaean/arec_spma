import React, { useState, useEffect, useContext } from 'react';
import { Container, Row, Col, Card, Button, Table, Badge, Form, InputGroup } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faPencilAlt, faTrash, faSearch, faFilter, faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';
import { DashboardContext } from '../App';
import AddPumpModal from '../components/pumps/AddPumpModal';
import EditPumpModal from '../components/pumps/EditPumpModal';
import DeletePumpModal from '../components/pumps/DeletePumpModal';

// Sample data - would normally come from API
const SAMPLE_PUMPS = [
  {
    _id: "68671e4ababf10848c8f9c61",
    solarPumpNumber: 1,
    model: "SPX-1500",
    power: "1.5kW",
    acInputVoltage: "220V",
    pvOperatingVoltage: "200V",
    openCircuitVoltage: "240V",
    outlet: "2 inch",
    maxHead: "35m",
    maxFlow: "10m3/h",
    solarPanelConfig: "6x300W",
    lat: 14.5995,
    lng: 120.9842,
    address: {
      barangay: "Quiapo",
      municipality: "Manila",
      region: "Metro Manila",
      country: "Philippines"
    },
    timeInstalled: "2025-07-01T08:00:00.000Z",
    status: "active",
    createdBy: "superadmin",
    updatedBy: "superadmin",
    createdAt: "2025-07-04T00:20:26.631Z",
    updatedAt: "2025-07-04T00:20:26.631Z",
  },
  {
    _id: "68671e4ababf10848c8f9c62",
    solarPumpNumber: 2,
    model: "SPX-2000",
    power: "2.0kW",
    acInputVoltage: "220V",
    pvOperatingVoltage: "220V",
    openCircuitVoltage: "260V",
    outlet: "2.5 inch",
    maxHead: "40m",
    maxFlow: "15m3/h",
    solarPanelConfig: "8x300W",
    lat: 10.3157,
    lng: 123.8854,
    address: {
      barangay: "Downtown",
      municipality: "Cebu City",
      region: "Central Visayas",
      country: "Philippines"
    },
    timeInstalled: "2025-06-15T09:30:00.000Z",
    status: "inactive",
    createdBy: "superadmin",
    updatedBy: "superadmin",
    createdAt: "2025-07-04T00:22:18.251Z",
    updatedAt: "2025-07-04T00:22:18.251Z",
  },
  {
    _id: "68671e4ababf10848c8f9c63",
    solarPumpNumber: 3,
    model: "SPX-1800",
    power: "1.8kW",
    acInputVoltage: "220V",
    pvOperatingVoltage: "210V",
    openCircuitVoltage: "250V",
    outlet: "2 inch",
    maxHead: "38m",
    maxFlow: "12m3/h",
    solarPanelConfig: "7x300W",
    lat: 7.1907,
    lng: 125.4553,
    address: {
      barangay: "Poblacion",
      municipality: "Davao City",
      region: "Davao Region",
      country: "Philippines"
    },
    timeInstalled: "2025-06-20T10:15:00.000Z",
    status: "warning",
    createdBy: "superadmin",
    updatedBy: "superadmin",
    createdAt: "2025-07-04T00:25:44.192Z",
    updatedAt: "2025-07-04T00:25:44.192Z",
  }
];

const PumpManagement = () => {
  const { dashboardSettings } = useContext(DashboardContext);
  const [pumps, setPumps] = useState(SAMPLE_PUMPS);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  
  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedPump, setSelectedPump] = useState(null);

  // Filtered pumps based on search query and status filter
  const filteredPumps = pumps.filter(pump => {
    const matchesSearch = 
      pump.solarPumpNumber.toString().includes(searchQuery) ||
      pump.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pump.address.municipality.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pump.address.region.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || pump.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Handlers for pump operations
  const handleAddPump = (newPump) => {
    // This would be an API call in a real implementation
    console.log('Adding new pump:', newPump);
    const pumpWithId = { 
      ...newPump, 
      _id: `temp-${Date.now()}`,
      createdBy: dashboardSettings.currentUser,
      updatedBy: dashboardSettings.currentUser,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setPumps([...pumps, pumpWithId]);
    setShowAddModal(false);
  };

  const handleEditPump = (updatedPump) => {
    // This would be an API call in a real implementation
    console.log('Updating pump:', updatedPump);
    const updatedPumps = pumps.map(pump => 
      pump._id === updatedPump._id ? { ...updatedPump, updatedBy: dashboardSettings.currentUser, updatedAt: new Date().toISOString() } : pump
    );
    setPumps(updatedPumps);
    setShowEditModal(false);
  };

  const handleDeletePump = () => {
    // This would be an API call in a real implementation
    if (!selectedPump) return;
    console.log('Deleting pump:', selectedPump._id);
    const updatedPumps = pumps.filter(pump => pump._id !== selectedPump._id);
    setPumps(updatedPumps);
    setShowDeleteModal(false);
    setSelectedPump(null);
  };

  const openEditModal = (pump) => {
    setSelectedPump(pump);
    setShowEditModal(true);
  };

  const openDeleteModal = (pump) => {
    setSelectedPump(pump);
    setShowDeleteModal(true);
  };

  // Render status badge
  const renderStatusBadge = (status) => {
    const badgeClass = `status-badge status-${status}`;
    return <span className={badgeClass}>{status.charAt(0).toUpperCase() + status.slice(1)}</span>;
  };

  return (
    <Container fluid className="pump-management">
      <Row className="mb-3">
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h4 className="mb-1">Solar Pump Management</h4>
              <p className="text-muted mb-0">Add, edit, and manage solar water pumps</p>
            </div>
            <div className="d-flex align-items-center">
              <span className="text-muted me-3">
                {dashboardSettings.currentUser} | {dashboardSettings.currentDateTime}
              </span>
              <Button 
                variant="primary" 
                onClick={() => setShowAddModal(true)}
                className="add-pump-btn"
              >
                <FontAwesomeIcon icon={faPlus} className="me-2" />
                Add New Pump
              </Button>
            </div>
          </div>
        </Col>
      </Row>

      <Row className="mb-3">
        <Col md={6}>
          <InputGroup>
            <InputGroup.Text className="search-icon">
              <FontAwesomeIcon icon={faSearch} />
            </InputGroup.Text>
            <Form.Control
              placeholder="Search by pump number, model, or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </InputGroup>
        </Col>
        <Col md={6}>
          <div className="d-flex justify-content-end">
            <InputGroup className="w-50">
              <InputGroup.Text className="filter-icon">
                <FontAwesomeIcon icon={faFilter} />
              </InputGroup.Text>
              <Form.Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="filter-select"
              >
                <option value="all">All Statuses</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="warning">Warning</option>
              </Form.Select>
            </InputGroup>
          </div>
        </Col>
      </Row>

      <div className="pump-table-container visible-table">
        <Table responsive hover className="pump-table">
          <thead>
            <tr>
              <th>Pump #</th>
              <th>Model</th>
              <th>Power</th>
              <th>Location</th>
              <th>Installation Date</th>
              <th>Status</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredPumps.length > 0 ? (
              filteredPumps.map((pump) => (
                <tr key={pump._id}>
                  <td className="pump-number">{pump.solarPumpNumber}</td>
                  <td className="pump-model">{pump.model}</td>
                  <td className="pump-power">{pump.power}</td>
                  <td className="pump-location">
                    <FontAwesomeIcon icon={faMapMarkerAlt} className="location-icon me-1" />
                    <span>{pump.address.municipality}, {pump.address.region}</span>
                  </td>
                  <td className="pump-date">{new Date(pump.timeInstalled).toLocaleDateString()}</td>
                  <td className="pump-status">{renderStatusBadge(pump.status)}</td>
                  <td className="pump-actions">
                    <div className="d-flex justify-content-center gap-2">
                      <Button 
                        variant="outline-primary" 
                        size="sm"
                        onClick={() => openEditModal(pump)}
                        className="action-btn edit-btn"
                      >
                        <FontAwesomeIcon icon={faPencilAlt} />
                      </Button>
                      <Button 
                        variant="outline-danger" 
                        size="sm"
                        onClick={() => openDeleteModal(pump)}
                        className="action-btn delete-btn"
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center py-4 no-results">
                  No pumps found matching your search criteria.
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>

      {/* Modals */}
      <AddPumpModal 
        show={showAddModal} 
        handleClose={() => setShowAddModal(false)} 
        handleAdd={handleAddPump} 
      />

      {selectedPump && (
        <EditPumpModal 
          show={showEditModal} 
          handleClose={() => setShowEditModal(false)} 
          handleEdit={handleEditPump}
          pump={selectedPump}
        />
      )}

      {selectedPump && (
        <DeletePumpModal
          show={showDeleteModal}
          handleClose={() => setShowDeleteModal(false)}
          handleDelete={handleDeletePump}
          pump={selectedPump}
        />
      )}
    </Container>
  );
};

export default PumpManagement;