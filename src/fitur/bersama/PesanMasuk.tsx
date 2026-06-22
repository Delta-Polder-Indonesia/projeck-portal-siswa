import { useState, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getStudents, getTeachers } from '../../data/store';
import { Search, Send, User } from 'lucide-react';

interface Message {
    id: string;
    senderId: string;
    receiverId: string;
    subject: string;
    content: string;
    timestamp: number;
}

// Temporary local state for messaging since it's not yet in the data store
let mockMessages: Message[] = [
    // Example dummy message
    {
        id: 'msg_1',
        senderId: 't1',
        receiverId: 's1',
        subject: 'Selamat Datang',
        content: 'Selamat datang di portal siswa. Jangan lupa cek tugas terbaru.',
        timestamp: Date.now() - 3600000,
    }
];

export default function PesanMasuk() {
    const { user } = useAuth();

    const [activeChatId, setActiveChatId] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [messageInput, setMessageInput] = useState('');
    const [subjectInput, setSubjectInput] = useState('');

    const [messages, setMessages] = useState<Message[]>(mockMessages);

    const allUsers = useMemo(() => {
        const students = getStudents().map(s => ({ ...s, role: 'Siswa' }));
        const teachers = getTeachers().map(t => ({ ...t, role: 'Guru' }));
        return [...teachers, ...students].filter(u => u.id !== user?.id);
    }, [user]);

    const filteredUsers = useMemo(() => {
        return allUsers.filter(u =>
            u.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [allUsers, searchTerm]);

    const activeContact = allUsers.find(u => u.id === activeChatId);

    const activeMessages = useMemo(() => {
        if (!activeChatId || !user) return [];
        return messages
            .filter(m =>
                (m.senderId === user.id && m.receiverId === activeChatId) ||
                (m.senderId === activeChatId && m.receiverId === user.id)
            )
            .sort((a, b) => a.timestamp - b.timestamp);
    }, [messages, activeChatId, user]);

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (!user || !activeChatId || !messageInput.trim()) return;

        const newMsg: Message = {
            id: `msg_${Date.now()}`,
            senderId: user.id,
            receiverId: activeChatId,
            subject: subjectInput || 'Pesan Baru',
            content: messageInput,
            timestamp: Date.now(),
        };

        const newMessages = [...messages, newMsg];
        mockMessages = newMessages; // update the simple mock variable
        setMessages(newMessages);
        setMessageInput('');
    }

    return (
        <div className="flex bg-white rounded-xl shadow-sm border border-slate-200 h-[calc(100vh-140px)] overflow-hidden">
            {/* Sidebar Contacts */}
            <div className="w-1/3 min-w-[250px] border-r border-slate-200 flex flex-col bg-slate-50">
                <div className="p-4 border-b border-slate-200">
                    <h2 className="text-lg font-bold text-slate-800 mb-3">Pesan Pesonal</h2>
                    <div className="relative">
                        <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Cari guru atau siswa..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                        />
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto w-full">
                    {filteredUsers.length === 0 ? (
                        <p className="text-center text-slate-400 mt-6 text-sm">Tidak ditemukan.</p>
                    ) : (
                        filteredUsers.map(u => (
                            <button
                                key={u.id}
                                onClick={() => setActiveChatId(u.id)}
                                className={`w-full text-left p-4 border-b border-slate-100 flex items-center gap-3 transition-colors ${activeChatId === u.id ? 'bg-sky-50 border-sky-100' : 'hover:bg-slate-100/50 bg-white'}`}
                            >
                                <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center flex-shrink-0 text-slate-600 font-bold border border-slate-300">
                                    {u.name.charAt(0).toUpperCase()}
                                </div>
                                <div className="overflow-hidden flex-1">
                                    <p className="text-sm font-bold text-slate-800 truncate">{u.name}</p>
                                    <p className="text-xs text-slate-500">{u.role}</p>
                                </div>
                            </button>
                        ))
                    )}
                </div>
            </div>

            {/* Main Mail Area */}
            <div className="flex-1 flex flex-col bg-white">
                {activeChatId && activeContact ? (
                    <>
                        <div className="p-4 border-b border-slate-200 bg-white flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-sky-100 flex items-center justify-center flex-shrink-0 text-sky-700 font-bold">
                                    {activeContact.name.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <h3 className="text-md font-bold text-slate-900">{activeContact.name}</h3>
                                    <p className="text-xs text-slate-500">{activeContact.role}</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50">
                            {activeMessages.length === 0 ? (
                                <div className="h-full flex items-center justify-center">
                                    <p className="text-slate-400 text-sm bg-white px-4 py-2 border border-slate-200 rounded-full shadow-sm">Belum ada pesan. Mulai percakapan sekarang.</p>
                                </div>
                            ) : (
                                activeMessages.map(msg => {
                                    const isMine = msg.senderId === user?.id;
                                    return (
                                        <div key={msg.id} className={`flex flex-col ${isMine ? 'items-end' : 'items-start'}`}>
                                            <div className={`max-w-[70%] p-3 rounded-2xl ${isMine ? 'bg-sky-600 text-white rounded-br-sm' : 'bg-white border border-slate-200 text-slate-700 rounded-bl-sm shadow-sm'}`}>
                                                {msg.subject !== 'Pesan Baru' && (
                                                    <div className={`text-xs font-bold mb-1 ${isMine ? 'text-sky-200' : 'text-slate-500'}`}>{msg.subject}</div>
                                                )}
                                                <div className="text-sm">{msg.content}</div>
                                            </div>
                                            <span className="text-[10px] text-slate-400 mt-1 mx-1">
                                                {new Date(msg.timestamp).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                    );
                                })
                            )}
                        </div>

                        <div className="p-4 bg-white border-t border-slate-200">
                            <form onSubmit={handleSendMessage} className="flex flex-col gap-2">
                                <input
                                    type="text"
                                    placeholder="Subjek (Opsional)"
                                    value={subjectInput}
                                    onChange={e => setSubjectInput(e.target.value)}
                                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-sky-500 bg-slate-50"
                                />
                                <div className="flex items-center gap-2">
                                    <input
                                        type="text"
                                        required
                                        placeholder="Tulis pesan..."
                                        value={messageInput}
                                        onChange={e => setMessageInput(e.target.value)}
                                        className="flex-1 px-4 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                                    />
                                    <button
                                        type="submit"
                                        className="bg-sky-600 hover:bg-sky-700 text-white p-2.5 rounded-lg transition-colors flex items-center justify-center shrink-0 shadow-sm"
                                    >
                                        <Send className="w-5 h-5 ml-1" />
                                    </button>
                                </div>
                            </form>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-slate-400 bg-slate-50/50">
                        <User className="w-16 h-16 text-slate-200 mb-4" />
                        <p className="text-lg font-medium text-slate-500">Pilih Kontak</p>
                        <p className="text-sm mt-1">Pilih guru atau murid di daftar untuk mulai mengirim pesan.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
