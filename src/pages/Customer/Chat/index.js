import React, { useState, useEffect } from 'react';
import { Container, Row, Col, InputGroup, FormControl, Button, ListGroup } from 'react-bootstrap';
import { MessageList, MessageBubble } from 'react-bootstrap-chat-ui';
import io from 'socket.io-client';
import styles from "./Chat.module.scss";
import classNames from 'classnames/bind';

const socket = io('http://localhost:8084'); 

export default function Chat({ticket,userId}){
  const cx = classNames.bind(styles);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [buyerMode,setBuyerMode] = useState(false)
  
  const channels = [
    { name: 'Channel 1', lastMessage: 'This is a message', date: '2022-01-01' },
    { name: 'Channel 2', lastMessage: 'Hello, get started', date: '2021-12-03' },
    { name: 'Channel 3', lastMessage: 'Rigth', date: '2021-12-03' },
    { name: 'Channel 4', lastMessage: 'Gato', date: '2021-12-03' },
    { name: 'Channel 5', lastMessage: 'Naruto', date: '2021-12-03' },

  ];

  const filteredChannels = channels.filter(channel =>
    channel.name.toLowerCase().includes(searchTerm.toLowerCase()) 
  );

  const isBuyer = () =>{
    if(ticket.userId !== userId){
      setBuyerMode(true);
    }
  } 

  const socketSetup=() =>{
    // Lắng nghe sự kiện nhận tin nhắn
    socket.on('receiveMessage', (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    // Dọn dẹp sự kiện khi component unmount
    return () => {
      socket.off('receiveMessage');
    };
  }

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const message = { text: newMessage, id: messages.length + 1, sender: 'user' };
      setMessages((prevMessages) => [...prevMessages, message]);
      socket.emit('sendMessage', message); // Gửi tin nhắn đến server
      setNewMessage('');
    }
  };

  const handleDeal = () =>{

  }
  const handleSignal =(signal) =>{
    
  }
  useEffect(() => {
    isBuyer();
    socketSetup()
  }, []);

  return (
    <Container fluid>
      <Row>
        <Col md={4} className="sidebar">
          <h2>Search</h2>
          <FormControl type="text" placeholder="Search..." className="mb-3" onChange={(e)=>setSearchTerm(e.target.value)}/>
          <h2>Channels</h2>
          <ListGroup>
            {filteredChannels.map((channel, index) => (
              <ListGroup.Item key={index}>
                <strong>{channel.name}</strong><br />
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
              {messages.map((message) => (
                <MessageBubble 
                  key={message.id} 
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
            <Button variant="primary" onClick={handleSendMessage}>Send</Button>
          </InputGroup>
          <Row>
            <Col xs={6}>
            <Button variant="success" className={cx("button-mess")} onClick={handleSignal(buyerMode ? "REJECT" : "DISCOUNT MORE")}>{buyerMode ? ("REJECT"):("DISCOUNT MORE")}</Button>
            </Col>
            <Col xs={6}>
            <Button variant="danger" className={cx("button-mess")} onClick={handleDeal}>DEAL</Button>
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  );
}
