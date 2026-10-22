import React, { useEffect, useRef, useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, Loader2, Mail } from 'lucide-react';
import SeoMeta from '../../components/SeoMeta';
import { useCustomer } from '../../context/CustomerContext';

// Customer sign-in: a one-time email code (default; also creates the account), a password, or a new
// account with a password (confirmed with a code). ?next=/checkout returns there afterwards.

export const field =
  'w-full px-4 py-3 rounded-xl text-[15px] border border-line bg-canvas/60 dark:bg-canvas text-fg placeholder:text-subtle focus:outline-none focus:ring-4 focus:ring-accent/15 focus:border-accent';
const label = 'block text-[13px] font-medium text-fg/80 mb-1.5';
const primary =
  'w-full inline-flex items-center justify-center gap-2 rounded-full bg-accent text-on-accent hover:bg-accent-hover px-6 py-3 text-[15px] font-medium disabled:opacity-60';

const TABS = [
  ['code', 'Email code'],
  ['password', 'Password'],
  ['register', 'Create account'],
];

const retryText = (err) => {
  if (err.status !== 429) return err.message;
  const minutes = Math.max(1, Math.ceil((err.retryAfter || 60) / 60));
  return `${err.message} (about ${minutes} minute${minutes === 1 ? '' : 's'})`;
};

