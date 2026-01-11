export function FieldItems({name, placeholder, error, type='number'}) {
  return (
    <input 
      id={name} 
      name={name} 
      type={type}
      placeholder={placeholder}
      className={`border px-1 py-0.5 rounded-lg w-50 ${error ? 'border-red-500' : 'border-border-color'}`}
    />
  )
}