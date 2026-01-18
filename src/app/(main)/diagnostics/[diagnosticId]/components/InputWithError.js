export function InputWithError({ name, label, error, children }) {
  return (
    <div className="w-full flex flex-col gap-1 mb-1">
      <div className="w-full flex justify-between items-center">
        <label htmlFor={name}>{label}</label>
        {children}
      </div>
      {error && <p className="text-red-500 text-xs self-end h-0">{error}</p>}
    </div>
  );
}
