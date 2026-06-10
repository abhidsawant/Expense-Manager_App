import React, { createContext, useReducer, useEffect } from 'react';
import { Category } from '../types';
import { getCategories, setCategories, DEFAULT_CATEGORIES } from '../storage';

type Action =
  | { type: 'HYDRATE'; payload: Category[] }
  | { type: 'ADD'; payload: Category }
  | { type: 'UPDATE'; payload: Category }
  | { type: 'DELETE'; payload: string }
  | { type: 'RESET' };

function reducer(state: Category[], action: Action): Category[] {
  switch (action.type) {
    case 'HYDRATE': return action.payload;
    case 'ADD':     return [...state, action.payload];
    case 'UPDATE':  return state.map(c => c.id === action.payload.id ? action.payload : c);
    case 'DELETE':  return state.filter(c => c.id !== action.payload);
    case 'RESET':   return DEFAULT_CATEGORIES;
    default:        return state;
  }
}

export const CategoriesContext = createContext<{
  categories: Category[];
  dispatch: React.Dispatch<Action>;
}>({ categories: [], dispatch: () => {} });

export function CategoriesProvider({ children }: { children: React.ReactNode }) {
  const [categories, dispatch] = useReducer(reducer, []);

  useEffect(() => {
    getCategories().then(data => dispatch({ type: 'HYDRATE', payload: data }));
  }, []);

  useEffect(() => {
    if (categories.length > 0) {
      setCategories(categories);
    }
  }, [categories]);

  return <CategoriesContext.Provider value={{ categories, dispatch }}>{children}</CategoriesContext.Provider>;
}
