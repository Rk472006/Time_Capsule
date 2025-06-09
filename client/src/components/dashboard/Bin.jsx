import React, { useEffect, useState } from "react";
import axios from "axios";
import "./bin.css";

export default function Bin({ uid }) {
  const [messages, setMessages] = useState([]);

  const fetchMessages = async () => {
    try {
      
      const res = await axios.get(`http://localhost:5000/api/messages/bin/${uid}`);
      setMessages(res.data);
    } catch (err) {
      console.error("Error fetching bin messages:", err);
    }
  };

  useEffect(() => {
    //console.log(uid);
    if (uid) fetchMessages();
   // const interval = setInterval(fetchMessages, 15000); // auto-refresh every 15 seconds
   // return () => clearInterval(interval); // cleanup on unmount
  }, [uid]);

  const handleRestore = async (id) => {
    try {
      await axios.patch(`http://localhost:5000/api/messages/restore/${id}`);
      setMessages((prev) => prev.filter(msg => msg._id !== id));
    } catch (err) {
      console.error("Restore failed:", err);
      alert("Failed to restore message.");
    }
  };

  const handlePermanentDelete = async (id) => {
    if (!window.confirm("Are you sure you want to permanently delete this message?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/messages/permanent/${id}`);
      setMessages((prev) => prev.filter(msg => msg._id !== id));
    } catch (err) {
      console.error("Permanent delete failed:", err);
      alert("Failed to permanently delete message.");
    }
  };

  return (
  <div className="bin-container">
    <h3>Bin</h3>
    {messages.length === 0 ? (
      <p>No deleted messages found.</p>
    ) : (
      messages.map((msg) => (
        <div key={msg._id} className="message-card">
          <p><strong>From:</strong> {msg.senderEmail}</p>
          <p>{msg.content}</p>
          <p><small>Opened on: {new Date(msg.openTime).toLocaleString()}</small></p>
          <div className="button-group">
            <button
              onClick={() => handleRestore(msg._id)}
              className="button-restore"
            >
              Restore
            </button>
            <button
              onClick={() => handlePermanentDelete(msg._id)}
              className="button-delete"
            >
              Delete Permanently
            </button>
          </div>
        </div>
      ))
    )}
  </div>
);

}
