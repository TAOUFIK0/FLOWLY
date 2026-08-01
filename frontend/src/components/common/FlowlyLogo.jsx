export default function FlowlyLogo({ size = 36, className = "" }) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 36 36" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg" 
      className={className}
    >
      {/* Forme principale fluide (F stylisé) */}
      <path 
        d="M4 6H24C26.2091 6 28 7.79086 28 10C28 12.2091 26.2091 14 24 14H12C9.79086 14 8 15.7909 8 18C8 20.2091 9.79086 22 12 22H32" 
        stroke="url(#flowly-gradient1)" 
        strokeWidth="3.5" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
      {/* Vague du bas pour le côté "Flow" */}
      <path 
        d="M8 30H28C30.2091 30 32 28.2091 32 26C32 23.7909 30.2091 22 28 22H20" 
        stroke="url(#flowly-gradient2)" 
        strokeWidth="3.5" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
      
      {/* Définition des dégradés */}
      <defs>
        <linearGradient id="flowly-gradient1" x1="4" y1="6" x2="32" y2="22" gradientUnits="userSpaceOnUse">
          <stop stopColor="#4f46e5" /> {/* Couleur primaire */}
          <stop offset="1" stopColor="#818cf8" /> {/* Couleur primaire claire */}
        </linearGradient>
        <linearGradient id="flowly-gradient2" x1="8" y1="22" x2="32" y2="30" gradientUnits="userSpaceOnUse">
          <stop stopColor="#818cf8" />
          <stop offset="1" stopColor="#c7d2fe" /> {/* Violet très clair */}
        </linearGradient>
      </defs>
    </svg>
  );
}