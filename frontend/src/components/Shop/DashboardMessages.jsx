import axios from "axios";
import React, { useRef, useState } from "react";
import { useEffect } from "react";
import { backend_url, server } from "../../server";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { AiOutlineArrowRight, AiOutlineSend } from "react-icons/ai";
import styles from "../../styles/styles";
import { TfiGallery } from "react-icons/tfi";
import socketIO from "socket.io-client";
import { format } from "timeago.js";
const ENDPOINT = "https://eshop-qc49.onrender.com";
const socketId = socketIO(ENDPOINT, { transports: ["websocket"] });

const DashboardMessages = () => {
  const { seller } = useSelector((state) => state.seller);
  const [conversations, setConversations] = useState([]);
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const [currentChat, setCurrentChat] = useState();
  const [messages, setMessages] = useState([]);
  const [userData, setUserData] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [activeStatus, setActiveStatus] = useState(false);
  const [open, setOpen] = useState(false);
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
          `${server}/conversation/get-all-conversation-seller/${seller?._id}`,
          {
            withCredentials: true,
          }
        );

        setConversations(response.data.conversations);
      } catch (error) {
        // console.log(error);
      }
    };
    getConversation();
  }, [seller, messages]);

  useEffect(() => {
    if (seller) {
      const userId = seller?._id;
      socketId.emit("addUser", userId);
      socketId.on("getUsers", (data) => {
        setOnlineUsers(data);
      });
    }
  }, [seller]);

  const onlineCheck = (chat) => {
    const chatMembers = chat.members.find((member) => member !== seller?._id);
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
      } catch (error) {
        console.log(error);
      }
    };
    getMessage();
  }, [messages, images]);

  // create new message
  const sendMessageHandler = async (e) => {
    e.preventDefault();

    const receiverId = currentChat.members.find(
      (member) => member.id !== seller._id
    );

    socketId.emit("sendMessage", {
      senderId: seller?._id,
      receiverId,
      text: newMessage,
    });

    try {
      if (newMessage !== "") {
        await axios
          .post(`${server}/message/create-new-message`, {
            sender: seller._id,
            conversationId: currentChat._id,
            text: newMessage,
          })
          .then((res) => {
            setMessages([...messages, res.data.message]);
            updateLastMessage();
          })
          .catch((error) => {
            console.log(error);
          });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const updateLastMessage = async () => {
    socketId.emit("updateLastMessage", {
      lastMessage: newMessage,
      lastMessageId: seller?._id,
    });

    await axios
      .put(`${server}/conversation/update-last-message/${currentChat._id}`, {
        lastMessage: newMessage,
        lastMessageId: seller._id,
      })
      .then((res) => {
        setNewMessage("");
      })
      .catch((error) => {
        console.log(error);
      });
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
      (member) => member !== seller._id
    );

    socketId.emit("sendMessage", {
      senderId: seller?._id,
      receiverId,
      images: imageData,
    });

    try {
      setLoading(true);
      await axios
        .post(`${server}/message/create-new-message`, {
          sender: seller._id,
          conversationId: currentChat._id,
          images: imageData,
        })
        .then((res) => {
          setLoading(false);
          setImages();
          setMessages([...messages, res.data.message]);
          updateLastMessageForImage();
        });
    } catch (error) {
      console.log(error);
    }
  };

  const updateLastMessageForImage = async () => {
    await axios.put(
      `${server}/conversation/update-last-message/${currentChat._id}`,
      {
        lastMessage: "Photo",
        lastMessageId: seller._id,
      }
    );
  };

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-[#F5F8FF] via-[#EAF1FB] to-[#F5F8FF] py-10">
      <div className="max-w-3xl mx-auto">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar - Message List */}
          <div className="w-full md:w-1/3 bg-white rounded-xl shadow p-4 h-[70vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-[#4F8CFF] mb-4">Messages</h2>
            {!open && (
              <>
                {conversations &&
                  conversations.map((item, index) => (
                    <MessageList
                      data={item}
                      key={index}
                      index={index}
                      setOpen={setOpen}
                      setCurrentChat={setCurrentChat}
                      me={seller._id}
                      setUserData={setUserData}
                      userData={userData}
                      online={onlineCheck(item)}
                      setActiveStatus={setActiveStatus}
                    />
                  ))}
              </>
            )}
          </div>

          {/* Chat Area */}
          <div className="flex-1 bg-white rounded-xl shadow p-4 flex flex-col h-[70vh]">
            {open && (
              <SellerInbox
                setOpen={setOpen}
                newMessage={newMessage}
                setNewMessage={setNewMessage}
                sendMessageHandler={sendMessageHandler}
                messages={messages}
                sellerId={seller._id}
                userData={userData}
                activeStatus={activeStatus}
                scrollRef={scrollRef}
                setMessages={setMessages}
                handleImageUpload={handleImageUpload}
                loading={loading}
              />
            )}
            {!open && (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-[#4F8CFF] to-[#A0C1FF] rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">Select a conversation</h3>
                  <p className="text-gray-500">Choose a customer to start messaging</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const MessageList = ({
  data,
  index,
  setOpen,
  setCurrentChat,
  me,
  setUserData,
  online,
  setActiveStatus,
}) => {
  const [user, setUser] = useState([]);
  const navigate = useNavigate();
  const handleClick = (id) => {
    navigate(`/dashboard-messages?${id}`);
    setOpen(true);
  };
  const [active, setActive] = useState(0);

  useEffect(() => {
    const userId = data.members.find((user) => user != me);

    const getUser = async () => {
      try {
        const res = await axios.get(`${server}/user/user-info/${userId}`);
        setUser(res.data.user);
      } catch (error) {
        console.log(error);
      }
    };
    getUser();
  }, [me, data]);

  return (
    <div
      className={`w-full flex p-3 rounded-lg mb-2 transition-all duration-200 cursor-pointer ${
        active === index 
          ? "bg-gradient-to-r from-[#4F8CFF] to-[#A0C1FF] text-white shadow-lg" 
          : "bg-gray-50 hover:bg-[#F5F8FF] hover:text-[#4F8CFF]"
      }`}
      onClick={(e) =>
        setActive(index) ||
        handleClick(data._id) ||
        setCurrentChat(data) ||
        setUserData(user) ||
        setActiveStatus(online)
      }
    >
      <div className="relative">
        <img
          src={`${user?.avatar?.url}`}
          alt=""
          className="w-[50px] h-[50px] rounded-full border-2 border-white shadow-md"
        />
        {online ? (
          <div className="w-[12px] h-[12px] bg-green-400 rounded-full absolute top-[2px] right-[2px] border-2 border-white" />
        ) : (
          <div className="w-[12px] h-[12px] bg-gray-400 rounded-full absolute top-[2px] right-[2px] border-2 border-white" />
        )}
      </div>
      <div className="pl-3 flex-1">
        <h1 className="text-[16px] font-semibold">{user?.name}</h1>
        <p className={`text-[14px] ${active === index ? 'text-white/90' : 'text-gray-600'}`}>
          {data?.lastMessageId !== user?._id
            ? "You:"
            : user?.name?.split(" ")[0] + ": "}{" "}
          {data?.lastMessage}
        </p>
      </div>
    </div>
  );
};

const SellerInbox = ({
  scrollRef,
  setOpen,
  newMessage,
  setNewMessage,
  sendMessageHandler,
  messages,
  sellerId,
  userData,
  activeStatus,
  handleImageUpload,
  loading,
}) => {
  return (
    <>
      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/60 backdrop-blur-sm">
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 border-4 border-t-transparent border-[#4F8CFF] rounded-full animate-spin"></div>
            <p className="mt-4 text-[#4F8CFF] font-medium">Uploading...</p>
          </div>
        </div>
      )}
      <div className="w-full min-h-full flex flex-col justify-between">
        {/* message header */}
        <div className="w-full flex p-4 items-center justify-between bg-gradient-to-r from-[#4F8CFF] to-[#A0C1FF] text-white rounded-t-xl">
          <div className="flex items-center">
            <img
              src={`${userData?.avatar?.url}`}
              alt=""
              className="w-[50px] h-[50px] rounded-full border-2 border-white shadow-md"
            />
            <div className="pl-3">
              <h1 className="text-[18px] font-semibold">{userData?.name}</h1>
              <div className="flex items-center">
                <div className={`w-2 h-2 rounded-full mr-2 ${activeStatus ? 'bg-green-400' : 'bg-gray-400'}`}></div>
                <span className="text-sm opacity-90">{activeStatus ? "Active Now" : "Offline"}</span>
              </div>
            </div>
          </div>
          <button
            onClick={() => setOpen(false)}
            className="p-2 hover:bg-white/20 rounded-full transition-colors duration-200"
          >
            <AiOutlineArrowRight size={20} />
          </button>
        </div>

        {/* messages */}
        <div className="px-4 h-[50vh] py-4 overflow-y-scroll bg-gray-50">
          {messages &&
            messages.map((item, index) => {
              return (
                <div
                  className={`flex w-full my-2 ${
                    item.sender === sellerId ? "justify-end" : "justify-start"
                  }`}
                  ref={scrollRef}
                >
                  {item.sender !== sellerId && (
                    <img
                      src={`${userData?.avatar?.url}`}
                      className="w-[35px] h-[35px] rounded-full mr-3 border-2 border-white shadow-sm"
                      alt=""
                    />
                  )}
                  {item.images && (
                    <img
                      src={`${item.images?.url}`}
                      className="w-[250px] h-[250px] object-cover rounded-xl mr-2 shadow-md"
                    />
                  )}
                  {item.text !== undefined && (
                    <div>
                      <div
                        className={`w-max p-3 rounded-2xl shadow-sm ${
                          item.sender === sellerId
                            ? "bg-gradient-to-r from-[#4F8CFF] to-[#A0C1FF] text-white"
                            : "bg-white text-gray-800 border border-gray-200"
                        }`}
                      >
                        <p className="text-sm">{item.text}</p>
                      </div>

                      <p className="text-[11px] text-gray-500 pt-1 ml-1">
                        {format(item.createdAt)}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
        </div>

        {/* send message input */}
        <form
          aria-required={true}
          className="p-4 relative w-full flex justify-between items-center bg-white rounded-b-xl border-t border-gray-200"
          onSubmit={sendMessageHandler}
        >
          <div className="w-[40px]">
            <input
              type="file"
              name=""
              id="image"
              className="hidden"
              onChange={handleImageUpload}
            />
            <label htmlFor="image" className="cursor-pointer">
              <TfiGallery className="text-[#4F8CFF] hover:text-[#2563eb] transition-colors duration-200" size={20} />
            </label>
          </div>
          <div className="w-full mx-3">
            <input
              type="text"
              required
              placeholder="Type your message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4F8CFF] focus:border-transparent"
            />
            <input type="submit" value="Send" className="hidden" id="send" />
            <label htmlFor="send">
              <AiOutlineSend
                size={20}
                className="absolute right-6 top-6 cursor-pointer text-[#4F8CFF] hover:text-[#2563eb] transition-colors duration-200"
              />
            </label>
          </div>
        </form>
      </div>
    </>
  );
};

export default DashboardMessages;
