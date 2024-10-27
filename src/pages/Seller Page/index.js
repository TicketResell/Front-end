import React, { useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import SellerInformation from '../../layouts/components/Seller Information';
import { useLocation } from 'react-router-dom';
import TicketCard from '../../layouts/components/TicketCard';
import api from '../../config/axios';
const SellerPage = () => {
    const location = useLocation();
    const sellerInfor = location.state?.sellerInfor
    const [sellerTickets,setSellerTickets] = useState([]);

    const fetchSellerTickets = () =>{
        try {
            const response = api.get("");
            const tickets = response.data;
            setSellerTickets(tickets);
        } catch (error) {
            
        }

        
    }
    return (
        <Container className="mt-5">
            {/* Thông tin người bán */}
            <Row className="mb-4">
                <Col>
                    <SellerInformation seller={sellerInfor} />
                </Col>
            </Row>

            {/* Danh sách vé */}
            <Row>
                <Col>
                    <h4 className="mb-3">Danh sách vé</h4>
                </Col>
            </Row>
            <Row>
                {sellerTickets.map((ticket) => ( 
                <Col key={ticket.id} xs={12} md={3}>
                    <TicketCard ticket={ticket} seller={ticket.seller}/>
                  </Col>
                ))}
            </Row>
        </Container>
    );
};

export default SellerPage;
