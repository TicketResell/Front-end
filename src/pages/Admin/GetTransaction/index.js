import { Row, Col, Table, Button } from "react-bootstrap";
import classNames from "classnames/bind";
import styles from "./AdminOverview.module.scss";
import { useEffect, useState } from "react";
import api from "../../../config/axios";

const cx = classNames.bind(styles);

const TransactionList = () => {
  const [transactions, setTransactions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  const fetchTransactions = async () => {
    try {
      const transactionsResponse = await api.get("/admin/transactions");
      const sortedTransactions = transactionsResponse.data.sort(
        (a, b) => new Date(b.createdDate) - new Date(a.createdDate)
      );
      setTransactions(sortedTransactions);
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  };


  useEffect(() => {
    fetchTransactions();
  }, []);

  const indexOfLastTransaction = currentPage * rowsPerPage;
  const indexOfFirstTransaction = indexOfLastTransaction - rowsPerPage;
  const currentTransactions = transactions.slice(indexOfFirstTransaction, indexOfLastTransaction);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const totalPages = Math.ceil(transactions.length / rowsPerPage);

  return (
    <>
      <div className={cx("adminPage")}>
        <Col className={cx("transaction_table")}>
          <Row className={cx("transaction", "justify-content-center", "align-items-center")}>
            <Col>
              <div className={cx("table-container")}>
                <h2 id="transaction-table">Transaction List</h2>
                <Table striped bordered hover>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Transaction Date</th>
                      <th>Order ID</th>
                      <th>Seller</th>
                      <th>Buyer</th>
                      <th>Amount</th>
                      <th>Transaction Type</th>
                      <th>VNP Response Code</th>
                      <th>VNP Transaction No</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentTransactions.map((transaction, index) => (
                      <tr key={transaction.id}>
                        <td>{index + 1 + (currentPage - 1) * rowsPerPage}</td>
                        <td>{new Date(transaction.createdDate).toLocaleDateString()}</td>
                        <td>{transaction.order?.id || "N/A"}</td>
                        <td className="text-center">{transaction.seller?.username || "N/A"}</td>
                        <td className="text-center">
                          {transaction.buyer?.username
                            ? transaction.buyer.username.length > 10
                              ? transaction.buyer.username.slice(0, 10) + "..."
                              : transaction.buyer.username
                            : "N/A"}
                        </td>

                        <td>
                          {transaction.transactionAmount
                            ? new Intl.NumberFormat("vi-VN").format(transaction.transactionAmount) + " VND"
                            : "0.00 VND"}
                        </td>
                        <td className="text-center">
                          <span
                            style={{
                              display: "inline-block",
                              padding: "5px 10px",
                              borderRadius: "12px",
                              backgroundColor:
                                transaction.transactionType === "Refund"
                                  ? "#f8d7da"
                                  : transaction.transactionType === "Income"
                                    ? "#d4edda"
                                    : transaction.transactionType === "Expense"
                                      ? "#d1ecf1"
                                      : "#f0f0f0",

                              color:
                                transaction.transactionType === "Refund"
                                  ? "#721c24"
                                  : transaction.transactionType === "Income"
                                    ? "#155724"
                                    : transaction.transactionType === "Expense"
                                      ? "#0c5460"
                                      : "#000",
                            }}
                          >
                            {transaction.transactionType}
                          </span>
                        </td>

                        <td>{transaction.vnpResponseCode || "COD"}</td>
                        <td>{transaction.vnpTransactionNo || "COD"}</td>
                      </tr>
                    ))}
                  </tbody>

                </Table>
              </div>

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
