import { Row, Col } from "react-bootstrap";
import classNames from "classnames/bind";
import styles from "./StaffOverview.module.scss";
import SmallerCard from "./SmallCard";
import RevenueChart from "./RevenueChart";
import OrdersToday from "./OrdersToday";
import SalesStatistics from "./SalesStatistics"; // Component mới cho thống kê vé bán
import { useEffect, useState } from "react"; // Thêm useEffect và useState
import axios from "axios"; // Thêm Axios
import api from '../../../config/axios'

const cx = classNames.bind(styles);

export default function Overview() {
  // State cho dữ liệu doanh thu, số lượng vé và số lượng user
  const [revenue, setRevenue] = useState(null);
  const [salesData, setSalesData] = useState({
    totalSales: 0, // Giá trị khởi tạo cho tổng số vé
    timeframe: "Tháng 9", // Khoảng thời gian ví dụ
  });
  const [totalUser, setTotalUser] = useState(0); // State cho tổng số user
  const [error, setError] = useState("");
  const token = "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJqYW5lX3NlbGxlciIsInJvbGUiOiJzdGFmZiIsInVzZXJfaW1hZ2UiOiJodHRwczovL2kuaWJiLmNvL3NnYlMyR0IvdC1pLXh1LW5nLmpwZyIsImlkIjoyLCJmdWxsbmFtZSI6IkphbmVDYXB0aWFuIiwiZXhwIjoxNzMwMjEwODI4LCJpYXQiOjE3Mjk2MDYwMjgsImVtYWlsIjoiamFuZUBleGFtcGxlLmNvbSJ9.hmT-f2hkQQdoJsAmqGvNg1lhA8IIZlUT8U680o7eU3Q"; // Thay thế với token của bạn
  // Fetch dữ liệu từ API
  const fetchRevenueAndSalesData = async () => {
    const token = localStorage.getItem("token"); // Lấy token từ localStorage
    if (!token) {
      setError("Token is missing. Please log in again.");
      return;
    }

    try {
      const revenueResponse = await axios.get("http://localhost:8084/api/staff/get-total-revenue-profit", {
        headers: {
          Authorization: `Bearer ${token}`, // Thêm token vào Authorization header
        },
      });

      // Cập nhật dữ liệu từ API
      setRevenue({
        money: revenueResponse.data.revenue.toFixed(2), // Làm tròn đến 2 chữ số thập phân
        percent: revenueResponse.data.profit * 100, // Chuyển đổi profit thành phần trăm
        status: revenueResponse.data.profit >= 0 ? "up" : "down", // Xác định trạng thái
      });

      // Giả sử tổng số vé là giá trị khởi tạo
      setSalesData((prevState) => ({
        ...prevState,
        totalSales: 3200, // Cập nhật tổng số vé, thay thế bằng giá trị thật nếu cần
      }));

      // Fetch tổng số user
      const userResponse = await axios.get("http://localhost:8084/api/staff/get-number-of-user", {
        headers: {
          Authorization: `Bearer ${token}`, // Thêm token vào Authorization header
        },
      });

      setTotalUser(userResponse.data); // Cập nhật tổng số user
    } catch (err) {
      console.error("Error fetching revenue, sales or user data:", err);
      setError("Could not fetch data."); // Xử lý lỗi
    }
  };

  useEffect(() => {
    fetchRevenueAndSalesData();
  }, []);

  // Nếu chưa có dữ liệu, có thể hiển thị thông báo hoặc loader
  if (!revenue) {
    return <div>Loading...</div>; // Hoặc bạn có thể hiển thị thông báo lỗi
  }

  return (
    <>
      <Row className={cx("rowHalfAbove")}>
        <Col xs={6}>
          <Row>
            <SmallerCard
              types={{
                name: "Revenue",
                number: `$${revenue.money}`, // Định dạng giá trị tiền tệ
                percent: revenue.percent.toFixed(2), // Làm tròn phần trăm
                status: revenue.status, // Trạng thái tăng hoặc giảm
              }}
            />
          </Row>
          <Row>
            <SmallerCard
              types={{
                name: "Sales",
                number: salesData.totalSales, // Sử dụng tổng số vé từ API
                percent: 10, // Thay thế bằng dữ liệu thật nếu có
                status: "up", // Thay thế bằng dữ liệu thật nếu có
              }}
            />
          </Row>
          <Row>
            <SmallerCard
              types={{
                name: "Total Users",
                number: totalUser, // Hiển thị tổng số user
                percent: 5, // Thay thế bằng dữ liệu thật nếu có
                status: "up", // Thay thế bằng dữ liệu thật nếu có
              }}
            />
          </Row>
        </Col>
        <Col xs={6}>
          {/* Biểu đồ Doanh thu */}
          <RevenueChart
            revenue={{
              money: `$${revenue.money}`,
              thisYear: [50, 60, 70, 80, 90, 100, 110, 120, 130, 140, 150, 160], // Dữ liệu giả cho năm nay
              lastYear: [40, 50, 60, 70, 80, 90, 100, 110, 120, 130, 140, 150], // Dữ liệu giả cho năm trước
            }}
          />
        </Col>
      </Row>
    </>
  );
}
