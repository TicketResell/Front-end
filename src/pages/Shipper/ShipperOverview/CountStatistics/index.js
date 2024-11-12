import React from 'react';
import { Card } from 'react-bootstrap';

export default function CountStatistics({ data }) {
    return (
        <Card className="text-center">
            <Card.Body>
                <Card.Title>{data.name}</Card.Title>
                <Card.Text>
                    Total OrderBombing: <strong>{data.number.orderBombingCount}</strong>
                </Card.Text>
                <Card.Text>
                    Success Rate : <strong>{data.number.successRate}%</strong>
                </Card.Text>
                <Card.Text>
                    Success Orders : <strong>{data.number.receivedCount}</strong>
                </Card.Text>
            </Card.Body>
        </Card>
    );
}
