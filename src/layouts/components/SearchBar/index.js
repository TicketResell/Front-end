import React, { useState } from "react";
import { FaSearch, FaFilter } from "react-icons/fa"; // Thêm icon search và filter
import { Container, Form, InputGroup, Dropdown, Button } from "react-bootstrap";
import api from "../../../config/axios";
import styles from "./SearchBar.module.scss";
import { ToastContainer, toast, Bounce } from "react-toastify";

function Search({ onSearch }) {
  const [searchQuery, setSearchQuery] = useState(""); // Từ khóa tìm kiếm
  const [ticketType, setTicketType] = useState(""); // Loại vé được chọn
  const [showTicketType, setShowTicketType] = useState(false); // Hiện/ẩn dropdown loại vé

  // Hàm thực hiện tìm kiếm khi người dùng nhấn icon search
  const handleSearch = async () => {
    if (!searchQuery && !ticketType) {
      toast.error("Please enter at least one search criteria (event title or ticket type).", {
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
console.log("Ticket Types",ticketType);
    if(ticketType === "" ){
      try {
        const response = await api.get(`/tickets/search/${searchQuery}`);
        onSearch(response.data);
      } catch (error) {
        toast.error(error.response?.data || "An error occurred during search.", {
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
    }else{
      try {
        const response = await api.get(`/tickets/search-ticket-/${ticketType}/${searchQuery}`);
        console.log("Tìm kiếm theo type ",response.data);
        onSearch(response.data);
      } catch (error) {
        toast.error(error.response?.data || "An error occurred during search.", {
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
    }

  };

  // Hàm xử lý chọn loại vé
  const handleSelectTicketType = (type) => {
    setTicketType(type);
    setShowTicketType(false); // Ẩn dropdown sau khi chọn
  };

  return (
    <div className="container p-4">

      <ToastContainer />
      <Container className={` ${styles.wrapper} p-4 `} style={{ maxWidth: "600px" }}>
        <h2 className={` ${styles.header} text-center`}>SEARCH TICKET</h2>


        {/* Thanh tìm kiếm */}
        <InputGroup className="mb-3">
          <Form.Control
            placeholder="Search by event title"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)} // Cập nhật khi người dùng nhập
          />

          {/* Dropdown chọn loại vé trực tiếp */}
          <Dropdown show={showTicketType} onToggle={() => setShowTicketType(!showTicketType)}>
            <Dropdown.Toggle variant="outline-secondary">
              <FaFilter /> {ticketType ? `Type: ${ticketType}` : "Ticket Type"}
            </Dropdown.Toggle>

            <Dropdown.Menu>
              <Dropdown.Item onClick={() => handleSelectTicketType("Standard")}>
                Standard
              </Dropdown.Item>
              <Dropdown.Item onClick={() => handleSelectTicketType("VIP")}>
                VIP
              </Dropdown.Item>
              <Dropdown.Item onClick={() => handleSelectTicketType("Premium")}>
                Premium
              </Dropdown.Item>
              {/* Thêm tùy chọn để xóa bộ lọc loại vé */}
              <Dropdown.Item onClick={() => setTicketType("")}>All Types</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>


          {/* Nút Search */}
          <Button variant="primary" onClick={handleSearch}>
            <FaSearch />

          </Button>
        </InputGroup>
      </Container>
    </div>
  );
}

export default Search;
