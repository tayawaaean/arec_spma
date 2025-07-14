import React, { useState, useEffect, useContext } from 'react';
import { Dropdown } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faPlus, faPen, faTrashAlt, faSearch, faFilter, faMapMarkerAlt, 
  faSync, faFileExport, faSpinner, faFileCsv, faInfoCircle,
  faBolt, faWater, faCalendarAlt, faChevronLeft, faChevronRight
} from '@fortawesome/free-solid-svg-icons';
import { DashboardContext } from '../App';
import AddPumpModal from '../components/pumps/AddPumpModal';
import EditPumpModal from '../components/pumps/EditPumpModal';
import DeletePumpModal from '../components/pumps/DeletePumpModal';
import { pumpService } from '../services/pumpService';
import { toast } from 'react-toastify';
import { convertToCSV, downloadCSV } from '../utils/csvExport';
import '../styles/pump-management.css';

const PumpManagement = () => {
  const { dashboardSettings } = useContext(DashboardContext);
  const [pumps, setPumps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchType, setSearchType] = useState('all');
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0
  });
  
  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedPump, setSelectedPump] = useState(null);
  
  // Current date and time
  const currentDateTime = dashboardSettings?.currentDateTime || "2025-07-09 06:12:00";
  const currentUser = dashboardSettings?.currentUser || "Dextiee";

  useEffect(() => {
    fetchPumps();
  }, [pagination.page, pagination.limit, statusFilter]);

  const fetchPumps = async (searchOverride = null) => {
    try {
      setLoading(true);
      setError(null);
      
      const filters = {};
      const currentSearch = searchOverride !== null ? searchOverride : searchQuery;
      
      if (currentSearch) {
        filters.search = currentSearch;
        
        if (searchType === 'model' || searchType === 'all') {
          filters.model = currentSearch;
        }
        
        if (searchType === 'location' || searchType === 'all') {
          filters['address.municipality'] = currentSearch;
          filters['address.region'] = currentSearch;
        }
        
        if (searchType === 'number' || searchType === 'all') {
          if (!isNaN(parseInt(currentSearch))) {
            filters.solarPumpNumber = parseInt(currentSearch);
          }
        }
      }
      
      if (statusFilter !== 'all') {
        filters.status = statusFilter;
      }
      
      const response = await pumpService.getAllPumps(
        pagination.page,
        pagination.limit,
        filters
      );
      
      setPumps(response.data);
      setPagination({
        ...pagination,
        total: response.total
      });
    } catch (err) {
      console.error('Error fetching pumps:', err);
      setError('Failed to load pumps. Please try again later.');
      toast.error('Failed to load pumps');
    } finally {
      setLoading(false);
    }
  };
  
  const exportToCSV = async () => {
    try {
      setExporting(true);
      
      const filters = {};
      
      if (searchQuery) {
        filters.search = searchQuery;
        
        if (searchType === 'model' || searchType === 'all') {
          filters.model = searchQuery;
        }
        
        if (searchType === 'location' || searchType === 'all') {
          filters['address.municipality'] = searchQuery;
          filters['address.region'] = searchQuery;
        }
        
        if (searchType === 'number' || searchType === 'all') {
          if (!isNaN(parseInt(searchQuery))) {
            filters.solarPumpNumber = parseInt(searchQuery);
          }
        }
      }
      
      if (statusFilter !== 'all') {
        filters.status = statusFilter;
      }
      
      const response = await pumpService.exportPumpsToCSV(filters);
      
      if (!response.data || response.data.length === 0) {
        toast.warning('No data to export');
        return;
      }
      
      const columns = [
        { key: 'solarPumpNumber', header: 'Pump Number' },
        { key: 'model', header: 'Model' },
        { key: 'power', header: 'Power' },
        { key: 'address.municipality', header: 'Municipality' },
        { key: 'address.region', header: 'Region' },
        { key: 'lat', header: 'Latitude' },
        { key: 'lng', header: 'Longitude' },
        { key: 'timeInstalled', header: 'Installation Date', type: 'date' },
        { key: 'status', header: 'Status' },
        { key: 'createdBy', header: 'Created By' },
        { key: 'updatedAt', header: 'Last Updated', type: 'date' }
      ];
      
      const csvContent = convertToCSV(response.data, columns);
      const date = new Date().toISOString().split('T')[0];
      const filename = `solar_pumps_export_${date}.csv`;
      
      downloadCSV(csvContent, filename);
      toast.success(`Exported ${response.data.length} records to CSV`);
    } catch (err) {
      toast.error('Failed to export data');
    } finally {
      setExporting(false);
    }
  };

  const handleSearchChange = (e) => setSearchQuery(e.target.value);
  const handleSearch = () => {
    setPagination({...pagination, page: 1});
    fetchPumps(searchQuery);
  };
  
  const handleAddPump = async (newPump) => {
    try {
      setLoading(true);
      await pumpService.addPump(newPump);
      toast.success('Pump added successfully!');
      setShowAddModal(false);
      fetchPumps();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add pump');
    } finally {
      setLoading(false);
    }
  };

  const handleEditPump = async (updatedPump) => {
    try {
      setLoading(true);
      await pumpService.updatePump(updatedPump._id, updatedPump);
      toast.success('Pump updated successfully!');
      setShowEditModal(false);
      fetchPumps();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update pump');
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePump = async () => {
    if (!selectedPump) return;
    try {
      setLoading(true);
      await pumpService.deletePump(selectedPump._id);
      toast.success('Pump deleted successfully!');
      setShowDeleteModal(false);
      setSelectedPump(null);
      fetchPumps();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete pump');
    } finally {
      setLoading(false);
    }
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setStatusFilter('all');
    setSearchType('all');
    setPagination({...pagination, page: 1});
    fetchPumps('');
  };

  // Generate model icon/avatar
  const getPumpModelAvatar = (model) => {
    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F06595', '#748CAB', '#6A0572'];
    const index = model.charCodeAt(0) % colors.length;
    const modelPrefix = model.split('-')[0]; // Get the prefix (SPX)
    
    return (
      <div className="pump-avatar" style={{ backgroundColor: colors[index] }}>
        {modelPrefix}
      </div>
    );
  };
  
  // Render status badge
  const renderStatusBadge = (status) => {
    let badgeClass = 'status-badge';
    
    switch (status) {
      case 'active':
        badgeClass += ' status-active';
        break;
      case 'inactive':
        badgeClass += ' status-inactive';
        break;
      case 'maintenance':
        badgeClass += ' status-warning';
        break;
    }
    
    return (
      <div className={badgeClass}>
        <span className="status-indicator"></span>
        <span>{status.charAt(0).toUpperCase() + status.slice(1)}</span>
      </div>
    );
  };

  // Format power nicely
  const formatPower = (power) => {
    if (!power) return 'N/A';
    
    // If it already has kW, return as is
    if (power.toString().includes('kW')) return power;
    
    // Otherwise add kW
    return `${power}kW`;
  };

  return (
    <div className="dashboard-container">
      {/* Header section */}
      <div className="header-panel">
        <div className="title-section">
          <h1>Solar Pump Management</h1>
          <p>Add, edit, and manage solar water pumps</p>
        </div>
        <div className="user-info">
          <span className="time-display">{currentDateTime}</span>
          <div className="current-user">
            <div className="user-avatar current">{currentUser.substring(0, 2).toUpperCase()}</div>
            <span>{currentUser}</span>
          </div>
        </div>
      </div>
      
      {/* Action buttons */}
      <div className="action-panel">
        <div className="search-section">
          <div className="search-box">
            <FontAwesomeIcon icon={faSearch} className="search-icon" />
            <input
              type="text"
              placeholder="Search pumps..."
              value={searchQuery}
              onChange={handleSearchChange}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
          </div>
          <Dropdown className="search-type-dropdown">
            <Dropdown.Toggle variant="dark" id="search-type-dropdown">
              {searchType === 'all' ? 'All Fields' : 
               searchType === 'number' ? 'Pump #' :
               searchType === 'model' ? 'Model' : 'Location'}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item onClick={() => setSearchType('all')} active={searchType === 'all'}>
                All Fields
              </Dropdown.Item>
              <Dropdown.Item onClick={() => setSearchType('number')} active={searchType === 'number'}>
                Pump #
              </Dropdown.Item>
              <Dropdown.Item onClick={() => setSearchType('model')} active={searchType === 'model'}>
                Model
              </Dropdown.Item>
              <Dropdown.Item onClick={() => setSearchType('location')} active={searchType === 'location'}>
                Location
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
          <button className="btn-search" onClick={handleSearch}>Search</button>
        </div>
        <div className="filter-section">
          <Dropdown>
            <Dropdown.Toggle variant="dark" id="filter-dropdown" className="filter-toggle">
              <FontAwesomeIcon icon={faFilter} className="filter-icon" />
              {statusFilter === 'all' ? 'All Statuses' : 
               statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1)}
            </Dropdown.Toggle>
            <Dropdown.Menu className="filter-menu">
              <Dropdown.Item 
                className={statusFilter === 'all' ? 'active' : ''}
                onClick={() => setStatusFilter('all')}
              >
                All Statuses
              </Dropdown.Item>
              <Dropdown.Item 
                className={statusFilter === 'active' ? 'active' : ''}
                onClick={() => setStatusFilter('active')}
              >
                <span className="dropdown-status-dot active"></span>
                Active
              </Dropdown.Item>
              <Dropdown.Item 
                className={statusFilter === 'inactive' ? 'active' : ''}
                onClick={() => setStatusFilter('inactive')}
              >
                <span className="dropdown-status-dot inactive"></span>
                Inactive
              </Dropdown.Item>
              <Dropdown.Item 
                className={statusFilter === 'maintenance' ? 'active' : ''}
                onClick={() => setStatusFilter('maintenance')}
              >
                <span className="dropdown-status-dot maintenance"></span>
                maintenance
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
          <button 
            className="btn-refresh" 
            onClick={() => fetchPumps()}
            title="Refresh pump data"
          >
            <FontAwesomeIcon icon={faSync} />
          </button>
          <button 
            className={`btn-export ${(exporting || loading || pumps.length === 0) ? 'disabled' : ''}`}
            onClick={exportToCSV}
            disabled={exporting || loading || pumps.length === 0}
          >
            {exporting ? (
              <>
                <FontAwesomeIcon icon={faSpinner} spin />
                <span>Exporting...</span>
              </>
            ) : (
              <>
                <FontAwesomeIcon icon={faFileCsv} />
                <span>Export CSV</span>
              </>
            )}
          </button>
          <button className="btn-add" onClick={() => setShowAddModal(true)}>
            <FontAwesomeIcon icon={faPlus} />
            <span>Add Pump</span>
          </button>
        </div>
      </div>
      
      {/* Main content area */}
      <div className="data-panel">
        {loading ? (
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>Loading pumps...</p>
          </div>
        ) : error ? (
          <div className="error-message">
            <FontAwesomeIcon icon={faInfoCircle} className="error-icon" />
            <p>{error}</p>
            <button onClick={() => fetchPumps()}>Try Again</button>
          </div>
        ) : (
          <>
            <div className="pumps-table">
              <div className="table-header">
                <div className="th th-number">PUMP #</div>
                <div className="th th-model">MODEL</div>
                <div className="th th-power">POWER</div>
                <div className="th th-location">LOCATION</div>
                <div className="th th-date">INSTALLED</div>
                <div className="th th-status">STATUS</div>
                <div className="th th-actions">ACTIONS</div>
              </div>
              
              <div className="table-body">
                {pumps.length === 0 ? (
                  <div className="empty-state">
                    <div className="empty-icon">🔍</div>
                    <h3>No pumps found</h3>
                    <p>Try adjusting your search or filters</p>
                    {(searchQuery || statusFilter !== 'all') && (
                      <button className="btn-clear" onClick={handleClearSearch}>
                        Clear Search & Filters
                      </button>
                    )}
                  </div>
                ) : (
                  pumps.map((pump) => (
                    <div className="table-row" key={pump._id}>
                      <div className="td td-number">
                        <div className="pump-number-badge">
                          {pump.solarPumpNumber}
                        </div>
                      </div>
                      <div className="td td-model">
                        <div className="model-info">
                          {getPumpModelAvatar(pump.model)}
                          <span className="model-name">{pump.model}</span>
                        </div>
                      </div>
                      <div className="td td-power">
                        <div className="power-badge">
                          <FontAwesomeIcon icon={faBolt} />
                          <span>{formatPower(pump.power)}</span>
                        </div>
                      </div>
                      <div className="td td-location">
                        <div className="location-container">
                          <div className="location-pin">
                            <FontAwesomeIcon icon={faMapMarkerAlt} />
                          </div>
                          <div className="location-details">
                            <span className="location-municipality">
                              {pump.address?.municipality || 'Unknown'}
                            </span>
                            <span className="location-region">
                              {pump.address?.region || 'Unknown'}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="td td-date">
                        <div className="date-container">
                          <FontAwesomeIcon icon={faCalendarAlt} />
                          <span>{new Date(pump.timeInstalled).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <div className="td td-status">
                        {renderStatusBadge(pump.status)}
                      </div>
                      <div className="td td-actions">
                        <button 
                          className="btn-action btn-edit" 
                          onClick={() => {
                            setSelectedPump(pump);
                            setShowEditModal(true);
                          }}
                          title="Edit Pump"
                        >
                          <FontAwesomeIcon icon={faPen} />
                        </button>
                        <button 
                          className="btn-action btn-delete" 
                          onClick={() => {
                            setSelectedPump(pump);
                            setShowDeleteModal(true);
                          }}
                          title="Delete Pump"
                        >
                          <FontAwesomeIcon icon={faTrashAlt} />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
            
            {pumps.length > 0 && (
              <div className="pagination-controls">
                <div className="showing-info">
                  Showing {pumps.length} of {pagination.total} pumps
                </div>
                <div className="pagination">
                  <button 
                    className="page-btn prev" 
                    disabled={pagination.page === 1}
                    onClick={() => setPagination({...pagination, page: pagination.page - 1})}
                  >
                    <FontAwesomeIcon icon={faChevronLeft} />
                  </button>
                  
                  <span className="current-page">
                    Page <span className="page-number">{pagination.page}</span> of <span className="page-count">{Math.ceil(pagination.total / pagination.limit) || 1}</span>
                  </span>
                  
                  <button 
                    className="page-btn next" 
                    disabled={pagination.page >= Math.ceil(pagination.total / pagination.limit)}
                    onClick={() => setPagination({...pagination, page: pagination.page + 1})}
                  >
                    <FontAwesomeIcon icon={faChevronRight} />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
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
          onDeleteSuccess={() => {
            setSelectedPump(null);
            fetchPumps();
          }}
          pump={selectedPump}
        />
      )}
    </div>
  );
};

export default PumpManagement;