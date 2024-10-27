import React from 'react';
import { Card, Row, Col, Image } from 'react-bootstrap';
import styles from './SellerInformation.module.scss';
import classNames from 'classnames/bind';
import { MdCircle } from "react-icons/md";

const SellerInformation = ({ seller }) => {
    const cx = classNames.bind(styles);
    return (
        <Card className={cx("seller-info p-3 shadow-sm")}>
            <Row>
            <Col xs={6}>
            <Row >
                <Col xs={6}>
                    <Image 
                        src={seller.userImage || "https://i.ibb.co/sg31cC8/download.png"} 
                        roundedCircle 
                        fluid 
                        className={cx("seller-info__avatar")}
                    />
                </Col>
                <Col xs={6}>
                    <h5 className={cx("seller-info__name mb-1")}>{seller.fullname}</h5>
                    <div className={cx("seller-info__rating")}>
                        <strong>Rating:</strong> {seller.rating} ⭐
                    </div>
                </Col>
            </Row>
            <Row >
                <Col xs={12} className={cx("seller-info__contact")}>
                    <strong>Contact (phone):</strong> {seller.phone}
                </Col>
            </Row>
            <Row className="mt-1">
                <Col xs={12} className={cx("seller-info__status")}>
                {seller.location ? (
                    <p style={{color :'#14b100'}} ><MdCircle/>Online</p>
                ) : (
                    <p style={{color :'#d10024'}}><MdCircle/>Offline</p>
                    )} 
                </Col>
            </Row>
            </Col>
            <Col xs={6}>
                    THÔNG TIN ĐANG THÊM
            </Col>
            </Row>
        </Card>
    );
};

export default SellerInformation;
