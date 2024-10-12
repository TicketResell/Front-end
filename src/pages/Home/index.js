import Search from "../../layouts/components/SearchBar";
import TicketCard from "../../layouts/components/TicketCard";
import api from "../../config";
import { Container, Row, Col } from "react-bootstrap";
import { useEffect, useState } from "react";
import { differenceInDays, parse } from "date-fns";
import Categories from "../../layouts/components/Categories";

function Home() {
  const [nearlyExpiredTickets, setNearlyExpiredTickets] = useState([]);
  const [normalTickets, setNormalTickets] = useState([]);
  const [categories, setCategories] = useState([]);
  //Sau khi lấy được vé từ search
  const handleSearchResults = (ticket) => {
    ticketClassification(ticket);
  };
  //Phân loại vé
  const ticketClassification = (tickets) => {
    const ticketArray = Array.isArray(tickets) ? tickets : [tickets];
    const now = new Date();
    const nearlyExpired = [];
    const normal = [];

    ticketArray.forEach((ticket) => {
      if (ticket.status === "onsale") {
        const expiredDate = parse(ticket.eventDate, "yyyy-MM-dd", new Date());
        const dayLeft = differenceInDays(expiredDate, now);

        if (dayLeft <= 3) {
          nearlyExpired.push(ticket);
        } else {
          normal.push(ticket);
        }
      }
    });
    setNearlyExpiredTickets(nearlyExpired);
    setNormalTickets(normal);
  };

  const fetchTickets = async () => {
    //call api get tickets
    try {
      const response = await api.get("/tickets");
      console.log("Tickets List",response.data);
      ticketClassification(response.data);
    } catch (err) {
      if (err.response) {
        // Server đã phản hồi nhưng có mã lỗi (như 401)
        console.log("Error response", err.response.data);
        console.log("Status", err.response.status);
      } else if (err.request) {
        // Yêu cầu đã được gửi nhưng không có phản hồi từ server
        console.log("Error request", err.request);
      } else {
        // Lỗi phát sinh khi tạo yêu cầu
        console.log("Error message", err.message);
      }
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await api.get("/categories");
      console.log("Response Categories", response);
      console.log("Response Categories", response.data);
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories", error);
    }

  };

  const handleCategoryClick = async (categoryId) => {
    try {
      const response = await api.get(`/categories/${categoryId}`);
      console.log("Ticket by Category ID",response.data);
      ticketClassification(response.data);
    } catch (error) {
      console.error("Error fetching ticket by categories ", error);
    }

  };

  //Mỗi lần load lại trang lại lấy lại dữ liệu 1 lần
  useEffect(() => {
    fetchTickets();
    fetchCategories();
  }, []);

  return (
    <>
      <Search onSearch={handleSearchResults} />
      <Categories categories={categories} clickCategory={handleCategoryClick} />
      <Container>
        <Row>
          <h2>Nearly Expired Tickets</h2>
          {nearlyExpiredTickets.length === 0 ? (
            <h2>No Nearly Expired Tickets</h2>
          ) : (
            nearlyExpiredTickets.map((nearlyExpiredTicket) => (
              <Col
                xs={12}
                sm={6}
                md={3}
                className="mb-4"
                key={nearlyExpiredTicket.id}
              >
                <TicketCard
                  key={nearlyExpiredTicket.id}
                  ticket={nearlyExpiredTicket}
                />
              </Col>
            ))
          )}

          <h2>Normal Ticket</h2>
          {normalTickets.map((normalTicket) => (
            <Col xs={12} sm={6} md={3} className="mb-4" key={normalTicket.id}>
              <TicketCard key={normalTicket.id} ticket={normalTicket} />
            </Col>
          ))}
        </Row>
      </Container>
    </>
  );
}

export default Home;
