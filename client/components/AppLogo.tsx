interface AppLogoProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function AppLogo({ size = "md", className = "" }: AppLogoProps) {
  const sizeMap = {
    sm: 20,
    md: 24,
    lg: 28,
  };

  const dimension = sizeMap[size];

  return (
    <svg
      width={dimension}
      height={dimension}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3B82F6" />
          <stop offset="50%" stopColor="#06B6D4" />
          <stop offset="100%" stopColor="#8B5CF6" />
        </linearGradient>
        <linearGradient id="grad2" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#EC4899" />
          <stop offset="100%" stopColor="#F97316" />
        </linearGradient>
        <linearGradient id="grad3" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#10B981" />
          <stop offset="100%" stopColor="#06B6D4" />
        </linearGradient>
      </defs>

      {/* Left Book Pages */}
      <path
        d="M 20 15 L 35 15 L 35 85 L 20 85 C 15 85 12 80 12 75 L 12 25 C 12 20 15 15 20 15 Z"
        fill="url(#grad1)"
        opacity="0.9"
      />

      {/* Right Book Pages */}
      <path
        d="M 50 15 L 65 15 L 65 85 L 50 85 C 45 85 42 80 42 75 L 42 25 C 42 20 45 15 50 15 Z"
        fill="url(#grad2)"
        opacity="0.9"
      />

      {/* Center Book Spine with gradient */}
      <rect
        x="33"
        y="15"
        width="4"
        height="70"
        fill="url(#grad3)"
        opacity="0.95"
      />

      {/* Decorative accents - stars/sparkles */}
      <circle cx="28" cy="30" r="2.5" fill="#FCD34D" opacity="0.8" />
      <circle cx="58" cy="45" r="2" fill="#FCD34D" opacity="0.7" />
      <circle cx="25" cy="65" r="1.8" fill="#BFDBFE" opacity="0.8" />
      <circle cx="62" cy="70" r="2.2" fill="#F472B6" opacity="0.7" />

      {/* Highlight lines for dimension */}
      <line
        x1="22"
        y1="25"
        x2="22"
        y2="75"
        stroke="#FFFFFF"
        strokeWidth="1.2"
        opacity="0.4"
      />
      <line
        x1="52"
        y1="25"
        x2="52"
        y2="75"
        stroke="#FFFFFF"
        strokeWidth="1.2"
        opacity="0.4"
      />

      {/* Book page waves for dynamism */}
      <path
        d="M 25 45 Q 28 42 32 45"
        stroke="#FFFFFF"
        strokeWidth="1.5"
        fill="none"
        opacity="0.3"
      />
      <path
        d="M 55 55 Q 58 52 62 55"
        stroke="#FFFFFF"
        strokeWidth="1.5"
        fill="none"
        opacity="0.3"
      />
    </svg>
  );
}
