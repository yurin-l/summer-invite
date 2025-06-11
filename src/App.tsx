import React, { useState, useEffect } from 'react';
import './App.css';
import { db, storage } from './firebase';
import {
  collection,
  addDoc,
  onSnapshot,
  deleteDoc,
  updateDoc,
  doc,
  Timestamp,
  query,
  orderBy,
} from 'firebase/firestore';
import {
  ref,
  uploadBytes,
  getDownloadURL,
  listAll,
  deleteObject,
} from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';

interface Comment {
  id: string;
  name: string;
  text: string;
  likes: number;
  dislikes: number;
  timestamp: any;
}

const App: React.FC = () => {
  const attendees = ['유린👸🏻', '의정🐱', '소정🤩', '다은🐰', '규리🍺'];
  const [comments, setComments] = useState<Comment[]>([]);
  const [name, setName] = useState('');
  const [inputText, setInputText] = useState('');
  const [photos, setPhotos] = useState<string[]>([]);

  useEffect(() => {
    const q = query(collection(db, 'comments'), orderBy('timestamp', 'asc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        ...(doc.data() as Omit<Comment, 'id'>),
        id: doc.id,
      }));
      setComments(data);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchImages = async () => {
      const listRef = ref(storage, 'photos');
      const res = await listAll(listRef);
      const urls = await Promise.all(res.items.map((itemRef) => getDownloadURL(itemRef)));
      setPhotos(urls);
    };
    fetchImages();
  }, []);

  const handleAddComment = async () => {
    if (name.trim() === '' || inputText.trim() === '') return;
    await addDoc(collection(db, 'comments'), {
      name: name.trim(),
      text: inputText.trim(),
      likes: 0,
      dislikes: 0,
      timestamp: Timestamp.now(),
    });
    setName('');
    setInputText('');
  };

  const handleDelete = async (id: string) => {
    await deleteDoc(doc(db, 'comments', id));
  };

  const handleLike = async (id: string, current: number) => {
    await updateDoc(doc(db, 'comments', id), { likes: current + 1 });
  };

  const handleDislike = async (id: string, current: number) => {
    await updateDoc(doc(db, 'comments', id), { dislikes: current + 1 });
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const fileRef = ref(storage, `photos/${uuidv4()}`);
    await uploadBytes(fileRef, file);
    const url = await getDownloadURL(fileRef);
    setPhotos((prev) => [...prev, url]);
  };

  const handleDeleteImage = async (url: string) => {
    const decoded = decodeURIComponent(url);
    const filePath = decoded.split('/o/')[1].split('?')[0];
    const fileRef = ref(storage, filePath);
    await deleteObject(fileRef);
    setPhotos((prev) => prev.filter((u) => u !== url));
  };

  return (
    <div className="app">
      <div className="card">
        <h1 className="title">Promise<br />in June</h1>
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

      <div className="calendar-container">
        <p className="meeting-text">📅 모임 날짜<br />2025년 6월 22일 (일요일) 1PM</p>
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

      <div className="photo-section">
        <h2 className="section-title">📸 우리 사진</h2>
        <input type="file" accept="image/*" onChange={handleUpload} />
        <div className="photo-grid">
          {photos.map((url) => (
            <div key={url} className="photo-item">
              <img src={url} alt="uploaded" />
              <button onClick={() => handleDeleteImage(url)}>삭제</button>
              <a href={url} download target="_blank" rel="noopener noreferrer">다운로드</a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default App;
