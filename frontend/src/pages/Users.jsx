import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Button, Form, InputGroup, Pagination } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUserPlus, faEdit, faTrash, faSearch, 
  faFilter, faSort, faSyncAlt 
} from '@fortawesome/free-solid-svg-icons';
import AddUserModal from '../components/users/AddUserModal';
import EditUserModal from '../components/users/EditUserModal';
import DeleteUserModal from '../components/users/DeleteUserModal';
import { getUsers} from '../utils/userDataSimulator';

const Users = () => {
  // State management
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [userTypeFilter, setUserTypeFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [sortField, setSortField] = useState('username');
  const [sortDirection, setSortDirection] = useState('asc');
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const usersPerPage = 10;

  // Fetch users
  const fetchUsers = () => {
    setLoading(true);
    try {
      const filters = {
        username: searchTerm,
        userType: userTypeFilter === 'all' ? '' : userTypeFilter
      };
      const { data } = getUsers(filters);
      setUsers(data);
      
      // Sort users
      const sortedUsers = sortUsers(data, sortField, sortDirection);
      
      // Calculate total pages
      const total = Math.ceil(sortedUsers.length / usersPerPage);
      setTotalPages(total > 0 ? total : 1);
      
      // Adjust current page if it exceeds the new total
      if (currentPage > total && total > 0) {
        setCurrentPage(total);
      }
      
      // Get current page data
      const startIndex = (currentPage - 1) * usersPerPage;
      const paginatedUsers = sortedUsers.slice(startIndex, startIndex + usersPerPage);
      setFilteredUsers(paginatedUsers);
      
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchUsers();
  }, []);

  // When filters, sort, or pagination changes
  useEffect(() => {
    fetchUsers();
  }, [searchTerm, userTypeFilter, sortField, sortDirection, currentPage]);
  
  // Handle sorting
  const sortUsers = (usersArray, field, direction) => {
    return [...usersArray].sort((a, b) => {
      if (direction === 'asc') {
        return a[field] > b[field] ? 1 : -1;
      } else {
        return a[field] < b[field] ? 1 : -1;
      }
    });
  };
  
  const handleSort = (field) => {
    const newDirection = field === sortField && sortDirection === 'asc' ? 'desc' : 'asc';
    setSortField(field);
    setSortDirection(newDirection);
    // Reset to first page on sort change
    setCurrentPage(1);
  };

  // Modal handlers
  const handleAddUser = () => {
    setShowAddModal(true);
  };

  const handleEditUser = (user) => {
    setCurrentUser(user);
    setShowEditModal(true);
  };

  const handleDeleteUser = (user) => {
    setCurrentUser(user);
    setShowDeleteModal(true);
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setUserTypeFilter('all');
    setCurrentPage(1); // Reset to first page
  };
  
  // Handle pagination
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  
  // Generate pagination items
  const renderPaginationItems = () => {
    let items = [];
    
    // Always show first page
    items.push(
      <Pagination.Item 
        key={1} 
        active={1 === currentPage}
        onClick={() => handlePageChange(1)}
      >
        1
      </Pagination.Item>
    );
    
    // If there are many pages, add ellipsis after first page
    if (currentPage > 3) {
      items.push(<Pagination.Ellipsis key="ellipsis1" disabled />);
    }
    
    // Pages around current page
    for (let number = Math.max(2, currentPage - 1); number <= Math.min(totalPages - 1, currentPage + 1); number++) {
      if (number === 1 || number === totalPages) continue; // Skip first and last page as they're added separately
      items.push(
        <Pagination.Item
          key={number}
          active={number === currentPage}
          onClick={() => handlePageChange(number)}
        >
          {number}
        </Pagination.Item>
      );
    }
    
    // If there are many pages, add ellipsis before last page
    if (currentPage < totalPages - 2) {
      items.push(<Pagination.Ellipsis key="ellipsis2" disabled />);
    }
    
    // Always show last page if there's more than one page
    if (totalPages > 1) {
      items.push(
        <Pagination.Item
          key={totalPages}
          active={totalPages === currentPage}
          onClick={() => handlePageChange(totalPages)}
        >
          {totalPages}
        </Pagination.Item>
      );
    }
    
    return items;
  };

  return (
    <Container fluid>
      <Row className="mb-4">
        <Col>
          <h4 className="mb-3">User Management</h4>
          <p className="text-muted">
            Manage user accounts and permissions for the solar monitoring system
          </p>
        </Col>
        <Col md="auto" className="d-flex align-items-center">
          <Button 
            variant="outline-secondary" 
            className="me-2"
            style={{ 
              background: 'rgba(255, 255, 255, 0.05)', 
              color: 'var(--text-primary)', 
              borderColor: 'var(--filter-border)'
            }}
            onClick={handleResetFilters}
          >
            <FontAwesomeIcon icon={faSyncAlt} className="me-2" />
            Reset Filters
          </Button>
          <Button 
            variant="primary"
            style={{ 
              background: 'var(--blue-accent)', 
              borderColor: 'var(--blue-accent)'
            }}
            onClick={handleAddUser}
          >
            <FontAwesomeIcon icon={faUserPlus} className="me-2" />
            Add User
          </Button>
        </Col>
      </Row>

      {/* Filter Row */}
      <Row className="mb-4">
        <Col>
          <Card className="dashboard-card filters-container">
            <Card.Body>
              <Row>
                <Col md={6} lg={8}>
                  <InputGroup>
                    <InputGroup.Text style={{ background: 'var(--filter-bg)', border: '1px solid var(--filter-border)' }}>
                      <FontAwesomeIcon icon={faSearch} className="text-muted" />
                    </InputGroup.Text>
                    <Form.Control
                      placeholder="Search users by username..."
                      value={searchTerm}
                      onChange={(e) => {
                        setSearchTerm(e.target.value);
                        setCurrentPage(1); // Reset to first page on search
                      }}
                      style={{ 
                        background: 'var(--filter-bg)', 
                        color: 'var(--text-primary)', 
                        border: '1px solid var(--filter-border)'
                      }}
                    />
                  </InputGroup>
                </Col>
                <Col md={6} lg={4}>
                  <InputGroup>
                    <InputGroup.Text style={{ background: 'var(--filter-bg)', border: '1px solid var(--filter-border)' }}>
                      <FontAwesomeIcon icon={faFilter} className="text-muted" />
                    </InputGroup.Text>
                    <Form.Select 
                      value={userTypeFilter} 
                      onChange={(e) => {
                        setUserTypeFilter(e.target.value);
                        setCurrentPage(1); // Reset to first page on filter change
                      }}
                      style={{ 
                        background: 'var(--filter-bg)', 
                        color: 'var(--text-primary)', 
                        border: '1px solid var(--filter-border)'
                      }}
                    >
                      <option value="all">All User Types</option>
                      <option value="superadmin">Superadmin</option>
                      <option value="admin">Admin</option>
                      <option value="user">User</option>
                    </Form.Select>
                  </InputGroup>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* User Table */}
      <Row>
        <Col>
          <Card className="dashboard-card">
            <Card.Body>
              <div className="table-responsive">
                <Table variant="dark" hover>
                  <thead>
                    <tr>
                      <th 
                        onClick={() => handleSort('username')}
                        style={{ cursor: 'pointer' }}
                      >
                        Username 
                        <FontAwesomeIcon 
                          icon={faSort} 
                          className="ms-2"
                          style={{ 
                            opacity: sortField === 'username' ? 1 : 0.3,
                            transform: sortField === 'username' && sortDirection === 'desc' ? 'rotate(180deg)' : 'none'
                          }} 
                        />
                      </th>
                      <th 
                        onClick={() => handleSort('userType')}
                        style={{ cursor: 'pointer' }}
                      >
                        User Type 
                        <FontAwesomeIcon 
                          icon={faSort} 
                          className="ms-2"
                          style={{ 
                            opacity: sortField === 'userType' ? 1 : 0.3,
                            transform: sortField === 'userType' && sortDirection === 'desc' ? 'rotate(180deg)' : 'none'
                          }}
                        />
                      </th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr>
                        <td colSpan="3" className="text-center">
                          <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Loading...</span>
                          </div>
                        </td>
                      </tr>
                    ) : filteredUsers.length === 0 ? (
                      <tr>
                        <td colSpan="3" className="text-center">No users found</td>
                      </tr>
                    ) : (
                      filteredUsers.map(user => (
                        <tr key={user.id}>
                          <td>{user.username}</td>
                          <td>
                            <span className={`badge ${
                              user.userType === 'superadmin' ? 'bg-danger' : 
                              user.userType === 'admin' ? 'bg-warning' : 
                              'bg-info'
                            }`}>
                              {user.userType}
                            </span>
                          </td>
                          <td>
                            <Button 
                              variant="outline-primary" 
                              size="sm" 
                              className="me-2"
                              onClick={() => handleEditUser(user)}
                            >
                              <FontAwesomeIcon icon={faEdit} />
                            </Button>
                            <Button 
                              variant="outline-danger" 
                              size="sm"
                              onClick={() => handleDeleteUser(user)}
                              disabled={user.userType === 'superadmin'} // Prevent deleting superadmin
                            >
                              <FontAwesomeIcon icon={faTrash} />
                            </Button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </Table>
              </div>
              
              {/* Pagination */}
              {!loading && filteredUsers.length > 0 && (
                <div className="d-flex justify-content-between align-items-center mt-3">
                  <div className="text-muted">
                    Showing {((currentPage - 1) * usersPerPage) + 1} to {Math.min(currentPage * usersPerPage, users.length)} of {users.length} users
                  </div>
                  <Pagination className="mb-0">
                    <Pagination.Prev 
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                    />
                    {renderPaginationItems()}
                    <Pagination.Next 
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                    />
                  </Pagination>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Modals */}
      <AddUserModal 
        show={showAddModal} 
        onHide={() => setShowAddModal(false)}
        onUserAdded={() => fetchUsers()}
      />
      
      <EditUserModal 
        show={showEditModal} 
        onHide={() => setShowEditModal(false)}
        user={currentUser}
        onUserUpdated={() => fetchUsers()}
      />
      
      <DeleteUserModal 
        show={showDeleteModal} 
        onHide={() => setShowDeleteModal(false)}
        user={currentUser}
        onUserDeleted={() => fetchUsers()}
      />
    </Container>
  );
};

export default Users;