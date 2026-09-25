// Íconos propios (mismo estilo de trazo que lucide) para no depender de paquetes extra.
function Icono({ size = 18, children }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {children}
    </svg>
  );
}
export const Play = (p) => <Icono {...p}><polygon points="6 3 20 12 6 21 6 3" /></Icono>;
export const RotateCcw = (p) => <Icono {...p}><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" /><path d="M3 3v5h5" /></Icono>;
export const Mic = (p) => <Icono {...p}><rect x="9" y="2" width="6" height="12" rx="3" /><path d="M19 10v2a7 7 0 0 1-14 0v-2" /><line x1="12" y1="19" x2="12" y2="22" /></Icono>;
export const Square = (p) => <Icono {...p}><rect x="5" y="5" width="14" height="14" rx="2" /></Icono>;
export const ChevronRight = (p) => <Icono {...p}><path d="m9 18 6-6-6-6" /></Icono>;
export const ChevronLeft = (p) => <Icono {...p}><path d="m15 18-6-6 6-6" /></Icono>;
export const ArrowLeft = (p) => <Icono {...p}><path d="m12 19-7-7 7-7" /><path d="M19 12H5" /></Icono>;
export const Check = (p) => <Icono {...p}><path d="M20 6 9 17l-5-5" /></Icono>;
export const X = (p) => <Icono {...p}><path d="M18 6 6 18" /><path d="m6 6 12 12" /></Icono>;
export const MinusCircle = (p) => <Icono {...p}><circle cx="12" cy="12" r="10" /><path d="M8 12h8" /></Icono>;
export const Lightbulb = (p) => <Icono {...p}><path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5" /><path d="M9 18h6" /><path d="M10 22h4" /></Icono>;
export const Plus = (p) => <Icono {...p}><path d="M12 5v14" /><path d="M5 12h14" /></Icono>;
export const BookmarkPlus = (p) => <Icono {...p}><path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" /><line x1="12" y1="7" x2="12" y2="13" /><line x1="9" y1="10" x2="15" y2="10" /></Icono>;
export const ClipboardCheck = (p) => <Icono {...p}><rect x="8" y="2" width="8" height="4" rx="1" /><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" /><path d="m9 14 2 2 4-4" /></Icono>;
export const BarChart3 = (p) => <Icono {...p}><path d="M3 3v18h18" /><path d="M18 17V9" /><path d="M13 17V5" /><path d="M8 17v-3" /></Icono>;
export const Trash2 = (p) => <Icono {...p}><path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /></Icono>;
