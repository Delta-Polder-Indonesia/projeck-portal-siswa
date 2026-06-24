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
    const [roleFilter, setRoleFilter] = useState<'all' | 'guru' | 'siswa'>('all'); // State filter tab
    const [messageInput, setMessageInput] = useState('');
    const [subjectInput, setSubjectInput] = useState('');

    const [messages, setMessages] = useState<Message[]>(mockMessages);

    const allUsers = useMemo(() => {
        const students = getStudents().map(s => ({ ...s, role: 'Siswa' }));
        const teachers = getTeachers().map(t => ({ ...t, role: 'Guru' }));
        return [...teachers, ...students].filter(u => u.id !== user?.id);
    }, [user]);

    const filteredUsers = useMemo(() => {
        return allUsers.filter(u => {
            const matchesSearch = u.name.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesRole = roleFilter === 'all' || u.role.toLowerCase() === roleFilter;
            return matchesSearch && matchesRole;
        });
    }, [allUsers, searchTerm, roleFilter]);

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
        /* Container Utama - Full height flush w-full without borders creating gaps */
        <div className="flex bg-white w-full h-[calc(100vh-3.5rem)] overflow-hidden">

            {/* Sidebar Contacts - Bersih & Rapat */}
            <div className="w-1/3 min-w-[280px] max-w-[340px] border-r border-slate-200 flex flex-col bg-slate-50/50">
                <div className="p-4 border-b border-slate-200 bg-white space-y-3">
                    <h2 className="text-lg font-bold text-slate-900 tracking-tight">Pesan Personal</h2>
                    
                    {/* Input Pencarian */}
                    <div className="relative">
                        <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Cari nama..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-9 pr-3 py-1.5 bg-white border border-slate-300 rounded-md text-sm focus:outline-none focus:border-slate-600 focus:ring-1 focus:ring-slate-600 transition-shadow"
                        />
                    </div>

                    {/* Simple Tab Filter: Semua | Guru | Siswa */}
                    <div className="flex items-center gap-1.5 text-xs font-mono text-slate-400">
                        <button
                            type="button"
                            onClick={() => setRoleFilter('all')}
                            className={`hover:text-slate-900 transition-colors cursor-pointer ${roleFilter === 'all' ? 'text-slate-900 font-bold underline underline-offset-4' : ''}`}
                        >
                            SEMUA
                        </button>
                        <span>|</span>
                        <button
                            type="button"
                            onClick={() => setRoleFilter('guru')}
                            className={`hover:text-slate-900 transition-colors cursor-pointer ${roleFilter === 'guru' ? 'text-slate-900 font-bold underline underline-offset-4' : ''}`}
                        >
                            GURU
                        </button>
                        <span>|</span>
                        <button
                            type="button"
                            onClick={() => setRoleFilter('siswa')}
                            className={`hover:text-slate-900 transition-colors cursor-pointer ${roleFilter === 'siswa' ? 'text-slate-900 font-bold underline underline-offset-4' : ''}`}
                        >
                            SISWA
                        </button>
                    </div>
                </div>

                {/* Manifes Daftar Kontak */}
                <div className="flex-1 overflow-y-auto w-full divide-y divide-slate-100/50 bg-white">
                    {filteredUsers.length === 0 ? (
                        <div className="text-center py-8 px-4 font-mono">
                            <p className="text-xs text-slate-400 uppercase tracking-wider">EMPTY_RESULT</p>
                        </div>
                    ) : (
                        filteredUsers.map(u => (
                            <button
                                key={u.id}
                                onClick={() => setActiveChatId(u.id)}
                                className={`w-full text-left p-4 flex items-center gap-3 transition-colors border-l-4 ${activeChatId === u.id
                                        ? 'bg-slate-50 border-slate-800'
                                        : 'hover:bg-slate-50 bg-white border-transparent'
                                    }`}
                            >
                                <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-800 font-bold flex items-center justify-center flex-shrink-0 text-base border border-slate-200">
                                    {u.name.charAt(0).toUpperCase()}
                                </div>
                                <div className="overflow-hidden flex-1">
                                    <p className="text-sm font-semibold text-slate-900 truncate">{u.name}</p>
                                    <p className="text-xs text-slate-500 mt-0.5">{u.role}</p>
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
                        <div className="px-6 py-4 border-b border-slate-200 bg-white flex items-center justify-between shadow-sm z-10">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0 text-slate-800 font-bold text-lg border border-slate-200">
                                    {activeContact.name.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <h3 className="text-base font-bold text-slate-900 leading-tight">{activeContact.name}</h3>
                                    <p className="text-xs text-slate-500 mt-0.5">{activeContact.role}</p>
                                </div>
                            </div>
                        </div>

                        {/* Chat Messages Area */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/50">
                            {activeMessages.length === 0 ? (
                                <div className="h-full flex items-center justify-center">
                                    <p className="text-slate-500 text-sm border border-slate-200 px-4 py-2 rounded bg-white shadow-sm">
                                        Belum ada pesan. Mulai percakapan sekarang.
                                    </p>
                                </div>
                            ) : (
                                activeMessages.map(msg => {
                                    const isMine = msg.senderId === user?.id;
                                    return (
                                        <div key={msg.id} className={`flex flex-col ${isMine ? 'items-end' : 'items-start'}`}>
                                            <div className={`max-w-[75%] px-4 py-3 rounded-2xl shadow-sm ${isMine
                                                    ? 'bg-slate-800 text-white rounded-br-sm'
                                                    : 'bg-white border border-slate-200 text-slate-800 rounded-bl-sm'
                                                }`}>
                                                {msg.subject !== 'Pesan Baru' && (
                                                    <div className={`text-xs font-semibold mb-1 uppercase tracking-wide ${isMine ? 'text-slate-300' : 'text-slate-500'}`}>
                                                        {msg.subject}
                                                    </div>
                                                )}
                                                <div className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</div>
                                            </div>
                                            <span className="text-xs font-medium text-slate-400 mt-1.5 px-1">
                                                {new Date(msg.timestamp).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                    );
                                })
                            )}
                        </div>

                        {/* Chat Input Footer */}
                        <div className="p-4 bg-white border-t border-slate-200 shadow-sm z-10">
                            <form onSubmit={handleSendMessage} className="flex flex-col gap-3 max-w-4xl mx-auto w-full">
                                <input
                                    type="text"
                                    placeholder="Subjek (Opsional)"
                                    value={subjectInput}
                                    onChange={e => setSubjectInput(e.target.value)}
                                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-400 bg-white transition-shadow"
                                />
                                <div className="flex items-center gap-2">
                                    <input
                                        type="text"
                                        required
                                        placeholder="Ketik pesan Anda di sini..."
                                        value={messageInput}
                                        onChange={e => setMessageInput(e.target.value)}
                                        className="flex-1 px-4 py-3 text-sm border border-slate-300 rounded-lg focus:outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-500 transition-shadow"
                                    />
                                    <button
                                        type="submit"
                                        className="bg-slate-800 hover:bg-slate-900 text-white rounded-lg p-3 transition-colors flex items-center justify-center shrink-0 shadow-sm disabled:opacity-50 cursor-pointer"
                                        disabled={!messageInput.trim()}
                                    >
                                        <Send className="w-5 h-5" />
                                    </button>
                                </div>
                            </form>
                        </div>
                    </>
                ) : (
                    /* Default State (No Contact Selected) */
                    <div className="flex-1 flex flex-col items-center justify-center text-slate-500 bg-slate-50">
                        <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-sm mb-4 border border-slate-100">
                            <User className="w-10 h-10 text-slate-300" />
                        </div>
                        <p className="text-lg font-bold text-slate-700 uppercase tracking-wide">Pesan Personal</p>
                        <p className="text-sm text-slate-500 mt-2 text-center max-w-sm">Pilih guru atau siswa dari daftar di sebelah kiri untuk mulai mengirim dan menerima pesan secara privat.</p>
                    </div>
                )}
            </div>
        </div>
    );
}