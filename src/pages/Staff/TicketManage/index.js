import React, { useState } from "react";
import { Table, Button, Dropdown, Modal, Form } from "react-bootstrap";
import styles from './TicketManage.module.scss';

// Dữ liệu vé mẫu
const getAllTickets = () => {
  return [
    {
      ticketID: "T001",
      userID: "U001",
      orderDate: "2023-09-25",
      status: "Pending",
      ticketType: "Standard",
    },
    {
      ticketID: "T002",
      userID: "U002",
      orderDate: "2023-09-26",
      status: "Confirmed",
      ticketType: "VIP",
    },
    // Thêm nhiều vé hơn...
  ];
};

// Hàm cập nhật trạng thái vé
const updateTicketStatus = (ticketID, newStatus, tickets) => {
  return tickets.map((ticket) =>
    ticket.ticketID === ticketID ? { ...ticket, status: newStatus } : ticket
  );
};

// Hàm lọc vé
const filterTickets = (searchQuery, filterStatus, tickets) => {
  return tickets.filter((ticket) => {
    return (
      ticket.userID.toLowerCase().includes(searchQuery.toLowerCase()) &&
      (filterStatus === "All" || ticket.status === filterStatus)
    );
  });
};

export default function TicketManage() {
  const [tickets, setTickets] = useState(getAllTickets());
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [selectedTicket, setSelectedTicket] = useState(null);

  const handleUpdateStatus = (ticketID, newStatus) => {
    setTickets(updateTicketStatus(ticketID, newStatus, tickets));
  };

  const handleViewDetail = (ticket) => {
    setSelectedTicket(ticket);
  };

  const handleCloseDetail = () => {
    setSelectedTicket(null);
  };

  const filteredTickets = filterTickets(searchQuery, filterStatus, tickets);

  return (
    <div className={styles.ticketManage}>
      <h2>Quản Lý Vé</h2>

      {/* Form tìm kiếm và lọc vé */}
      <Form>
        <Form.Group>
          <Form.Label>Tìm kiếm theo tên người dùng</Form.Label>
          <Form.Control
            type="text"
            placeholder="Nhập tên người dùng..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </Form.Group>

        <Form.Group>
          <Form.Label>Lọc theo trạng thái</Form.Label>
          <Form.Control
            as="select"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="All">Tất cả</option>
            <option value="Pending">Pending</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Canceled">Canceled</option>
            <option value="Used">Used</option>
          </Form.Control>
        </Form.Group>
      </Form>

      {/* Bảng danh sách vé */}
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Mã Vé</th>
            <th>Tên Người Dùng</th>
            <th>Ngày Đặt Vé</th>
            <th>Trạng Thái Vé</th>
            <th>Loại Vé</th>
            <th>Thao Tác</th>
          </tr>
        </thead>
        <tbody>
          {filteredTickets.map((ticket) => (
            <tr key={ticket.ticketID}>
              <td>{ticket.ticketID}</td>
              <td>{ticket.userID}</td>
              <td>{ticket.orderDate}</td>
              <td>
                <Dropdown onSelect={(newStatus) => handleUpdateStatus(ticket.ticketID, newStatus)}>
                  <Dropdown.Toggle variant="secondary" id="dropdown-basic">
                    {ticket.status}
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item eventKey="Pending">Pending</Dropdown.Item>
                    <Dropdown.Item eventKey="Confirmed">Confirmed</Dropdown.Item>
                    <Dropdown.Item eventKey="Canceled">Canceled</Dropdown.Item>
                    <Dropdown.Item eventKey="Used">Used</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </td>
              <td>{ticket.ticketType}</td>
              <td>
                <Button variant="info" onClick={() => handleViewDetail(ticket)}>
                  Xem Chi Tiết
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Modal chi tiết vé */}
      {selectedTicket && (
        <Modal show={!!selectedTicket} onHide={handleCloseDetail}>
          <Modal.Header closeButton>
            <Modal.Title>Chi Tiết Vé {selectedTicket.ticketID}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p><strong>Tên Người Dùng:</strong> {selectedTicket.userID}</p>
            <p><strong>Ngày Đặt Vé:</strong> {selectedTicket.orderDate}</p>
            <p><strong>Trạng Thái Vé:</strong> {selectedTicket.status}</p>
            <p><strong>Loại Vé:</strong> {selectedTicket.ticketType}</p>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseDetail}>Đóng</Button>
          </Modal.Footer>
        </Modal>
      )}
    </div>
  );
}
