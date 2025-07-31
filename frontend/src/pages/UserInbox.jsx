import React, { useEffect, useRef, useState } from "react";
import Header from "../components/Layout/Header";
import { useSelector } from "react-redux";
import socketIO from "socket.io-client";
import { format } from "timeago.js";
import { backend_url, server } from "../server";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AiOutlineArrowRight, AiOutlineSend } from "react-icons/ai";
import { TfiGallery } from "react-icons/tfi";
import styles from "../styles/styles";
const ENDPOINT = "https://eshop-qc49.onrender.com";
const socketId = socketIO(ENDPOINT, { transports: ["websocket"] });

const UserInbox = () => {
  const { user } = useSelector((state) => state.user);
  const [conversations, setConversations] = useState([]);
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const [currentChat, setCurrentChat] = useState();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [userData, setUserData] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [activeStatus, setActiveStatus] = useState(false);
  const [images, setImages] = useState();
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    socketId.on("getMessage", (data) => {
      setArrivalMessage({
        sender: data.senderId,
        text: data.text,
        createdAt: Date.now(),
      });
    });
  }, []);

  useEffect(() => {
    arrivalMessage &&
      currentChat?.members.includes(arrivalMessage.sender) &&
      setMessages((prev) => [...prev, arrivalMessage]);
  }, [arrivalMessage, currentChat]);

  useEffect(() => {
    const getConversation = async () => {
      try {
        const response = await axios.get(
          `${server}/conversation/get-all-conversation-user/${user?._id}`,
          {
            withCredentials: true,
          }
        );
        setConversations(response.data.conversations);
      } catch (error) {}
    };
    getConversation();
  }, [user, messages]);

  useEffect(() => {
    if (user) {
      const userId = user?._id;
      socketId.emit("addUser", userId);
      socketId.on("getUsers", (data) => {
        setOnlineUsers(data);
      });
    }
  }, [user]);

  const onlineCheck = (chat) => {
    const chatMembers = chat.members.find((member) => member !== user?._id);
    const online = onlineUsers.find((user) => user.userId === chatMembers);
    return online ? true : false;
  };

  // get messages
  useEffect(() => {
    const getMessage = async () => {
      try {
        const response = await axios.get(
          `${server}/message/get-all-messages/${currentChat?._id}`
        );
        setMessages(response.data.messages);
      } catch (error) {}
    };
    if (currentChat) getMessage();
  }, [currentChat]);

  // create new message
  const sendMessageHandler = async (e) => {
    e.preventDefault();
    const receiverId = currentChat.members.find(
      (member) => member !== user?._id
    );
    socketId.emit("sendMessage", {
      senderId: user?._id,
      receiverId,
      text: newMessage,
    });
    try {
      if (newMessage !== "") {
        await axios
          .post(`${server}/message/create-new-message`, {
            sender: user._id,
            text: newMessage,
            conversationId: currentChat._id,
          })
          .then((res) => {
            setMessages([...messages, res.data.message]);
            setNewMessage("");
          });
      }
    } catch (error) {}
  };

  const handleImageUpload = async (e) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.readyState === 2) {
        const imageData = reader.result;
        setImages(imageData);
        imageSendingHandler(imageData);
      }
    };
    reader.readAsDataURL(e.target.files[0]);
  };

  const imageSendingHandler = async (imageData) => {
    const receiverId = currentChat.members.find(
      (member) => member !== user._id
    );
    socketId.emit("sendMessage", {
      senderId: user?._id,
      receiverId,
      images: imageData,
    });
    try {
      setLoading(true);
      await axios
        .post(`${server}/message/create-new-message`, {
          sender: user._id,
          conversationId: currentChat._id,
          images: imageData,
        })
        .then((res) => {
          setLoading(false);
          setImages();
          setMessages([...messages, res.data.message]);
        });
    } catch (error) {}
  };

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="min-h-screen bg-[#f5f5f5]">
            <Header />
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-6 py-8 px-2 md:px-0">
        {/* Sidebar: Conversation List */}
        <div className="w-full md:w-1/3 bg-white rounded-xl shadow p-4 h-[70vh] overflow-y-auto">
          <h2 className="text-xl font-bold text-[#4F8CFF] mb-4">Inbox</h2>
          {conversations && conversations.length > 0 ? (
                conversations.map((item, index) => (
              <ConversationListItem
                key={item._id}
                    data={item}
                userId={user._id}
                    setCurrentChat={setCurrentChat}
                    setUserData={setUserData}
                    online={onlineCheck(item)}
                isActive={currentChat && currentChat._id === item._id}
              />
            ))
          ) : (
            <div className="text-gray-500 text-center mt-10">No conversations yet.</div>
          )}
        </div>
        {/* Main Chat Area */}
        <div className="flex-1 bg-white rounded-xl shadow p-4 flex flex-col h-[70vh]">
          {currentChat && userData ? (
            <>
              {/* Chat Header */}
              <div className="flex items-center border-b pb-3 mb-3">
                <img
                  src={userData.avatar?.url}
                  alt={userData.name}
                  className="w-12 h-12 rounded-full border-2 border-[#4F8CFF] object-cover"
                />
                <div className="ml-4">
                  <h3 className="font-semibold text-lg text-[#4F8CFF]">{userData.name}</h3>
                  <span className="text-xs text-gray-500">{onlineCheck(currentChat) ? "Online" : "Offline"}</span>
            </div>
          </div>
              {/* Messages */}
              <div className="flex-1 overflow-y-auto space-y-2 pr-2">
                {messages && messages.length > 0 ? (
                  messages.map((item, idx) => (
                    <div
                      key={idx}
                      className={`flex ${item.sender === user._id ? "justify-end" : "justify-start"}`}
                ref={scrollRef}
              >
                      <div
                        className={`max-w-xs px-4 py-2 rounded-lg shadow text-sm ${
                          item.sender === user._id
                          ? "bg-gradient-to-r from-[#4F8CFF] to-[#A0C1FF] text-white"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                        {item.images && (
                          <img
                            src={item.images?.url}
                            className="w-40 h-40 object-cover rounded mb-1"
                            alt="attachment"
                          />
                        )}
                        {item.text}
                        <div className="text-xs text-gray-300 mt-1 text-right">{format(item.createdAt)}</div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-gray-400 text-center mt-10">No messages yet.</div>
                  )}
              </div>
              {/* Message Input */}
        <form
                className="mt-4 flex items-center gap-2"
          onSubmit={sendMessageHandler}
        >
            <input
              type="file"
              id="image"
              onChange={handleImageUpload}
              className="hidden"
            />
            <label htmlFor="image">
              <TfiGallery className="cursor-pointer text-[#4F8CFF] hover:text-[#2563eb]" size={22} />
            </label>
          <input
            type="text"
            required
                  placeholder="Type your message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4F8CFF] focus:border-[#4F8CFF] transition-colors"
          />
          <button
            type="submit"
            className="px-6 py-3 bg-gradient-to-r from-[#4F8CFF] to-[#A0C1FF] text-white font-semibold rounded-lg shadow hover:from-[#2563eb] hover:to-[#4F8CFF] transition-all duration-200"
          >
            <AiOutlineSend size={20} />
          </button>
        </form>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-400">
              Select a conversation to start chatting.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const ConversationListItem = ({ data, userId, setCurrentChat, setUserData, online, isActive }) => {
  const [user, setUser] = useState({});
  useEffect(() => {
    const otherUserId = data.members.find((id) => id !== userId);
    const getUser = async () => {
      try {
        const res = await axios.get(`${server}/shop/get-shop-info/${otherUserId}`);
        setUser(res.data.shop);
        setUserData(res.data.shop);
      } catch (error) {}
    };
    getUser();
    // eslint-disable-next-line
  }, [data, userId]);
  return (
    <div
      className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all ${
        isActive ? "bg-gradient-to-r from-[#4F8CFF] to-[#A0C1FF] text-white" : "hover:bg-gray-100"
      }`}
      onClick={() => {
        setCurrentChat(data);
        setUserData(user);
      }}
    >
      <div className="relative">
        <img
          src={user.avatar?.url}
          alt={user.name}
          className="w-10 h-10 rounded-full border-2 border-[#4F8CFF] object-cover"
        />
        <span
          className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
            online ? "bg-green-400" : "bg-gray-300"
          }`}
        ></span>
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="font-semibold truncate">{user.name}</h4>
        <p className="text-xs truncate">
          {data.lastMessageId !== user._id ? "You: " : user.name?.split(" ")[0] + ": "}
          {data.lastMessage}
        </p>
      </div>
    </div>
  );
};

export default UserInbox;
