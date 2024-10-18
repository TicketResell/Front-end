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
import { Client } from '@stomp/stompjs';
import { ToastContainer, toast, Bounce } from 'react-toastify';
import classNames from "classnames/bind";
import api from "../../../config";

export default function Chat({ ticket, user }) {
  const cx = classNames.bind(styles);
  const [messageContent, setMessageContent] = useState('');
  const [messages, setMessages] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isBuyer, setIsBuyer] = useState(false);  // Sử dụng isBuyer để xác định vai trò
  const [userName, setUserName] = useState("");
  const [chatType, setChatType] = useState('');
  const [connected, setConnected] = useState(false);
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

  const handleSendMessage = () => {
    if (!connected) {
      console.error("WebSocket is not connected");
      return;
    }

    const senderId = user.id;
    const receiverId = isBuyer ? ticket.userID : messages[0]?.senderId; // Xác định receiverId
    if (!senderId || !messageContent.trim() || !receiverId || !chatType) {
      toast.error('Please enter full recipient information, chat type and message content.', {
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
      return;
    }

    const messageToSend = JSON.stringify({
      senderId,
      receiverId,
      messageContent,
      chatType,
    });

    console.log("Sending message:", messageToSend);

    socket.current.publish({
      destination: '/app/sendMessage',
      body: messageToSend,
    });

    setMessageContent('');
  };

  const handleSignal = (signal) => {
    if (!connected) {
      console.error("WebSocket is not connected");
      return;
    }

    const senderId = user.id;
    const receiverId = isBuyer ? ticket.userID : messages[0]?.senderId;

    const messageToSend = JSON.stringify({
      senderId,
      receiverId,
      messageContent: signal,
      chatType: 'system',
    });

    console.log("Sending signal message:", messageToSend);

    socket.current.publish({
      destination: '/app/sendMessage',
      body: messageToSend,
    });
  };

  const connectWebSocket = () => {
    socket.current = new Client({
      brokerURL: 'ws://localhost:8084/chat-websocket',
      reconnectDelay: 5000,
      onConnect: () => {
        console.log('WebSocket connected');
        setConnected(true);

        socket.current.subscribe('/topic/messages', (message) => {
          const msg = JSON.parse(message.body);
          console.log("Message body",msg);
          setMessages(prevMessages => [...prevMessages, msg]);
        });

        socket.current.subscribe('/topic/history', (history) => {
          const chatHistory = JSON.parse(history.body);
          setMessages(chatHistory);
        });
      },
      onDisconnect: () => {
        console.log('WebSocket disconnected');
        setConnected(false);
      },
      onStompError: (frame) => {
        console.error('Broker reported error:', frame.headers['message']);
      },
    });

    socket.current.activate();
  };

  const getUserNameByID = async (id) => {
    console.log("Id dùng để get userName của người đối phương", id);
    try {
        const response = await api.post(`/accounts/hidden-search-profile/${id}`); // Gửi id trong URL
        setUserName(response.data);
    } catch (error) {
        console.error("Error fetching user name", error);
    }
};

  const handleDeal = () =>{

  }

  useEffect(() => {
    const determineRole = () => {
      if (ticket && ticket.userID !== user.id) {
        setIsBuyer(true);
        getUserNameByID(ticket.userID); // Người mua get user của người bán
      } else {
        setIsBuyer(false);
        getUserNameByID(messages[0]?.senderId); // Người bán get user của người mua
      }
    };

    connectWebSocket();
    determineRole(); // Gọi khi component mount

    return () => {
      if (socket.current) {
        socket.current.deactivate();
      }
    };
  }, [messages]); // Khi danh sách tin nhắn thay đổi thì kiểm tra lại vai trò

  return (
    <Container fluid>
      <ToastContainer/>
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
          <h1>Chat</h1>
          <div className={cx("chat-window")}>
            <MessageList>
              {messages.map((message, index) => (
                <MessageBubble
                  key={index}
                  text={message.messageContent}
                  sender={message.senderId === user.id ? 'You' : userName}
                  className={cx("message-bubble", {
                    "sent-message": message.senderId === user.id,
                    "received-message": message.senderId !== user.id,
                  })}
                />
              ))}
            </MessageList>
          </div>
          <InputGroup className={cx("input-container")}>
            <FormControl
              as="select"
              id="chatType"
              value={chatType}
              onChange={(e) => setChatType(e.target.value)}
            >
              <option value="">Chọn loại chat</option>
              <option value="text">Tin nhắn văn bản</option>
              <option value="image">Hình ảnh</option>
              <option value="bid">Đấu giá</option>
            </FormControl>
            <FormControl
              placeholder="Type your message here..."
              value={messageContent}
              onChange={(e) => setMessageContent(e.target.value)}
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
                onClick={() => handleSignal(isBuyer ? "DISCOUNT MORE" : "REJECT")}
              >
                {isBuyer ? "DISCOUNT MORE" : "REJECT"}
              </Button>
            </Col>
            <Col xs={6}>
              <Button variant="danger" className={cx("button-mess")} onClick={handleDeal}>
                DEAL
              </Button>
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  );
}
