import { Container, Row, Col } from "react-bootstrap";
import classNames from "classnames/bind";
import styles from "./CustomerLayout.module.scss";
import Sidebar from "../Sidebar";
import Overview from "../Overview";
import Transaction from "../Transaction";
import Chat from "../Chat";
import noImg from "../../../assets/images/crowd-background.jpg";
import NewTick from "../NewTicket";
import TicketManage from "../TicketManage";
import Profile from "../../Profile";
import Support from "../Support";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
const cx = classNames.bind(styles);

export default function CustomerLayout() {
  const location = useLocation();
  const [currentLayout, setCurrentLayout] = useState("overview");
  const ticket = location.state?.ticket;
  console.log("Location Ticket",ticket);
  const [user,setUser] = useState(null);

  const listTransactions = [{
    transactionID : "1",
    userID : "2",
    orderID : "3",
    amount : "5",
    transactionType : "deposit",
    transactionDate : "12/39/2023"
  },{
    transactionID : "2",
    userID : "5",
    orderID : "6",
    amount : "4",
    transactionType : "refund",
    transactionDate : "16/09/2024"
  }]
  
  const fetchUser = () =>{
    try {
      const userCustomer =  JSON.parse(localStorage.getItem("user"));
        console.log("User Customer",userCustomer)
        setUser(userCustomer);
      } catch (error) {
        console.error("Không có người dùng", error);
      }
  }

  const handleLayoutClick = (view) => {
    setCurrentLayout(view);
  };

  const renderLayout = () => {
    switch (currentLayout) {
      case "overview":
        return <Overview />;
      case "transaction":
        return <Transaction listTransactions={listTransactions}/>;
      case "chat":
        return <Chat ticket={ticket} userId={user.id}/>;
      case "newTicket":
        return <NewTick user={user}/>
      case "setTicket":
        return <TicketManage/>
      case "profile":
        return <Profile/>
      case "support":
        return <Support/>
      default:
        return <Overview />;
    }
  };

  useEffect(() => {
    fetchUser();
    setCurrentLayout(location.state?.currentLayout);
  }, []);

  return (
    <Container fluid className={cx("container")}>
      <Row className={cx("rowFullHeight")}>
        <Col xs={2} className={cx("wrapper", "p-3")}>
          <Sidebar customer={user} onLayoutClick={handleLayoutClick} />
        </Col>
        <Col xs={10} className={cx("rowFullHeight")}>
          {renderLayout()}
        </Col>
      </Row>
    </Container>
  );
}
