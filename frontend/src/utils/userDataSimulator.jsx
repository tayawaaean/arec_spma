// User data simulator for local testing without API calls
let users = [
    { id: 1, username: "superadmin", userType: "superadmin" },
    { id: 2, username: "admin1", userType: "admin" },
    { id: 3, username: "admin2", userType: "admin" },
    { id: 4, username: "user1", userType: "user" },
    { id: 5, username: "user2", userType: "user" },
    { id: 6, username: "user3", userType: "user" },
    { id: 7, username: "techuser", userType: "user" },
    { id: 8, username: "analyst", userType: "admin" },
    { id: 9, username: "monitor", userType: "user" },
    { id: 10, username: "fieldtech", userType: "user" }
  ];
  
  export const getUsers = (filters = {}) => {
    let filteredUsers = [...users];
    
    // Filter by username
    if (filters.username) {
      const searchTerm = filters.username.toLowerCase();
      filteredUsers = filteredUsers.filter(user => 
        user.username.toLowerCase().includes(searchTerm)
      );
    }
    
    // Filter by userType
    if (filters.userType && filters.userType !== 'all') {
      filteredUsers = filteredUsers.filter(user => 
        user.userType === filters.userType
      );
    }
    
    return {
      data: filteredUsers,
      total: filteredUsers.length
    };
  };
  
  export const addUser = (userData) => {
    const newId = Math.max(...users.map(u => u.id), 0) + 1;
    const newUser = { ...userData, id: newId };
    users.push(newUser);
    return newUser;
  };
  
  export const updateUser = (id, userData) => {
    const index = users.findIndex(u => u.id === id);
    if (index !== -1) {
      users[index] = { ...users[index], ...userData };
      return users[index];
    }
    return null;
  };
  
  export const deleteUser = (id) => {
    const index = users.findIndex(u => u.id === id);
    if (index !== -1) {
      const deletedUser = users[index];
      users = users.filter(u => u.id !== id);
      return deletedUser;
    }
    return null;
  };
  
  export const getUserTypes = () => {
    return ['superadmin', 'admin', 'user'];
  };