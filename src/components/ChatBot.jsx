import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { m, AnimatePresence } from 'framer-motion';
import { MessageSquareText, X, Send, ArrowUpRight, Loader2 } from 'lucide-react';
import { useSiteText } from '../context/PublicContentContext';
import { submitInquiry, formErrorMessage } from '../services/publicApi';
import { answerFor, STARTER_CHIPS, CHIP_QUESTIONS } from '../lib/chatAnswers';
import { ease } from '../lib/motion';

// The chat lasts for this browser tab (sessionStorage), so moving between pages keeps it
const STORE_KEY = 'symmetry_chat';
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^[0-9+()\s-]{8,20}$/;

const load = () => {
  try {
    return JSON.parse(sessionStorage.getItem(STORE_KEY)) || null;
  } catch {
    return null;
  }
};
const save = (state) => {
  try {
    sessionStorage.setItem(STORE_KEY, JSON.stringify(state));
  } catch {
    /* private mode: the chat simply is not remembered */
  }
};

/**
 * Website chat: a button next to the floating WhatsApp pill opens a small panel.
 * 1. The visitor enters name, phone and email; this is saved as an enquiry (Admin → Inquiries,
 *    service "Website chat") so the team can follow up. No passwords.
 * 2. Questions get ready-made answers (lib/chatAnswers.js), with links and suggested questions;
 *    anything it cannot answer is handed to WhatsApp / phone.
 */
