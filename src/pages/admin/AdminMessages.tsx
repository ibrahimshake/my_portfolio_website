import React, { useEffect, useState } from 'react';
import { MessageSquare, Mail, Trash2, CheckCircle2, Circle, Clock, Reply } from 'lucide-react';
import type { ContactMessage } from '../../types';
import { api } from '../../lib/api';

interface AdminMessagesProps {
  initialSelectedId?: string | null;
}

export const AdminMessages: React.FC<AdminMessagesProps> = ({ initialSelectedId }) => {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);

  const loadMessages = async () => {
    try {
      setLoading(true);
      const data = await api.getAdminMessages();
      setMessages(data);
      if (initialSelectedId) {
        const found = data.find(m => m.id === initialSelectedId);
        if (found) {
          setSelectedMessage(found);
          return;
        }
      }
      if (data.length > 0 && !selectedMessage) {
        setSelectedMessage(data[0]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMessages();
  }, []);

  const handleToggleRead = async (msg: ContactMessage) => {
    try {
      const newRead = !msg.read;
      await api.markMessageRead(msg.id, newRead);
      const updated = messages.map(m => m.id === msg.id ? { ...m, read: newRead } : m);
      setMessages(updated);
      if (selectedMessage?.id === msg.id) {
        setSelectedMessage({ ...selectedMessage, read: newRead });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this message?')) return;
    try {
      await api.deleteMessage(id);
      const filtered = messages.filter(m => m.id !== id);
      setMessages(filtered);
      if (selectedMessage?.id === id) {
        setSelectedMessage(filtered[0] || null);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-zinc-900">
        <h1 className="text-xl font-bold text-zinc-100 flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-purple-400" />
          <span>Client Inquiries Inbox</span>
        </h1>
        <p className="text-xs text-zinc-400 mt-0.5">
          Inbound client messages stored securely in your database.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        
        {/* Messages List (Left column) */}
        <div className="md:col-span-5 rounded-xl border border-zinc-800 bg-zinc-900/40 overflow-hidden divide-y divide-zinc-800/80 max-h-[600px] overflow-y-auto">
          {messages.length === 0 ? (
            <div className="p-8 text-center text-xs text-zinc-500">
              No inquiries received yet.
            </div>
          ) : (
            messages.map((m) => {
              const isSelected = selectedMessage?.id === m.id;
              return (
                <div
                  key={m.id}
                  onClick={() => {
                    setSelectedMessage(m);
                    if (!m.read) handleToggleRead(m);
                  }}
                  className={`p-4 cursor-pointer transition-colors ${
                    isSelected ? 'bg-zinc-800/80 border-l-2 border-emerald-400' : 'hover:bg-zinc-900/60'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className={`text-xs font-semibold ${m.read ? 'text-zinc-300' : 'text-emerald-400 font-bold'}`}>
                      {m.name}
                    </span>
                    <span className="text-[10px] text-zinc-500 font-mono">
                      {new Date(m.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="text-xs text-zinc-200 truncate mt-1">
                    {m.subject || '(No Subject)'}
                  </div>

                  <p className="text-[11px] text-zinc-400 line-clamp-2 mt-1">
                    {m.message}
                  </p>
                </div>
              );
            })
          )}
        </div>

        {/* Selected Message Detail (Right column) */}
        <div className="md:col-span-7 rounded-xl border border-zinc-800 bg-zinc-900/60 p-6 space-y-6">
          {selectedMessage ? (
            <div className="space-y-4">
              <div className="flex items-start justify-between gap-4 pb-4 border-b border-zinc-800">
                <div>
                  <h2 className="text-base font-bold text-zinc-100">
                    {selectedMessage.subject || 'Inquiry regarding Lead Gen / Scraping'}
                  </h2>
                  <div className="text-xs text-zinc-400 mt-1 flex items-center gap-2">
                    <span className="font-semibold text-zinc-200">{selectedMessage.name}</span>
                    <span>&lt;{selectedMessage.email}&gt;</span>
                  </div>
                  <div className="text-[11px] text-zinc-500 font-mono mt-0.5 flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    <span>{new Date(selectedMessage.createdAt).toLocaleString()}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleToggleRead(selectedMessage)}
                    className="p-1.5 rounded bg-zinc-800 text-zinc-400 hover:text-zinc-200"
                    title={selectedMessage.read ? 'Mark as Unread' : 'Mark as Read'}
                  >
                    {selectedMessage.read ? <CheckCircle2 className="h-4 w-4 text-emerald-400" /> : <Circle className="h-4 w-4" />}
                  </button>
                  <button
                    onClick={() => handleDelete(selectedMessage.id)}
                    className="p-1.5 rounded bg-zinc-800 text-zinc-400 hover:text-red-400"
                    title="Delete Message"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Body */}
              <div className="p-4 rounded-lg bg-zinc-950 border border-zinc-800/80 text-xs text-zinc-200 leading-relaxed whitespace-pre-line min-h-[160px]">
                {selectedMessage.message}
              </div>

              {/* Reply via email */}
              <div className="flex justify-end">
                <a
                  href={`mailto:${selectedMessage.email}?subject=Re: ${encodeURIComponent(selectedMessage.subject || 'Inquiry')}`}
                  className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-zinc-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-colors"
                >
                  <Reply className="h-4 w-4" />
                  <span>Reply via Email Client</span>
                </a>
              </div>
            </div>
          ) : (
            <div className="py-20 text-center text-xs text-zinc-500">
              Select an inquiry from the list to view details.
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
