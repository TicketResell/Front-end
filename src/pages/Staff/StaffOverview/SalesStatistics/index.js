import React from 'react';
import { Card } from 'react-bootstrap';

export default function SalesStatistics({ data }) {
    return (
        <Card className="text-center">
            <Card.Body>
                <Card.Title>Số Lượng Vé Bán</Card.Title>
                <Card.Text>
                    Tổng số vé đã bán: <strong>{data.totalSales}</strong>
                </Card.Text>
                <Card.Text>
                    Khoảng thời gian: <strong>{data.timeframe}</strong>
                </Card.Text>
            </Card.Body>
        </Card>
    );
}
