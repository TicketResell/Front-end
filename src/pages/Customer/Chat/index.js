import React, { useState, useEffect, useRef } from "react";
import {
  MainContainer,
  ChatContainer,
  MessageList,
  Message,
  MessageInput,
  Sidebar,
  ConversationList,
  Conversation,
  Avatar,
  ConversationHeader,
  Search,
} from "@chatscope/chat-ui-kit-react";
import { Client } from "@stomp/stompjs";
import { ToastContainer, toast, Bounce } from "react-toastify";
import api from "../../../config/axios";
import uploadImgBB from "../../../config/imgBB";

export default function Chat({ ticket, user }) {
  const [messages, setMessages] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isBuyer, setIsBuyer] = useState(false); // Sử dụng isBuyer để xác định vai trò
  const [userName, setUserName] = useState("");
  const [userAvatar, setUserAvatar] = useState("");
  const [connected, setConnected] = useState(false);
  const [activeIndex, setActiveIndex] = useState(null);
  const [unreadCounts, setUnreadCounts] = useState([3, 5, 7, 4, 4, 5]);
  const [conversations, setConversations] = useState([]);
  const socket = useRef(null);
  const msgListRef = useRef(null);

  const users = [
    { name: "User 1", lastMessage: "This is a message", date: "2022-01-01" },
    {
      name: "User 2",
      lastMessage: "Hello, get started",
      date: "2021-12-03",
    },
    { name: "User 3", lastMessage: "Rigth", date: "2021-12-03" },
    { name: "User 4", lastMessage: "Gato", date: "2021-12-03" },
    { name: "User 5", lastMessage: "Naruto", date: "2021-12-03" },
  ];

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getUserImageByID = async (id) => {
    console.log("Id dùng để get userImage của người đối phương", id);
    try {
      const response = await api.post(`/accounts/get-avatar/${id}`); // Gửi id trong URL
      console.log("UserImage : ", response.data);
      setUserAvatar(response.data);
    } catch (error) {
      console.error("Error fetching user name", error);
    }
  };

  const handleSendMessage = async (mess) => {
    console.log("User message:", mess);
    if (!connected) {
      console.error("WebSocket is not connected");
      return;
    }

    const senderId = user.id;
    console.log("M co phai Buyer ko", isBuyer);
    const receiverId = isBuyer ? ticket.userID : messages[0]?.user1_id; // Xác định receiverId
    console.log("senderId", senderId);
    console.log("messageContent", mess);
    console.log("receiverId", receiverId);
    console.log("Đối phương", userName);
    if (!senderId || !mess.trim() || !receiverId) {
      toast.error("Please enter message content.", {
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
    //Lấy hình ảnh của người gửi hiện tại
    const response = await api.post(`/accounts/get-avatar/${senderId}`);
    const imageSender = response.data;
    console.log("Image Sender", imageSender);

    const messageToSend = JSON.stringify({
      user1_id: senderId,
      user2_id: receiverId,
      messageContent: mess,
      messageType: "text",
      user2Name: userName,
      user1_avatar: imageSender,
    });

    console.log("Sending message:", messageToSend);

    socket.current.publish({
      destination: "/app/sendMessage",
      body: messageToSend,
    });
    msgListRef.current?.scrollToBottom( "auto" )
  };

  const reconnectWebSocket = () => {
    if (!socket.current || !socket.current.connected) {
      connectWebSocket(); // Gọi lại hàm connectWebSocket
    }
  };

  const handleAttachFile = async () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";

    input.onchange = async (e) => {
      const img = e.target.files[0];
      if (img) {
        const imageUrlArray = await uploadImgBB([img]);
        const imageUrl = imageUrlArray[0];

        console.log("Hình ảnh Imgbb:", imageUrl);

        const senderId = user.id;
        const receiverId = isBuyer ? ticket.userID : messages[0]?.user1_id;
        const response = await api.post(`/accounts/get-avatar/${senderId}`);
        const imageSender = response.data;

        const messageToSend = JSON.stringify({
          user1_id: senderId,
          user2_id: receiverId,
          messageContent: imageUrl,
          messageType: "image",
          user2Name: userName,
          user1_avatar: imageSender,
        });

        reconnectWebSocket(); // Gọi hàm để kết nối lại khi bị mất do chờ hình ảnh lên imgBB quá lâu
        console.log("Sending message image:", messageToSend);
        if (socket.current && socket.current.connected) {
          socket.current.publish({
            destination: "/app/sendMessage",
            body: messageToSend,
          });
        } else {
          console.error("STOMP connection is not established");
        }
      }
    };

    input.click();
  };

  const fetchChatHistory = (id) => {
    socket.current.publish({
      destination: "/app/chat/history",
      body: JSON.stringify(id)
    });
  };

  //Lấy tên người dùng bằng id
  const getUserNameByID = async (id) => {
    console.log("Id dùng để get userName của người đối phương", id);
    try {
      const response = await api.post(`/accounts/hidden-search-profile/${id}`); 
      setUserName(response.data);
    } catch (error) {
      console.error("Error fetching user name", error);
    }
  };
  //Xác định rằng bên nào mua bên nào bán
  const determineRole = () => {
    if (ticket && ticket.userID !== user.id) {
      console.log("Ticket UserID Determinerole", ticket.userID);
      console.log("UserID Login Determinerole", user.id);
      setIsBuyer(true);
      getUserNameByID(ticket.userID); // Người mua get user của người bán
      getUserImageByID(ticket.userID);
    } else {
      setIsBuyer(false);
      getUserNameByID(messages[0]?.user1_id); // Người bán get user của người mua
      getUserImageByID(messages[0]?.user1_id);
    }
  };

  const connectWebSocket = () => {
    socket.current = new Client({
      brokerURL: "ws://localhost:8084/chat-websocket",
      reconnectDelay: 10000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      onConnect: () => {
        console.log("WebSocket connected");
        setConnected(true);
  
        // Kiểm tra kết nối trước khi subscribe
        if (socket.current.connected) {
          // Trả về tin nhắn đã gửi của users
          socket.current.subscribe("/topic/messages", (message) => {
            console.log("Message Body JSON", message);
            const msg = JSON.parse(message.body);
            console.log("Message được trả về", msg);
            setMessages((prevMessages) => [...prevMessages, msg]);
          });
          // Kéo lịch sử chat của một user bằng userId
          socket.current.subscribe("/topic/history", (history) => {
            const chatHistory = JSON.parse(history.body);
            console.log("Chat History", chatHistory);
            setMessages(chatHistory);
          });
  
          // Gọi fetchChatHistory ở đây để đảm bảo WebSocket đã kết nối thành công
          fetchChatHistory(user.id);
        } else {
          console.error("STOMP connection is not established");
        }
  
        // Xác định vai trò sau khi kết nối thành công
        determineRole();
      },
      onDisconnect: () => {
        console.log("WebSocket disconnected");
        setConnected(false);
      },
      onStompError: (frame) => {
        console.error("Broker reported error:", frame.headers["message"]);
      },
    });
  
    socket.current.activate();
  };

  useEffect(() => {
    // Đảm bảo rằng WebSocket chỉ được kết nối một lần khi component được mount
    connectWebSocket();
  
    return () => {
      if (socket.current) {
        socket.current.deactivate();
      }
    };
  }, []);

  // Hàm xử lý khi click vào một Conversation
  const handleChatClick = (index) => {
    setActiveIndex(index); // Cập nhật conversation đang active
    setUnreadCounts(
      (prevUnreadCounts) =>
        prevUnreadCounts.map((count, i) => (i === index ? 0 : count)) // Đặt unreadCnt về 0 cho conversation được click
    );
  };

  useEffect(() => {
    const storedConversations = JSON.parse(localStorage.getItem("conversations")) || [];
    setConversations(storedConversations);
  }, []);

  const saveConversationsToLocalStorage = (conversations) => {
    localStorage.setItem("conversations", JSON.stringify(conversations));
  };

  return (
    <MainContainer>
      <ToastContainer />
      <Sidebar position="left">
        <Search
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e)}
          onClearClick={() => setSearchTerm("")}
        />
        <ConversationList>
          {filteredUsers.map((user, index) => (
            <Conversation
              key={index}
              name={user.name}
              lastSenderName={user.name}
              info={user.lastMessage}
              active={activeIndex === index}
              unreadCnt={unreadCounts[index]}
              lastActivityTime="43 min"
              onClick={() => handleChatClick(index)}
            >
              <Avatar src="https://i.ibb.co/wpnnQ3Q/a882ecea-527f-4cd7-b2c4-2587a2d10e23.jpg" />
              <p>{user.lastMessage}</p>
            </Conversation>
          ))}
        </ConversationList>
      </Sidebar>
      <ChatContainer>
        <ConversationHeader>
          {/* Avatar cho người nhận */}
          {userAvatar && <Avatar src={userAvatar} status="dnd" />}
          <ConversationHeader.Content
            userName={userName}
          ></ConversationHeader.Content>
        </ConversationHeader>
        <MessageList ref={msgListRef} >
          {messages.map((message, index) => (
            <Message
              key={index}
              model={{
                message:
                  message.messageType === "text" ? message.messageContent : "",
                direction:
                  message.user1_id === user.id ? "outgoing" : "incoming",
                type: message.messageType,
                sentTime: message.timestamp,
                sender: message.user1_id === user.id ? "You" : userName,
              }}
              avatarSpacer={true}
            >
              {/* Hiển thị nội dung tin nhắn */}
              {message.messageType === "text" ? (
                <Message.CustomContent>
                  {message.messageContent} {/* Hiển thị văn bản */}
                </Message.CustomContent>
              ) : message.messageType === "image" ? (
                <Message.CustomContent>
                  <img
                    src={message.messageContent}
                    alt="Message content"
                    style={{
                      maxWidth: "400px",
                      maxHeight: "250px",
                      borderRadius: "8px",
                      display: "block",
                      margin: "0 auto",
                      objectFit: "cover",
                    }}
                  />
                </Message.CustomContent>
              ) : null}
              {/* Avatar cho người gửi */}
              <Avatar src={message.user1_avatar} />
            </Message>
          ))}
        </MessageList>

        <MessageInput
          placeholder="Type message here"
          onSend={handleSendMessage}
          onAttachClick={handleAttachFile}
        />
      </ChatContainer>
    </MainContainer>
  );
}
