import { faFilter, faSort, faSearch } from "@fortawesome/free-solid-svg-icons";
import { Activity } from "react"; 
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState, useEffect, useRef } from "react";

export function ControlBar({filterOptions, filtersValue, setFiltersValue, orderByValue, setOrderByValue, orderByOptions, setDebouncedSearch}) {
  const [activeMenu, setActiveMenu] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(searchTerm.trim()), 500);
    return () => clearTimeout(t);
  }, [searchTerm]);

  return (
    <div className="w-5xl mb-5 flex items-center justify-between sticky top-22 bg-bg-main z-10 py-4 px-6 border-b border-border-color gap-4">
      <Dropdown 
        isOpen={activeMenu === 'order'} 
        setIsOpen={(state) => setActiveMenu(state ? 'order' : null)}
        trigger={<>Order By <FontAwesomeIcon icon={faSort} /></>}
      >
        <ul className="menu bg-base-200 w-40 grid grid-cols-2 gap-2">
          {orderByOptions.map((option) => (
            <li key={option}>
              <button
                className={`w-full text-center rounded-md px-2 py-1 ${orderByValue === option ? 'bg-btn-bg text-btn-text' : 'bg-bg-main'}`}
                onClick={() => {
                  setOrderByValue(option);
                  setActiveMenu(null);
                }}
              >
                {option}
              </button>
            </li>
          ))}
        </ul>
      </Dropdown>

      <Dropdown 
        isOpen={activeMenu === 'filter'} 
        setIsOpen={(state) => setActiveMenu(state ? 'filter' : null)}
        trigger={<>Filter <FontAwesomeIcon icon={faFilter} /></>}
      >
        <div className="w-160 flex flex-col gap-1">
          {Object.entries(filterOptions).map(([key, config]) => (
            <FilterItems
              key={key}
              name={config.label}
              filterKey={key}
              options={config.options}
              value={filtersValue[key]}
              setFiltersValue={setFiltersValue}
            />
          ))}
        </div>
      </Dropdown>

      <div className="w-3xl relative border border-border-color rounded-xl flex items-center px-2 gap-2">
        <input
          type="text"
          placeholder="Search in results history"
          className="w-full p-1.5 border-none outline-0 rounded-md"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <FontAwesomeIcon icon={faSearch} />
      </div>
    </div>
  )
}

function FilterItems({ name, filterKey, options, value, setFiltersValue }) {
  return (
    <div className="flex gap-2 my-1">
      <span className="w-30">{name}</span>
      <div className="flex gap-1 w-full">
        {options.map((option) => (
          <button
            key={`${filterKey}-${option}`}
            className={`w-full text-center rounded-md cursor-pointer px-2 py-2 ${ value === option ? 'bg-text-main text-bg-main' : 'bg-bg-main'}`}
            onClick={() =>
              setFiltersValue((prev) => ({ ...prev, [filterKey]: option }))
            }
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  )
}

function Dropdown({ trigger, children, isOpen, setIsOpen }) {
  const containerRef = useRef(null);
  useEffect(() => {
    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, setIsOpen]);

  return (
    <div className="relative" ref={containerRef}>
      <div onClick={() => setIsOpen(!isOpen)}>
        <button className="px-4 py-3 rounded-md hover:bg-btn-bg hover:text-btn-text cursor-pointer w-30">
          {trigger}
        </button>
      </div>

      {isOpen && (
        <div className="absolute z-20 top-13 left-0 border bg-bg-second border-border-color rounded-xl shadow-md p-4">
          {children}
        </div>
      )}
    </div>
  );
}