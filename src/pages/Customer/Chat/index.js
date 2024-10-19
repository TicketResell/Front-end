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
  Search 
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
  const [connected, setConnected] = useState(false);
  const socket = useRef(null);

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

  const handleSendMessage = (mess) => {
    console.log("User message:", mess);
    if (!connected) {
      console.error("WebSocket is not connected");
      return;
    }

    const senderId = user.id;
    const receiverId = isBuyer ? ticket.userID : messages[0]?.senderId; // Xác định receiverId
    console.log("senderId",senderId)
    console.log("messageContent",mess)
    console.log("receiverId",receiverId)
    if (!senderId || !mess.trim() || !receiverId) {
      toast.error(
        "Please enter message content.",
        {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          transition: Bounce,
        }
      );
      return;
    }

    const messageToSend = JSON.stringify({
      senderId,
      receiverId,
      messageContent: mess,
      chatType:'text',
    });

    console.log("Sending message:", messageToSend);

    socket.current.publish({
      destination: "/app/sendMessage",
      body: messageToSend,
    });
  };

  const handleAttachFile = () =>{
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = 'image/*';
  input.onchange = (e) => {
    const img = e.target.files[0];
    if (img) {
      const imageUrl = uploadImgBB(img);
      const imageMessage = {
        messageContent: imageUrl, // Hiển thị hình ảnh trong tin nhắn
        senderId: user.id,
        timestamp: new Date().toISOString(),
        type: 'image', // Đánh dấu kiểu tin nhắn là file
      };
      //Thên hình ảnh vào messagelist
      console.log("Image :",img);
      setMessages((prevMessages) => [...prevMessages, imageMessage]);

      // Gửi file qua WebSocket nếu cần thiết (chỉ nếu bạn muốn)
      const senderId = user.id;
      const receiverId = isBuyer ? ticket.userID : messages[0]?.senderId; // Xác định receiverId

      const messageToSend = JSON.stringify({
        senderId,
        receiverId,
        messageContent: imageUrl,
        chatType: 'image',
      });

      socket.current.publish({
        destination: "/app/sendMessage",
        body: messageToSend,
      });
    }
  };
  input.click();
  }

  const connectWebSocket = () => {
    socket.current = new Client({
      brokerURL: "ws://localhost:8084/chat-websocket",
      reconnectDelay: 5000,
      onConnect: () => {
        console.log("WebSocket connected");
        setConnected(true);

        socket.current.subscribe("/topic/messages", (message) => {
          const msg = JSON.parse(message.body);
          console.log("Message body", msg);
          setMessages((prevMessages) => [...prevMessages, msg]);
        });

        socket.current.subscribe("/topic/history", (history) => {
          const chatHistory = JSON.parse(history.body);
          setMessages(chatHistory);
        });
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

  const getUserNameByID = async (id) => {
    console.log("Id dùng để get userName của người đối phương", id);
    try {
      const response = await api.post(`/accounts/hidden-search-profile/${id}`); // Gửi id trong URL
      console.log("UserName : ",response.data);
      setUserName(response.data);
    } catch (error) {
      console.error("Error fetching user name", error);
    }
  };

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
    <MainContainer >
    <ToastContainer />
    <Sidebar position="left">
    <Search placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e)}
          onClearClick={() => setSearchTerm("")} />
      <ConversationList>
        {filteredUsers.map((user, index) => (
          <Conversation key={index} name={user.name} lastSenderName={user.name} info = {user.lastMessage} active = {false}>
            <Avatar src='https://i.ibb.co/wpnnQ3Q/a882ecea-527f-4cd7-b2c4-2587a2d10e23.jpg'/> 
            <p>{user.lastMessage}</p>
            <small>{user.date}</small>
          </Conversation>
        ))}
      </ConversationList>
    </Sidebar>
      <ChatContainer>
        
      <ConversationHeader>
        <Avatar src="https://i.ibb.co/wpnnQ3Q/a882ecea-527f-4cd7-b2c4-2587a2d10e23.jpg" status="dnd"/>
        <ConversationHeader.Content userName={userName}></ConversationHeader.Content>
      </ConversationHeader>
      <MessageList>
        {messages.map((message, index) => (
          <Message
            key={index}
            model={{
              message: message.type === 'file' ? `📎 ${message.messageContent}` : message.messageContent,
              sentTime: message.timestamp,
              sender: message.senderId === user.id ? "You" : userName,
              direction : message.senderId === user.id ? "outgoing" : "incoming",
              position: message.senderId === user.id ? "normal" : ""
            }}
            avatarSpacer= {true}
          >
             <Avatar  src={message.senderId === user.id ? user.image : messages[0]?.senderId.image}/> {/*user chính diện và user đối diện */}
          {message.type === 'image' && (
        <Message.ImageContent src={message.messageContent} alt="attached" style={{ maxWidth: "200px", borderRadius: "8px" }}/>
      )}
          </Message>
        ))}
      </MessageList>
      <MessageInput placeholder="Type message here" onSend={handleSendMessage} onAttachClick={handleAttachFile} />
    </ChatContainer>
  </MainContainer>
  );
}
