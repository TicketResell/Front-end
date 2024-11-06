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
import ErrorPage from "../../ErrorPage";


const cx = classNames.bind(styles);

export default function CustomerLayout() {
  const location = useLocation();
  const [currentLayout, setCurrentLayout] = useState("overview");
  const ticket = location.state?.ticket;
  const [user,setUser] = useState(null);
  const [ordersSeller,setOrdersSeller] = useState([]);
  const [ordersBuyer,setOrdersBuyer] = useState([]);
  const [errorMessage,setErrorMessage] = useState("");
  const [revenue,setRevenue] = useState(0);
  const [sales,setSales] = useState(0);
  const fetchOrdersListByBuyer = async () =>{
    try {
      console.log("User Current Buyer",user.id)
      const response = await api.get(`/orders/buyer/${user.id}`);
      const buyerOrderList = response.data;
        console.log("List oreder by Buyer",buyerOrderList)
        setOrdersBuyer(buyerOrderList);
      } catch (error) {
        console.error("Không có danh sách order", error);
      }
  }

  const fetchOrdersListBySeller = async () =>{
    try {
      console.log("User Current Seller",user.id)
      const response = await api.get(`/orders/seller/${user.id}`);
      const sellerOrderList = response.data;
      console.log("List oreder by Seller",sellerOrderList)
      if (sellerOrderList.length === 0) {
        setErrorMessage("No Seller Order Tickets List");
      } else {
        setOrdersSeller(sellerOrderList);
      }
      } catch (error) {
        console.log("Error Data",error.response.data);
        setErrorMessage(error.response.data);
      }
  }
  
  const fetchUser = () =>{
    try {
      const storedUser =  JSON.parse(localStorage.getItem("user"));
        console.log("User Customer",storedUser);
        setUser(storedUser);
      } catch (error) {
        console.error("Không có người dùng", error);
      }
  }
  const fetchRevenue = async (user) =>{
    try {
      const response = await api.get(`/balance/${user.id}`);
      console.log("Revenue here",response.data);
      const revenue = response.data;
      setRevenue(revenue);
      } catch (error) {
        console.error("Không có doanh thu", error);
      }
  }
  const fetchSales= async (user) =>{
    try {
      const response = await api.get(`/orders/count-completed/${user.id}`);
      console.log("Sales here",response.data);
      const sales = response.data;
      setSales(sales);
      } catch (error) {
        console.error("Không có doanh số", error);
      }
  }
  const handleLayoutClick = (view) => {
    setCurrentLayout(view);
  };

  const renderLayout = () => {
    console.log("currentLayout khi bấm vào sidebar",currentLayout);
    switch (currentLayout) {
      case "overview":
        return <Overview listOrdersBuyer={ordersBuyer} revenue={revenue} sales={sales}/>;
      case "orderSeller":
        return ordersSeller.length > 0 ? (
          <OrdersList listOrders={ordersSeller} />
        ) : (
          <ErrorPage errorMessage={errorMessage}/>
        );
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
    if(!user){
      fetchUser();  
    }
      if(ticket){
      setCurrentLayout(location.state.currentLayout);
    }
  }, [ticket]);
  
  useEffect(() => {
      if (currentLayout === "orderSeller") {
        fetchOrdersListBySeller();
      } else if (currentLayout === "overview") {
        fetchOrdersListByBuyer();
      }
    fetchRevenue(user);
    fetchSales(user);
  }, [user,currentLayout]);


  return (
    <Container fluid className={cx("container")}>
      <Row className={cx("rowFullHeight")}>
        <Col xs={2} className={cx("wrapper", "p-3")}>
          <Sidebar customer={user} onLayoutClick={handleLayoutClick}  />
        </Col>
        <Col xs={10} className={cx("rowFullHeight")}>
          {renderLayout()}
        </Col>
      </Row>
    </Container>
  );
}
