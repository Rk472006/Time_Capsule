import React from 'react';
import './bin_msg.css'; 
export default function Bin_Msg({ msg, handleRestore, handlePermanentDelete }) {
  return (
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
  );
}