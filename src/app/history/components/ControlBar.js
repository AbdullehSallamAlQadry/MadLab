import { faFilter, faSort, faSearch } from "@fortawesome/free-solid-svg-icons";
import { Activity } from "react"; 
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState, useEffect, useRef } from "react";

export function ControlBar({filterOptions, filtersValue, setFiltersValue, orderByValue, setOrderByValue, orderByOptions, searchTerm, setSearchTerm}) {
  const filterRef = useRef(null);
  const [filterTrigger, setFilterTrigger] = useState(false);
  const orderByRef = useRef(null);
  const [orderByTrigger, setOrderByTrigger] = useState(false);

  useEffect(() => {
    function handleClickOutside(e) {
      if (orderByRef.current && !orderByRef.current.contains(e.target)) setOrderByTrigger(false);
      if (filterRef.current && !filterRef.current.contains(e.target)) setFilterTrigger(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="w-5xl my-5 flex items-center justify-between">
      <div className="relative" ref={orderByRef}>
        <button
          className="px-4 py-1.5 rounded-md hover:bg-btn-bg hover:text-btn-text cursor-pointer"
          onClick={() => setOrderByTrigger(!orderByTrigger)}
        >
          Order By <FontAwesomeIcon icon={faSort} />
        </button>
        <div className={orderByTrigger ? 'visible' : 'hidden'}>
          <div className="absolute w-fit top-10 left-0 border bg-bg-second border-border-color rounded-xl shadow-md flex flex-col items-start justify-start p-4 gap-2">
            <ul className="menu bg-base-200 rounded-box w-40  grid grid-cols-2 gap-2">
              {orderByOptions.map((option) => (
                <li key={`order-${option}`}>
                  <button
                    className={`w-full text-center rounded-md cursor-pointer px-2 py-1 ${orderByValue === option ? 'bg-btn-bg text-btn-text' : 'bg-bg-main'}`}
                    onClick={() => setOrderByValue(option)}
                  >
                    {option}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="relative" ref={filterRef}>
        <button
          className="px-4 py-1.5 rounded-md hover:bg-btn-bg hover:text-btn-text cursor-pointer"
          onClick={() => {
            setFilterTrigger(!filterTrigger)
            setOrderByTrigger(false)
          }}
        >
          Filter <FontAwesomeIcon icon={faFilter} />
        </button>
        <div className={filterTrigger ? 'visible' : 'hidden'}>
          <div className="absolute w-150 top-10 left-0 border bg-bg-second border-border-color rounded-xl shadow-md flex-col items-start p-4 gap-4 tra">
            {
              Object.entries(filterOptions).map(([key, config]) => (
                <FilterItems
                  key={key}
                  name={config.label}
                  filterKey={key}
                  options={config.options}
                  value={filtersValue[key]}
                  setFiltersValue={setFiltersValue}
                />
              ))
            }
          </div>
        </div>
      </div>

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
    <div className="flex gap-3 my-1">
      <span className="w-30">{name}</span>
      <div className="flex gap-2 w-full">
        {options.map((option) => (
          <button
            key={`${filterKey}-${option}`}
            className={`w-full text-center rounded-md cursor-pointer px-2 py-1 ${ value === option ? 'bg-text-main text-bg-main' : 'bg-bg-main'}`}
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