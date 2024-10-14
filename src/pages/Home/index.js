import Search from "../../layouts/components/SearchBar";
import TicketCard from "../../layouts/components/TicketCard";
import api from "../../config";
import { Container, Row, Col } from "react-bootstrap";
import { useEffect, useState } from "react";
import { differenceInDays, parse } from "date-fns";
import Categories from "../../layouts/components/Categories";
import Pagination from "../../layouts/components/Pagination";


function Home() {
  const [nearlyExpiredTickets, setNearlyExpiredTickets] = useState([]);
  const [normalTickets, setNormalTickets] = useState([]);
  const [categories, setCategories] = useState([]);
  //State phân trang của từng mục vé
  const [nearlyExpiredPage, setNearlyExpiredPage] = useState(0);
  const [normalPage, setNormalPage] = useState(0);
  
  const itemsPerPage = 4;
  //Sau khi lấy được vé từ search
  const handleSearchResults = async (ticket) => {
    console.log("Vé được search đã ra ngoài trang Home",ticket)
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
      console.log("Category hien tai dang lấy vé theo id",categoryId)
      const response = await api.get(`/tickets/category/${categoryId}`);
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

  //item mục vé gần hết hạn cho trang hiện
  const displayedNearlyExpiredTickets = nearlyExpiredTickets.slice(
    nearlyExpiredPage * itemsPerPage,
    (nearlyExpiredPage + 1) * itemsPerPage
  );
  //item mục vé thường cho trang hiện
  const displayedNormalTickets = normalTickets.slice(
    normalPage * itemsPerPage,
    (normalPage + 1) * itemsPerPage
  );
  return (
    <>
    <Search onSearch={handleSearchResults} categories={categories} />
    <Categories
      categories={categories}
      clickCategory={handleCategoryClick}
      clickAll={fetchTickets}
    />
    <Container>
      <Row>
        <h2>Nearly Expired Tickets</h2>
        {displayedNearlyExpiredTickets.length === 0 ? (
          <h2>No Nearly Expired Tickets</h2>
        ) : (
          displayedNearlyExpiredTickets.map((ticket) => (
            <Col xs={12} sm={6} md={3} className="mb-4" key={ticket.id}>
              <TicketCard ticket={ticket} />
            </Col>
          ))
        )}

        <Pagination
          currentPage={nearlyExpiredPage}
          pageCount={Math.ceil(nearlyExpiredTickets.length / itemsPerPage)}
          onPageChange={(selectedPage) => setNearlyExpiredPage(selectedPage)}
        />

        <h2>Normal Tickets</h2>
        {displayedNormalTickets.map((ticket) => (
          <Col xs={12} sm={6} md={3} className="mb-4" key={ticket.id}>
            <TicketCard ticket={ticket} />
          </Col>
        ))}

        <Pagination
          currentPage={normalPage}
          pageCount={Math.ceil(normalTickets.length / itemsPerPage)}
          onPageChange={(selectedPage) => setNormalPage(selectedPage)}
        />
      </Row>
    </Container>
  </>
  );
}

export default Home;
