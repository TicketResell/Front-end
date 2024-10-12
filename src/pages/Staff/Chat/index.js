import { Form, Button, InputGroup, Container, Row, Col, ListGroup } from "react-bootstrap";
import io from 'socket.io-client';
import React, { useState, useEffect } from 'react';
import classNames from 'classnames/bind';
import styles from './Chat.module.scss';

const socket = io('http://localhost:3000'); // Connect backend server

const Chat = ({ staffRole }) => {
    const cx = classNames.bind(styles);
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState('');
    const [activeUsers, setActiveUsers] = useState([]); // List of users sending messages

    useEffect(() => {
        // Listener for chat history
        socket.on('chatHistory', (history) => {
            setMessages(history);
            const users = history.map(msg => msg.sender);
            setActiveUsers([...new Set(users)]); // Unique list of users
        });

        // Listener for incoming messages
        socket.on('receiveMessage', (newMessage) => {
            setMessages((prevMessages) => [...prevMessages, newMessage]);

            // Update user list with new message
            setActiveUsers((prevUsers) => {
                if (!prevUsers.includes(newMessage.sender)) {
                    return [...prevUsers, newMessage.sender];
                }
                return prevUsers;
            });
        });

        // Clean up on component disconnect
        return () => {
            socket.off('chatHistory');
            socket.off('receiveMessage');
        };
    }, []);

    const sendMessage = (e) => {
        e.preventDefault(); // Corrected capitalization
        if (message.trim() === '') return;

        const newMessage = {
            sender: staffRole,
            content: message,
            timestamp: new Date().toISOString(),
        };

        // Send the message to server
        socket.emit('sendMessage', newMessage);
        setMessage(''); // Clear the input message after sending
    };

    return (
        <Container>
            <Row>
                {/* User list panel */}
                <Col md={3} className={cx("user-list")}>
                    <h5>Message</h5>
                    <ListGroup>
                        {activeUsers.map((user, index) => (
                            <ListGroup.Item key={index}>
                                {user === staffRole ? 'You (Staff)' : user}
                            </ListGroup.Item>
                        ))}
                    </ListGroup>
                </Col>

                {/* Chat box */}
                <Col md={9} className={cx("chat-box")}>
                    <div className={cx("chat-messages")}>
                        {messages.map((msg, index) => (
                            <div key={index} className={msg.sender === staffRole ? cx('staff-message') : cx('user-message')}>
                                <strong>{msg.sender === staffRole ? 'You (Staff)' : msg.sender}:</strong> {msg.content}
                                <span className="message-time">{new Date(msg.timestamp).toLocaleTimeString()}</span>
                            </div>
                        ))}
                    </div>

                    <Form onSubmit={sendMessage}>
                        <InputGroup>
                            <Form.Control
                                type="text"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder="Type your message..."
                            />
                            <Button variant="primary" type="submit">Send</Button>
                        </InputGroup>
                    </Form>
                </Col>
            </Row>
        </Container>
    );
};

export default Chat;
