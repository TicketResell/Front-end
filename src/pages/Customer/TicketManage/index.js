import { useState, useEffect } from "react";
import {
  Container,
  Row,
  ButtonGroup,
  ToggleButton,
  Modal,
} from "react-bootstrap";
import {
  MDBBadge,
  MDBTable,
  MDBTableHead,
  MDBTableBody,
} from "mdb-react-ui-kit";
import TicketEdit from "./TicketEdit";
import api from "../../../config/axios";
import { ToastContainer, toast, Bounce } from "react-toastify";
import ErrorPage from "../../ErrorPage";
import Pagination from "../../../layouts/components/Pagination";

function TicketManage({ user }) {
  const [tickets, setTickets] = useState([]);
  const [editRowId, setEditRowId] = useState(null);
  const [showEditForm, setShowEditForm] = useState(false); // Điều khiển form chỉnh sửa
  const [showErrorPage, setShowErrorPage] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showModalImage, setShowModalImage] = useState(false);
  const [ticketPage, setTicketPage] = useState(0);
  const itemsPerPage = 5;
  const offset = ticketPage * itemsPerPage;
  const currentTickets = tickets.slice(offset, offset + itemsPerPage);
  const [selectedImage, setSelectedImage] = useState("");

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
    const confirmDelete = window.confirm(
      "Bạn có chắc chắn muốn xóa vé này không?"
    );

    // Nếu người dùng xác nhận, xóa vé
    if (confirmDelete) {
      api
        .delete(`/tickets/${id}`)
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
      console.log("Respone", response);
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
  }, [user.id, showEditForm]);

  const handleImageClick = (imgSrc) => {
    setSelectedImage(imgSrc);
    setShowModalImage(true);
  };

  return showErrorPage ? (
    <ErrorPage errorMessage={errorMessage} />
  ) : (
    <Container>
      <ToastContainer />
      <Row>
        {showEditForm ? (
          <TicketEdit
            ticket={tickets.find((ticket) => ticket.id === editRowId)}
            onSave={handleSave}
          />
        ) : (
          <>
          <MDBTable align="middle">
            <MDBTableHead>
              <tr>
                <th
                  scope="col"
                  style={{ backgroundColor: "#8e65ff", color: "white" }}
                >
                  TicketID
                </th>
                <th
                  scope="col"
                  style={{ backgroundColor: "#8e65ff", color: "white" }}
                >
                  Image
                </th>
                <th
                  scope="col"
                  style={{ backgroundColor: "#8e65ff", color: "white" }}
                >
                  Event Title
                </th>
                <th
                  scope="col"
                  style={{ backgroundColor: "#8e65ff", color: "white" }}
                >
                  Category
                </th>
                <th
                  scope="col"
                  style={{ backgroundColor: "#8e65ff", color: "white" }}
                >
                  Ticket Type
                </th>
                <th
                  scope="col"
                  style={{ backgroundColor: "#8e65ff", color: "white" }}
                >
                  Event Date
                </th>
                <th
                  scope="col"
                  style={{ backgroundColor: "#8e65ff", color: "white" }}
                >
                  Ticket Detail
                </th>
                <th
                  scope="col"
                  style={{ backgroundColor: "#8e65ff", color: "white" }}
                >
                  Location
                </th>
                <th
                  scope="col"
                  style={{ backgroundColor: "#8e65ff", color: "white" }}
                >
                  Price
                </th>
                <th
                  scope="col"
                  style={{ backgroundColor: "#8e65ff", color: "white" }}
                >
                  Status
                </th>
                <th
                  scope="col"
                  style={{ backgroundColor: "#8e65ff", color: "white" }}
                >
                  Quantity
                </th>
                <th
                  scope="col"
                  style={{ backgroundColor: "#8e65ff", color: "white" }}
                >
                  Actions
                </th>
              </tr>
            </MDBTableHead>
            <MDBTableBody>
              {currentTickets.map((ticket, index) => (
                <tr key={index + offset + 1}>
                  <td>{ticket.id}</td>
                  <td>
                    <div style={{ display: "flex", gap: "5px" }}>
                      {ticket.imageUrls.map((imgSrc) => (
                        <img
                          src={imgSrc}
                          alt="ticket"
                          style={{ width: "45px", height: "45px" }}
                          className="rounded-circle"
                          onClick={() => handleImageClick(imgSrc)}
                        />
                      ))}
                    </div>
                  </td>
                  <td>{ticket.eventTitle}</td>
                  <td>{ticket.categoryId}</td>
                  <td>{ticket.ticketType}</td>
                  <td>{ticket.eventDate}</td>
                  <td>{ticket.ticketDetails}</td>
                  <td>{ticket.location}</td>
                  <td>{ticket.price.toLocaleString("vi-VN")} VND</td>
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
                  <Pagination
                  currentPage={ticketPage}
                  pageCount={Math.ceil(tickets.length / itemsPerPage)}
                  onPageChange={(selectedPage) => setTicketPage(selectedPage)}
                />
        </>
        )}


        <Modal
          show={showModalImage}
          onHide={() => setShowModalImage(false)}
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title>Ảnh Ticket</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <img
              src={selectedImage}
              style={{ width: "100%", height: "auto" }}
            />
          </Modal.Body>
        </Modal>
      </Row>
    </Container>
  );
}

export default TicketManage;
