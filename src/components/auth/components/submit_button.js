import { useFormStatus } from "react-dom"

export default function SubmitButton({name}) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="btnStyle text-xl"
    >
      {pending ? <div className="loader"></div> : name}
    </button>
  );
}