export const ChatBot = () => {
  const company = useSiteText('company');
  const saved = load();
  const [open, setOpen] = useState(false);
  const [visitor, setVisitor] = useState(saved?.visitor || null);
  const [messages, setMessages] = useState(saved?.messages || []);
  const [draft, setDraft] = useState('');
  const [typing, setTyping] = useState(false);
  const listRef = useRef(null);
  const inputRef = useRef(null);
  const firstName = visitor?.name?.split(' ')[0] || '';

  useEffect(() => save({ visitor, messages }), [visitor, messages]);

  // Newest message in view; focus the box when the chat opens
  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, typing, open]);
  useEffect(() => {
    if (open && visitor) setTimeout(() => inputRef.current?.focus(), 250);
  }, [open, visitor]);

  // Escape closes the panel
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  const ask = (question) => {
    const q = question.trim();
    if (!q || typing) return;
    setMessages((list) => [...list, { from: 'me', text: q }]);
    setDraft('');
    setTyping(true);
    // A short pause so the reply reads as a reply
    setTimeout(() => {
      setMessages((list) => [...list, { from: 'bot', ...answerFor(q, { company, name: firstName }) }]);
      setTyping(false);
    }, 550);
  };

  const onSignedIn = (who) => {
    setVisitor(who);
    setMessages([
      {
        from: 'bot',
        text: `Thank you, ${who.name.split(' ')[0]}! I can answer quick questions about our services, prices, the studio and the shop. Our team also has your details and can call you back.`,
        chips: STARTER_CHIPS,
      },
    ]);
  };

  return (
    <>
      {/* Launcher: just left of the floating WhatsApp pill */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? 'Close chat' : 'Chat with Symmetry'}
        aria-expanded={open}
        className="float-btn fixed z-40 bottom-5 right-[76px] md:bottom-8 md:right-[88px] h-14 sm:h-[52px] min-w-14 sm:min-w-[52px] px-0 sm:px-5 rounded-full bg-accent text-on-accent shadow-[0_10px_30px_rgba(0,0,0,0.18)] hover:bg-accent-hover flex items-center justify-center gap-2 transition-colors cursor-pointer"
      >
        {open ? <X className="w-5 h-5" /> : <MessageSquareText className="w-5 h-5" />}
        <span className="hidden sm:inline text-[15px] font-medium">{open ? 'Close' : 'Ask us'}</span>
      </button>

      <AnimatePresence>
        {open && (
          <m.section
            role="dialog"
            aria-label="Chat with Symmetry"
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: 0.25, ease: ease.out }}
            data-lenis-prevent
            className="fixed z-[1200] inset-x-3 bottom-24 top-[84px] sm:inset-auto sm:right-6 sm:bottom-28 md:bottom-[104px] sm:w-[380px] sm:h-[min(600px,calc(100svh-140px))] flex flex-col rounded-[24px] bg-canvas border border-line/70 shadow-[0_24px_60px_rgba(0,0,0,0.22)] overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center gap-3 px-5 py-4 bg-surface border-b border-line/60">
              <span className="w-10 h-10 rounded-full bg-accent text-on-accent flex items-center justify-center shrink-0">
                <MessageSquareText className="w-5 h-5" />
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-[16px] font-semibold text-fg leading-tight">Symmetry Assistant</p>
                <p className="text-[12.5px] text-muted flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Quick answers · team replies on WhatsApp
                </p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close chat"
                className="w-9 h-9 rounded-full flex items-center justify-center text-muted hover:text-fg hover:bg-fg/[0.06] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {!visitor ? (
              <SignIn onDone={onSignedIn} />
            ) : (
              <>
                {/* Conversation */}
                <div ref={listRef} className="flex-1 overflow-y-auto px-4 py-5 space-y-3" aria-live="polite">
                  {messages.map((msg, i) => (
                    <Bubble key={i} msg={msg} onChip={(c) => ask(CHIP_QUESTIONS[c] || c)} onNavigate={() => setOpen(false)} last={i === messages.length - 1} />
                  ))}
                  {typing && (
                    <div className="flex gap-1 px-4 py-3 rounded-2xl rounded-bl-md bg-surface w-fit" aria-label="Typing">
                      {[0, 1, 2].map((d) => (
                        <span key={d} className="w-1.5 h-1.5 rounded-full bg-subtle animate-bounce" style={{ animationDelay: `${d * 0.15}s` }} />
                      ))}
                    </div>
                  )}
                </div>

                {/* Question box */}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    ask(draft);
                  }}
                  className="flex items-center gap-2 p-3 border-t border-line/60 bg-surface"
                >
                  <label htmlFor="chat-question" className="sr-only">Your question</label>
                  <input
                    id="chat-question"
                    ref={inputRef}
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    maxLength={300}
                    placeholder="Type your question…"
                    autoComplete="off"
                    className="flex-1 h-11 px-4 rounded-full bg-canvas border border-line text-[16px] sm:text-[15px] text-fg placeholder:text-subtle focus:outline-none focus:border-accent focus:ring-4 focus:ring-accent/15"
                  />
                  <button
                    type="submit"
                    disabled={!draft.trim() || typing}
                    aria-label="Send"
                    className="w-11 h-11 rounded-full bg-accent text-on-accent flex items-center justify-center disabled:opacity-40 cursor-pointer"
                  >
                    <Send className="w-[18px] h-[18px]" />
                  </button>
                </form>
              </>
            )}
          </m.section>
        )}
      </AnimatePresence>
    </>
  );
};

