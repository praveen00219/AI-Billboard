const Button = ({ children, variant, ...props }) => {
  const base = "px-6 py-3 rounded-lg font-medium transition";
  const styles =
    variant === "outline"
      ? "border border-gray-400 text-gray-800 hover:bg-gray-100"
      : "bg-[#FAFAFA] text-[#0A0A0A] hover:bg-gray-200";
  return (
    <button className={`${base} ${styles}`} {...props}>
      {children}
    </button>
  );
};

export default Button;
