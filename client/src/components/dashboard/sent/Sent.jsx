import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Sent.css";
import ReactionSent from "../reactions/Reaction_Sent";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";
import Navbar from "../layouts/Navbar";
import Sent_Msg from "./Sent_Msg";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../../utils/firebase";

export default function Sent() {
  const [uid, setUid] = useState(null);
  const [messages, setMessages] = useState([]);
  const [now, setNow] = useState(new Date());
  const [reload, setReload] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editedContent, setEditedContent] = useState("");
  const [viewingImageUrl, setViewingImageUrl] = useState(null);

  
  const [search, setSearch] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [openTimeFilter, setOpenTimeFilter] = useState("");
  const [isOpened, setIsOpened] = useState("all");
  useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, (user) => {
    if (user) {
      const currentUid = user.uid;
      setUid(currentUid);
      console.log("User UID:", currentUid);  
    } else {
      toast.error("Authentication required to sent messages.");
      setUid(null);
    }
  });

  return () => unsubscribe();
}, []);

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 10000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (uid) fetchMessages();
  }, [uid, reload, search, startDate, endDate, openTimeFilter, isOpened]);

  const fetchMessages = async () => {
    try {
      const params = {};
      if (search) params.search = search;
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;
      if (openTimeFilter) params.openTime = openTimeFilter;
      if (isOpened !== "all") params.isOpened = isOpened;

      const res = await axios.get(
        `${import.meta.env.VITE_EXPRESS_API}/api/messages/sent/${uid}`,
        { params }
      );
      setMessages(res.data);
    } catch (err) {
      console.error("Failed to fetch sent messages:", err);
      toast.error("Failed to fetch sent messages. Please try again later.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this message?")) return;
    try {
      await axios.delete(`${import.meta.env.VITE_EXPRESS_API}/api/messages/${id}`);
      setReload((prev) => !prev);
    } catch (err) {
      toast.error("Failed to delete message.");
      console.error(err);
    }
  };

  const handleEdit = (id, currentContent) => {
    setEditingId(id);
    setEditedContent(currentContent);
  };

  const handleSaveEdit = async (id) => {
    try {
      await axios.patch(`${import.meta.env.VITE_EXPRESS_API}/api/messages/update/${id}`, {
        content: editedContent,
      });
      setEditingId(null);
      setEditedContent("");
      setReload((prev) => !prev);
    } catch (err) {
      toast.error("Failed to save changes.");
      console.error(err);
    }
  };

  return (
    <>
      <div className="sent-container">
        <Navbar uid={uid} />
        <div className="sent-page">
          <h3>Sent Messages</h3>

          <div className="sent-filters">
            <input
              type="text"
              placeholder="Search content"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <label>
              Created From:
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </label>
            <label>
              Created To:
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </label>
            <label>
              Open Time Before:
              <input
                type="date"
                value={openTimeFilter}
                onChange={(e) => setOpenTimeFilter(e.target.value)}
              />
            </label>
            <label>
              Opened Status:
              <select
                value={isOpened}
                onChange={(e) => setIsOpened(e.target.value)}
              >
                <option value="all">All</option>
                <option value="true">Opened</option>
                <option value="false">Not Opened</option>
              </select>
            </label>
          </div>

          {messages.length === 0 ? (
            <p className="no-messages">No messages sent yet.</p>
          ) : (
            <div className="sent-messages-list">
              {messages.map((msg) => (
                <Sent_Msg
                  key={msg._id}
                  now={now}
                  msg={msg}
                  handleDelete={handleDelete}
                  handleEdit={handleEdit}
                  setEditingId={setEditingId}
                  setEditedContent={setEditedContent}
                  setViewingImageUrl={setViewingImageUrl}
                  editingId={editingId}
                  editedContent={editedContent}
                  handleSaveEdit={handleSaveEdit}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {viewingImageUrl && typeof viewingImageUrl === "string" && (
        <div className="image-modal">
          <div className="image-modal-content">
            <span
              className="image-close"
              onClick={() => setViewingImageUrl(null)}
            >
              &times;
            </span>
            <img className="modal-image" src={viewingImageUrl} alt="Message" />
          </div>
        </div>
      )}
    </>
  );
}
