import Search from "../../layouts/components/SearchBar";
import TicketCard from "../../layouts/components/TicketCard";
// import api from "../../config";
import { Container, Row, Col, Carousel } from "react-bootstrap";
import api from "../../config/axios";
// import { Container, Row, Col } from "react-bootstrap";
import { useEffect, useState } from "react";
import { differenceInDays, parse } from "date-fns";
import Categories from "../../layouts/components/Categories";
import Pagination from "../../layouts/components/Pagination";
import Filter from "../../layouts/components/Filter"; // Vẫn giữ import Filter
import styles from "./Home.module.scss";
import { IoWarning } from "react-icons/io5";
import classNames from "classnames/bind";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from 'jwt-decode';
import { useRef } from "react";

function Home() {
  const cx = classNames.bind(styles);
  const [nearlyExpiredTickets, setNearlyExpiredTickets] = useState([]);
  const [normalTickets, setNormalTickets] = useState([]);
  const [categories, setCategories] = useState([]);
  const [nearlyExpiredPage, setNearlyExpiredPage] = useState(0);
  const [normalPage, setNormalPage] = useState(0);
  const [filteredNearlyExpired, setFilteredNearlyExpired] = useState([]);
  const [filteredNormal, setFilteredNormal] = useState([]);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(0);
  const itemsPerPage = 4;
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const ticketDisplayRef = useRef(null);

  // Scroll đến phần hiển thị Ticket
  const scrollToTicketDisplay = () => {
    if (ticketDisplayRef.current) {
      ticketDisplayRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  // Nhận giá trị MIN và MAX từ Filter
  const handleMinMaxChange = (min, max) => {
    setMinPrice(min);
    setMaxPrice(max);
  };

  useEffect(() => {
    if (token) {
      const user = jwtDecode(token);
      // Nếu người dùng là admin hoặc staff, chuyển hướng đến trang dashboard của họ
      if (user.role === 'admin') {
        navigate('/admin');
      } else if (user.role === 'staff') {
        navigate('/staff');
      }else if (user.role === "shipper"){
        navigate('/shipper');
      }
    }
  }, [token, navigate]);

  const filterTickets = (tickets, priceRange) => {
    return tickets.filter(
      (ticket) => ticket.price >= priceRange[0] && ticket.price <= priceRange[1]
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
      scrollToTicketDisplay();
    } catch (error) {
      console.error("Error fetching ticket by categories ", error);
    }
  };

  useEffect(() => {
    fetchTickets();
    fetchCategories();
  }, []);

  useEffect(() => {
    handleFilterChange([minPrice, maxPrice]); // Giá trị mặc định của bộ lọc ban đầu
  }, [nearlyExpiredPage, normalPage, nearlyExpiredTickets, normalTickets, minPrice, maxPrice]);

  return (
    <>
      <Container style={{ paddingTop: "30px", margin: "0px" }}>
        <section
        >
          <Row>
            <Categories
              categories={categories}
              clickCategory={handleCategoryClick}
              clickAll={fetchTickets}
              onClickDisplay={scrollToTicketDisplay}
            />
          </Row>
          <Row>
            <Col xs={12} md={6} className="mb-4 d-flex flex-column"> 
                <Search onSearch={handleSearchResults} categories={categories}/>
                <Filter onFilterChange={handleFilterChange} onMinMaxChange={handleMinMaxChange}/>
            </Col>
            <Col xs={12} md={6} className="mb-4 d-flex flex-column">
              <div
                className={cx("img-slides")}
                style={{
                  backgroundImage: `url('https://i.pinimg.com/enabled/564x/a7/03/90/a7039087bb901ccef5d27e7ae7a01e23.jpg')`,
                }}
              ></div>
            </Col>

          </Row>
        </section>

        {/* Carousel for Nearly Expired Tickets */}
        <div ref={ticketDisplayRef} >
        <h1 className={cx("span-flame")}>
          EXPIRING SOON TICKET{" "}
          <span>
            <img
              src="https://i.ibb.co/Vq72zMp/icons8-fire.gif"
              alt="icons8-fire"
              border="0"
            />
          </span>{" "}
          <img
            src="https://i.ibb.co/Vq72zMp/icons8-fire.gif"
            alt="icons8-fire"
            border="0"
          />
          <img
            src="https://i.ibb.co/Vq72zMp/icons8-fire.gif"
            alt="icons8-fire"
            border="0"
          />
        </h1>

        {filteredNearlyExpired.length === 0 ? (
          <div className={cx("notification-container")}>
            <span className={cx("notification-icon")}>
              <IoWarning />
            </span>
            <h2>NO EXPIRING SOON TICKET FOUND MATCHING YOUR SEARCH</h2>
          </div>
        ) : (
          <Carousel>
            <Carousel.Item>
              <Container>
                <Row>
                  {filteredNearlyExpired.map((ticket) => (
                    <Col key={ticket.id} xs={12} md={3}>
                      <TicketCard ticket={ticket} seller={ticket.seller} />
                    </Col>
                  ))}
                </Row>
              </Container>
            </Carousel.Item>
          </Carousel>
        )}

        <Pagination
          currentPage={nearlyExpiredPage}
          pageCount={Math.ceil(nearlyExpiredTickets.length / itemsPerPage)}
          onPageChange={(selectedPage) => setNearlyExpiredPage(selectedPage)}
        />

        {/* Carousel for Hot Deal Tickets */}
        <h1>HOT DEAL TICKETS</h1>

        {filteredNormal.length === 0 ? (
          <div className={cx("notification-container")}>
            <span className={cx("notification-icon")}>
              <IoWarning />
            </span>
            <h2>NO NORMAL TICKET FOUND MATCHING YOUR SEARCH</h2>
          </div>
        ) : (

          <Container>
            <Row>
              {filteredNormal.map((ticket) => (
                <Col key={ticket.id} xs={12} md={3}>
                  <TicketCard ticket={ticket} seller={ticket.seller} />
                </Col>
              ))}
            </Row>
          </Container>

        )}
        <Pagination
          currentPage={normalPage}
          pageCount={Math.ceil(normalTickets.length / itemsPerPage)}
          onPageChange={(selectedPage) => setNormalPage(selectedPage)}
        />
        </div>
      </Container>
    </>
  );
}

export default Home;
