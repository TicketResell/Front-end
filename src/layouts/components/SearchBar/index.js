import React, { useState } from "react";
import { FaSearch} from "react-icons/fa";
import { Container, Row, Col, Form,InputGroup, Button } from "react-bootstrap";
import api from "../../../config";
import { useNavigate } from "react-router-dom";
import styles from "./SearchBar.module.scss" 

function Search (){
  const [tickName,setTickName] = useState("")
  const [tickCategory,setTickCategory] = useState("")
  const [location,setLocation] = useState("")
  const [tickNum,setTickNum] = useState(1)
  const navigate = useNavigate()

  const handleSearch = async () =>{
    const infoSearch = {
      tickName,
      tickCategory,
      location,
      tickNum
    }

    console.log(infoSearch)
    const response = await api.post("search",infoSearch)
    console.log(response.data)
    const {token} = response.data
    localStorage.setItem("token",token)
    navigate("/home")
    
  }

  return (
    <div className="container p-4">
    <Container className={`  ${styles.wrapper} p-4 `} style={{maxWidth: "500px"}}>
      <h2 className={` ${styles.header} text-center`}>SEARCH TICKET</h2>
      <Form>
        <InputGroup className="mb-3">
          <InputGroup.Text><FaSearch /></InputGroup.Text>
          <Form.Control placeholder="Nhập vé cần tìm"  value={tickName} onChange={(e) =>{setTickName(e.target.value)}}/>
        </InputGroup>

        <Row className="mb-3">
          <Col>
            <Form.Group>
              <Form.Label>CATEGORY</Form.Label>
              <Form.Select defaultValue={"Movie"} value={tickCategory} onChange={(e) =>{setTickCategory(e.target.value)}}>
                <option value={"Movie"}>Movie tickets</option>
                <option value={"Event"}>Event tickets</option>
                <option value={"Sports"}>Sports tickets</option>
              </Form.Select>
            </Form.Group>
          </Col>

          <Col>
            <Form.Group>
              <Form.Label>LOCATION</Form.Label>
              <Form.Select defaultValue={"TP HCM"} value={location} onChange={(e) =>{setLocation(e.target.value)}}>
                <option value={"TP HCM"}>TP HCM</option>
                <option value={"Ha Noi"}>Ha Noi</option>
                <option value={"Khánh Hòa"}>Khanh Hoa</option>
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>

        <Form.Group className="mb-3">
          <Form.Label>SỐ LƯỢNG</Form.Label>
          <Form.Select defaultValue={1} value={tickNum} onChange={(e) =>{setTickNum(parseInt(e.target.value,10))}}>
            <option value={1}>1 ticket</option>
            <option value={2}>2 ticket</option>
            <option value={3}>3 ticket</option>
            <option value={4}>4 ticket</option>
          </Form.Select>
        </Form.Group>

        <Button variant="primary" type="submit" className="w-100" style={{ backgroundColor: '##4562EB' }} onClick={handleSearch}>
          SEARCH
        </Button>
      </Form>
    </Container>
  </div>
  );
};

export default Search;