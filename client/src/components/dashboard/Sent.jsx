import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Sent.css';
import ReactionSent from './Reaction_Sent';
export default function Sent({ uid }) {
  const [messages, setMessages] = useState([]);
  const [now, setNow] = useState(new Date());
  const [reload, setReload] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editedContent, setEditedContent] = useState('');

  // Filters
  const [search, setSearch] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [openTimeFilter, setOpenTimeFilter] = useState('');
  const [isOpened, setIsOpened] = useState('all');

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
      if (isOpened !== 'all') params.isOpened = isOpened;

      const res = await axios.get(`http://localhost:5000/api/messages/sent/${uid}`, { params });
      setMessages(res.data);
    } catch (err) {
      console.error("Failed to fetch sent messages:", err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this message?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/messages/${id}`);
      setReload(prev => !prev);
    } catch (err) {
      alert("Failed to delete message.");
      console.error(err);
    }
  };

  const handleEdit = (id, currentContent) => {
    setEditingId(id);
    setEditedContent(currentContent);
  };

  const handleSaveEdit = async (id) => {
    try {
      await axios.patch(`http://localhost:5000/api/messages/update/${id}`, { content: editedContent });
      setEditingId(null);
      setEditedContent('');
      setReload(prev => !prev);
    } catch (err) {
      alert("Failed to save changes.");
      console.error(err);
    }
  };

  return (
    <div className="sent-container">
      <h3>Sent Messages</h3>

      {/* Filters */}
      <div className="sent-filters">
        <input
          type="text"
          placeholder="Search content"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <label>
          Created From:
          <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
        </label>
        <label>
          Created To:
          <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
        </label>
        <label>
          Open Time Before:
          <input type="date" value={openTimeFilter} onChange={(e) => setOpenTimeFilter(e.target.value)} />
        </label>
        <label>
          Opened Status:
          <select value={isOpened} onChange={(e) => setIsOpened(e.target.value)}>
            <option value="all">All</option>
            <option value="true">Opened</option>
            <option value="false">Not Opened</option>
          </select>
        </label>
      </div>

      {messages.length === 0 ? (
        <p>No messages sent yet.</p>
      ) : (
        messages.map((msg) => {
          const isFuture = new Date(msg.openTime) > now;
          const isEditing = editingId === msg._id;

          return (
            <div className={`sent-card ${msg.isOpened ? 'opened' : 'not-opened'}`} key={msg._id}>
              <p><strong>To:</strong> {msg.recipientEmail}</p>
              {isEditing ? (
                <textarea
                  value={editedContent}
                  onChange={(e) => setEditedContent(e.target.value)}
                  rows={4}
                />
              ) : (
                <p><strong>Message:</strong> {msg.content}</p>
              )}
              <small><strong>Will open at:</strong> {new Date(msg.openTime).toLocaleString()}</small><br />
              <small className={`status ${msg.isOpened ? 'opened-text' : 'not-opened-text'}`}>
                Status: {msg.isOpened ? "Opened" : "Not Opened"}
              </small>
              <ReactionSent reactions={msg.reactions} />
              <br />
              {isFuture && (
                <>
                  {isEditing ? (
                    <>
                      <button className="btn save" onClick={() => handleSaveEdit(msg._id)}>Save</button>
                      <button className="btn cancel" onClick={() => setEditingId(null)}>Cancel</button>
                    </>
                  ) : (
                    <button className="btn edit" onClick={() => handleEdit(msg._id, msg.content)}>Edit</button>
                  )}
                  <button className="btn delete" onClick={() => handleDelete(msg._id)}>Delete</button>
                </>
              )}
            </div>
          );
        })
      )}
    </div>
  );
}