/** One message; bot messages can carry links and suggested questions (chips on the latest only) */
const Bubble = ({ msg, onChip, onNavigate, last }) => {
  const mine = msg.from === 'me';
  return (
    <div className={`flex flex-col ${mine ? 'items-end' : 'items-start'}`}>
      <div
        className={`max-w-[85%] px-4 py-2.5 text-[14.5px] leading-relaxed whitespace-pre-line ${
          mine ? 'rounded-2xl rounded-br-md bg-accent text-on-accent' : 'rounded-2xl rounded-bl-md bg-surface text-fg'
        }`}
      >
        {msg.text}
      </div>
      {msg.links?.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-2 max-w-[90%]">
          {msg.links.map((l) =>
            l.to ? (
              <Link key={l.label} to={l.to} onClick={onNavigate} className="btn btn-sm border border-accent text-accent hover:bg-accent hover:text-on-accent">
                {l.label}
              </Link>
            ) : (
              <a key={l.label} href={l.href} target={l.href.startsWith('http') || l.href.endsWith('.pdf') ? '_blank' : undefined} rel="noopener noreferrer" className="btn btn-sm border border-accent text-accent hover:bg-accent hover:text-on-accent">
                {l.label} <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            )
          )}
        </div>
      )}
      {last && msg.chips?.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {msg.chips.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => onChip(c)}
              className="px-3.5 py-2 rounded-full bg-surface border border-line text-[13px] text-fg hover:border-accent hover:text-accent transition-colors cursor-pointer"
            >
              {c}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

/** First step: name, phone and email, saved as an enquiry for the team */
const SignIn = ({ onDone }) => {
  const [form, setForm] = useState({ name: '', phone: '', email: '', website: '' });
  const [errors, setErrors] = useState({});
  const [sending, setSending] = useState(false);
  const [failure, setFailure] = useState('');
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    const next = {};
    if (form.name.trim().length < 2) next.name = 'Please enter your name.';
    if (!PHONE_RE.test(form.phone.trim())) next.phone = 'Please enter a valid phone number.';
    if (!EMAIL_RE.test(form.email.trim())) next.email = 'Please enter a valid email address.';
    setErrors(next);
    if (Object.keys(next).length) return;
    setSending(true);
    setFailure('');
    try {
      await submitInquiry({
        name: form.name.trim(),
        phone: form.phone.trim(),
        email: form.email.trim(),
        service: 'Website chat',
        message: 'Started a chat on the website and asked the team to follow up if needed.',
        website: form.website,
      });
      onDone({ name: form.name.trim(), phone: form.phone.trim(), email: form.email.trim() });
    } catch (err) {
      setFailure(formErrorMessage(err));
    } finally {
      setSending(false);
    }
  };

  const field = (k, label, type, autoComplete, inputMode) => (
    <div>
      <label htmlFor={`chat-${k}`} className="block text-[13px] font-medium text-fg mb-1.5">{label}</label>
      <input
        id={`chat-${k}`}
        type={type}
        inputMode={inputMode}
        autoComplete={autoComplete}
        value={form[k]}
        onChange={set(k)}
        aria-invalid={!!errors[k]}
        aria-describedby={errors[k] ? `chat-${k}-error` : undefined}
        className={`w-full h-11 px-4 rounded-xl bg-surface border text-[16px] sm:text-[15px] text-fg focus:outline-none focus:ring-4 focus:ring-accent/15 ${errors[k] ? 'border-red-500' : 'border-line focus:border-accent'}`}
      />
      {errors[k] && <p id={`chat-${k}-error`} className="mt-1 text-[12.5px] text-red-600 dark:text-red-400">{errors[k]}</p>}
    </div>
  );

  return (
    <form onSubmit={submit} noValidate className="flex-1 overflow-y-auto px-5 py-6 space-y-4">
      <div>
        <p className="text-[19px] font-semibold text-fg leading-snug">Hello! Before we start…</p>
        <p className="mt-1 text-[14px] text-muted leading-relaxed">
          Tell us who you are so our team can follow up if the assistant cannot answer something.
        </p>
      </div>
      {field('name', 'Your name', 'text', 'name')}
      {field('phone', 'Phone', 'tel', 'tel', 'tel')}
      {field('email', 'Email', 'email', 'email', 'email')}
      {/* Honeypot: hidden from people, bots fill it in */}
      <input type="text" name="website" value={form.website} onChange={set('website')} tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />
      {failure && <p role="alert" className="text-[13px] text-red-600 dark:text-red-400">{failure}</p>}
      <button type="submit" disabled={sending} className="btn-primary w-full cursor-pointer">
        {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
        {sending ? 'Starting…' : 'Start chat'}
      </button>
      <p className="text-[12px] text-subtle leading-relaxed">
        Your details are saved as an enquiry for Symmetry Interiors and used only to reply to you.
      </p>
    </form>
  );
};

export default ChatBot;
