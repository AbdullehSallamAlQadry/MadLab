import { useFormStatus } from "react-dom"

export default function SubmitButton({name, disabled = false, className}) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending || disabled}
      className={`btnStyle ${className}`}
    >
      {pending ? <div className="grid place-items-center"><div className="loader"></div></div> : name}
    </button>
  );
}