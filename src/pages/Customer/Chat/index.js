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
import { Button, Modal } from 'react-bootstrap';
import { Client } from "@stomp/stompjs";
import { ToastContainer, toast, Bounce } from "react-toastify";
import api, { apiWithoutPrefix } from "../../../config/axios";
import uploadImgBB from "../../../config/imgBB";

export default function Chat({ ticket, user }) {
  const [messages, setMessages] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [userName, setUserName] = useState("");
  const [userAvatar, setUserAvatar] = useState("");
  const [userStatus,setUserStatus] = useState({});
  const [connected, setConnected] = useState(false);
  const [activeConservation, setActiveConservation] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [receiverId, setReceiverId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showChatBox,setShowChatBox] = useState(false);
  const socket = useRef(null);
  const msgListRef = useRef(null);

  const filteredUsers = conversations.filter((conversation) =>
    conversation.user2FullName && conversation.user2FullName.toLowerCase().includes(searchTerm.toLowerCase())
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

  const getUserStatusByID = async (id) => {
    console.log("Id dùng để get userStatus của người đối phương", id);
    try {
      const response = await api.get(`/accounts/get-user-online-status/${id}`); // Gửi id trong URL
      console.log("User Status : ", response.data);
      setUserStatus(response.data);
    } catch (error) {
      console.error("Error fetching user name", error);
    }
  };

  const handleSendMessage = async (mess) => {

    const senderId = user.id;
    console.log("User message:", mess);
    if (!connected) {
      console.error("WebSocket is not connected");
      return;
    }

    
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
    console.log("Lấy hình ảnh của người gửi",response.data);
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
    console.log("WebSocket is connected:", socket.current?.connected);

    try {
      socket.current.publish({
        destination: "/app/sendMessage",
        body: messageToSend,
      });
      console.log("Message published successfully!");
    } catch (error) {
      console.error("Error publishing message:", error);

    }

    msgListRef.current?.scrollToBottom( "auto" )
  };

  const reconnectWebSocket = () => {
    try {
      if (!socket.current || !socket.current.connected) {
        connectWebSocket(); // Gọi lại hàm connectWebSocket
      }
      console.log("Reconnect Wesocket successfully!");
    } catch (error) {
      
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
        
        try{
          socket.current.publish({
            destination: "/app/sendMessage",
            body: messageToSend,
          });
          console.log("Image published successfully!");
        } catch(error) {
          console.error("Error publishing message:", error);
        }
      }
    };

    input.click();
  };

  const fetchChatHistory = async (userId,user2Id) => {
    try {
      const response = await apiWithoutPrefix.get(`/chat-history/${userId}/${user2Id}`)
      console.log("Lấy lịch sử chat 2 con thằng này cho bố",response.data);
      const chatHistory = response.data;
      console.log("Chat History", chatHistory);
      setMessages(chatHistory);
      console.log("ChatHistory published successfully!");
    } catch (error) {
      console.error("Error publishing ChatHistory:", error);
    }
    
  };

  const fetchChatConversation = async (userId,user2Id = null) => {
    console.log("User Login",userId);
    try {
      if(userId && user2Id) {
        await apiWithoutPrefix.post(`/check-conversation/${userId}/${user2Id}`);
      }else{
        await apiWithoutPrefix.post(`/check-conversation/${userId}/${userId}`);
      }
      console.log("UserID1 fetchChatConversation", userId);
      console.log("UserID2 fetchChatConversation", user2Id);
      //Lấy danh sách conversation về dựa trên user login
      socket.current.publish({
        destination: "/app/chat/conversations",
        body: JSON.stringify(userId)
      });

      console.log("Chat Conservation published successfully!");
    } catch (error) {
      console.error("Error publishing Chat Conversation:", error);
    }

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
  const determineRole = async () => {
    let receiverId;
    if (ticket && ticket.seller) {
    receiverId = ticket.seller.id === user.id ? messages[0]?.user1_id : ticket.seller.id;
    }else if (messages.length > 0){
      receiverId = messages[0]?.user1_id === user.id ? messages[0]?.user2_id : messages[0]?.user1_id;
    }
    setReceiverId(receiverId);
    await getUserNameByID(receiverId); 
    await getUserImageByID(receiverId); 
    await getUserStatusByID(receiverId);
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
          try {
            socket.current.subscribe("/topic/messages", (message) => {
              console.log("Message Body JSON", message);
              const msg = JSON.parse(message.body);
              console.log("Message được trả về", msg);
              setMessages((prevMessages) => [...prevMessages, msg]);
            });
            console.log("Message subscribed successfully!");
          } catch (error) {
            console.error("Không lấy được tin nhắn")
          }

          socket.current.subscribe("/topic/conversations",(convesation)=>{
            const chatConversation = JSON.parse(convesation.body);
            console.log("Conversation Chat",chatConversation);
            setConversations(chatConversation);
          }) 
        } else {
          console.error("STOMP connection is not established");
        }
        if(ticket){
          fetchChatConversation(user.id,ticket.seller.id);
        }else{
          fetchChatConversation(user.id);
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

  // Hàm xử lý khi click vào một Conversation
  const handleChatConversationClick = async (index,conversation) => {
    await apiWithoutPrefix.post(`/chat/set-hasRead-status/${user.id}/${conversation}`);
    setShowChatBox(true);
    setActiveConservation(index); // Cập nhật conversation đang active
    setReceiverId(conversation);
    await getUserNameByID(conversation);
    await getUserImageByID(conversation);
    await getUserStatusByID(conversation)
    //Lấy một khung chat mới bằng cách tải history chat của user cụ thể
    fetchChatHistory(user.id,conversation);

    //Chỉnh unreadCount về 0 khi click vào nghĩa là đã đọc rồi
    setConversations((prevConversations) =>
      prevConversations.map((conv, i) =>
        i === index ? { ...conv, unreadCount: 0 } : conv
      )
    );

  };

  useEffect(() => {
    // Đảm bảo rằng WebSocket chỉ được kết nối một lần khi component được mount
    connectWebSocket();
    return () => {
      if (socket.current) {
        socket.current.deactivate();
      }
    };
  }, [ticket,messages]);

  useEffect(() => {
    // Hiển thị modal để thông báo không có conversation với người nào
    console.log("Số lượng Conversation người dùng có",conversations.length);
    if (conversations.length === 0 ) {
      setShowModal(true);
    }else{
      setShowModal(false);
    }
  }, [conversations]);

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
          {filteredUsers.map((conversation, index) => {
            console.log("User2 filter:", conversation.user2);
            console.log("Userid filter:", user.id);
            return (
            <Conversation
              key={index}
              name={conversation.user1 === user.id ? conversation.user2FullName : conversation.user1FullName}
              info={conversation.lastMessage.startsWith("https://i.ibb.co") ? "Sent 1 photo" : conversation.lastMessage}
              active={activeConservation === index}
              unreadDot={conversation.unreadCount > 0}
              lastActivityTime={conversation.timestamp}
              onClick={() => handleChatConversationClick(index,conversation.user1 === user.id ? conversation.user2 : conversation.user1)}
            >
              <Avatar src={conversation.user1 === user.id ? conversation.user2Img : conversation.user1Img || "https://i.ibb.co/sg31cC8/download.png" } status={conversation.user1 === user.id ? (conversation.user2OnlineStatus === true ? "available" : "dnd") : (conversation.user1OnlineStatus === true ? "available" : "dnd")}/>
            </Conversation>
            )
          })}
        </ConversationList>
      </Sidebar>
      <ChatContainer>
        <ConversationHeader>
          {/* Avatar cho người nhận */}
          {userAvatar && <Avatar src={userAvatar} status={userStatus.online === true ? "available" : "dnd"} />}
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
          {showChatBox && <MessageInput
          placeholder="Type message here"
          onSend={handleSendMessage}
          onAttachClick={handleAttachFile}
        /> }

      </ChatContainer>
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>No Contacts Available</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>You currently have no contacts to chat with.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </MainContainer>
  );
}
