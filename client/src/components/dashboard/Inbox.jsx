import React, { useEffect, useState } from "react";
import axios from "axios";
import "./inbox.css";
import ReactionInbox from './Reaction_Inbox.jsx';
export default function Inbox({ uid }) {
  const [messages, setMessages] = useState([]);
  const [filters, setFilters] = useState({
    search: "",
    startDate: "",
    endDate: "",
    isOpened: "",
    includeDeleted: false,
  });

  const fetchMessages = async () => {
    try {
      const params = new URLSearchParams();
      if (filters.search) params.append("search", filters.search);
      if (filters.startDate) params.append("startDate", filters.startDate);
      if (filters.endDate) params.append("endDate", filters.endDate);
      if (filters.isOpened) params.append("isOpened", filters.isOpened);
      if (filters.includeDeleted) params.append("includeDeleted", "true");

      const res = await axios.get(
        `http://localhost:5000/api/messages/inbox/${uid}?${params}`
      );
      setMessages(res.data);
    } catch (err) {
      console.error("Error fetching inbox messages:", err);
    }
  };

  useEffect(() => {
    if (uid) fetchMessages();
  }, [uid, filters]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleViewMessage = async (id) => {
    try {
      await axios.patch(`http://localhost:5000/api/messages/open/${id}`);
      fetchMessages();
    } catch (error) {
      console.error("Failed to mark message as opened:", error);
    }
  };

  const handleSoftDelete = async (id) => {
    try {
      await axios.patch(`http://localhost:5000/api/messages/inbox/delete/${id}`);
      fetchMessages();
    } catch (err) {
      console.error("Error during soft delete:", err);
    }
  };

  return (
    <div className="inbox-container">
      <h3 className="inbox-header">Inbox</h3>

      {/* Filter Section */}
      <div className="filter-section">
        <input
          type="text"
          name="search"
          placeholder="Search content..."
          value={filters.search}
          onChange={handleChange}
        />

        <label>
          Created From:
          <input
            type="date"
            name="startDate"
            value={filters.startDate}
            onChange={handleChange}
          />
        </label>

        <label>
          To:
          <input
            type="date"
            name="endDate"
            value={filters.endDate}
            onChange={handleChange}
          />
        </label>

        <label>
          <input
            type="checkbox"
            name="isOpened"
            checked={filters.isOpened === "true"}
            onChange={(e) =>
              setFilters((prev) => ({
                ...prev,
                isOpened: e.target.checked ? "true" : "",
              }))
            }
          />
          Show Only Opened
        </label>

        <label>
          <input
            type="checkbox"
            name="includeDeleted"
            checked={filters.includeDeleted}
            onChange={handleChange}
          />
          Include Deleted
        </label>
      </div>

      {/* Message List */}
      {messages.length === 0 && <p className="no-messages">No messages found.</p>}
      <div className="message-list">
        {messages.map((msg) => (
          <div key={msg._id} className="message-item">
            <div className={`message-from ${msg.isOpened ? "" : "unopened"}`}>
              From: {msg.senderEmail || msg.from}
            </div>

            {msg.isOpened ? (
              <p className="message-content">{msg.content}</p>
            ) : (
              <button
                className="message-button"
                onClick={() => handleViewMessage(msg._id)}
              >
                View Message
              </button>
            )}
            {msg.isOpened ? (
             <ReactionInbox
               messageId={msg._id}
               reactions={msg.reactions}
               currentUserUid={uid}
               refresh={fetchMessages}
                    />
            ) : <></>}

            <div className="message-actions">
              <button
                className="message-button delete-button"
                onClick={() => handleSoftDelete(msg._id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
