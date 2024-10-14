export const getTransactions = async () => {
    try {
        const response = await fetch('/api/transactions');
        if (response.ok) {
            const data = await response.json();
            return data;
        } else {
            throw new Error('Failed to fetch transactions');
        }
    } catch (error) {
        console.error('Error fetching transactions:', error);
        throw error;
    }
};

export const updateTransactionStatus = async (transactionID, newStatus) => {
    try {
        const response = await fetch(`/api/update-transaction-status/${transactionID}`, {
            method: 'PUT',  // Thường dùng PUT để cập nhật
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ status: newStatus }),
        });

        if (response.ok) {
            return await response.json();
        } else {
            throw new Error('Failed to update transaction status');
        }
    } catch (error) {
        console.error('Error updating transaction status:', error);
        throw error;
    }
};
