export const ProfileIcon = () => (
  <svg
    width="64"
    height="64"
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="32" cy="32" r="32" fill="#e8f5e8" />
    <circle cx="32" cy="32" r="12" fill="#349934" />
  </svg>
);

export const OrbitDot = ({ color = "#fd992d" }: { color?: string }) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="8" cy="8" r="8" fill={color} />
  </svg>
);
