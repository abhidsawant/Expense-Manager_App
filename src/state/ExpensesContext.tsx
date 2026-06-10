import React, { createContext, useReducer, useEffect, useCallback } from 'react';
import { Expense } from '../types';
import { getExpenses, setExpenses } from '../storage';

type Action =
  | { type: 'HYDRATE'; payload: Expense[] }
  | { type: 'ADD'; payload: Expense }
  | { type: 'UPDATE'; payload: Expense }
  | { type: 'DELETE'; payload: string }
  | { type: 'CLEAR' };

type State = { expenses: Expense[]; hydrated: boolean };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'HYDRATE': return { expenses: action.payload, hydrated: true };
    case 'ADD':     return { ...state, expenses: [action.payload, ...state.expenses] };
    case 'UPDATE':  return { ...state, expenses: state.expenses.map(e => e.id === action.payload.id ? action.payload : e) };
    case 'DELETE':  return { ...state, expenses: state.expenses.filter(e => e.id !== action.payload) };
    case 'CLEAR':   return { expenses: [], hydrated: true };
    default:        return state;
  }
}

export const ExpensesContext = createContext<{
  state: State;
  dispatch: React.Dispatch<Action>;
}>({ state: { expenses: [], hydrated: false }, dispatch: () => {} });

export function ExpensesProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, { expenses: [], hydrated: false });

  useEffect(() => {
    getExpenses().then(data => dispatch({ type: 'HYDRATE', payload: data }));
  }, []);

  useEffect(() => {
    if (state.hydrated) {
      const timer = setTimeout(() => setExpenses(state.expenses), 250);
      return () => clearTimeout(timer);
    }
  }, [state.expenses, state.hydrated]);

  return <ExpensesContext.Provider value={{ state, dispatch }}>{children}</ExpensesContext.Provider>;
}
