import { useState, useEffect } from "react";
import api from "../../../config/axios";
import { ToastContainer, toast, Bounce } from 'react-toastify';
import { Button } from "react-bootstrap";
import { FaLock } from "react-icons/fa";
import Pagination from "../../../layouts/components/Pagination";
import "./index.scss"; 

function StaffList() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const [userPage, setUserPage] = useState(0);
  const itemsPerPage = 5;
  const offset = userPage * itemsPerPage;
  const currentUsers = users.slice(offset, offset + itemsPerPage);
  
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
      const response = await api.get(`/staff/get-ban-user/${userId}`);
      if (response.data === true) {
        toast.success("Ban user successfully", {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          transition: Bounce,
        });
      }
      fetchUsers();
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
      <ToastContainer/>
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
            <th>Status</th>
            <th>Verified Email</th>
            <th>Role</th>
            <th>Action</th> 
          </tr>
        </thead>
        <tbody>
          {currentUsers.map((user,index) => (
            <tr key={user.id}>
              <td>{offset + index + 1}</td>
              <td><img src={user.userImage} alt={user.fullname} className="user-avatar" /></td>
              <td>{user.username}</td>
              <td>{user.fullname}</td>
              <td>{user.email}</td>
              <td>{user.phone}</td>
              <td>{user.status}</td>
              <td>{user.verifiedEmail ? "Yes" : "No"}</td>
              <td>{user.role}</td>
              <td>
                {user.status === "active" ?  <Button variant="outline-danger" onClick={() => banUser(user.id)} >Ban</Button> : <FaLock />}  
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Pagination
          currentPage={userPage}
          pageCount={Math.ceil(users.length / itemsPerPage)}
          onPageChange={(selectedPage) => setUserPage(selectedPage)}
        />
    </div>
  );
}

export default StaffList;
