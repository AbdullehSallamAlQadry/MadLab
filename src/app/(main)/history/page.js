'use client';

import { ControlBar } from "./components/ControlBar";
import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { getHistoryAction } from "./action";
import diagnosticsItems from '../diagnostics/diagnostics.json';
import { PopupResult } from "./components/result";
import { checkAuthStatus } from "@/components/session";

export default function History() {
  const [selectItem, setSelectItem] = useState(null);

  useEffect(() => {
    const verify = async () => {
      const isAuthenticated = await checkAuthStatus();
      if (!isAuthenticated) {
        window.location.href = "/";
      }
    };
    verify();
  }, []);

  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  const filterOptions = {
    bloodType: {
      label: 'Blood Type',
      options: ['all','A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
    },
    gender: {
      label: 'Gender',
      options: ['all', 'male', 'female'],
    },
    result: {
      label: 'Result',
      options: ['all', 'melanoma', 'benign'],
    },
    time: {
      label: 'Time',
      options: ['all', 'year', 'month', 'week', 'day'],
    },
  };
  const [filtersValue, setFiltersValue] = useState({
    bloodType: 'all',
    gender: 'all',
    result: 'all',
    time: 'all',
  })

  const orderByOptions = ['Newest','Oldest','Highest','Lowest']
  const [orderByValue, setOrderByValue] = useState('Newest');

  const [items, setItems] = useState([]);
  const [cursor, setCursor] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const observer = useRef();

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(searchTerm.trim()), 500);
    return () => clearTimeout(t);
  }, [searchTerm]);

  useEffect(() => {
    setItems([]);
    setCursor(null);
    setHasMore(true);
    loadMore(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filtersValue, orderByValue, debouncedSearch]);

  function getTime(time) {
    const now = new Date();
    switch(time){
        case 'day': now.setDate(now.getDate() - 1); break;
        case 'week': now.setDate(now.getDate() - 7); break;
        case 'month': now.setMonth(now.getMonth() - 1); break;
        case 'year': now.setFullYear(now.getFullYear() - 1); break;
        default: return null;
    }
    return now.toISOString();
}

  function getOrder(order) {
    switch(order) {
      case 'Newest':
        return '-created_at'
      case 'Oldest':
        return 'created_at'
      case 'Highest':
        return '-confidence'
      case 'Lowest':
      return 'confidence'
    }
  }

  const buildParams = (cursorParam) => {
    const params = new URLSearchParams();
    
    if (cursorParam) {
        const url = new URL(cursorParam);
        return url.search.substring(1); 
    }

    if (filtersValue.bloodType !== 'all') params.set('blood_type', filtersValue.bloodType);
    if (filtersValue.gender !== 'all') params.set('gender__iexact', filtersValue.gender);
    if (filtersValue.result !== 'all') params.set('result', filtersValue.result);
    
    const timeLimit = getTime(filtersValue.time);
    if (timeLimit) {
        params.set('created_at__lte', new Date().toISOString());
        params.set('created_at__gte', timeLimit);
    }

    if (debouncedSearch) params.set('search', debouncedSearch);
    
    params.set('ordering', getOrder(orderByValue)); 
    
    return params.toString();
  }

  const fetchPage = async (cursorParam) => {
    setLoading(true);
    const queryString = buildParams(cursorParam);
    const result = await getHistoryAction(queryString);
    setLoading(false);
    return result;
  };

  const loadMore = useCallback(async (isFirst = false) => {
    if (!hasMore && !isFirst) return;
    if (loading) return;
    const pageCursor = isFirst ? null : cursor;
    const { items: newItems = [], nextCursor = null } = await fetchPage(pageCursor);
    setItems(prev => isFirst ? newItems : [...prev, ...newItems]);
    setCursor(nextCursor);
    setHasMore(!!nextCursor);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cursor, hasMore, loading, debouncedSearch, filtersValue, orderByValue]);

  const lastElementRef = useCallback(node => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        loadMore();
      }
    });
    if (node) observer.current.observe(node);
  }, [loading, hasMore, loadMore]);

  return (
    <main className="min-h-145 flex flex-col items-center justify-start">
      <ControlBar 
        filterOptions={filterOptions} 
        filtersValue={filtersValue} 
        setFiltersValue={setFiltersValue} 
        orderByOptions={orderByOptions} 
        orderByValue={orderByValue} 
        setOrderByValue={setOrderByValue} 
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}  
      />

      <div className="w-5xl h-122 overflow-scroll">
        {items.length === 0 && !loading && <div className="p-6 text-center">No diagnostics to preview yet</div>}
        <ItemsList items={items} lastElementRef={lastElementRef} setSelectItem={setSelectItem}/>
        {loading && <div className="w-full h-15 flex justify-center items-center"><div className="pageLoader"></div></div>}
      </div>
      <PopupResult selectItem={selectItem} setSelectItem={setSelectItem} />
    </main>
  )
}

function ItemsList({items, lastElementRef, setSelectItem}) {
  const diagnosticsMap = useMemo(() => {
    const map = {};
    diagnosticsItems.forEach(category => {
      category.items.forEach(item => {
        map[item.name] = { image: item.image, color: category.color };
      });
    });
    return map;
  }, []);

  return (
    <ul className="flex flex-col gap-3 mb-4">
      {items.map((item, idx) => {
        const isLast = idx === items.length - 1;
        return (
          <Item key={item.id} isLast={isLast} item={item} lastElementRef={lastElementRef} setSelectItem={setSelectItem} diagnosticsMap={diagnosticsMap}/>
        );
      })}
    </ul>
  )
}

function Item({isLast, item, lastElementRef, setSelectItem, diagnosticsMap}) {
  const date = new Date(item.created_at).toLocaleDateString('en-GB'); 
  const hour = new Date(item.created_at).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
  });
  const type = item.checkup_type.toLowerCase().replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase());
  const config = diagnosticsMap[type] || { image: '', color: 'transparent' };
  return (
    <li
      ref={isLast ? lastElementRef : null}
      className="py-4 px-10 rounded-4xl bg-bg-second capitalize cursor-pointer focus:border focus:border-border-color"
      onClick={() => setSelectItem(item.id)}
    >
      <div className="flex gap-2 text-xl">
        <p>{date}</p>
        <p>{hour}</p>
      </div>
      <div className="flex justify-between w-full">
        <div className="flex justify-center items-center gap-3">
          <div style={{backgroundColor: config.color}} className={`w-10 h-10 p-2 rounded-xl`}>
            <img src={config.image} alt={type} className='h-full w-full' />
          </div>
          <p className="text-xl">{type}</p>
        </div>
        <div>
          <p className="text-text-second">id</p>
          <p>{item.id}</p>
        </div>
        <div>
          <p className="text-text-second">age</p>
          <p>{item.age}</p>
        </div>
        <div>
          <p className="text-text-second">gender</p>
          <p>{item.gender}</p>
        </div>
        <div>
          <p className="text-text-second">result</p>
          <p>{item.result}</p>
        </div>
        <div>
          <p className="text-text-second">confidence</p>
          <p>{(Number(item.final_confidence) * 100).toFixed(2)}</p>
        </div>
        <div>
          <p className="text-text-second">samples</p>
          <p>{item.image_count}</p>
        </div>
      </div>
    </li>
  )
}