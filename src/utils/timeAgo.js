const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });

const UNITS = [
  ['year', 31536000],
  ['month', 2592000],
  ['day', 86400],
  ['hour', 3600],
  ['minute', 60],
];

export default function timeAgo(dateString) {
  if (!dateString) return '';
  const diffSeconds = (new Date(dateString).getTime() - Date.now()) / 1000;
  for (const [unit, secs] of UNITS) {
    if (Math.abs(diffSeconds) >= secs) return rtf.format(Math.round(diffSeconds / secs), unit);
  }
  return 'just now';
}