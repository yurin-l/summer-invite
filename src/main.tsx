import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';       // 경로 정확하게!
import './App.css';                // 스타일도 불러왔는지 확인

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
