import React, { useState, useEffect } from 'react';
import './App.css';

type Comment = {
  id: number;
  name: string;
  text: string;
  likes: number;
  dislikes: number;
};

const App: React.FC = () => {
  const attendees = ['유린', '의정', '소정', '다은', '규리'];
  const [comments, setComments] = useState<Comment[]>([]);
  const [name, setName] = useState('');
  const [inputText, setInputText] = useState('');

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('comments');
    if (saved) {
      try {
        const parsed: Comment[] = JSON.parse(saved);
        setComments(parsed);
      } catch (e) {
        console.error('로컬스토리지 파싱 실패:', e);
      }
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('comments', JSON.stringify(comments));
  }, [comments]);

  // Debug log
  useEffect(() => {
    console.log('저장된 comments:', comments);
  }, [comments]);

  const handleAddComment = () => {
    if (name.trim() === '' || inputText.trim() === '') return;

    const newComment: Comment = {
      id: Date.now(),
      name: name.trim(),
      text: inputText.trim(),
      likes: 0,
      dislikes: 0,
    };

    setComments(prev => [...prev, newComment]);
    setName('');
    setInputText('');
  };

  const handleDelete = (id: number) => {
    setComments(prev => prev.filter(comment => comment.id !== id));
  };

  const handleLike = (id: number) => {
    setComments(prev =>
      prev.map(comment =>
        comment.id === id ? { ...comment, likes: comment.likes + 1 } : comment
      )
    );
  };

  const handleDislike = (id: number) => {
    setComments(prev =>
      prev.map(comment =>
        comment.id === id ? { ...comment, dislikes: comment.dislikes + 1 } : comment
      )
    );
  };

  return (
    <div className="app">
      {/* 카드 */}
      <div className="card">
        <h1 className="title">Promise<br />in June</h1>
      </div>

      {/* 참석자 */}
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

      {/* 캘린더 */}
      <div className="calendar-container">
        <p className="meeting-text">📅 모임 날짜: 2025년 6월 22일 (일요일) 1PM</p>
        <div className="calendar">
          <div className="calendar-header">
            <span>일</span><span>월</span><span>화</span><span>수</span><span>목</span><span>금</span><span>토</span>
          </div>
          <div className="calendar-grid">
            {Array.from({ length: 30 }).map((_, i) => {
              const day = i + 1;
              const isTarget = day === 22;
              return (
                <div key={day} className={`day ${isTarget ? 'highlight' : ''}`}>
                  {day}
                  {isTarget && <div className="time-label">오후 1시</div>}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 메뉴판 */}
      <div className="menu-section">
        <div className="info">📍 점심 장소: 더기와 합정점</div>
        <h2 className="section-title">🍽 대표 메뉴</h2>
        <ul className="menu-list">
          <li><strong>⭐보성 토종벌꿀 옥수수전</strong> — 달콤+바삭한 꿀조합 (21,000원)</li>
          <li><strong>5색 나물 비빔밥</strong> — 제철 나물과 직접 만든 양념장 (32,000원)</li>
          <li><strong>매화 칼비빔면</strong> — 쫄깃한 면과 고명 감성 비빔면 (12,000원)</li>
          <li><strong>⭐아보콩국수</strong> — 진한 콩국 + 아보카도 반숙 (12,000원)</li>
          <li><strong>⭐말차 막걸리</strong> — 진한 말차 향의 막걸리 (19,000원)</li>
        </ul>
        <a href="https://naver.me/G38n7AzN" target="_blank" className="link-button">🔗 가게 정보 보러가기</a>
      </div>

       {/* 의견 남기기 섹션 */}
      <div className="comment-section">
        <h2>🍧 밥먹고 뭐할까?</h2>

        <div className="comment-input-row">
          <input
            type="text"
            placeholder="이름"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="input-name"
          />
          <input
            type="text"
            placeholder="아이디어"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="input-text"
          />
          <button onClick={handleAddComment} className="add-button">추가</button>
        </div>

        <ul className="comment-list">
          {comments.map((c) => (
            <li key={c.id} className="comment-item">
              <div className="comment-left">
                <strong>{c.name}</strong>: {c.text}
              </div>
              <div className="comment-right">
                <button onClick={() => handleLike(c.id)}>👍 {c.likes}</button>
                <button onClick={() => handleDislike(c.id)}>👎 {c.dislikes}</button>
                <button onClick={() => handleDelete(c.id)}>❌</button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default App;
