import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import AuthCard from '../components/AuthCard';
import FormInput from '../components/FormInput';
import getErrorMessage from '../utils/getErrorMessage';

export default function Signup() {
  const { signup } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  // Keep these rules in sync with your backend validate middleware
  const validate = () => {
    const errs = {};
    if (form.name.trim().length < 2) errs.name = 'Name must be at least 2 characters';
    if (!/^\S+@\S+\.\S+$/.test(form.email)) errs.email = 'Enter a valid email';
    if (form.password.length < 8) errs.password = 'Password must be at least 8 characters';
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
      await signup(form.name.trim(), form.email.trim(), form.password);
      navigate('/', { replace: true });
    } catch (err) {
      setServerError(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthCard
      title="Create your account"
      subtitle="Upload documents and ask them questions"
      footer={
        <>
          Already have an account?{' '}
          <Link to="/login" className="text-indigo-400 hover:underline">
            Log in
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
        <FormInput label="Name" id="name" name="name" autoComplete="name"
          value={form.name} onChange={handleChange} error={errors.name} />
        <FormInput label="Email" id="email" name="email" type="email" autoComplete="email"
          value={form.email} onChange={handleChange} error={errors.email} placeholder="you@example.com" />
        <FormInput label="Password" id="password" name="password" type="password" autoComplete="new-password"
          value={form.password} onChange={handleChange} error={errors.password} />
        <button type="submit" disabled={submitting}
          className="w-full rounded-lg bg-indigo-600 py-2 font-medium text-white hover:bg-indigo-500 disabled:opacity-60 disabled:cursor-not-allowed">
          {submitting ? 'Creating account...' : 'Sign up'}
        </button>
      </form>
    </AuthCard>
  );
}