import React from 'react';
import { Card } from 'react-bootstrap';

export default function CountStatistics({ data }) {
    return (
        <Card className="text-center">
            <Card.Body>
                <Card.Title>{data.name}</Card.Title>
                <Card.Text>
                    Tổng hàng bị bom: <strong>{data.number.orderBombingCount}</strong>
                </Card.Text>
                <Card.Text>
                    Tỉ lệ giao hàng thành công : <strong>{data.number.successRate}%</strong>
                </Card.Text>
                <Card.Text>
                    Tổng số hàng đã giao thành công : <strong>{data.number.receivedCount}</strong>
                </Card.Text>
            </Card.Body>
        </Card>
    );
}
