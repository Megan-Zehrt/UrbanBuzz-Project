import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'
import axios from 'axios';
import '../styling/Message.css';

const Message = ({ userId }) => {
    const [messages, setMessages] = useState([]);
    const [content, setContent] = useState(''); // Renamed from 'newMessage' to 'content'
    const [users, setUsers] = useState([]);
    const [receiver, setReceiver] = useState(null); // Renamed from 'receiverId' to 'receiver'
    const [errors, setErrors] = useState([])
    const _id = localStorage.getItem("_id")


    useEffect(() => {
        axios.get("http://localhost:8000/api/users")
            .then(res => {
                console.log("✅✅✅✅", res.data)
                setUsers(res.data.users)
            })
            .catch(err => console.log("❌❌❌❌", err))

    }, [])

    const fetchMessages = (receiverId) => {
        axios.get(`http://localhost:8000/api/messages/between/${_id}/${receiverId}`)
            .then(res => {
                console.log("✅✅✅✅ messages", res.data);
                setMessages(res.data); // Assuming your API response structure
            })
            .catch(err => console.log("❌❌❌❌", err));
    };

    const handleUserClick = (receiverId) => {
        setReceiver(receiverId);
        fetchMessages(receiverId); // Fetch messages when a user is clicked
    };
    
    


    const handleSendMessage = (e) => {
        
        e.preventDefault();

        const messageVariables = {
            senderId: _id,        // Match with the 'sender' field in the model
            receiverId: receiver, // Match with the 'receiver' field in the model
            content: content
        }

        console.log(messageVariables)

        axios.post("http://localhost:8000/api/messages/send", messageVariables)
            .then(res =>{
                console.log("✔✔✔✔ message sent", res.data)
            })
            .catch(err => {
                console.log("❌❌❌❌", err)
                const errorResponse = err.response.data.errors;
                const errorArr = []
                for (const key of Object.keys(errorResponse)) {
                    errorArr.push(errorResponse[key].message)
                }
                setErrors(errorArr)

            })
    };

    

    return (
        <div className="message-component">
            <div className="users-list">
                {users.map((user) => (
                    <div 
                        key={user._id} 
                        className="user-item"
                        onClick={() => handleUserClick(user._id)} // Fetch messages on click
                    >
                        {user.username}
                    </div>
                ))}
            </div>
            <div className="message-container">
                <div className="messages-list">
                    {messages.map((message) => (
                        <div key={message._id} className="message-item">
                            <strong>{message.sender.username}:</strong> {message.content}
                        </div>
                    ))}
                </div>
                <div className="message-input">
                    <input
                        type="text"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="Type a message..."
                    />
                    <button onClick={handleSendMessage}>Send</button>
                </div>
            </div>
        </div>
    );
};

export default Message;