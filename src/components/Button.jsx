import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { m } from 'framer-motion';

export const Button = ({
  children,
  to,
  href,
  onClick,
  variant = 'primary',
  size = 'md',
  showArrow = false,
  className = '',
  type = 'button',
  disabled = false,
  ...rest
}) => {
  const sizeClasses = {
    sm: 'text-[13px] px-4 py-2',
    md: 'text-[15px] px-6 py-3',
    lg: 'text-[16px] px-7 py-3.5',
  };

  const variantClasses = {
    primary: 'bg-accent text-on-accent hover:bg-accent-hover border border-transparent',
    accent: 'bg-accent text-on-accent hover:bg-accent-hover border border-transparent',
    dark: 'bg-fg text-canvas hover:opacity-85 border border-transparent',
    secondary: 'bg-transparent text-fg border border-fg/20 hover:border-fg/50 hover:bg-fg/[0.04]',
    outline: 'bg-transparent text-fg border border-fg/20 hover:border-fg/50 hover:bg-fg/[0.04]',
    ghost: 'bg-transparent text-accent hover:underline underline-offset-4',
  };

  const baseClasses =
    'inline-flex items-center justify-center gap-2 font-medium tracking-[-0.01em] font-sans transition-all duration-300 ease-apple rounded-full cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed group text-center whitespace-nowrap';

  const combinedClasses = `${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`;

  const content = (
    <>
      <span>{children}</span>
      {showArrow && (
        <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      )}
    </>
  );

  if (to) {
    return (
      <Link to={to} className={combinedClasses} {...rest}>
        {content}
      </Link>
    );
  }

  if (href) {
    return (
      <a href={href} className={combinedClasses} target="_blank" rel="noopener noreferrer" {...rest}>
        {content}
      </a>
    );
  }

  return (
    <m.button
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={combinedClasses}
      {...rest}
    >
      {content}
    </m.button>
  );
};

export default Button;
