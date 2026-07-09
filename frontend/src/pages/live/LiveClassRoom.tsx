import { useQuery, useMutation } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { liveApi } from '../../services/api';
import { io, Socket } from 'socket.io-client';
import { Video, Mic, MicOff, Camera, CameraOff, MessageSquare, Hand, Users } from 'lucide-react';
import toast from 'react-hot-toast';

const LiveClassRoom = () => {
  const { id } = useParams();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { data } = useQuery({
    queryKey: ['live-class', id],
    queryFn: () => liveApi.getClassById(id!),
    enabled: !!id,
  });

  const joinMutation = useMutation({ mutationFn: () => liveApi.joinClass(id!) });
  const leaveMutation = useMutation({ mutationFn: () => liveApi.leaveClass(id!) });
  const handMutation = useMutation({ mutationFn: (q?: string) => liveApi.raiseHand(id!, q) });

  useEffect(() => {
    const token = localStorage.getItem('edu_access_token');
    const newSocket = io('/', { auth: { token } });
    setSocket(newSocket);

    newSocket.emit('join:class', id);

    newSocket.on('chat:message', (msg: any) => {
      setMessages((prev) => [...prev, msg]);
    });

    joinMutation.mutate();

    return () => {
      leaveMutation.mutate();
      newSocket.emit('leave:class', id);
      newSocket.disconnect();
    };
  }, [id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = () => {
    if (!newMessage.trim()) return;
    socket?.emit('chat:message', { classId: id, content: newMessage });
    setMessages((prev) => [...prev, { content: newMessage, senderId: 'me', timestamp: new Date() }]);
    setNewMessage('');
  };

  const raiseHand = () => {
    handMutation.mutate(undefined);
    toast.success('✅ تم رفع اليد');
  };

  const liveClass = data?.data?.liveClass;

  return (
    <div className="h-[calc(100vh-8rem)] flex gap-4 animate-fade-in">
      {/* Main Video */}
      <div className="flex-1 flex flex-col">
        <div className="flex-1 bg-gray-900 rounded-2xl flex items-center justify-center relative">
          <div className="text-center text-white">
            <Video className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <h2 className="text-xl font-bold">{liveClass?.title}</h2>
            <p className="text-gray-400">الدورة قيد التقدم</p>
          </div>

          {/* Controls */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-3">
            <button onClick={() => setIsMuted(!isMuted)} className="p-3 rounded-full bg-white/20 hover:bg-white/30 text-white transition">
              {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </button>
            <button onClick={() => setIsVideoOn(!isVideoOn)} className="p-3 rounded-full bg-white/20 hover:bg-white/30 text-white transition">
              {isVideoOn ? <Camera className="w-5 h-5" /> : <CameraOff className="w-5 h-5" />}
            </button>
            <button onClick={raiseHand} className="p-3 rounded-full bg-yellow-500/80 hover:bg-yellow-500 text-white transition">
              <Hand className="w-5 h-5" />
            </button>
            <button className="p-3 rounded-full bg-red-500/80 hover:bg-red-500 text-white transition" onClick={() => window.history.back()}>
              إنهاء
            </button>
          </div>
        </div>
      </div>

      {/* Chat */}
      <div className="w-80 bg-white dark:bg-gray-800 rounded-2xl flex flex-col">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            <span className="font-bold">المحادثة</span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.senderId === 'me' ? 'justify-start' : 'justify-end'}`}>
              <div className={`max-w-[80%] p-3 rounded-xl ${msg.senderId === 'me' ? 'bg-primary-50 dark:bg-primary-900/20' : 'bg-gray-100 dark:bg-gray-700'}`}>
                <p className="text-sm">{msg.content}</p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex gap-2">
            <input value={newMessage} onChange={(e) => setNewMessage(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
              className="input-field flex-1" placeholder="اكتب رسالة..." />
            <button onClick={sendMessage} className="btn-primary">إرسال</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveClassRoom;
