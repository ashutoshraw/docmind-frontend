export default function getErrorMessage(err) {
  // Server never answered: offline, server asleep, or CORS/network failure
  if (!err.response) {
    return 'Cannot reach the server. If it was idle, give it a minute to wake up and try again.';
  }
  if (err.response.status === 429) {
    return 'Too many attempts. Please wait a few minutes and try again.';
  }
  const data = err.response.data;
  // Adjust these keys if your backend's error shape differs
  return data?.message || data?.error || 'Something went wrong. Please try again.';
}