import React, { useState } from 'react';
import { MDBTable, MDBTableHead, MDBTableBody } from 'mdb-react-ui-kit';
import Pagination from '../../../layouts/components/Pagination';

function Transaction({listTransactions}) {
  const [transactionlPage,setTransactionlPage] = useState(0);
  const itemsPerPage = 10;
    return (
        <MDBTable >
      <MDBTableHead >
        <tr>
          <th scope="col" style={{backgroundColor : "#8e65ff",color : "white"}} >TransactionID</th>
          <th scope="col" style={{backgroundColor : "#8e65ff",color : "white"}} >UserID</th>
          <th scope="col" style={{backgroundColor : "#8e65ff",color : "white"}} >OrderID</th>
          <th scope="col" style={{backgroundColor : "#8e65ff",color : "white"}} >Amount</th>
          <th scope="col" style={{backgroundColor : "#8e65ff",color : "white"}} >TransactionType</th>
          <th scope="col" style={{backgroundColor : "#8e65ff",color : "white"}} >TransactionDate</th>
        </tr>
      </MDBTableHead>
      <MDBTableBody>
        {listTransactions.map((transaction) => (
          <tr key={transaction.id}>
            <td>{transaction.transactionID}</td>
            <td>
              {transaction.userID}
            </td>
            <td>{transaction.orderID}</td>
            <td>{transaction.amount}</td>
            <td>{transaction.transactionType}</td>
            <td>{transaction.transactionDate}</td>
          </tr>
        ))}
      </MDBTableBody>
      <Pagination
            currentPage={transactionlPage}
            pageCount={Math.ceil(listTransactions.length / itemsPerPage)}
            onPageChange={(selectedPage) => setTransactionlPage(selectedPage)}
          />
    </MDBTable>
    );
}

export default Transaction;