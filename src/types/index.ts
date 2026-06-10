export type Theme = 'light' | 'dark' | 'system';

export type Settings = {
  username: string;
  theme: Theme;
  currency: string;
};

export type Category = {
  id: string;
  name: string;
  color: string;
  icon: string;
  is_default: boolean;
};

export type Expense = {
  id: string;
  amount_cents: number;
  category_id: string;
  spent_on: string; // 'YYYY-MM-DD'
  note: string | null;
  receipt_uri: string | null;
  created_at: string;
};
