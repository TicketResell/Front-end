import React, { useState,useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import SellerInformation from '../../layouts/components/Seller Information';
import { useLocation } from 'react-router-dom';
import TicketCard from '../../layouts/components/TicketCard';
import api from '../../config/axios';
import { ToastContainer, toast, Bounce } from 'react-toastify';
const SellerPage = () => {
    const location = useLocation();
    const sellerInfor = location.state?.sellerInfor
    const [sellerTickets,setSellerTickets] = useState([]);

    const fetchSellerTickets = async () =>{
        console.log("sellerInfor",sellerInfor.id);
        try {
            const response = await api.get(`/tickets/onsale/${sellerInfor.id}`);
            console.log("Response data",response);
            const tickets = response.data;
            setSellerTickets(tickets);
        } catch (err) {
            toast.error(err.response.data, {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
                transition: Bounce,
              });
        }
    }
    useEffect(() => {
        fetchSellerTickets();
      }, [sellerInfor]);
    
    return (
        <Container className="mt-5">
            {/* Thông tin người bán */}
            <ToastContainer/>
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
