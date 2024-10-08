import Search from "../../layouts/components/SearchBar";
import TicketCard from "../../layouts/components/TicketCard";
import api from "../../config";
import { Container,Row,Col, } from "react-bootstrap";
import { useEffect, useState } from "react";
import { differenceInDays, parse } from "date-fns";
import Categories from "../../layouts/components/Categories";
import moviebackground from "../../assets/images/movie-background.jpg";
import sport from "../../assets/images/sport-background.png";


function Home() {
  const [nearlyExpiredTickets, setNearlyExpiredTickets] = useState([]);
  const [normalTickets, setNormalTickets] = useState([]);
  const crowd = "https://i.ibb.co/ZgMMVP2/Music-Concert-Event-Ticket-Design-870x490.jpg"
  const categories = [
    { title: "Concert", imgSrc: moviebackground },
    { title: "Lễ hội", imgSrc: moviebackground },
    { title: "Phương tiện", imgSrc: moviebackground },
    { title: "Bóng đá", imgSrc: moviebackground },
    { title: "Hài kịch", imgSrc: moviebackground },
    { title: "Triển lãm", imgSrc: moviebackground },
    { title: "Hòa nhạc", imgSrc: moviebackground },
    { title: "Hội chợ", imgSrc: moviebackground },
    { title: "Hội thảo", imgSrc: moviebackground },
    { title: "Phim chiếu rạp", imgSrc: moviebackground },
  ];
  
  const sampleTickets = [
    {
      id: 1,
      sellerID: crowd, // Hình ảnh của seller
      eventTitle: "Concert of the Year",
      ticketDetails: "VIP Ticket for an exclusive concert event.",
      image: sport, // Hình ảnh của vé
      location: "Madison Square Garden, NY",
      eventDate: "2024-11-15",
      price: "$150",
      salePrice: "$120",
    },
    {
      id: 2,
      sellerID: sport, // Hình ảnh của seller
      eventTitle: "Football Championship",
      ticketDetails: "Front-row seats for the football final match.",
      image: crowd, // Hình ảnh của vé
      location: "Wembley Stadium, London",
      eventDate: "2024-12-01",
      price: "$250",
      salePrice: "$200",
    },
    {
      id: 3,
      sellerID: sport, // Hình ảnh của seller
      eventTitle: "Broadway Show",
      ticketDetails: "Balcony seats for the classic Broadway show.",
      image: crowd, // Hình ảnh của vé
      location: "Broadway Theatre, NY",
      eventDate: "2024-10-20",
      price: "$80",
      salePrice: "$65",
    },
    {
      id: 4,
      sellerID: crowd, // Hình ảnh của seller
      eventTitle: "Tech Conference 2024",
      ticketDetails: "Full-access pass to the Tech Conference.",
      image: sport, // Hình ảnh của vé
      location: "Silicon Valley, CA",
      eventDate: "2024-09-25",
      price: "$500",
      salePrice: "$450",
    },
    {
      id: 5,
      sellerID: crowd, // Hình ảnh của seller
      eventTitle: "NBA Playoff Game",
      ticketDetails: "Courtside seats for the playoff game.",
      image: sport, // Hình ảnh của vé
      location: "Staples Center, LA",
      eventDate: "2024-12-10",
      price: "$300",
      salePrice: "$250",
    },
  ];

  //Sau khi lấy được vé từ search
  const handleSearchResults = (ticket) => {
    ticketClassification(ticket);
  };
  //Phân loại vé
  const ticketClassification = async (tickets) => {
    const now = new Date();
    const nearlyExpired = [];
    const normal = [];

    tickets.forEach((ticket) => {
      const expiredDate = parse(
        ticket.eventDate,
        "yyyy-MM-dd",
        new Date()
      );
      const dayLeft = differenceInDays(expiredDate, now);

      if (dayLeft <= 3) {
        nearlyExpired.push(ticket);
      } else {
        normal.push(ticket);
      }
    });
    setNearlyExpiredTickets(nearlyExpired);
    setNormalTickets(normal);
  };

  const fetchTickets = async () => {
    //call api get tickets
    try {
      const response = await api.get("tickets");
      const tickets = response.data;
      ticketClassification(tickets);
    } catch (err) {
      console.log(err);
      ticketClassification(sampleTickets);
    }
  };

  //Mỗi lần load lại trang lại lấy lại dữ liệu 1 lần
  useEffect(() => {
    fetchTickets();
  }, []);

  return (
    <>
      <Search onSearch={handleSearchResults} />
      <Categories categories={categories} />
      <Container>
        <Row>
          <h2>Nearly Expired Tickets</h2>
          {nearlyExpiredTickets.length === 0 ? (
            <h2>No Nearly Expired Tickets</h2>
          ) : (
            nearlyExpiredTickets.map((nearlyExpiredTicket) => (
              <Col xs={12} sm={6} md={3} className="mb-4" key={nearlyExpiredTicket.id}>
                <TicketCard
                  key={nearlyExpiredTicket.id}
                  ticket={nearlyExpiredTicket}
                />
              </Col>
            ))
          )}

          <h2>Normal Ticket</h2>
          {normalTickets.map((normalTicket) => (
            <Col xs={12} sm={6} md={3} className="mb-4" key={normalTicket.id} >
              <TicketCard key={normalTicket.id} ticket={normalTicket} />
            </Col>
          ))}
        </Row>
      </Container>
    </>
  );
}

export default Home;
