import React, { useState } from 'react';
import Inbox from './Inbox.jsx';
import Sent from './Sent.jsx';
import Create from './Create.jsx';
import Bin from './Bin.jsx';
import './dashboard.css'; // import the css file

export default function Dashboard({ user }) {
  const [page, setPage] = useState('inbox');

  return (
    <div className="dashboard-container">
      <nav className="dashboard-nav">
        <button
          className={page === 'inbox' ? 'active' : ''}
          onClick={() => setPage('inbox')}
        >
          Inbox
        </button>
        <button
          className={page === 'sent' ? 'active' : ''}
          onClick={() => setPage('sent')}
        >
          Sent
        </button>
        <button
          className={page === 'create' ? 'active' : ''}
          onClick={() => setPage('create')}
        >
          Create Message
        </button>
        <button
          className={page === 'bin' ? 'active' : ''}
          onClick={() => setPage('bin')}
        >
          Bin
        </button>
      </nav>

      <main className="dashboard-content">
        {page === 'inbox' && <Inbox uid={user.uid} />}
        {page === 'sent' && <Sent uid={user.uid} />}
        {page === 'create' && <Create uid={user.uid} />}
        {page === 'bin' && <Bin uid={user.uid} />}
      </main>
    </div>
  );
}
