import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Send, 
  Plus, 
  Hash, 
  Users, 
  Image as ImageIcon, 
  Video, 
  MoreVertical, 
  Search,
  ArrowLeft,
  Copy,
  Check,
  ShieldCheck,
  Sparkles
} from 'lucide-react';
import { io, Socket } from 'socket.io-client';
import { ChatMessage, ChatRoom } from '../types';
import { v4 as uuidv4 } from 'uuid';

export const ChatTea: React.FC = () => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [roomCode, setRoomCode] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isJoining, setIsJoining] = useState(false);
  const [joinCode, setJoinCode] = useState('');
  const [activeRoom, setActiveRoom] = useState<ChatRoom | null>(null);
  const [copied, setCopied] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const newSocket = io(window.location.origin);
    setSocket(newSocket);

    newSocket.on('receive-message', (message: ChatMessage) => {
      setMessages((prev) => [...prev, message]);
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const generateRoom = async () => {
    const code = Math.floor(10000000 + Math.random() * 90000000).toString();
    const newRoom: ChatRoom = {
      id: uuidv4(),
      code,
      name: `Classroom ${code.slice(-4)}`,
      max_participants: 24
    };

    try {
      const res = await fetch('/api/rooms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newRoom)
      });
      if (res.ok) {
        setRoomCode(code);
        setActiveRoom(newRoom);
        socket?.emit('join-room', code);
      }
    } catch (err) {
      console.error('Failed to create room:', err);
    }
  };

  const joinRoom = async () => {
    if (!joinCode) return;
    try {
      const res = await fetch(`/api/rooms/${joinCode}`);
      const room = await res.json();
      if (room) {
        setRoomCode(joinCode);
        setActiveRoom(room);
        socket?.emit('join-room', joinCode);
        setIsJoining(false);
      } else {
        alert('Invalid Room Code');
      }
    } catch (err) {
      console.error('Failed to join room:', err);
    }
  };

  const sendMessage = () => {
    if (!input.trim() || !roomCode) return;
    const message: ChatMessage = {
      roomCode,
      sender: 'You', // In a real app, this would be the user's name
      content: input,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type: 'text'
    };
    socket?.emit('send-message', message);
    setInput('');
  };

  const copyCode = () => {
    if (roomCode) {
      navigator.clipboard.writeText(roomCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!roomCode) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-brand-indigo">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card p-12 max-w-lg w-full text-center space-y-8"
        >
          <div className="space-y-4">
            <div className="w-20 h-20 bg-gradient-to-br from-electric-blue to-violet-glow rounded-3xl flex items-center justify-center mx-auto shadow-xl shadow-violet-glow/20">
              <Sparkles size={40} className="text-white" />
            </div>
            <h2 className="text-4xl font-display text-white">ChatTea</h2>
            <p className="text-white/40 font-medium">Classroom-style real-time communication platform.</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={generateRoom}
              className="btn-primary flex-col py-8 h-auto gap-4"
            >
              <Plus size={32} />
              <div className="text-center">
                <p className="font-bold">Generate</p>
                <p className="text-[10px] opacity-60 uppercase">New Private Room</p>
              </div>
            </button>
            <button
              onClick={() => setIsJoining(true)}
              className="btn-secondary flex-col py-8 h-auto gap-4"
            >
              <Users size={32} />
              <div className="text-center">
                <p className="font-bold">Join Room</p>
                <p className="text-[10px] opacity-60 uppercase">Enter 8-Digit Code</p>
              </div>
            </button>
          </div>

          <AnimatePresence>
            {isJoining && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-4 pt-4 border-t border-white/5"
              >
                <input
                  type="text"
                  placeholder="Enter 8-digit code"
                  value={joinCode}
                  onChange={(e) => setJoinCode(e.target.value)}
                  className="input-field text-center text-2xl tracking-[0.5em] font-mono"
                  maxLength={8}
                />
                <div className="flex gap-3">
                  <button onClick={() => setIsJoining(false)} className="btn-secondary flex-1">Cancel</button>
                  <button onClick={joinRoom} className="btn-primary flex-1">Join Now</button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-brand-indigo">
      {/* Sidebar */}
      <div className="w-80 border-r border-white/5 flex flex-col bg-black/20 backdrop-blur-md">
        <div className="p-6 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-violet-glow rounded-lg flex items-center justify-center">
              <Sparkles size={16} className="text-white" />
            </div>
            <span className="font-display font-bold text-white">ChatTea</span>
          </div>
          <button onClick={() => setRoomCode(null)} className="text-white/40 hover:text-white transition-colors">
            <ArrowLeft size={20} />
          </button>
        </div>

        <div className="p-6 space-y-6 flex-1 overflow-y-auto">
          <div className="space-y-2">
            <p className="label-mono">Active Room</p>
            <div className="p-4 bg-white/5 rounded-2xl border border-white/10 space-y-3">
              <div className="flex justify-between items-start">
                <h3 className="font-bold text-white">{activeRoom?.name}</h3>
                <ShieldCheck size={16} className="text-emerald-400" />
              </div>
              <div className="flex items-center justify-between bg-black/40 p-2 rounded-xl border border-white/5">
                <span className="font-mono text-sm text-white/60 tracking-wider">{roomCode}</span>
                <button onClick={copyCode} className="text-violet-glow hover:text-white transition-colors">
                  {copied ? <Check size={16} /> : <Copy size={16} />}
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <p className="label-mono">Participants (1/24)</p>
            <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/5">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-electric-blue to-violet-glow flex items-center justify-center text-white font-bold">Y</div>
              <div className="flex-1">
                <p className="text-sm font-bold text-white">You</p>
                <p className="text-[10px] text-emerald-400 uppercase font-bold">Online</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Chat */}
      <div className="flex-1 flex flex-col relative">
        {/* Header */}
        <div className="h-20 border-b border-white/5 flex items-center justify-between px-8 bg-black/20 backdrop-blur-md z-10">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/40">
              <Hash size={20} />
            </div>
            <div>
              <h3 className="font-bold text-white">General Discussion</h3>
              <p className="text-xs text-white/40">Real-time classroom network</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 text-white/40 hover:text-white transition-colors"><Search size={20} /></button>
            <button className="p-2 text-white/40 hover:text-white transition-colors"><MoreVertical size={20} /></button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-8 space-y-6">
          {messages.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-20">
              <Sparkles size={64} />
              <p className="text-xl font-display">No messages yet. Start the conversation!</p>
            </div>
          )}
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex flex-col ${msg.sender === 'You' ? 'items-end' : 'items-start'}`}
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">{msg.sender}</span>
                <span className="text-[10px] text-white/20">{msg.timestamp}</span>
              </div>
              <div className={`max-w-md p-4 rounded-2xl ${
                msg.sender === 'You' 
                  ? 'bg-violet-glow text-white rounded-tr-none shadow-lg shadow-violet-glow/20' 
                  : 'bg-white/5 text-white/80 rounded-tl-none border border-white/10'
              }`}>
                <p className="text-sm leading-relaxed">{msg.content}</p>
              </div>
            </motion.div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-8 bg-gradient-to-t from-brand-indigo via-brand-indigo to-transparent">
          <div className="glass-card p-2 flex items-center gap-2">
            <div className="flex items-center gap-1 px-2">
              <button className="p-2 text-white/40 hover:text-white transition-colors"><Plus size={20} /></button>
              <button className="p-2 text-white/40 hover:text-white transition-colors"><ImageIcon size={20} /></button>
              <button className="p-2 text-white/40 hover:text-white transition-colors"><Video size={20} /></button>
            </div>
            <input
              type="text"
              placeholder="Type a message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              className="flex-1 bg-transparent border-none focus:ring-0 text-white placeholder:text-white/20 py-3"
            />
            <button
              onClick={sendMessage}
              className="w-12 h-12 rounded-xl bg-violet-glow flex items-center justify-center text-white shadow-lg shadow-violet-glow/20 hover:shadow-violet-glow/40 transition-all"
            >
              <Send size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
