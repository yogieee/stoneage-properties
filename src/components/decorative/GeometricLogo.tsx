interface GeometricLogoProps {
  className?: string;
  size?: string;
}

export function GeometricLogo({ className = "", size = "w-6 h-5" }: GeometricLogoProps) {
  return (
    <svg
      viewBox="0 0 44 38"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      className={`${size} ${className}`}
      aria-hidden="true"
    >
      <path d="M17.6298 3.44706L22.0886 1.60715L22.1804 3.8007L17.5483 5.66439L17.6298 3.44706Z" />
      <path d="M16.5621 32.7915L23.326 30.9269L23.5438 36.1337L16.373 37.9373L16.5621 32.7915Z" />
      <path d="M31.6239 0L35.9052 0.692643L33.315 3.5885L29.1074 2.72402L31.6239 0Z" />
      <path d="M5.90723 12.375L9.29129 8.94795L11.3444 9.72015L7.87018 13.2983L5.90723 12.375Z" />
      <path d="M41.9074 21.0034L37.4409 26.9695L32.7256 24.7415L37.0801 19.1786L41.9074 21.0034Z" />
      <path d="M4.79399 36.0661L1.61475 32.9919L5.06938 29.1728L8.41764 31.9215L4.79399 36.0661Z" />
      <path d="M42.3998 5.55733L44.0001 9.70575L38.7852 11.4972L37.5498 7.3188L42.3998 5.55733Z" />
      <path d="M4.48057 19.2297L3.61749 23.4661L0 24.7108L1.04267 20.48L4.48057 19.2297Z" />
    </svg>
  );
}
