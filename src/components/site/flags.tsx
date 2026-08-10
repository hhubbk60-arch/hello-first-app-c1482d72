/** Accurate vector renditions of the Tunisian and French national flags. */

export function FlagTN({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 60 40" className={className} role="img" aria-label="Tunisie">
      <rect width="60" height="40" fill="#E70013" />
      <circle cx="30" cy="20" r="12" fill="#fff" />
      <circle cx="30" cy="20" r="8" fill="#E70013" />
      <circle cx="32.4" cy="20" r="6.6" fill="#fff" />
      <path
        d="M33.2 14.6l1.42 4.36h4.58l-3.7 2.7 1.42 4.36-3.72-2.7-3.7 2.7 1.42-4.36-3.72-2.7h4.6z"
        fill="#E70013"
      />
    </svg>
  );
}

export function FlagFR({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 60 40" className={className} role="img" aria-label="France">
      <rect width="20" height="40" fill="#002395" />
      <rect x="20" width="20" height="40" fill="#fff" />
      <rect x="40" width="20" height="40" fill="#ED2939" />
    </svg>
  );
}
