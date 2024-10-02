import { useState } from "react";
import {
  Container,
  Row,
  ButtonGroup,
  ToggleButton,
  Button,
} from "react-bootstrap";
import {
  MDBBadge,
  MDBTable,
  MDBTableHead,
  MDBTableBody,
} from "mdb-react-ui-kit";
import TicketEdit from "./TicketEdit"; 

function TicketManage() {
  const [tickets, setTickets] = useState([
    {
      id: 1,
      image: "https://mdbootstrap.com/img/new/avatars/8.jpg",
      title: "Vé ca nhạc",
      type: "Sự kiện",
      date: "15/9/2024",
      location: "157/32/14 Lý liên kiệt",
      price: "50,000 VND",
      salePrice: "30,000 VND",
      status: "Expired Soon",
    },
  ]);

  const [editRowId, setEditRowId] = useState(null);
  const [showEditForm, setShowEditForm] = useState(false); // Điều khiển form chỉnh sửa

  const handleEdit = (id) => {
    setEditRowId(id);
    setShowEditForm(true); // Hiển thị form chỉnh sửa
  };

  const handleSave = (updatedTicket) => {
    setTickets((prevTickets) =>
      prevTickets.map((ticket) =>
        ticket.id === updatedTicket.id ? updatedTicket : ticket
      )
    );
    setShowEditForm(false); // Quay lại bảng sau khi lưu
  };

  const handleDelete = (id) => {
    setTickets(tickets.filter((ticket) => ticket.id !== id));
  };

  return (
    <Container>
      <Row>
        {showEditForm ? (
          <TicketEdit
            ticket={tickets.find((ticket) => ticket.id === editRowId)}
            onSave={handleSave}
          />
        ) : (
          <MDBTable align="middle">
            <MDBTableHead>
              <tr>
                <th scope="col"style={{backgroundColor : "#8e65ff",color : "white"}} >TicketID</th>
                <th scope="col"style={{backgroundColor : "#8e65ff",color : "white"}} >Image</th>
                <th scope="col"style={{backgroundColor : "#8e65ff",color : "white"}} >Event Title</th>
                <th scope="col"style={{backgroundColor : "#8e65ff",color : "white"}} >Ticket Type</th>
                <th scope="col"style={{backgroundColor : "#8e65ff",color : "white"}} >Event Date</th>
                <th scope="col"style={{backgroundColor : "#8e65ff",color : "white"}} >Location</th>
                <th scope="col"style={{backgroundColor : "#8e65ff",color : "white"}} >Price</th>
                <th scope="col"style={{backgroundColor : "#8e65ff",color : "white"}} >SalePrice</th>
                <th scope="col"style={{backgroundColor : "#8e65ff",color : "white"}} >Status</th>
                <th scope="col"style={{backgroundColor : "#8e65ff",color : "white"}} >Actions</th>
              </tr>
            </MDBTableHead>
            <MDBTableBody>
              {tickets.map((ticket) => (
                <tr key={ticket.id}>
                  <td>{ticket.id}</td>
                  <td>
                    <img
                      src={ticket.image}
                      alt=""
                      style={{ width: "45px", height: "45px" }}
                      className="rounded-circle"
                    />
                  </td>
                  <td>{ticket.title}</td>
                  <td>{ticket.type}</td>
                  <td>{ticket.date}</td>
                  <td>{ticket.location}</td>
                  <td>{ticket.price}</td>
                  <td>{ticket.salePrice}</td>
                  <td>
                    <MDBBadge
                      color={
                        ticket.status === "Delivered"
                          ? "primary"
                          : ticket.status === "Expired Soon"
                          ? "warning"
                          : ticket.status === "Expired"
                          ? "danger"
                          : "success"
                      }
                      pill
                    >
                      {ticket.status}
                    </MDBBadge>
                  </td>
                  <td>
                    <ButtonGroup>
                      <ToggleButton
                        type="radio"
                        variant="outline-success"
                        onClick={() => handleEdit(ticket.id)}
                      >
                        Edit
                      </ToggleButton>
                      <ToggleButton
                        type="radio"
                        variant="outline-danger"
                        onClick={() => handleDelete(ticket.id)}
                      >
                        Delete
                      </ToggleButton>
                    </ButtonGroup>
                  </td>
                </tr>
              ))}
            </MDBTableBody>
          </MDBTable>
        )}
      </Row>
    </Container>
  );
}

export default TicketManage;
