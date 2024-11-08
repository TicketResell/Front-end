import { Row, Col } from "react-bootstrap";
import classNames from "classnames/bind";
import styles from "./StaffOverview.module.scss";
import SmallerCard from "./SmallCard";
import RevenueChart from "./RevenueChart";
import OrdersToday from "./OrdersToday";
import SalesStatistics from "./SalesStatistics"; // Component mới cho thống kê vé bán
import { useEffect, useState } from "react";
import api from "../../../config/axios";

const cx = classNames.bind(styles);

export default function Overview() {
  const [revenue, setRevenue] = useState(null);
  const [salesData, setSalesData] = useState({
    totalSales: 0,
    timeframe: "Tháng 9",
  });
  const [totalUser, setTotalUser] = useState(0);
  const [error, setError] = useState("");

  // Fetch dữ liệu từ API
  const fetchRevenueAndSalesData = async () => {
    try {
      // Fetch revenue and profit data
      const revenueResponse = await api.get("/staff/get-total-revenue-profit");

      setRevenue({
        money: revenueResponse.data.revenue.toFixed(2),
        percent: revenueResponse.data.profit * 100,
        status: revenueResponse.data.profit >= 0 ? "up" : "down",
      });

      // Update total sales (replace 3200 with real data if available)
      setSalesData((prevState) => ({
        ...prevState,
        totalSales: 3200,
      }));

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
      <Row className={cx("rowHalfAbove")}>
        <Col xs={6}>
          <Row>
            <SmallerCard
              types={{
                name: "Revenue",
                number: `$${revenue.money}`,
                percent: revenue.percent.toFixed(2),
                status: revenue.status,
              }}
            />
          </Row>
          <Row>
            <SmallerCard
              types={{
                name: "Sales",
                number: salesData.totalSales,
                percent: 10, // Replace with real data if available
                status: "up",
              }}
            />
          </Row>
          <Row>
            <SmallerCard
              types={{
                name: "Total Users",
                number: totalUser,
                percent: 5, // Replace with real data if available
                status: "up",
              }}
            />
          </Row>
        </Col>
        <Col xs={6}>
          <RevenueChart
            revenue={{
              money: `$${revenue.money}`,
              thisYear: [50, 60, 70, 80, 90, 100, 110, 120, 130, 140, 150, 160],
              lastYear: [40, 50, 60, 70, 80, 90, 100, 110, 120, 130, 140, 150],
            }}
          />
        </Col>
      </Row>
    </>
  );
}
