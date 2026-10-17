import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
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
    sm: 'text-[14px] px-4 py-[7px]',
    md: 'text-[15px] sm:text-[17px] px-[22px] py-[11px]',
    lg: 'text-[17px] px-7 py-3.5',
  };

  const variantClasses = {
    primary: 'bg-accent text-on-accent hover:bg-accent-hover border border-transparent',
    accent: 'bg-accent text-on-accent hover:bg-accent-hover border border-transparent',
    dark: 'bg-fg text-canvas hover:opacity-85 border border-transparent',
    secondary: 'bg-transparent text-accent border border-accent hover:bg-accent hover:text-on-accent',
    outline: 'bg-transparent text-accent border border-accent hover:bg-accent hover:text-on-accent',
    ghost: 'bg-transparent text-accent hover:underline underline-offset-4',
  };

  const baseClasses =
    'inline-flex items-center justify-center gap-1.5 font-normal tracking-[-0.01em] font-sans transition-[background-color,color,border-color,transform,opacity] duration-200 ease-apple rounded-full cursor-pointer active:scale-[0.97] disabled:opacity-50 disabled:cursor-not-allowed group text-center whitespace-nowrap';

  const combinedClasses = `${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`;

  const content = (
    <>
      <span>{children}</span>
      {showArrow && (
        <ChevronRight className="w-4 h-4 -mr-1 transition-transform duration-200 group-hover:translate-x-0.5" />
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
