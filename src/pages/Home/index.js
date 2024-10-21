import Search from "../../layouts/components/SearchBar";
import TicketCard from "../../layouts/components/TicketCard";
import api from "../../config/axios";
import { Container, Row, Col } from "react-bootstrap";
import { useEffect, useState } from "react";
import { differenceInDays, parse } from "date-fns";
import Categories from "../../layouts/components/Categories";
import Pagination from "../../layouts/components/Pagination";
import Filter from "../../layouts/components/Filter"; // Vẫn giữ import Filter
import styles from "./Home.module.scss";
import { IoWarning } from "react-icons/io5";
import classNames from "classnames/bind";

function Home() {
  const cx = classNames.bind(styles);
  const [nearlyExpiredTickets, setNearlyExpiredTickets] = useState([]);
  const [normalTickets, setNormalTickets] = useState([]);
  const [categories, setCategories] = useState([]);
  const [nearlyExpiredPage, setNearlyExpiredPage] = useState(0);
  const [normalPage, setNormalPage] = useState(0);
  const [filteredNearlyExpired, setFilteredNearlyExpired] = useState([]);
  const [filteredNormal, setFilteredNormal] = useState([]);
  const itemsPerPage = 4;


  const filterTickets = (tickets, priceRange) => {
    return tickets.filter(
      (ticket) =>
        ticket.price >= priceRange[0] &&
        ticket.price <= priceRange[1]
    );
  };

  const handleFilterChange = (priceRange) => {
    const filteredNearlyExpired = filterTickets(
      nearlyExpiredTickets.slice(
        nearlyExpiredPage * itemsPerPage,
        (nearlyExpiredPage + 1) * itemsPerPage
      ),
      priceRange
    );
    const filteredNormal = filterTickets(
      normalTickets.slice(
        normalPage * itemsPerPage,
        (normalPage + 1) * itemsPerPage
      ),
      priceRange
    );
    setFilteredNearlyExpired(filteredNearlyExpired);
    setFilteredNormal(filteredNormal);
  };

  const handleSearchResults = async (ticket) => {
    ticketClassification(ticket);
  };

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
    try {
      const response = await api.get("/tickets");
      console.log("Tickets List", response.data);
      ticketClassification(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await api.get("/categories");
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories", error);
    }
  };

  const handleCategoryClick = async (categoryId) => {
    try {
      const response = await api.get(`/tickets/category/${categoryId}`);
      ticketClassification(response.data);
    } catch (error) {
      console.error("Error fetching ticket by categories ", error);
    }
  };

  useEffect(() => {
    fetchTickets();
    fetchCategories();
  }, []);

  useEffect(() => {
    handleFilterChange([0, 100]); // Giá trị mặc định của bộ lọc ban đầu
  }, [nearlyExpiredPage, normalPage, nearlyExpiredTickets, normalTickets]);

  return (
    <>
      <Search onSearch={handleSearchResults} categories={categories} />
      <Categories
        categories={categories}
        clickCategory={handleCategoryClick}
        clickAll={fetchTickets}
      />
      <Filter onFilterChange={handleFilterChange} />
      <Container>
        <Row>
          <h1 className={cx("span-flame")}>
            Nearly Expired Tickets{" "}
            <span>
              <img
                src="https://i.ibb.co/Vq72zMp/icons8-fire.gif"
                alt="icons8-fire"
                border="0"
              />
            </span>{" "}
            <img src="https://i.ibb.co/Vq72zMp/icons8-fire.gif" alt="icons8-fire" border="0" />
            <img src="https://i.ibb.co/Vq72zMp/icons8-fire.gif" alt="icons8-fire" border="0" />
          </h1>
          {filteredNearlyExpired.length === 0 ? (
            <div className={cx("notification-container")}>
              <span className={cx("notification-icon")}>
                <IoWarning />
              </span>
              <h2>NO NEARLY EXPIRED TICKET FOUND MATCHING YOUR SEARCH</h2>
            </div>
          ) : (
            filteredNearlyExpired.map((ticket) => (
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

          <h1>Hot Deal Tickets</h1>
          {filteredNormal.length === 0 ? (
            <div className={cx("notification-container")}>
              <span className={cx("notification-icon")}>
                <IoWarning />
              </span>
              <h2>NO NORMAL TICKET FOUND MATCHING YOUR SEARCH</h2>
            </div>
          ) : (
            filteredNormal.map((ticket) => (
              <Col xs={12} sm={6} md={3} className="mb-4" key={ticket.id}>
                <TicketCard ticket={ticket} />
              </Col>
            ))
          )}

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
