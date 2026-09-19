// src/components/Logo.jsx
export default function Logo({ size = 44 }) {
  return (
    <img
      src="/logo.png"
      alt="Palabra Justa"
      style={{ width: size, height: size }}
      className="object-contain flex-shrink-0"
    />
  );
}
