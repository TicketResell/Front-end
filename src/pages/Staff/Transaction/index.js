import React, { useState, useEffect } from 'react';
import { MDBTable, MDBTableHead, MDBTableBody } from 'mdb-react-ui-kit';
import { getTransactions, updateTransactionStatus } from './TransactionStatus';

// Dữ liệu mẫu
const sampleTransactions = [
    {
        transactionID: 'TRX001',
        userID: 'USR123',
        orderID: 'ORD001',
        amount: 150.00,
        transactionType: 'Credit',
        transactionDate: '2024-10-01',
        status: 'pending',
    },
    {
        transactionID: 'TRX002',
        userID: 'USR456',
        orderID: 'ORD002',
        amount: 200.00,
        transactionType: 'Debit',
        transactionDate: '2024-10-02',
        status: 'completed',
    },
    {
        transactionID: 'TRX003',
        userID: 'USR789',
        orderID: 'ORD003',
        amount: 300.00,
        transactionType: 'Credit',
        transactionDate: '2024-10-03',
        status: 'canceled',
    },
];

function Transaction() {
    const [listTransactions, setListTransactions] = useState(sampleTransactions); // Sử dụng dữ liệu mẫu

    useEffect(() => {
        // Gọi API để lấy danh sách giao dịch
        const fetchTransactions = async () => {
            try {
                const transactions = await getTransactions();
                setListTransactions(transactions);
            } catch (error) {
                console.error('Error fetching transactions:', error);
            }
        };
        // fetchTransactions(); // Bỏ comment để gọi API thực tế
    }, []);

    const handleUpdateStatus = async (transactionID, newStatus) => {
        try {
            await updateTransactionStatus(transactionID, newStatus);
            alert('Transaction status updated successfully!');
            // Cập nhật lại danh sách giao dịch sau khi cập nhật thành công
            const transactions = await getTransactions();
            setListTransactions(transactions);
        } catch (error) {
            console.error('Error updating transaction status:', error);
            alert('Failed to update transaction status.');
        }
    };

    return (
        <MDBTable>
            <MDBTableHead>
                <tr>
                    <th scope="col" style={{ backgroundColor: "#8e65ff", color: "white" }}>TransactionID</th>
                    <th scope="col" style={{ backgroundColor: "#8e65ff", color: "white" }}>UserID</th>
                    <th scope="col" style={{ backgroundColor: "#8e65ff", color: "white" }}>OrderID</th>
                    <th scope="col" style={{ backgroundColor: "#8e65ff", color: "white" }}>Amount</th>
                    <th scope="col" style={{ backgroundColor: "#8e65ff", color: "white" }}>TransactionType</th>
                    <th scope="col" style={{ backgroundColor: "#8e65ff", color: "white" }}>TransactionDate</th>
                    <th scope="col" style={{ backgroundColor: "#8e65ff", color: "white" }}>Status</th>
                    <th scope="col" style={{ backgroundColor: "#8e65ff", color: "white" }}>Actions</th>
                </tr>
            </MDBTableHead>
            <MDBTableBody>
                {listTransactions.map((transaction) => (
                    <tr key={transaction.transactionID}>
                        <td>{transaction.transactionID}</td>
                        <td>{transaction.userID}</td>
                        <td>{transaction.orderID}</td>
                        <td>{transaction.amount}</td>
                        <td>{transaction.transactionType}</td>
                        <td>{transaction.transactionDate}</td>
                        <td>
                            <select
                                value={transaction.status}
                                onChange={(e) => handleUpdateStatus(transaction.transactionID, e.target.value)}
                            >
                                <option value="pending">Pending</option>
                                <option value="completed">Completed</option>
                                <option value="canceled">Canceled</option>
                            </select>
                        </td>
                        <td>
                            <button
                                onClick={() => handleUpdateStatus(transaction.transactionID, transaction.status)}
                                className="btn btn-primary"
                            >
                                Cập nhật
                            </button>
                        </td>
                    </tr>
                ))}
            </MDBTableBody>
        </MDBTable>
    );
}

export default Transaction;