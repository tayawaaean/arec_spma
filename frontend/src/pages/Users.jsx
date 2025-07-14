import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, InputGroup, Dropdown } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUserPlus, faPen, faTrashAlt, faSearch, 
  faFilter, faSort, faSyncAlt, faEllipsisV, 
  faShield, faUser, faCrown, faChevronLeft, faChevronRight
} from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';
import AddUserModal from '../components/users/AddUserModal';
import EditUserModal from '../components/users/EditUserModal';
import DeleteUserModal from '../components/users/DeleteUserModal';
import { userService } from '../services/userService';
import '../styles/user.css';

const Users = () => {
  // State management
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [userTypeFilter, setUserTypeFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const usersPerPage = 10;

  // Current date/time and username
  const currentDateTime = "2025-07-09 06:27:34";
  const currentUsername = "Dextiee";
  
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const filters = {};
      if (searchTerm) filters.username = searchTerm;
      if (userTypeFilter !== 'all') filters.userType = userTypeFilter;
      
      const response = await userService.getUsers(currentPage, usersPerPage, filters);
      setUsers(response.data);
      setTotalPages(Math.ceil(response.total / usersPerPage) || 1);
      setSelectedUsers([]);
      setSelectAll(false);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [currentPage]);
  
  const handleSearch = () => {
    setCurrentPage(1);
    fetchUsers();
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setUserTypeFilter('all');
    setCurrentPage(1);
    fetchUsers();
  };
  
  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedUsers([]);
    } else {
      const selectableUsers = users
        .filter(user => user.userType !== 'superadmin')
        .map(user => user._id);
      setSelectedUsers(selectableUsers);
    }
    setSelectAll(!selectAll);
  };
  
  const handleSelectUser = (userId) => {
    if (selectedUsers.includes(userId)) {
      setSelectedUsers(selectedUsers.filter(id => id !== userId));
      setSelectAll(false);
    } else {
      setSelectedUsers([...selectedUsers, userId]);
    }
  };
  
  const handleBulkDelete = async () => {
    if (window.confirm(`Delete ${selectedUsers.length} users?`)) {
      try {
        for (const userId of selectedUsers) {
          await userService.deleteUser(userId);
        }
        toast.success(`${selectedUsers.length} users deleted`);
        fetchUsers();
      } catch (error) {
        toast.error('Failed to delete some users');
      }
    }
  };

  // Get user avatar based on username
  const getUserAvatar = (username) => {
    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F06595', '#748CAB', '#6A0572'];
    const index = username.charCodeAt(0) % colors.length;
    const initials = username.substring(0, 2).toUpperCase();
    
    return (
      <div className="user-avatar" style={{ backgroundColor: colors[index] }}>
        {initials}
      </div>
    );
  };
  
  // Get user type icon and class
  const getUserTypeInfo = (userType) => {
    switch (userType) {
      case 'superadmin':
        return { icon: faCrown, className: 'superadmin-badge' };
      case 'admin':
        return { icon: faShield, className: 'admin-badge' };
      default:
        return { icon: faUser, className: 'user-badge' };
    }
  };
  
  return (
    <div className="dashboard-container">
      {/* Header section */}
      <div className="header-panel">
        <div className="title-section">
          <h1>User Management</h1>
          <p>Manage user accounts and permissions for the solar monitoring system</p>
        </div>
        <div className="user-info">
          <span className="time-display">{currentDateTime}</span>
          <div className="current-user">
            <div className="user-avatar current">{currentUsername.substring(0, 2).toUpperCase()}</div>
            <span>{currentUsername}</span>
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
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
          </div>
          <button className="btn-search" onClick={handleSearch}>Search</button>
        </div>
        <div className="filter-section">
          <Dropdown>
            <Dropdown.Toggle variant="dark" id="filter-dropdown" className="filter-toggle">
              <FontAwesomeIcon icon={faFilter} className="filter-icon" />
              {userTypeFilter === 'all' ? 'All Types' : userTypeFilter}
            </Dropdown.Toggle>
            <Dropdown.Menu className="filter-menu">
              <Dropdown.Item 
                className={userTypeFilter === 'all' ? 'active' : ''}
                onClick={() => setUserTypeFilter('all')}
              >
                All Types
              </Dropdown.Item>
              <Dropdown.Item 
                className={userTypeFilter === 'superadmin' ? 'active' : ''}
                onClick={() => setUserTypeFilter('superadmin')}
              >
                <FontAwesomeIcon icon={faCrown} className="me-2" />
                Superadmin
              </Dropdown.Item>
              <Dropdown.Item 
                className={userTypeFilter === 'admin' ? 'active' : ''}
                onClick={() => setUserTypeFilter('admin')}
              >
                <FontAwesomeIcon icon={faShield} className="me-2" />
                Admin
              </Dropdown.Item>
              <Dropdown.Item 
                className={userTypeFilter === 'user' ? 'active' : ''}
                onClick={() => setUserTypeFilter('user')}
              >
                <FontAwesomeIcon icon={faUser} className="me-2" />
                User
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
          <button className="btn-reset" onClick={handleResetFilters}>
            <FontAwesomeIcon icon={faSyncAlt} className="icon-spin" />
          </button>
          <button className="btn-add" onClick={() => setShowAddModal(true)}>
            <FontAwesomeIcon icon={faUserPlus} />
            <span>Add User</span>
          </button>
        </div>
      </div>
      
      {/* Bulk action bar */}
      {selectedUsers.length > 0 && (
        <div className="bulk-action-bar">
          <span className="selection-info">
            <span className="selection-count">{selectedUsers.length}</span> users selected
          </span>
          <button className="btn-bulk-delete" onClick={handleBulkDelete}>
            <FontAwesomeIcon icon={faTrashAlt} />
            <span>Delete Selected</span>
          </button>
          <button className="btn-cancel" onClick={() => {
            setSelectedUsers([]);
            setSelectAll(false);
          }}>
            Cancel
          </button>
        </div>
      )}
      
      {/* Users table */}
      <div className="data-panel">
        {loading ? (
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>Loading users...</p>
          </div>
        ) : (
          <>
            <div className="users-table">
              <div className="table-header">
                <div className="th-checkbox">
                  <input 
                    type="checkbox" 
                    checked={selectAll}
                    onChange={handleSelectAll}
                  />
                </div>
                <div className="th th-user">USER</div>
                <div className="th th-type">TYPE</div>
                <div className="th th-actions">ACTIONS</div>
              </div>
              
              <div className="table-body">
                {users.length === 0 ? (
                  <div className="empty-state">
                    <div className="empty-icon">👥</div>
                    <h3>No users found</h3>
                    <p>Try adjusting your search or filters</p>
                  </div>
                ) : (
                  users.map(user => (
                    <div className="table-row" key={user._id}>
                      <div className="td-checkbox">
                        <input 
                          type="checkbox" 
                          checked={selectedUsers.includes(user._id)}
                          onChange={() => handleSelectUser(user._id)}
                          disabled={user.userType === 'superadmin'}
                        />
                      </div>
                      <div className="td td-user">
                        {getUserAvatar(user.username)}
                        <div className="user-details">
                          <span className="username">{user.username}</span>
                        </div>
                      </div>
                      <div className="td td-type">
                        <div className={`type-badge ${getUserTypeInfo(user.userType).className}`}>
                          <FontAwesomeIcon icon={getUserTypeInfo(user.userType).icon} />
                          <span>{user.userType}</span>
                        </div>
                      </div>
                      <div className="td td-actions">
                        <button 
                          className="btn-action btn-edit" 
                          onClick={() => {
                            setCurrentUser(user);
                            setShowEditModal(true);
                          }}
                          title="Edit User"
                        >
                          <FontAwesomeIcon icon={faPen} />
                        </button>
                        <button 
                          className="btn-action btn-delete" 
                          onClick={() => {
                            setCurrentUser(user);
                            setShowDeleteModal(true);
                          }}
                          disabled={user.userType === 'superadmin'}
                          title="Delete User"
                        >
                          <FontAwesomeIcon icon={faTrashAlt} />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
            
            {users.length > 0 && (
              <div className="pagination-controls">
                <div className="showing-info">
                  Showing {Math.min(usersPerPage, users.length)} of {users.length} users
                </div>
                <div className="pagination">
                  <button 
                    className="page-btn prev" 
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(currentPage - 1)}
                  >
                    <FontAwesomeIcon icon={faChevronLeft} />
                  </button>
                  
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <button
                      key={page}
                      className={`page-btn ${currentPage === page ? 'active' : ''}`}
                      onClick={() => setCurrentPage(page)}
                    >
                      {page}
                    </button>
                  ))}
                  
                  <button 
                    className="page-btn next" 
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(currentPage + 1)}
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
      <AddUserModal 
        show={showAddModal} 
        onHide={() => setShowAddModal(false)}
        onUserAdded={() => {
          toast.success('User added successfully');
          fetchUsers();
        }}
      />
      
      <EditUserModal 
        show={showEditModal} 
        onHide={() => setShowEditModal(false)}
        user={currentUser}
        onUserUpdated={() => {
          toast.success('User updated successfully');
          fetchUsers();
        }}
      />
      
      <DeleteUserModal 
        show={showDeleteModal} 
        onHide={() => setShowDeleteModal(false)}
        user={currentUser}
        onUserDeleted={() => {
          toast.success('User deleted successfully');
          fetchUsers();
        }}
      />
    </div>
  );
};

export default Users;