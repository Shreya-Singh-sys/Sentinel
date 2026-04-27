import { ReactNode } from "react";

interface IconProps {
  name: string;
  className?: string;
  filled?: boolean;
  weight?: 300 | 400 | 500 | 600 | 700;
}

export const Icon = ({ name, className = "", filled = false, weight = 500 }: IconProps) => (
  <span
    className={`material-symbols-rounded select-none ${className}`}
    style={{
      fontVariationSettings: `'FILL' ${filled ? 1 : 0}, 'wght' ${weight}, 'GRAD' 0, 'opsz' 24`,
    }}
  >
    {name}
  </span>
);

export type { ReactNode };
