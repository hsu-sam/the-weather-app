// Input.jsx
const Input = ({
  variant = 'default',
  size = 'large',
  disabled = false,
  className = '',
  type = 'text',
  placeholder = '',
  value,
  onChange,
  ...rest
}) => {
  // Define variant styles
  const variantStyles = {
    default: 'text-neutarl-200 bg-(--neutral-800) py-4 px-6  rounded-xl',
  };

  // Define size styles
  const sizeStyles = {
    medium: 'text-base px-2.5 py-2',
    large: 'text-xl px-6 py-4',
  };

  const baseStyles = 'block w-full transition-colors duration-200 outline-none';

  const disabledStyles = disabled
    ? 'opacity-50 cursor-not-allowed bg-gray-100'
    : '';

  const inputClasses = `
    ${baseStyles}
    ${variantStyles[variant] || variantStyles.default}
    ${sizeStyles[size] || sizeStyles.medium}
    ${disabledStyles}
    ${className}
  `
    .trim()
    .replace(/\s+/g, ' ');

  return (
    <input
      type={type}
      className={inputClasses}
      placeholder={placeholder}
      disabled={disabled}
      value={value}
      onChange={onChange}
      {...rest}
    />
  );
};

export default Input;
