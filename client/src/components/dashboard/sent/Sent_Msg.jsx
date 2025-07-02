import ReactionSent from "../reactions/Reaction_Sent";
import "./sent_msg.css";

export default function Sent_Msg({
  now,
  msg,
  handleDelete,
  handleEdit,
  setEditingId,
  setEditedContent,
  setViewingImageUrl,
  editingId,
  editedContent,
  handleSaveEdit,
}) {
  const isFuture = new Date(msg.openTime) > now;
  const isEditing = editingId === msg._id;

  return (
    <div
      className={`sent-card ${msg.isOpened ? "opened" : "not-opened"}`}
      key={msg._id}
    >
      <p>
        <strong>To:</strong> {msg.recipientEmail}
      </p>
      {isEditing ? (
        <textarea
          value={editedContent}
          onChange={(e) => setEditedContent(e.target.value)}
          rows={4}
        />
      ) : (
        <p>
          <strong>Message:</strong> {msg.content}
        </p>
      )}
      <small>
        <strong>Will open at:</strong> {new Date(msg.openTime).toLocaleString()}
      </small>
      <br />
      <small
        className={`status ${msg.isOpened ? "opened-text" : "not-opened-text"}`}
      >
        Status: {msg.isOpened ? "Opened" : "Not Opened"}
      </small>
      <ReactionSent reactions={msg.reactions} />
      <br />
      {msg.imageUrl && (
        <button
          className="btn view-image"
          onClick={() => setViewingImageUrl(msg.imageUrl)}
        >
          View Image
        </button>
      )}

      <br />
      {isFuture && (
        <>
          {isEditing ? (
            <>
              <button
                className="btn save"
                onClick={() => handleSaveEdit(msg._id)}
              >
                Save
              </button>
              <button className="btn cancel" onClick={() => setEditingId(null)}>
                Cancel
              </button>
            </>
          ) : (
            <button
              className="btn edit"
              onClick={() => handleEdit(msg._id, msg.content)}
            >
              Edit
            </button>
          )}
          <button className="btn delete" onClick={() => handleDelete(msg._id)}>
            Delete
          </button>
        </>
      )}
    </div>
  );
}
