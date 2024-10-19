import React, { useState } from "react";
import { FaSearch } from "react-icons/fa";
import { Container, Row, Form, InputGroup, Button } from "react-bootstrap";
import api from "../../../config/axios";
import styles from "./SearchBar.module.scss";
import { ToastContainer, toast, Bounce } from 'react-toastify';

function Search({ onSearch }) {
  const [tickName, setTickName] = useState("");
  const [tickDate, setTickDate] = useState("");

  const handleSearch = async (e) => {
    e.preventDefault(); 

    if (!tickName && !tickDate) {
      toast.error("Please enter at least one search criteria (event title or date).", {
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
      return; // Dừng hàm nếu không có thông tin tìm kiếm
    }

    const selectedDate = new Date(tickDate);
    console.log("Selected Date",selectedDate)
    const currentDate = new Date();
    console.log("Current date",currentDate)
    currentDate.setHours(0, 0, 0, 0);
    
    if (selectedDate < currentDate) {
      // Nếu tickDate bé hơn currentDate thì  thông báo cảnh báo (quá khứ)
      toast.warn('Selected date cannot be in the past. Resetting to today\'s date.', {
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

      const today = `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1).toString().padStart(2, '0')}-${currentDate.getDate().toString().padStart(2, '0')}`; // Định dạng ISO là YYYY-MM-DDTHH:mm:ss.sssZ   ,T: Ký tự phân cách giữa ngày và giờ.
      console.log("Today",today);
      setTickDate(today);
    }
    
    const infoSearch = {
      eventTitle : tickName,
      date : tickDate,
    };


    try {
      console.log("Thông tin search sẽ gửi lên api",infoSearch)
      const response = await api.post("/tickets/search-date", infoSearch);
      console.log("Vé đã search",response.data)
      toast.success('Tickets found', {
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
      onSearch(response.data);
    } catch (error) {
      toast.error(error.response.data, {
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

  return (
    <div className="container p-4">
      <ToastContainer/>
      <Container
        className={`  ${styles.wrapper} p-4 `}
        style={{ maxWidth: "500px" }}
      >
        <Form onSubmit={handleSearch}>
          <InputGroup className="mb-3">
            <InputGroup.Text>
              <FaSearch />
            </InputGroup.Text>
            <Form.Control
              placeholder="Enter the ticket you want to find"
              value={tickName}
              onChange={(e) => {
                setTickName(e.target.value);
              }}
            />
          </InputGroup>

          <Row className="mb-3">
            <Form.Group>
              <Form.Label>DATE</Form.Label>
              <Form.Control
                type="date"
                value={tickDate}
                onChange={(e) => setTickDate(e.target.value)}
                placeholder="yyyy-MM-dd"
              />
            </Form.Group>
          </Row>


          <Button
            variant="primary"
            type="submit"
            className="w-100"
            // style={{ backgroundColor: "##4562EB" }}
          >
            SEARCH
          </Button>
        </Form>
      </Container>
    </div>
  );
}

export default Search;
