import React, { useState } from 'react';
import './App.css';

const App: React.FC = () => {
  const attendees = ['유린', '의정 ', '소정', '다은', '규리'];
  };

return (
  <div className="app">
    <div className="card">
      <h1 className="title">Promise<br />in June</h1>
      <div className="info">🗓 2025년 6월 22일 (일요일) 오후 1시</div>
      <div className="info">📍 더기와 합정점</div>
    </div>
  <div className="attendee-section">
      <h2 className="section-title">👥 함께하는 친구들</h2>
      <ul className="attendee-list">
        {attendees.map((name, index) => (
          <li
            key={name}
            className="fade-item"
            style={{ animationDelay: `${index * 0.2}s` }}
          >
            {name}
          </li>
        ))}
      </ul>
    </div>
  </div>
);
};


export default App;
