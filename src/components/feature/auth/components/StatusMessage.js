export function StatusMessage ({ title, message, icon, colorClass, onClose }) {
  return (
  <div className="w-full p-8 flex flex-col items-center text-center">
    <div className={`w-20 h-20 ${colorClass} rounded-full flex items-center justify-center mb-6 border`}>
      {icon}
    </div>
    <h3 className="text-2xl font-bold mb-3">{title}</h3>
    <p className="text-text-second leading-relaxed mb-8">{message}</p>
    <button className="btnStyle" onClick={onClose}>Close</button>
  </div>
  )
};