import { Row, Col, Table, Button, Form } from "react-bootstrap";
import classNames from "classnames/bind";
import styles from "./AdminOverview.module.scss";
import { useEffect, useState } from "react";
import api from "../../../config/axios";

const cx = classNames.bind(styles);

const TransactionList = () => {
  const [revenue, setRevenue] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  const token = "";

  // Fetch data from APIs
  const fetchRevenueAndSalesData = async () => {
    try {
      const revenueResponse = await api.get("/staff/get-total-revenue-profit");
      setRevenue({
        money: revenueResponse.data.revenue.toFixed(2),
        percent: revenueResponse.data.profit * 100,
        status: revenueResponse.data.profit >= 0 ? "up" : "down",
      });

      const transactionsResponse = await api.get("/admin/transactions");
      setTransactions(transactionsResponse.data);

    } catch (err) {
      console.error("Error fetching data:", err);
    }
  };

  useEffect(() => {
    fetchRevenueAndSalesData();
  }, []);

  // Pagination: Slice the transactions array for current page
  const indexOfLastTransaction = currentPage * rowsPerPage;
  const indexOfFirstTransaction = indexOfLastTransaction - rowsPerPage;
  const currentTransactions = transactions.slice(indexOfFirstTransaction, indexOfLastTransaction);

  // Handle page change
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Calculate total number of pages
  const totalPages = Math.ceil(transactions.length / rowsPerPage);

  if (!revenue) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className={cx("adminPage")}>
        <Col className={cx("transaction_table")}>
          <Row className={cx("transaction", "justify-content-center", "align-items-center")}>
            <Col>
              <div className={cx("table-container")}>
                <h2 id="transaction-table"></h2>
                <Table striped bordered hover>
                  <thead>
                    <tr>
                      <th>#</th> {/* Replace ID with sequential number */}
                      <th>Transaction Date</th>
                      <th>Amount</th>
                      <th>Status</th>
                      <th>Payment Method</th>
                      <th className="text-center">Buyer's Name</th>
                      <th className="text-center">Seller's Name</th>
                      <th className="text-center">Service Fee</th>
                      <th>Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentTransactions.map((transaction, index) => (
                      <tr key={transaction.id}>
                        <td>{index + 1 + (currentPage - 1) * rowsPerPage}</td>
                        <td>{new Date(transaction.createdDate).toLocaleDateString()}</td>
                        <td>${transaction.transactionAmount ? transaction.transactionAmount.toFixed(2) : '0.00'}</td>
                        <td className="text-center">
                          <span
                            style={{
                              display: "inline-block",
                              padding: "5px 10px",
                              borderRadius: "12px",
                              backgroundColor:
                                transaction.order.orderStatus === "completed" ? "#dcf1e4" :
                                  transaction.order.orderStatus === "pending" ? "#fff4e6" :
                                    transaction.order.orderStatus === "received" ? "#f7a474" :
                                      transaction.order.orderStatus === "orderbombing" ? "#fbf1dd" :
                                        transaction.order.orderStatus === "shipping" ? "#faf0dc" :  // New "shipping" status background color
                                          "#f0f0f0",

                              color:
                                transaction.order.orderStatus === "completed" ? "#0e612f" :
                                  transaction.order.orderStatus === "cancelled" ? "#856404" :
                                    transaction.order.orderStatus === "received" ? "#8a6111" :
                                      transaction.order.orderStatus === "orderbombing" ? "#ff0000" :
                                        transaction.order.orderStatus === "shipping" ? "#8a6212" :  // New "shipping" status text color
                                          "#000",

                            }}
                          >
                            {transaction.order.orderStatus}
                          </span>
                        </td>

                        <td>{transaction.order.orderMethod}</td>
                        <td className="text-center">{transaction.buyer.username}</td>
                        <td className="text-center">{transaction.seller.username}</td>
                        <td className="text-center">${transaction.order.serviceFee ? transaction.order.serviceFee.toFixed(2) : '0.00'}</td>
                        <td>{/* You can add description if needed */}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>

              {/* Pagination Controls */}
              <div className="pagination-controls">
                <Button
                  variant="outline-primary"
                  disabled={currentPage === 1}
                  onClick={() => paginate(currentPage - 1)}
                >
                  Prev
                </Button>
                <span className="mx-2">
                  Page {currentPage} of {totalPages}
                </span>
                <Button
                  variant="outline-primary"
                  disabled={currentPage === totalPages}
                  onClick={() => paginate(currentPage + 1)}
                >
                  Next
                </Button>
              </div>
            </Col>
          </Row>
        </Col>
      </div>
    </>
  );
};

export default TransactionList;
