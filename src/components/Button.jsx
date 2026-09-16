import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { motion } from 'framer-motion';

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
    sm: 'text-xs px-4 py-2 tracking-widest',
    md: 'text-xs sm:text-sm px-6 py-3.5 tracking-luxury',
    lg: 'text-sm sm:text-base px-8 py-4 tracking-luxury font-medium',
  };

  const variantClasses = {
    primary:
      'bg-[#131E20] dark:bg-[#F5F1E8] text-[#F4F7F6] dark:text-[#07121C] hover:bg-[#36656B] dark:hover:bg-[#BCA575] border border-transparent shadow-sm',
    accent:
      'bg-[#36656B] dark:bg-[#BCA575] text-[#FFFFFF] dark:text-[#07121C] hover:bg-[#254B50] dark:hover:bg-[#A7C3C6] border border-transparent shadow-md',
    secondary:
      'bg-transparent text-[#131E20] dark:text-[#F5F1E8] border border-[#D1DCDE] dark:border-[#1E3447] hover:border-[#36656B] dark:hover:border-[#BCA575] hover:text-[#36656B] dark:hover:text-[#BCA575]',
    outline:
      'bg-transparent text-[#131E20] dark:text-[#F5F1E8] border border-[#131E20] dark:border-[#F5F1E8] hover:bg-[#131E20] hover:text-[#F4F7F6] dark:hover:bg-[#F5F1E8] dark:hover:text-[#07121C]',
    ghost:
      'bg-transparent text-[#131E20] dark:text-[#F5F1E8] hover:text-[#36656B] dark:hover:text-[#BCA575]',
  };

  const baseClasses =
    'inline-flex items-center justify-center gap-2.5 uppercase font-sans transition-all duration-300 rounded-full cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed group text-center';

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
    <motion.button
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={combinedClasses}
      {...rest}
    >
      {content}
    </motion.button>
  );
};

export default Button;
