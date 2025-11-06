import { FormEvent, useState } from 'react';
import { GraduationCap, LogIn, UserPlus } from 'lucide-react';

interface LoginPageProps {
  onAuthenticate: (details: { mode: 'login' | 'signup'; studentId: string }) => void;
}

export default function LoginPage({ onAuthenticate }: LoginPageProps) {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [studentId, setStudentId] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState('');

  const isSignup = mode === 'signup';

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!studentId.trim() || !password.trim() || (isSignup && !fullName.trim())) {
      setError('Please fill in the required fields before continuing.');
      return;
    }

    setError('');
    onAuthenticate({ mode, studentId });
  };

  const toggleMode = (nextMode: 'login' | 'signup') => {
    setMode(nextMode);
    setError('');
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-emerald-500 via-green-500 to-emerald-600">
      <div className="absolute inset-0 opacity-70">
        <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-white/20 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-white/10 blur-3xl" />
      </div>

      <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid w-full max-w-5xl grid-cols-1 gap-10 overflow-hidden rounded-3xl bg-white/90 shadow-2xl backdrop-blur-sm lg:grid-cols-[1.1fr_1fr]">
          <div className="relative hidden flex-col justify-between bg-gradient-to-br from-emerald-600 via-green-600 to-emerald-700 p-10 text-white lg:flex">
            <div>
              <div className="flex items-center gap-3 text-white/90">
                <GraduationCap className="h-8 w-8" />
                <span className="text-lg font-semibold uppercase tracking-wide">VVCE Student Portal</span>
              </div>
              <h2 className="mt-10 text-4xl font-bold leading-tight">
                Welcome to your all-in-one campus companion
              </h2>
              <p className="mt-6 text-lg text-white/80">
                Access canteen menus, classroom schedules, bus tracking, and Zero—the friendly AI assistant
                designed to keep you in the loop.
              </p>
            </div>
            <div>
              <p className="text-sm uppercase tracking-[0.4em] text-white/60">Join the community</p>
              <h3 className="mt-3 text-2xl font-semibold">Stay informed, stay ahead.</h3>
            </div>
          </div>

          <div className="flex flex-col justify-center p-8 sm:p-10">
            <div className="mb-8 flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-wide text-emerald-500">VVCE Portal Access</p>
                <h1 className="mt-2 text-3xl font-bold text-gray-800">
                  {isSignup ? 'Create your account' : 'Sign in to continue'}
                </h1>
              </div>
              <div className="flex items-center gap-2 rounded-full bg-emerald-100 px-4 py-2 text-sm font-semibold text-emerald-700">
                <GraduationCap className="h-4 w-4" />
                <span>Students only</span>
              </div>
            </div>

            <div className="mb-6 flex rounded-full bg-gray-100 p-1 text-sm font-semibold">
              <button
                type="button"
                onClick={() => toggleMode('login')}
                className={`flex-1 rounded-full px-5 py-2 transition-all ${
                  mode === 'login'
                    ? 'bg-white text-emerald-600 shadow'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <LogIn className="h-4 w-4" />
                  <span>Log in</span>
                </div>
              </button>
              <button
                type="button"
                onClick={() => toggleMode('signup')}
                className={`flex-1 rounded-full px-5 py-2 transition-all ${
                  mode === 'signup'
                    ? 'bg-white text-emerald-600 shadow'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <UserPlus className="h-4 w-4" />
                  <span>Sign up</span>
                </div>
              </button>
            </div>

            <form className="space-y-5" onSubmit={handleSubmit}>
              {isSignup && (
                <div>
                  <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
                    Full name
                  </label>
                  <input
                    id="fullName"
                    type="text"
                    autoComplete="name"
                    value={fullName}
                    onChange={(event) => setFullName(event.target.value)}
                    className="mt-2 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-gray-900 shadow-sm transition focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                    placeholder="e.g., Akash Kumar"
                  />
                </div>
              )}

              <div>
                <label htmlFor="studentId" className="block text-sm font-medium text-gray-700">
                  Student ID
                </label>
                <input
                  id="studentId"
                  type="text"
                  autoComplete="username"
                  value={studentId}
                  onChange={(event) => setStudentId(event.target.value)}
                  className="mt-2 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-gray-900 shadow-sm transition focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                  placeholder="Enter your VVCE ID"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  autoComplete={isSignup ? 'new-password' : 'current-password'}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="mt-2 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-gray-900 shadow-sm transition focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                  placeholder="Enter your password"
                />
              </div>

              {error && <p className="text-sm font-medium text-red-600">{error}</p>}

              <button
                type="submit"
                className="group relative w-full overflow-hidden rounded-xl bg-gradient-to-r from-emerald-500 via-green-500 to-emerald-600 px-4 py-3 text-base font-semibold text-white shadow-lg transition hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-emerald-300"
              >
                <span className="relative z-10">
                  {isSignup ? 'Create account' : 'Log in'}
                </span>
                <span className="absolute inset-0 translate-y-full bg-white/20 transition-transform duration-300 ease-out group-hover:translate-y-0" />
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-gray-500">
              {isSignup ? (
                <>
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => toggleMode('login')}
                    className="font-semibold text-emerald-600 transition hover:text-emerald-700"
                  >
                    Log in instead
                  </button>
                </>
              ) : (
                <>
                  New to the portal?{' '}
                  <button
                    type="button"
                    onClick={() => toggleMode('signup')}
                    className="font-semibold text-emerald-600 transition hover:text-emerald-700"
                  >
                    Create an account
                  </button>
                </>
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
