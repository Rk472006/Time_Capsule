import React, { useState } from 'react';

export default function ReactionSent({ reactions = {} }) {
  const [hoveredEmoji, setHoveredEmoji] = useState(null);

  return (
    <div style={{ display: 'flex', gap: '10px', position: 'relative' }}>
      {Object.entries(reactions).map(([emoji, users]) =>
        users.length > 0 ? (
          <div
            key={emoji}
            onMouseEnter={() => setHoveredEmoji(emoji)}
            onMouseLeave={() => setHoveredEmoji(null)}
            style={{
              background: '#f8f9fa',
              borderRadius: '10px',
              padding: '5px 10px',
              position: 'relative',
              cursor: 'default',
            }}
          >
            {emoji} {users.length}
            {hoveredEmoji === emoji && (
              <div
                style={{
                  position: 'absolute',
                  top: '-60px',
                  background: '#fff',
                  boxShadow: '0 0 8px rgba(0,0,0,0.2)',
                  borderRadius: '8px',
                  padding: '8px',
                  whiteSpace: 'pre-wrap',
                  zIndex: 10
                }}
              >
                {users.join('\n')}
              </div>
            )}
          </div>
        ) : null
      )}
    </div>
  );
}
