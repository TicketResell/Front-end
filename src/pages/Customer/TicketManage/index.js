import { useState , useEffect} from "react";
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
import api from "../../../config";
import { ToastContainer, toast, Bounce } from 'react-toastify';

function TicketManage({user}) {
  const [tickets, setTickets] = useState([]);

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

  const fetchTicketsByUserID = async () => {
    //call api get tickets
    try {
      console.log(" userID trong Ticket Manager",user.id)
      const response = await api.get(`/tickets/used/${user.id}`);
      console.log("Ticketsby userID List",response.data);
      setTickets(response.data);
    } catch (err) {
        toast.error(err.response.data, {
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
        return;
    }
  };
  useEffect(() => {
    fetchTicketsByUserID();
  }, []);
  return (
    <Container>
      <ToastContainer/>
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
                <th scope="col"style={{backgroundColor : "#8e65ff",color : "white"}} >Category</th>
                <th scope="col"style={{backgroundColor : "#8e65ff",color : "white"}} >Ticket Type</th>
                <th scope="col"style={{backgroundColor : "#8e65ff",color : "white"}} >Event Date</th>
                <th scope="col"style={{backgroundColor : "#8e65ff",color : "white"}} >Ticket Detail</th>
                <th scope="col"style={{backgroundColor : "#8e65ff",color : "white"}} >Location</th>
                <th scope="col"style={{backgroundColor : "#8e65ff",color : "white"}} >Price</th>
                <th scope="col"style={{backgroundColor : "#8e65ff",color : "white"}} >Status</th>
                <th scope="col"style={{backgroundColor : "#8e65ff",color : "white"}} >Quantity</th>
                <th scope="col"style={{backgroundColor : "#8e65ff",color : "white"}} >Actions</th>
              </tr>
            </MDBTableHead>
            <MDBTableBody>
              {tickets.map((ticket) => (
                <tr key={ticket.id}>
                  <td>{ticket.id}</td>
                  <td>
                  {ticket.imageUrls.map((imgSrc) => (
                      <img
                        src={imgSrc}
                        alt="ticket"
                        style={{ width: "45px", height: "45px", marginRight: "10px" }}
                        className="rounded-circle"
                      />
                    ))}
                  </td>
                  <td>{ticket.eventTitle}</td>
                  <td>{ticket.categoryId}</td>
                  <td>{ticket.ticketType}</td>
                  <td>{ticket.eventDate}</td>
                  <td>{ticket.ticketDetails}</td>
                  <td>{ticket.location}</td>
                  <td>{ticket.price}</td>
                  <td>{ticket.quantity}</td>
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
