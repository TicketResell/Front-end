import React, { useState,useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import SellerInformation from '../../layouts/components/Seller Information';
import { useLocation } from 'react-router-dom';
import TicketCard from '../../layouts/components/TicketCard';
import api from '../../config/axios';
import { MDBCard,MDBCardBody,MDBCardImage,MDBTypography,MDBIcon} from 'mdb-react-ui-kit';
const SellerPage = () => {
    const location = useLocation();
    const sellerInfor = location.state?.sellerInfor
    const [sellerTickets,setSellerTickets] = useState([]);
    const [evaluateList,setEvaluateList] = useState([]);

    const fetchSellerTickets = async () =>{
            const response = await api.get(`/tickets/onsale/${sellerInfor.id}`);
            console.log("List Tickets data",response.data);
            const tickets = response.data;
            setSellerTickets(tickets);
    }
    const fetchRatingsSeller = async () =>{
        console.log("sellerInfor",sellerInfor.id);
        try {
            const response = await api.get(`/ratings/seller/${sellerInfor.id}`);
            console.log("Response data",response.data);
            const comments = response.data;
            setEvaluateList(comments);
        } catch (err) {
            console.error("Lỗi Rating Seller");
        }
    }
    useEffect(() => {
        fetchSellerTickets();
        fetchRatingsSeller();
      }, [sellerInfor]);
    
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
            <Row>
            <div style={{maxHeight: "300px",overflowY : "auto"}}>
            {evaluateList.map((comment) => (
                <MDBCard className="mb-3" >
                <MDBCardBody>
                  <div className="d-flex flex-start">
                    <MDBCardImage
                      className="rounded-circle shadow-1-strong me-3"
                      src={comment.buyer.userImage}
                      alt="avatar"
                      width="40"
                      height="40"
                    />
  
                    <div className="w-100">
                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <MDBTypography
                          tag="h6"
                          className="text-primary fw-bold mb-0"
                        >
                          {comment.buyer.username}
                          <span className="text-dark ms-2">
                            {comment.feedback}
                          </span>
                        </MDBTypography>
                      </div>
                      <div className="d-flex justify-content-between align-items-center">
                        <p className="small mb-0" style={{ color: "#aaa" }}>
                          {comment.createdDate.split('T')[0]}  
                          •
                          {comment.ratingScore} star
                          •
                          <MDBIcon fas icon="star text-warning me-2" />
                        </p>
                      </div>
                    </div>
                  </div>
                </MDBCardBody>
              </MDBCard>
                ))}
            </div> 
            </Row>
        </Container>
    );
};

export default SellerPage;
