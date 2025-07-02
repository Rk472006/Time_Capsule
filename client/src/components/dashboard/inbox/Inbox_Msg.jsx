import "./inbox_msg.css";
import ReactionInbox from "../reactions/Reaction_Inbox";
export default function Inbox_Msg({ msg, handleViewMessage, handleSoftDelete,setViewingImageUrl,uid, fetchMessages }) {
  return (
    <div key={msg._id} className="message-item">
      <div className={`message-from ${msg.isOpened ? "" : "unopened"}`}>
        <strong>From:</strong> {msg.senderEmail || msg.from}
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

      {msg.isOpened && (
        <ReactionInbox
          messageId={msg._id}
          reactions={msg.reactions}
          currentUserUid={uid}
          refresh={fetchMessages}
        />
      )}

      <div className="message-actions">
        {msg.isOpened && msg.imageUrl && (
          <button
            className="btn view-image"  
            onClick={() => setViewingImageUrl(msg.imageUrl)}
          >
            View Image
          </button>
        )}
        <button
          className="message-button delete-button"
          onClick={() => handleSoftDelete(msg._id)}
        >
          Delete
        </button>
      </div>
    </div>
  );
}
