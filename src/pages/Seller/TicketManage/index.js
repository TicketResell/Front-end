import {
  Container,
  Row,
  ButtonGroup,
  ToggleButton,
  Button,
} from "react-bootstrap";
import { useState } from "react";
import {
  MDBBadge,
  MDBTable,
  MDBTableHead,
  MDBTableBody,
} from "mdb-react-ui-kit";

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
  const [editingField, setEditingField] = useState(null);
  const handleEdit = (id) => {
    setEditRowId(id);
  };

  const handleSave = () => {
    setEditRowId(null); // Sau khi save, thoát khỏi chế độ edit
  };

  const handleDelete = (id) => {
    setTickets(tickets.filter((ticket) => ticket.id !== id));
  };

  const handleFieldChange = (id, field, value) => {
    setTickets((prevTickets) =>
      prevTickets.map((ticket) =>
        ticket.id === id ? { ...ticket, [field]: value } : ticket
      )
    );
  };

  const handleDoubleClick = (field, ticketId) => {
    setEditingField(field);
    setEditRowId(ticketId);
  };

  const getEditableProps = (field, ticketId) => ({
    onDoubleClick: () => handleDoubleClick(field, ticketId),
    style: {
      border:
        editingField === field && editRowId === ticketId
          ? "2px solid #28a745"
          : "none",
    },
  });

  return (
    <Container>
      <Row>
        <MDBTable align="middle">
          <MDBTableHead>
            <tr>
              <th scope="col">TicketID</th>
              <th scope="col">Image</th>
              <th scope="col">Event Title</th>
              <th scope="col">Ticket Type</th>
              <th scope="col">Event Date</th>
              <th scope="col">Location</th>
              <th scope="col">Price</th>
              <th scope="col">SalePrice</th>
              <th scope="col">Status</th>
              <th scope="col">Actions</th>
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
                <td
                  contentEditable={editRowId === ticket.id}
                  onBlur={(e) =>
                    handleFieldChange(ticket.id, "title", e.target.textContent)
                  }
                  {...getEditableProps("title", ticket.id)}
                >
                  {ticket.title}
                </td>
                <td
                  contentEditable={editRowId === ticket.id}
                  onBlur={(e) =>
                    handleFieldChange(ticket.id, "type", e.target.textContent)
                  }
                  {...getEditableProps("type", ticket.id)}
                >
                  {ticket.type}
                </td>
                <td
                  contentEditable={editRowId === ticket.id}
                  onBlur={(e) =>
                    handleFieldChange(ticket.id, "date", e.target.textContent)
                  }
                  {...getEditableProps("date", ticket.id)}
                >
                  {ticket.date}
                </td>
                <td
                  contentEditable={editRowId === ticket.id}
                  onBlur={(e) =>
                    handleFieldChange(
                      ticket.id,
                      "location",
                      e.target.textContent
                    )
                  }
                  {...getEditableProps("location", ticket.id)}
                >
                  {ticket.location}
                </td>
                <td
                  contentEditable={editRowId === ticket.id}
                  onBlur={(e) =>
                    handleFieldChange(ticket.id, "price", e.target.textContent)
                  }
                  {...getEditableProps("price", ticket.id)}
                >
                  {ticket.price}
                </td>
                <td
                  contentEditable={editRowId === ticket.id}
                  onBlur={(e) =>
                    handleFieldChange(
                      ticket.id,
                      "salePrice",
                      e.target.textContent
                    )
                  }
                  {...getEditableProps("salePrice", ticket.id)}
                >
                  {ticket.salePrice}
                </td>
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
                    {editRowId === ticket.id ? (
                      <Button variant="outline-primary" onClick={handleSave}>
                        Save
                      </Button>
                    ) : (
                      <ToggleButton
                        type="radio"
                        variant="outline-success"
                        onClick={() => handleEdit(ticket.id)}
                      >
                        Edit
                      </ToggleButton>
                    )}
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
      </Row>
    </Container>
  );
}

export default TicketManage;
