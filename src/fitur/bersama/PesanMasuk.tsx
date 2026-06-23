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

// Temporary local state tetap dipertahankan utuh
let mockMessages: Message[] = [
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
        mockMessages = newMessages;
        setMessages(newMessages);
        setMessageInput('');
        setSubjectInput('');
    };

    return (
        /* Container Utama - Border Flat Tanpa Shadow dan Tanpa Rounded Corner */
        <div className="flex bg-white h-[calc(100vh-3.5rem)] max-w-5xl mx-auto w-full overflow-hidden border border-slate-200">
            
            {/* Sidebar Contacts - Bersih & Rapat */}
            <div className="w-1/3 min-w-[220px] max-w-[300px] border-r border-slate-200 flex flex-col bg-white">
                <div className="p-2 border-b border-slate-200">
                    <h2 className="text-xs font-bold text-slate-900 mb-1.5 px-1 tracking-tight">Pesan Personal</h2>
                    <div className="relative">
                        <Search className="w-3.5 h-3.5 absolute left-2 top-2 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Cari guru atau siswa..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-6 pr-2 py-1 bg-white border border-slate-300 text-xs focus:outline-none focus:border-slate-600"
                        />
                    </div>
                </div>
                
                <div className="flex-1 overflow-y-auto w-full divide-y divide-slate-100">
                    {filteredUsers.length === 0 ? (
                        <p className="text-center text-slate-400 mt-4 text-[11px]">Tidak ditemukan.</p>
                    ) : (
                        filteredUsers.map(u => (
                            <button
                                key={u.id}
                                onClick={() => setActiveChatId(u.id)}
                                className={`w-full text-left p-2.5 flex items-center gap-2 transition-colors border-l-2 ${activeChatId === u.id ? 'bg-slate-50 border-l-slate-800' : 'hover:bg-slate-50/50 bg-white border-l-transparent'}`}
                            >
                                <div className="w-6 h-6 bg-slate-100 text-slate-800 font-bold flex items-center justify-center flex-shrink-0 text-[10px] border border-slate-200">
                                    {u.name.charAt(0).toUpperCase()}
                                </div>
                                <div className="overflow-hidden flex-1">
                                    <p className="text-xs font-bold text-slate-900 truncate leading-tight">{u.name}</p>
                                    <p className="text-[10px] text-slate-400 leading-none mt-0.5">{u.role}</p>
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
                        {/* Chat Header */}
                        <div className="px-3 py-2 border-b border-slate-200 bg-white flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="w-7 h-7 bg-slate-100 flex items-center justify-center flex-shrink-0 text-slate-800 font-bold text-xs border border-slate-200">
                                    {activeContact.name.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <h3 className="text-xs font-bold text-slate-900 leading-tight">{activeContact.name}</h3>
                                    <p className="text-[10px] text-slate-400 leading-none mt-0.5">{activeContact.role}</p>
                                </div>
                            </div>
                        </div>

                        {/* Chat Messages Area - Aliran Flat Polos */}
                        <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-white">
                            {activeMessages.length === 0 ? (
                                <div className="h-full flex items-center justify-center">
                                    <p className="text-slate-400 text-[11px] border border-slate-200 px-3 py-1 bg-white">
                                        Belum ada pesan. Mulai percakapan sekarang.
                                    </p>
                                </div>
                            ) : (
                                activeMessages.map(msg => {
                                    const isMine = msg.senderId === user?.id;
                                    return (
                                        <div key={msg.id} className={`flex flex-col ${isMine ? 'items-end' : 'items-start'}`}>
                                            <div className={`max-w-[80%] px-3 py-1.5 border ${isMine ? 'bg-slate-50 border-slate-300 text-slate-900' : 'bg-white border-slate-200 text-slate-800'}`}>
                                                {msg.subject !== 'Pesan Baru' && (
                                                    <div className="text-[10px] font-bold mb-0.5 uppercase tracking-wide text-slate-400">
                                                        {msg.subject}
                                                    </div>
                                                )}
                                                <div className="text-xs leading-relaxed whitespace-pre-wrap">{msg.content}</div>
                                            </div>
                                            <span className="text-[9px] font-mono text-slate-400 mt-0.5 px-0.5">
                                                {new Date(msg.timestamp).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                    );
                                })
                            )}
                        </div>

                        {/* Chat Input Footer - Rapat Tanpa Ornamen */}
                        <div className="p-2 bg-white border-t border-slate-200">
                            <form onSubmit={handleSendMessage} className="flex flex-col gap-1.5">
                                <input
                                    type="text"
                                    placeholder="Subjek (Opsional)"
                                    value={subjectInput}
                                    onChange={e => setSubjectInput(e.target.value)}
                                    className="w-full px-2 py-1 text-xs border border-slate-200 focus:outline-none focus:border-slate-500 bg-white"
                                />
                                <div className="flex items-center gap-1.5">
                                    <input
                                        type="text"
                                        required
                                        placeholder="Tulis pesan..."
                                        value={messageInput}
                                        onChange={e => setMessageInput(e.target.value)}
                                        className="flex-1 px-2.5 py-1.5 text-xs border border-slate-300 focus:outline-none focus:border-slate-500"
                                    />
                                    <button
                                        type="submit"
                                        className="border border-slate-300 hover:border-slate-900 text-slate-800 p-1.5 transition-colors flex items-center justify-center shrink-0 bg-white"
                                    >
                                        <Send className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            </form>
                        </div>
                    </>
                ) : (
                    /* Default State (No Contact Selected) */
                    <div className="flex-1 flex flex-col items-center justify-center text-slate-400 bg-white">
                        <User className="w-8 h-8 text-slate-300 mb-1" />
                        <p className="text-xs font-bold text-slate-700 uppercase tracking-wider">Pilih Kontak</p>
                        <p className="text-[11px] text-slate-400 mt-0.5 text-center px-4">Pilih guru atau murid di daftar untuk mulai mengirim pesan.</p>
                    </div>
                )}
            </div>
        </div>
    );
}