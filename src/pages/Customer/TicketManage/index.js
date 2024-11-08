import { useState, useEffect } from "react";
import {
  Container,
  Row,
  ButtonGroup,
  ToggleButton,
} from "react-bootstrap";
import {
  MDBBadge,
  MDBTable,
  MDBTableHead,
  MDBTableBody,
} from "mdb-react-ui-kit";
import TicketEdit from "./TicketEdit"; 
import api from "../../../config/axios";
import { ToastContainer, toast, Bounce } from 'react-toastify';
import ErrorPage from "../../ErrorPage";

function TicketManage({ user }) {
  const [tickets, setTickets] = useState([]);
  const [editRowId, setEditRowId] = useState(null);
  const [showEditForm, setShowEditForm] = useState(false); // Điều khiển form chỉnh sửa
  const [showErrorPage,setShowErrorPage] = useState(false);
  const [errorMessage,setErrorMessage] = useState("");
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
    // Hiển thị hộp thoại xác nhận trước khi xóa
    const confirmDelete = window.confirm("Bạn có chắc chắn muốn xóa vé này không?");
    
    // Nếu người dùng xác nhận, xóa vé
    if (confirmDelete) {
      api.delete(`/tickets/${id}`)
        .then(() => {
          // Cập nhật lại danh sách vé sau khi xóa
          setTickets(tickets.filter((ticket) => ticket.id !== id));
          toast.success("Vé đã được xóa thành công!", {
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
        })
        .catch((err) => {
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
        });
    }
  };

  const fetchTicketsByUserID = async () => {
    try {
      console.log(" userID trong Ticket Manager", user.id);
      const response = await api.get(`/tickets/seller/${user.id}`);
      console.log("Respone",response);
      console.log("Ticketsby userID List", response.data);
      setTickets(response.data);
      setShowErrorPage(false);
    } catch (err) {
      setShowErrorPage(true);
      setErrorMessage(err.response.data);
    }
  };

  useEffect(() => {
    fetchTicketsByUserID();
  }, [user.id,showEditForm]);

  return (
    showErrorPage ? (
      <ErrorPage errorMessage={errorMessage} />
    ) : (
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
                <th scope="col" style={{ backgroundColor: "#8e65ff", color: "white" }}>TicketID</th>
                <th scope="col" style={{ backgroundColor: "#8e65ff", color: "white" }}>Image</th>
                <th scope="col" style={{ backgroundColor: "#8e65ff", color: "white" }}>Event Title</th>
                <th scope="col" style={{ backgroundColor: "#8e65ff", color: "white" }}>Category</th>
                <th scope="col" style={{ backgroundColor: "#8e65ff", color: "white" }}>Ticket Type</th>
                <th scope="col" style={{ backgroundColor: "#8e65ff", color: "white" }}>Event Date</th>
                <th scope="col" style={{ backgroundColor: "#8e65ff", color: "white" }}>Ticket Detail</th>
                <th scope="col" style={{ backgroundColor: "#8e65ff", color: "white" }}>Location</th>
                <th scope="col" style={{ backgroundColor: "#8e65ff", color: "white" }}>Price</th>
                <th scope="col" style={{ backgroundColor: "#8e65ff", color: "white" }}>Status</th>
                <th scope="col" style={{ backgroundColor: "#8e65ff", color: "white" }}>Quantity</th>
                <th scope="col" style={{ backgroundColor: "#8e65ff", color: "white" }}>Actions</th>
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
                  <td>{ticket.price.toLocaleString("vi-VN")}</td>
                  <td>
                    <MDBBadge
                      color={
                        ticket.status === "used"
                          ? "warning"
                          : ticket.status === "expired"
                          ? "danger"
                          : "success"
                      }
                      pill
                    >
                      {ticket.status}
                    </MDBBadge>
                  </td>
                  <td>{ticket.quantity}</td>
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
    )
  );
}

export default TicketManage;
