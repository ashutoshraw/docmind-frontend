import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import AuthCard from '../components/AuthCard';
import FormInput from '../components/FormInput';
import getErrorMessage from '../utils/getErrorMessage';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = location.state?.from?.pathname || '/';

  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const validate = () => {
    const errs = {};
    if (!/^\S+@\S+\.\S+$/.test(form.email)) errs.email = 'Enter a valid email';
    if (!form.password) errs.password = 'Password is required';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length) return;

    setSubmitting(true);
    try {
      await login(form.email.trim(), form.password);
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setServerError(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthCard
      title="Welcome back"
      subtitle="Log in to chat with your documents"
      footer={
        <>
          New here?{' '}
          <Link to="/signup" className="text-indigo-400 hover:underline">
            Create an account
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        {serverError && (
          <div role="alert" className="rounded-lg bg-red-500/10 border border-red-500/40 px-3 py-2 text-sm text-red-300">
            {serverError}
          </div>
        )}
        <FormInput label="Email" id="email" name="email" type="email" autoComplete="email"
          value={form.email} onChange={handleChange} error={errors.email} placeholder="you@example.com" />
        <FormInput label="Password" id="password" name="password" type="password" autoComplete="current-password"
          value={form.password} onChange={handleChange} error={errors.password} />
        <button type="submit" disabled={submitting}
          className="w-full rounded-lg bg-indigo-600 py-2 font-medium text-white hover:bg-indigo-500 disabled:opacity-60 disabled:cursor-not-allowed">
          {submitting ? 'Logging in...' : 'Log in'}
        </button>
      </form>
    </AuthCard>
  );
}