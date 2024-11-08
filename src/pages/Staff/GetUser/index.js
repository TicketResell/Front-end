import { useState, useEffect } from "react";
import api from "../../../config/axios";
import "./index.scss"; 

function StaffList() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");

  const fetchUsers = async () => {
    try {
      const response = await api.get("/staff/get-list-user"); 
      setUsers(response.data); 
    } catch (err) {
      setError("Error fetching users.");
      console.error(err);
    }
  };

  const banUser = async (userId) => {
    try {
      const response = await api.post(`/staff/get-ban-user/${userId}`, {});
      if (response.data) {
        setUsers(users.filter(user => user.id !== userId));
      }
    } catch (err) {
      if (err.response) {
        console.error("Error banning user:", err.response.data);
        setError(`Error banning user: ${err.response.data.message || err.response.statusText}`);
      } else {
        console.error("Error banning user.", err);
        setError("Error banning user.");
      }
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="staff-list-container">
      <h1>Staff Users</h1>
      {error && <p>{error}</p>}
      <table className="staff-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Avatar</th>
            <th>Username</th>
            <th>Fullname</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Address</th>
            <th>Status</th>
            <th>Verified Email</th>
            <th>Role</th>
            <th>Action</th> 
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td><img src={user.userImage} alt={user.fullname} className="user-avatar" /></td>
              <td>{user.username}</td>
              <td>{user.fullname}</td>
              <td>{user.email}</td>
              <td>{user.phone}</td>
              <td>{user.address}</td>
              <td>{user.status}</td>
              <td>{user.verifiedEmail ? "Yes" : "No"}</td>
              <td>{user.role}</td>
              <td>
                <button onClick={() => banUser(user.id)}>Ban</button> 
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default StaffList;