export const AccountLogin = () => {
  const { signedIn, status, requestCode, verifyCode, login, register } = useCustomer();
  const navigate = useNavigate();
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const next = params.get('next');
  // Sent here by Add to cart / Buy now / the cart (the item is added once they are signed in)
  const forCart = params.get('reason') === 'cart';
  const target = next && next.startsWith('/') && !next.startsWith('//') ? next : '/account';

  const [tab, setTab] = useState('code');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [codeSentTo, setCodeSentTo] = useState(null); // email the code went to
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [note, setNote] = useState('');
  const codeInput = useRef(null);

  useEffect(() => {
    if (codeSentTo) codeInput.current?.focus();
  }, [codeSentTo]);

  if (signedIn) return <Navigate to={target} replace />;

  const run = async (fn) => {
    setBusy(true);
    setError('');
    try {
      await fn();
    } catch (err) {
      setError(retryText(err));
      if (err.code === 'verify_email') {
        setCodeSentTo(email.trim());
        setNote('Please confirm your email address first: we sent you a code.');
      }
    } finally {
      setBusy(false);
    }
  };

  const sendCode = (e) => {
    e?.preventDefault();
    run(async () => {
      const r = await requestCode(email.trim());
      setCodeSentTo(email.trim());
      setCode('');
      setNote(`We sent a 6-digit code to ${email.trim()}. It works for ${r.minutes} minutes. Check your spam folder if it doesn't arrive.`);
    });
  };

  const checkCode = (e) => {
    e.preventDefault();
    run(async () => {
      await verifyCode(codeSentTo, code.trim(), fullName.trim() || undefined);
      navigate(target, { replace: true });
    });
  };

  const signIn = (e) => {
    e.preventDefault();
    run(async () => {
      await login(email.trim(), password);
      navigate(target, { replace: true });
    });
  };

  const create = (e) => {
    e.preventDefault();
    run(async () => {
      const r = await register({ email: email.trim(), fullName: fullName.trim(), phone: phone.trim(), password });
      setCodeSentTo(email.trim());
      setNote(`Almost done: enter the 6-digit code we sent to ${email.trim()} (valid ${r.minutes} minutes).`);
    });
  };

  const switchTab = (id) => {
    setTab(id);
    setError('');
    setNote('');
    setCodeSentTo(null);
  };

  return (
    <div className="pt-[calc(var(--gnav-h)+40px)] pb-24 min-h-[80vh]">
      <SeoMeta title="Sign in" noindex />
      <div className="site-container max-w-md">
        <p className="eyebrow">Your account</p>
        <h1 className="mt-2 text-[32px] sm:text-[40px] font-semibold tracking-tight text-fg leading-tight">
          {tab === 'register' ? 'Create your account' : 'Sign in'}
        </h1>
        <p className="mt-2 text-[15px] text-muted">
          {forCart
            ? 'Please sign in or create an account to add items to your cart and buy. Your item will be waiting in your cart.'
            : 'See your orders, track deliveries and check out faster.'}
        </p>

        {status === 'checking' ? (
          <p className="mt-10 text-muted inline-flex items-center gap-2"><Loader2 className="w-4 h-4 animate-spin" /> Checking…</p>
        ) : (
          <div className="mt-8 rounded-tile bg-surface p-5 sm:p-7 shadow-sm ring-1 ring-line/60">
            <div role="tablist" aria-label="Sign-in method" className="grid grid-cols-3 p-1 rounded-full bg-sunken text-[13px] font-medium">
              {TABS.map(([id, text]) => (
                <button
                  key={id}
                  role="tab"
                  type="button"
                  aria-selected={tab === id}
                  onClick={() => switchTab(id)}
                  className={`py-2 rounded-full transition-colors ${tab === id ? 'bg-surface text-fg shadow-sm' : 'text-muted hover:text-fg'}`}
                >
                  {text}
                </button>
              ))}
            </div>

            {error && <p role="alert" className="mt-5 p-3 rounded-xl bg-red-500/10 text-red-700 dark:text-red-300 text-[14px]">{error}</p>}
            {note && !error && <p role="status" className="mt-5 p-3 rounded-xl bg-accent/10 text-fg text-[14px]">{note}</p>}

            {codeSentTo ? (
              <form onSubmit={checkCode} className="mt-6 space-y-4">
                <div>
                  <label htmlFor="acc-code" className={label}>6-digit code</label>
                  <input
                    id="acc-code"
                    ref={codeInput}
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    pattern="[0-9 ]{6,7}"
                    maxLength={7}
                    required
                    value={code}
                    onChange={(e) => setCode(e.target.value.replace(/[^\d ]/g, ''))}
                    className={`${field} text-center text-[22px] tracking-[0.4em] font-semibold`}
                    placeholder="••••••"
                  />
                </div>
                {tab === 'code' && (
                  <div>
                    <label htmlFor="acc-name-c" className={label}>Your name <span className="text-subtle font-normal">(new customers)</span></label>
                    <input id="acc-name-c" autoComplete="name" value={fullName} onChange={(e) => setFullName(e.target.value)} className={field} />
                  </div>
                )}
                <button type="submit" disabled={busy} className={primary}>
                  {busy && <Loader2 className="w-4 h-4 animate-spin" />} Continue
                </button>
                <div className="flex items-center justify-between text-[13px]">
                  <button type="button" onClick={() => { setCodeSentTo(null); setNote(''); setError(''); }} className="text-muted hover:text-fg inline-flex items-center gap-1">
                    <ArrowLeft className="w-3.5 h-3.5" /> Change email
                  </button>
                  <button type="button" disabled={busy} onClick={() => { setEmail(codeSentTo); sendCode(); }} className="text-accent hover:underline">
                    Send a new code
                  </button>
                </div>
              </form>
            ) : tab === 'code' ? (
              <form onSubmit={sendCode} className="mt-6 space-y-4">
                <div>
                  <label htmlFor="acc-email" className={label}>Email</label>
                  <input id="acc-email" type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} className={field} placeholder="name@example.com" />
                </div>
                <button type="submit" disabled={busy} className={primary}>
                  {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Mail className="w-4 h-4" />} Email me a code
                </button>
                <p className="text-[13px] text-muted">No password needed. New here? This also creates your account.</p>
              </form>
            ) : tab === 'password' ? (
              <form onSubmit={signIn} className="mt-6 space-y-4">
                <div>
                  <label htmlFor="acc-email-p" className={label}>Email</label>
                  <input id="acc-email-p" type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} className={field} />
                </div>
                <div>
                  <label htmlFor="acc-pass" className={label}>Password</label>
                  <input id="acc-pass" type="password" autoComplete="current-password" required value={password} onChange={(e) => setPassword(e.target.value)} className={field} />
                </div>
                <button type="submit" disabled={busy} className={primary}>
                  {busy && <Loader2 className="w-4 h-4 animate-spin" />} Sign in
                </button>
                <button type="button" onClick={() => switchTab('code')} className="text-[13px] text-accent hover:underline">
                  Forgot your password? Sign in with an email code
                </button>
              </form>
            ) : (
              <form onSubmit={create} className="mt-6 space-y-4">
                <div>
                  <label htmlFor="acc-name" className={label}>Full name</label>
                  <input id="acc-name" autoComplete="name" required minLength={2} value={fullName} onChange={(e) => setFullName(e.target.value)} className={field} />
                </div>
                <div>
                  <label htmlFor="acc-email-r" className={label}>Email</label>
                  <input id="acc-email-r" type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} className={field} />
                </div>
                <div>
                  <label htmlFor="acc-phone" className={label}>Mobile number</label>
                  <input id="acc-phone" type="tel" autoComplete="tel" required minLength={10} value={phone} onChange={(e) => setPhone(e.target.value)} className={field} placeholder="+91 98765 43210" />
                </div>
                <div>
                  <label htmlFor="acc-pass-r" className={label}>Password</label>
                  <input id="acc-pass-r" type="password" autoComplete="new-password" required minLength={8} value={password} onChange={(e) => setPassword(e.target.value)} className={field} />
                  <p className="mt-1 text-[12px] text-muted">At least 8 characters.</p>
                </div>
                <button type="submit" disabled={busy} className={primary}>
                  {busy && <Loader2 className="w-4 h-4 animate-spin" />} Create account
                </button>
              </form>
            )}
          </div>
        )}
        <p className="mt-6 text-[13px] text-muted">
          Just looking? You can <Link to="/shop" className="text-accent hover:underline">browse the shop</Link> without signing in. Signing in is needed to add to cart and buy.
        </p>
      </div>
    </div>
  );
};

export default AccountLogin;
