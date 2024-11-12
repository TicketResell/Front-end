import { Row, Col, Table, Button, Modal } from "react-bootstrap";
import classNames from "classnames/bind";
import styles from "./AdminOverview.module.scss";
import { useEffect, useState } from "react";
import api from "../../../config/axios";

const cx = classNames.bind(styles);

const UserList = () => {
  const [revenue, setRevenue] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState(null);

  const [adminCount, setAdminCount] = useState(0);
  const [activeUserCount, setActiveUserCount] = useState(0);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const fetchRevenueAndAccounts = async () => {
    try {
      const revenueResponse = await api.get("/staff/get-total-revenue-profit");
      setRevenue({
        money: revenueResponse.data.revenue.toFixed(2),
        percent: revenueResponse.data.profit * 100,
        status: revenueResponse.data.profit >= 0 ? "up" : "down",
      });
      const accountsResponse = await api.get("/admin/view-accounts");
      const accountsData = accountsResponse.data;
      setAccounts(accountsData);

      setAdminCount(accountsData.filter((account) => account.role === "admin").length);
      setActiveUserCount(accountsData.filter((account) => account.status === "active").length);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Could not fetch data.");
    }
  };

  useEffect(() => {
    fetchRevenueAndAccounts();
  }, []);

  const handlePromoteClick = (account) => {
    setSelectedAccount(account);
    setShowModal(true);
  };

  const handleConfirmPromote = async () => {
    if (!selectedAccount) return;

    let newRole;
    if (selectedAccount.role === "user") {
      newRole = "staff";
    } else if (selectedAccount.role === "staff") {
      newRole = "admin";
    } else {
      alert(`Account with role '${selectedAccount.role}' cannot be promoted.`);
      return;
    }

    try {
      await api.put(`/admin/promote/${selectedAccount.id}`, { role: newRole });
      await fetchRevenueAndAccounts();
      setShowModal(false);
      setSelectedAccount(null);
    } catch (error) {
      console.error("Failed to promote account:", error);
      setError("Failed to promote account.");
    }
  };

  const indexOfLastAccount = currentPage * itemsPerPage;
  const indexOfFirstAccount = indexOfLastAccount - itemsPerPage;
  const currentAccounts = accounts.slice(indexOfFirstAccount, indexOfLastAccount);

  const totalPages = Math.ceil(accounts.length / itemsPerPage);

  if (!revenue) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className={cx("adminPage")}>
        <Col className={cx("user_table")}>
          <Row className={cx("user", "justify-content-center", "align-items-center")}>
            <Col>
              <div className={cx("table-container")}>
                <Table striped bordered hover>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Username</th>
                      <th>Email</th>
                      <th>Phone</th>
                      <th>Address</th>
                      <th>Full Name</th>
                      <th>User Image</th>
                      <th className="text-center">Status</th>
                      <th className="text-center">Verified Email</th>
                      <th className="text-center">Role</th>
                      <th className="text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentAccounts.map((account) => (
                      <tr key={account.id}>
                        <td>{account.id}</td>
                        <td>{account.username.length > 15 ? `${account.username.slice(0, 15)}...` : account.username}</td>
                        <td>{account.email}</td>
                        <td>{account.phone}</td>
                        <td>{account.address}</td>
                        <td>{account.fullname}</td>
                        <td>
                          <img
                            src={account.userImage}
                            alt={account.fullname}
                            style={{ width: "50px", height: "50px" }}
                          />
                        </td>
                        <td className="text-center">
                          <span
                            style={{
                              display: "inline-block",
                              padding: "5px 10px",
                              borderRadius: "12px",
                              backgroundColor: account.status === "banned" ? "#fbf1dd" : account.status === "active" ? "#dcf1e4" : "#f0f0f0",
                              color: account.status === "banned" ? "#8a6111" : account.status === "active" ? "#0e612f" : "#000",
                            }}
                          >
                            {account.status}
                          </span>
                        </td>
                        <td className="text-center">{account.verifiedEmail ? "Yes" : "No"}</td>
                        <td className="text-center">
                          <span
                            style={{
                              display: "inline-block",
                              padding: "5px 10px",
                              borderRadius: "12px",
                              backgroundColor: account.role === "admin" ? "#ffe3e4"
                                : account.role === "user" ? "#e9f7e9"
                                  : account.role === "staff" ? "#d1ecf1"
                                    : account.role === "shipper" ? "#fff3cd"
                                      : "#f0f0f0",
                              color: account.role === "admin" ? "#cf3115"
                                : account.role === "user" ? "#438c41"
                                  : account.role === "staff" ? "#004085"
                                    : account.role === "shipper" ? "#856404"
                                      : "#000",
                            }}
                          >
                            {account.role}
                          </span>
                        </td>
                        <td className="text-center">
                          <Button
                            style={{ borderRadius: "30px" }}
                            variant="primary"
                            onClick={() => handlePromoteClick(account)}
                          >
                            Promote
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
              <div className="pagination-controls">
                <Button
                  variant="outline-primary"
                  disabled={currentPage === 1}
                  onClick={() => paginate(currentPage - 1)}
                >
                  Prev
                </Button>
                <span className="mx-2">
                  Page {currentPage} of {totalPages}
                </span>
                <Button
                  variant="outline-primary"
                  disabled={currentPage === totalPages}
                  onClick={() => paginate(currentPage + 1)}
                >
                  Next
                </Button>
              </div>
            </Col>
          </Row>
        </Col>

        {/* Modal for Confirm Promotion */}
        <Modal show={showModal} onHide={() => setShowModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Confirm Promotion</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Are you sure you want to promote{" "}
            <strong>{selectedAccount?.username}</strong> to the next role?
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleConfirmPromote}>
              Confirm
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </>
  );
};

export default UserList;
