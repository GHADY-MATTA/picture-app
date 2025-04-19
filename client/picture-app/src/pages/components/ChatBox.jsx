import React, { useEffect, useRef, useState } from 'react';

function ChatBox() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const socketRef = useRef(null);
  const messageListRef = useRef(null);

  // ⏺️ Connect to WebSocket
  useEffect(() => {
    const socket = new WebSocket(window.env.CHAT_URL);
    socketRef.current = socket;

    console.log('🛰️ Connecting to WebSocket server...');

    socket.onopen = () => {
      console.log(' WebSocket connected');
    };

    socket.onmessage = (event) => {
      const msg = event.data?.toString().trim();
      if (!msg) return;
      console.log('📥 Received:', msg);
      setMessages(prev => [...prev, msg]);
    };

    socket.onerror = (err) => {
      console.error('❌ WebSocket error:', err);
    };

    socket.onclose = () => {
      console.warn('🔌 WebSocket disconnected');
    };

    return () => {
      console.log(' Cleaning up socket');
      socket.close();
    };
  }, []);

  // 📨 Send message
  const sendMessage = () => {
    const trimmed = input.trim();
    if (!trimmed) return;

    if (socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(trimmed);
      console.log('📤 Sent:', trimmed);
      setMessages(prev => [...prev, `🧍 You: ${trimmed}`]);
      setInput('');
    } else {
      console.warn('Cannot send — socket not open');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') sendMessage();
  };

  // ⬇️ Auto scroll on new messages
  useEffect(() => {
    if (messageListRef.current) {
      messageListRef.current.scrollTo({
        top: messageListRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages]);

  return (
    <div className="p-4 w-full max-w-md mx-auto bg-white rounded-xl shadow-md border">
      <h2 className="text-xl font-semibold mb-2 text-center">🗨️ Group Chat</h2>

      <div
        ref={messageListRef}
        className="h-64 overflow-y-auto border p-2 mb-2 bg-gray-50 rounded text-sm"
      >
        {messages.length === 0 && (
          <div className="text-gray-400 text-center mt-20">No messages yet.</div>
        )}

        {messages.map((msg, idx) => (
          <div key={idx} className="mb-1 break-words">
            {msg}
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          className="flex-1 border px-2 py-1 rounded"
          placeholder="Type your message"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button
          onClick={sendMessage}
          className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default ChatBox;
