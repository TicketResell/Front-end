import { Row, Col } from "react-bootstrap";
import classNames from "classnames/bind";
import styles from "./StaffOverview.module.scss";
import SmallerCard from "./SmallCard";
import RevenueChart from "./RevenueChart";
import OrdersToday from "./OrdersToday";
import SalesStatistics from "./SalesStatistics"; // Component mới cho thống kê vé bán

const cx = classNames.bind(styles);

export default function Overview() {
  // Dữ liệu danh sách đơn hàng (có thể thêm nhiều hơn)
  const listOrder = [
    {
      orderID: "1",
      buyerID: "1",
      ticketID: "1",
      orderDate: "25/9/2023",
      paymentID: "EIR9",
      orderMethod: "COD",
      totalAmount: "1294000",
      status: "pending",
    },
    {
      orderID: "2",
      buyerID: "2",
      ticketID: "2",
      orderDate: "26/9/2023",
      paymentID: "EIR10",
      orderMethod: "Paypal",
      totalAmount: "12394000",
      status: "completed",
    },
  ];

  // Dữ liệu cho các chỉ số tổng quan như Revenue và Sales
  const types1 = {
    name: "Revenue",
    number: 400,
    percent: 10,
    status: "up",
  };
  const types2 = {
    name: "Sales",
    number: 100,
    percent: 10,
    status: "down",
  };

  // Dữ liệu cho biểu đồ doanh thu
  const revenue = {
    money: "500,273.00",
    thisYear: [55, 65, 75, 60, 85, 100, 75, 68, 90, 75, 65, 55],
    lastYear: [45, 55, 60, 50, 70, 85, 65, 58, 75, 60, 50, 40],
  };

  // Dữ liệu cho thống kê vé bán
  const salesData = {
    totalSales: 3200, // Tổng số vé đã bán
    timeframe: "Tháng 9", // Khoảng thời gian ví dụ
  };

  return (
    <>
      <Row className={cx("rowHalfAbove")}>
        <Col xs={6}>
          <Row>
            <SmallerCard types={types1} />
          </Row>
          <Row>
            <SmallerCard types={types2} />
          </Row>
        </Col>
        <Col xs={6}>
          {/* Biểu đồ Doanh thu */}
          <RevenueChart revenue={revenue} />
        </Col>
      </Row>

      <Row className={cx("rowHalfDown")}>
        <Col xs={8}>
          {/* Hiển thị danh sách đơn hàng trong ngày */}
          <OrdersToday listOrder={listOrder} />
        </Col>
        <Col xs={4}>
          {/* Thống kê số lượng vé bán */}
          <SalesStatistics data={salesData} />
        </Col>
      </Row>
    </>
  );
}
