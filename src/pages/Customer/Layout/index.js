import { Container, Row, Col } from "react-bootstrap";
import classNames from "classnames/bind";
import styles from "./CustomerLayout.module.scss";
import Sidebar from "../Sidebar";
import Overview from "../Overview";
import Chat from "../Chat";
import NewTick from "../NewTicket";
import TicketManage from "../TicketManage";
import Profile from "../../Profile";
import Feedback from "../Feedback";
import { useLocation } from "react-router-dom";
import { useState , useEffect} from "react";
import api from "../../../config/axios";
import OrdersList from "../../../layouts/components/OrdersList";


const cx = classNames.bind(styles);

export default function CustomerLayout() {
  const location = useLocation();
  const [currentLayout, setCurrentLayout] = useState("overview");
  const ticket = location.state?.ticket;
  console.log("Location Ticket",ticket);
  const [user,setUser] = useState(null);
  const [ordersSeller,setOrdersSeller] = useState([]);
  const [ordersBuyer,setOrdersBuyer] = useState([]);

  const fetchOrdersListByBuyer = async () =>{
    try {
      console.log("User Current Buyer",user.id)
      const response = await api.get(`/orders/buyer/${user.id}`);
      const sellerOrderList = response.data;
        console.log("List oreder by Seller",sellerOrderList)
        setOrdersSeller(sellerOrderList);
      } catch (error) {
        console.error("Không có danh sách order", error);
      }
  }

  const fetchOrdersListBySeller = async () =>{
    try {
      console.log("User Current Seller",user.id)
      const response = await api.get(`/orders/seller/${user.id}`);
      const buyerOrderList = response.data;
      console.log("List oreder by Buyer",buyerOrderList)
      setOrdersBuyer(buyerOrderList);
      } catch (error) {
        console.error("Không có danh sách order", error);
      }
  }
  
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
        return <Overview listOrdersBuyer={ordersBuyer} />;
      case "orderSeller":
        return <OrdersList listOrders={ordersSeller}/>;
      case "chat":
        return <Chat ticket={ticket} user={user}/>;
      case "newTicket":
        return <NewTick user={user}/>
      case "setTicket":
        return <TicketManage user={user} />
      case "profile":
        return <Profile user={user}/>
      case "feedback":
        return <Feedback user={user}/>
      default:
        return <Overview listOrdersBuyer={ordersBuyer}  />;
    }
  };
  useEffect(() => {
      fetchUser();  
      if(ticket){
      setCurrentLayout(location.state.currentLayout);
    }
  }, [ticket]);
  
  useEffect(() => {
    if(user){
      fetchOrdersListByBuyer();
      fetchOrdersListBySeller();
    }
  }, [user]);

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
