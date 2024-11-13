import React, { useState } from "react";
import { FaSearch, FaFilter } from "react-icons/fa";
import { Container, Form, InputGroup, Dropdown, Button } from "react-bootstrap";
import api from "../../../config/axios";
import styles from "./SearchBar.module.scss";
import { ToastContainer, toast, Bounce } from "react-toastify";

function Search({ onSearch }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [ticketType, setTicketType] = useState("");
  const [showTicketType, setShowTicketType] = useState(false);
  const [searchResultMessage, setSearchResultMessage] = useState(""); // Thêm trạng thái để hiển thị thông báo kết quả

  const handleSearch = async () => {
    try {
      console.log("Calling API with ticket type:", ticketType);
  
      // Thay thế `searchQuery` bằng dấu cách nếu là `null`, chuỗi trống hoặc chỉ chứa khoảng trắng
      const searchTitle = !searchQuery || searchQuery.trim() === "" ? " " : searchQuery.trim();
  
      // Tạo URL API động dựa trên `ticketType` và `searchTitle`
      let apiUrl = "";
  
      if (ticketType && searchTitle === " ") {
        // Trường hợp chỉ có `ticketType` và `searchQuery` rỗng
        apiUrl = `/tickets/search-ticket-/${ticketType}/%20`;
      } else if (ticketType && searchTitle !== " ") {
        // Trường hợp có cả `ticketType` và `searchQuery`
        apiUrl = `/tickets/search-ticket-/${ticketType}/${searchTitle}`;
      } else if (!ticketType && searchTitle !== " ") {
        // Trường hợp chỉ có `searchQuery`
        apiUrl = `/tickets/search/${searchTitle}`;
      } else {
        // Trường hợp không có cả `ticketType` và `searchQuery`
        setSearchResultMessage("Please enter a search criteria.");
        return;
      }
  
      console.log("API URL:", apiUrl);
  
      // Gọi API
      const response = await api.get(apiUrl);
  
      // Kiểm tra kết quả API
      if (response.data && response.data.length > 0) {
        setSearchResultMessage(""); // Xóa thông báo khi có kết quả
        onSearch(response.data);
      } else {
        setSearchResultMessage(`No tickets found for "${searchTitle.trim()}" with type "${ticketType}".`);
        onSearch([]); // Gửi dữ liệu rỗng khi không có kết quả
      }
    } catch (error) {
      // Hiển thị thông báo lỗi
      toast.error(error.response?.data || "An error occurred during search.", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
        transition: Bounce,
      });
    }
  };
  
  
  
  
  

  // Hàm xử lý chọn loại vé
  const handleSelectTicketType = (type) => {
    setTicketType(type);
    setShowTicketType(false);
  };

  return (
    <div className="container p-4">
      <ToastContainer />
      <Container className={` ${styles.wrapper} p-4 `} style={{ maxWidth: "600px" }}>

        {/* Thanh tìm kiếm */}
        <InputGroup className="mb-3">
          <Form.Control
            placeholder="Search by event title"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

          {/* Dropdown chọn loại vé */}
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
              <Dropdown.Item onClick={() => setTicketType("")}>All Types</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>

          {/* Nút Search */}
          <Button variant="primary" onClick={handleSearch}>
            <FaSearch />
          </Button>
        </InputGroup>

        {/* Hiển thị thông báo kết quả tìm kiếm */}
        {searchResultMessage && (
          <div className="text-center text-danger mt-3">
            {searchResultMessage}
          </div>
        )}
      </Container>
    </div>
  );
}

export default Search;
