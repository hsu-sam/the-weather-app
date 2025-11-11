// Define the component with props interface
const Button = ({
  variant = 'primary',
  size = 'medium',
  disabled = false,
  onClick,
  children,
  className = '',
  type = '',
  ...rest
}) => {
  // Define variant styles
  const variantStyles = {
    primary:
      'flex flex-row justify-center items-center gap-1.5 text-neutral-50  bg-blue-500 rounded-xl hover:bg-blue-700 focus:outline-none focus:ring-1 focus:ring-blue-700 focus:bg-blue-700  focus:ring-offset-2',
    secondary:
      'flex flex-row justify-center items-center gap-1.5 bg-(--neutral-600) focus:outline-none focus:ring-1 focus:ring-neutral-700  ',
    neutral:
      'flex flex-row items-center gap-1.5 text-neutral-50 bg-(--neutral-800) rounded-lg focus:outline-none focus:ring-1 focus:ring-neutral-500 focus:ring-offset-2',
  };

  // Define size styles
  const sizeStyles = {
    small: ' text-base px-1 py-2',
    medium: 'text-base px-2.5 py-2',
    large: 'text-xl px-6 py-4',
  };

  // Combine styles
  const baseStyles =
    'font-medium rounded transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';

  const disabledStyles = disabled
    ? 'opacity-50 cursor-not-allowed'
    : 'cursor-pointer';

  const buttonClasses = `
    ${baseStyles}
    ${variantStyles[variant] || variantStyles.primary}
    ${sizeStyles[size] || sizeStyles.medium}
    ${disabledStyles}
    ${className}
  `
    .trim()
    .replace(/\s+/g, ' ');

  // Handle click events
  const handleClick = (e) => {
    if (disabled) return;
    if (onClick) onClick(e);
  };

  // Render the component
  return (
    <button
      className={buttonClasses}
      onClick={handleClick}
      disabled={disabled}
      type={type}
      {...rest}
    >
      {children}
    </button>
  );
};

export default Button;
