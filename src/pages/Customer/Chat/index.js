import React, { useState, useEffect, useRef } from "react";
import {
  Container,
  Row,
  Col,
  InputGroup,
  FormControl,
  Button,
  ListGroup,
} from "react-bootstrap";
import { MessageList, MessageBubble } from "react-bootstrap-chat-ui";
import styles from "./Chat.module.scss";
import classNames from "classnames/bind";

export default function Chat({ ticket, user }) {
  const cx = classNames.bind(styles);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [buyerMode, setBuyerMode] = useState(false);
  const socket = useRef(null);

  const channels = [
    { name: "Channel 1", lastMessage: "This is a message", date: "2022-01-01" },
    {
      name: "Channel 2",
      lastMessage: "Hello, get started",
      date: "2021-12-03",
    },
    { name: "Channel 3", lastMessage: "Rigth", date: "2021-12-03" },
    { name: "Channel 4", lastMessage: "Gato", date: "2021-12-03" },
    { name: "Channel 5", lastMessage: "Naruto", date: "2021-12-03" },
  ];

  const filteredChannels = channels.filter((channel) =>
    channel.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const isBuyer = () => {
    if (ticket && ticket.userId !== user.id) {
      setBuyerMode(true);
    }
  };

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const message = {
        sender: user.name,
        text: newMessage,
        ticketId: ticket.id,
        timestamp: new Date(),
      };
      socket.current.send(JSON.stringify(message));
      setNewMessage("");
    }
  };

  const handleDeal = () => {
    // Xử lý deal
  };

  const handleSignal = (signal) => {
    const signalMessage = {
      sender: user.name,
      text: signal,
      ticketId: ticket.id,
      timestamp: new Date(),
    };
    socket.current.send(JSON.stringify(signalMessage));
  };

  useEffect(() => {
    if (ticket) {
      isBuyer();

      // Thiết lập kết nối WebSocket
      socket.current = new WebSocket("ws://localhost:8080/chat"); // Thay đổi URL này với URL thực của server WebSocket

      socket.current.onopen = () => {
        console.log("WebSocket connection opened");
      };

      socket.current.onmessage = (event) => {
        const message = JSON.parse(event.data);
        setMessages((prevMessages) => [...prevMessages, message]);
      };

      socket.current.onclose = () => {
        console.log("WebSocket connection closed");
      };

      socket.current.onerror = (error) => {
        console.log("WebSocket error:", error);
      };

      // Đóng kết nối WebSocket khi component unmount
      return () => {
        if (socket.current) {
          socket.current.close();
        }
      };
    }
  }, [ticket]);

  if (!ticket) {
    return (
      <Container fluid>
        <Row>
          <Col>
          <div id={cx("notfound")}>
		        <div className={cx("notfound")}>
			        <div>
				        <div className={cx("notfound-404")}>
					      <h1>!</h1>
				        </div>
				      <h2>Error<br/>Chat</h2>
			        </div>
			        <p>Chat cannot be used when you do not want to bargain for any fare <a href="/">Back to homepage</a></p>
		        </div>
	        </div>
          </Col>
        </Row>
      </Container>
    );
  }

  return (
    <Container fluid>
      <Row>
        <Col md={4} className="sidebar">
          <h2>Search</h2>
          <FormControl
            type="text"
            placeholder="Search..."
            className="mb-3"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <h2>Channels</h2>
          <ListGroup>
            {filteredChannels.map((channel, index) => (
              <ListGroup.Item key={index}>
                <strong>{channel.name}</strong>
                <br />
                <small>{channel.lastMessage} </small>
                <span>{channel.date}</span>
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Col>
        <Col md={8}>
          <h1>Channel Name</h1>
          <div className={cx("chat-window")}>
            <MessageList>
              {messages.map((message, index) => (
                <MessageBubble
                  key={index}
                  text={message.text}
                  sender={message.sender}
                  className={cx("message-bubble")}
                />
              ))}
            </MessageList>
          </div>
          <InputGroup className={cx("input-container")}>
            <FormControl
              placeholder="Aa"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
            />
            <Button variant="primary" onClick={handleSendMessage}>
              Send
            </Button>
          </InputGroup>
          <Row>
            <Col xs={6}>
              <Button
                variant="success"
                className={cx("button-mess")}
                onClick={() =>
                  handleSignal(buyerMode ? "REJECT" : "DISCOUNT MORE")
                }
              >
                {buyerMode ? "REJECT" : "DISCOUNT MORE"}
              </Button>
            </Col>
            <Col xs={6}>
              <Button
                variant="danger"
                className={cx("button-mess")}
                onClick={handleDeal}
              >
                DEAL
              </Button>
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  );
}
