import React from 'react';
import axios from 'axios';

const emojis = ['❤️', '😮', '😂', '😢', '👍', '👎'];

export default function ReactionInbox({ messageId, reactions = {}, currentUserUid, refresh }) {
  const handleReact = async (emoji) => {
    try {
      await axios.post(`http://localhost:5000/api/messages/${messageId}/react`, {
        emoji,
        userId: currentUserUid,
      });
      refresh(); 
    } catch (err) {
      console.error("Reaction failed", err);
    }
  };

  return (
    <div style={styles.container}>
      {emojis.map((emoji) => {
        const isReacted = reactions[emoji]?.includes(currentUserUid);
        const count = reactions[emoji]?.length || 0;

        return (
          <button
            key={emoji}
            onClick={() => handleReact(emoji)}
            title={`${emoji} - ${count} reaction${count !== 1 ? 's' : ''}`}
            style={{
              ...styles.button,
              backgroundColor: isReacted ? '#d1e7dd' : '#f0f0f0',
              fontWeight: isReacted ? 'bold' : 'normal',
              borderColor: isReacted ? '#0f5132' : '#ccc',
            }}
          >
            {emoji} {count}
          </button>
        );
      })}
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    gap: '12px',
    flexWrap: 'wrap',
    marginTop: '10px',
    justifyContent: 'flex-start',
  },
  button: {
    padding: '6px 12px',
    fontSize: '16px',
    borderRadius: '8px',
    border: '1px solid #ccc',
    cursor: 'pointer',
    transition: 'all 0.2s ease-in-out',
  },
};
