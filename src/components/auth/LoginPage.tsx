import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Mail, ArrowRight, CheckCircle, AlertCircle, GraduationCap } from 'lucide-react';

export default function LoginPage() {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    if (!email.endsWith('@berkeley.edu')) {
      setStatus('error');
      setErrorMsg('Only @berkeley.edu email addresses are allowed');
      return;
    }

    setStatus('sending');
    setErrorMsg('');

    const { error } = await signIn(email.trim());

    if (error) {
      setStatus('error');
      setErrorMsg(error);
    } else {
      setStatus('sent');
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-20">
      <div className="bg-white rounded-2xl shadow-lg border border-dark/8 p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-dark rounded-full mb-4">
            <GraduationCap size={32} className="text-gold" />
          </div>
          <h1 className="font-display text-2xl text-dark italic mb-2">Welcome to OskiLease</h1>
          <p className="text-sm text-dark/50">
            Sign in with your Berkeley email to list your place
          </p>
        </div>

        {status === 'sent' ? (
          <div className="text-center py-6">
            <CheckCircle size={48} className="text-emerald-500 mx-auto mb-4" />
            <h2 className="text-lg font-bold text-dark mb-2">Check your inbox!</h2>
            <p className="text-sm text-dark/60 mb-6">
              We sent a magic link to <span className="font-semibold">{email}</span>
            </p>
            <p className="text-xs text-dark/40">
              Click the link in your email to sign in. The link expires in 1 hour.
            </p>
            <button
              onClick={() => { setStatus('idle'); setEmail(''); }}
              className="mt-6 text-sm text-gold hover:text-gold-dark transition-colors bg-transparent border-none cursor-pointer underline font-semibold"
            >
              Use a different email
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-dark mb-1.5">
                Berkeley Email
              </label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-dark/30" />
                <input
                  type="email"
                  placeholder="you@berkeley.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={status === 'sending'}
                  className="w-full pl-9 pr-4 py-3 text-base border border-dark/12 rounded-xl focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 bg-white text-dark disabled:opacity-50"
                />
              </div>
            </div>

            {status === 'error' && (
              <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 px-4 py-3 rounded-xl">
                <AlertCircle size={16} className="shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={status === 'sending' || !email.trim()}
              className="w-full py-3 text-base font-semibold text-dark bg-gold rounded-xl hover:bg-gold-dark transition-colors cursor-pointer border-none disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {status === 'sending' ? (
                'Sending magic link...'
              ) : (
                <>
                  Send Magic Link
                  <ArrowRight size={18} />
                </>
              )}
            </button>

            <p className="text-xs text-dark/40 text-center">
              No password needed — we'll email you a secure link to sign in.
              <br />
              Only <span className="font-semibold">@berkeley.edu</span> addresses are accepted.
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
