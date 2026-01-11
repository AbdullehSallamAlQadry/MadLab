export function SelectItems({name, defaultValue, error, children}) {
  return (
    <select 
      name={name} 
      id={name}
      className={`border t px-1 py-0.5 rounded-lg w-50 ${error ? 'border-red-500' : 'border-border-color'}`}
      defaultValue={defaultValue}
    >
      {children}
    </select>
  )
}