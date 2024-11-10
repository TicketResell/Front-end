import { Row, } from "react-bootstrap";
import SmallerCard from "./SmallCard";
import { useEffect, useState } from "react";
import api, { apiWithoutPrefix } from "../../../config/axios";
import CountStatistics from "./CountStatistics";

export default function Overview() {
  const [orderShipping, setOrderShipping] = useState(0);
  const [orderbombing, setOrderBombing] = useState(0);
  const [counts,setCounts] = useState([])

  const fetchOrderShipping = async () => {

      const response = await apiWithoutPrefix.get("/order/count-orders-shipping");
      console.log("Shipping Response",response.data)
      setOrderShipping(response.data);

  };

  const fetchCount = async () => {
      const response = await apiWithoutPrefix.get("/order/success-rate");
      console.log("SuccessRate Response",response.data)
      setCounts(response.data);
  };

  const fetchOrderBomnbingCount = async () =>{
      const response = await apiWithoutPrefix.get("/order/count-orders-orderbombing-received");
      console.log("BombingCount Response",response.data)
      setOrderBombing(response.data);
  }

  useEffect(() => {
    fetchOrderShipping();
    fetchOrderBomnbingCount();
    fetchCount();
  }, []);

  return (
    <>
      <Row>
          <Row style={{height : "14rem"}}>
            <SmallerCard
              types={{
                name: "Shipping Count",
                number: orderShipping,
              }}
            />
          </Row>
          <Row style={{height : "14rem"}}>
            <SmallerCard
              types={{
                name: "OrderBombing Count",
                number: orderbombing,
              }}
            />
          </Row>
          <Row style={{height : "14rem"}}>
            <CountStatistics
              data={{
                name: "Success Rate",
                number: counts,
              }}
            />
          </Row>
      </Row>
    </>
  );
}
