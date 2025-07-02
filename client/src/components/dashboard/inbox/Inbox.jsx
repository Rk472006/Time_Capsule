// Inbox.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import "./inbox.css";
import ReactionInbox from '../reactions/Reaction_Inbox.jsx';
import toast from "react-hot-toast";
import Navbar from "../layouts/Navbar.jsx"; 
import { useParams } from "react-router-dom";
import Inbox_Msg from "./Inbox_Msg.jsx";

export default function Inbox() {
  const { uid } = useParams();
  const [messages, setMessages] = useState([]);
  const [filters, setFilters] = useState({
    search: "",
    startDate: "",
    endDate: "",
    isOpened: "",
    includeDeleted: false,
  });
  const [viewingImageUrl, setViewingImageUrl] = useState(null);
  const fetchMessages = async () => {
    try {
      const params = new URLSearchParams();
      if (filters.search) params.append("search", filters.search);
      if (filters.startDate) params.append("startDate", filters.startDate);
      if (filters.endDate) params.append("endDate", filters.endDate);
      if (filters.isOpened) params.append("isOpened", filters.isOpened);
      if (filters.includeDeleted) params.append("includeDeleted", "true");

      const res = await axios.get(
        `${import.meta.env.VITE_EXPRESS_API}/api/messages/inbox/${uid}?${params}`
      );
      setMessages(res.data);
    } catch (err) {
      console.error("Error fetching inbox messages:", err);
      toast.error("Failed to fetch messages. Please try again later.");
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
      await axios.patch(`${import.meta.env.VITE_EXPRESS_API}/api/messages/open/${id}`);
      fetchMessages();
    } catch (error) {
      console.error("Failed to mark message as opened:", error);
      toast.error("Failed to open message. Please try again.");
    }
  };

  const handleSoftDelete = async (id) => {
    try {
      await axios.patch(`${import.meta.env.VITE_EXPRESS_API}/api/messages/inbox/delete/${id}`);
      fetchMessages();
    } catch (err) {
      console.error("Error during soft delete:", err);
      toast.error("Failed to delete message.");
    }
  };

  return (
    <>
    <div className="inbox-container">
      <Navbar uid={uid} />
      <div className="inbox-page">
        <h2 className="inbox-title">📥 Inbox</h2>

        <section className="filter-section">
          <input
            type="text"
            name="search"
            placeholder="Search content..."
            value={filters.search}
            onChange={handleChange}
          />

          <label>
            From:
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
        </section>

        <section className="message-list">
          {messages.length === 0 ? (
            <p className="no-messages">No messages found.</p>
          ) : (
            messages.map((msg) => (
               <Inbox_Msg
                 key={msg._id}
                 msg={msg}
                 handleViewMessage={handleViewMessage}
                 handleSoftDelete={handleSoftDelete}
                 setViewingImageUrl={setViewingImageUrl}
                 uid={uid}
                 fetchMessages={fetchMessages}
               />
            ))
          )}
        </section>
      </div>

    </div>
    {viewingImageUrl && typeof viewingImageUrl === 'string' && (
  <div className="image-modal">
    <div className="image-modal-content">
      <span className="image-close" onClick={() => setViewingImageUrl(null)}>&times;</span>
      <img  className="modal-image"src={viewingImageUrl} alt="Message" />
    </div>
  </div>
)}
    </>
  );
}
