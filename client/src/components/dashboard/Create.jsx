import React, { useState } from "react";
import axios from "axios";
import './create.css';  // <-- Import your CSS here

export default function Create({ uid }) {
  const [to, setTo] = useState("");
  const [content, setContent] = useState("");
  const [openAt, setOpenAt] = useState("");

  const getUIDByEmail = async (email) => {
    try {
      const response = await axios.post("http://localhost:5000/api/user/getUIDByEmail", { email });
      return response.data.uid;
    } catch (error) {
      console.error("Error fetching UID by email:", error);
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const recipientUID = await getUIDByEmail(to);
      if (!recipientUID) {
        alert("Recipient email not found!");
        return;
      }
      await axios.post("http://localhost:5000/api/messages/create", {
        from: uid,
        to: recipientUID,
        content,
        openAt,
      });
      alert("Message scheduled!");
      setTo("");
      setContent("");
      setOpenAt("");
    } catch (error) {
      alert("Failed to schedule message");
      console.error(error);
    }
  };

  return (
    <div className="create-container">
      <h3 className="create-header">Create Messages</h3>
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        placeholder="Recipient Email"
        value={to}
        onChange={(e) => setTo(e.target.value)}
        required
      />
      <textarea
        placeholder="Message"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        required
      />
      <input
        type="datetime-local"
        value={openAt}
        onChange={(e) => setOpenAt(e.target.value)}
        required
      />
      <button type="submit">Schedule Message</button>
    </form>
    </div>
  );
}
