import {create} from "zustand";
import axios from "axios";

export interface BookDoc {
  key: string;
  title: string;
  author_name?: string[];
  cover_i?: number;
  first_publish_year?: number;
  subject?: string[];
  // other fields possible
}

interface State {
  query: string;
  page: number;
  books: BookDoc[];
  numFound: number;
  loading: boolean;
  error?: string | null;
  favorites: string[]; // keys
  selected?: BookDoc | null;
  setQuery: (q: string) => void;
  searchBooks: (reset?: boolean) => Promise<void>;
  loadMore: () => Promise<void>;
  toggleFav: (key: string) => void;
  selectBook: (book: BookDoc | null) => void;
}

const LOCAL_FAV = "bf_favorites_v1";

export const useBookStore = create<State>((set, get) => ({
  query: "",
  page: 1,
  books: [],
  numFound: 0,
  loading: false,
  error: null,
  favorites: (() => {
    try {
      const v = localStorage.getItem(LOCAL_FAV);
      return v ? JSON.parse(v) : [];
    } catch {
      return [];
    }
  })(),
  selected: null,

  setQuery: (q) => set({ query: q }),

  searchBooks: async (reset = false) => {
    const { query } = get();
    if (!query.trim()) {
      set({ books: [], numFound: 0 });
      return;
    }
    const page = reset ? 1 : get().page;
    set({ loading: true, error: null });
    try {
      const params = new URLSearchParams({
        title: query,
        page: String(page),
      });
      // limit handled on frontend by slicing; API returns many docs
      const res = await axios.get(`https://openlibrary.org/search.json?${params.toString()}`);
      const data = res.data;
      set((s: { books: any; }) => ({
        books: reset ? data.docs : [...s.books, ...data.docs],
        numFound: data.numFound || 0,
        page: page + 1,
        loading: false,
      }));
    } catch (err: any) {
      set({ error: err.message || "Failed to fetch", loading: false });
    }
  },

  loadMore: async () => {
    await get().searchBooks(false);
  },

  toggleFav: (key) => {
    set((s) => {
      const next = s.favorites.includes(key) ? s.favorites.filter(k => k !== key) : [...s.favorites, key];
      try { localStorage.setItem(LOCAL_FAV, JSON.stringify(next)); } catch {}
      return { favorites: next };
    });
  },

  selectBook: (book) => set({ selected: book }),
}));
