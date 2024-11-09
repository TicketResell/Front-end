import { Row, Col } from "react-bootstrap";
import classNames from "classnames/bind";
import styles from "./StaffOverview.module.scss";
import SmallerCard from "./SmallCard";
import RevenueChart from "./RevenueChart";
import OrdersToday from "./OrdersToday";
import SalesStatistics from "./SalesStatistics"; // Component mới cho thống kê vé bán
import { useEffect, useState } from "react";
import api from "../../../config/axios";

export default function Overview() {
  const [revenue, setRevenue] = useState(null);
  
  const [totalUser, setTotalUser] = useState(0);
  const [error, setError] = useState("");

  // Fetch dữ liệu từ API
  const fetchRevenueAndSalesData = async () => {
    try {
      // Fetch revenue and profit data
      const response = await api.get("/staff/get-total-revenue-profit");
      console.log("Revenue Response",response.data)
      const revpro = response.data; 
      setRevenue({
        money: revpro.revenue,
        profit : revpro.profit,
        status: revpro.profit >= 0 ? "up" : "down",
      });

      // Fetch total number of users
      const userResponse = await api.get("/staff/get-number-of-user");
      setTotalUser(userResponse.data);
    } catch (err) {
      console.error("Error fetching revenue, sales, or user data:", err);
      setError("Could not fetch data.");
    }
  };

  useEffect(() => {
    fetchRevenueAndSalesData();
  }, []);

  if (!revenue) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Row>
          <Row style={{height : "14rem"}}>
            <SmallerCard
              types={{
                name: "Revenue",
                number: revenue.money,
                status: revenue.status,
              }}
            />
          </Row>
          <Row style={{height : "14rem"}}>
            <SmallerCard
              types={{
                name: "Profit",
                number: revenue.profit,
                status: "up",
              }}
            />
          </Row>
          <Row style={{height : "14rem"}}>
            <SmallerCard
              types={{
                name: "Total Users",
                number: totalUser,
                status: "up",
              }}
            />
          </Row>
          <RevenueChart
            revenue={{
              money: `${revenue.money}`,
              thisYear: [50, 60, 70, 80, 90, 100, 110, 120, 130, 140, 150, 160],
              lastYear: [40, 50, 60, 70, 80, 90, 100, 110, 120, 130, 140, 150],
            }}
          />
      </Row>
    </>
  );
}
