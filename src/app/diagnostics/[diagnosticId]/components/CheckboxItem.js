export function CheckboxItem({category, defaultChecked}) {
  const name = category.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase())
  return(
    <div className={'w-full flex justify-between'}>
      <label className="flex items-center justify-between cursor-pointer w-full">
        <span className="text-text-main">
          {name}
        </span>
        <input name={category} type="checkbox" className="peer hidden" defaultChecked={defaultChecked} />
        <span
          className={`
            h-4 w-4 rounded border
            border-text-main
            bg-bg-second
            peer-checked:bg-btn-bg
            peer-checked:border-btn-bg
          `}
        ></span>
      </label>
    </div>
  )
}