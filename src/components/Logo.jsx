// src/components/Logo.jsx
export default function Logo({ size = 44 }) {
  return (
    <img
      src={`${import.meta.env.BASE_URL}logo.png`}
      alt="Palabra Justa"
      style={{ width: size, height: size }}
      className="object-contain flex-shrink-0"
    />
  );
}
