import { useEffect } from "react";
import { useBookStore } from "../store/useBookStore.ts";
import BookCard from "../components/BookCard.tsx";
import BookModal from "../components/BookModal.tsx";
import { motion, AnimatePresence } from "framer-motion";

export default function App() {
  const {
    query,
    setQuery,
    books,
    loading,
    searchBooks,
    loadMore,
    favorites,
    toggleFav,
    selected,
    selectBook,
    numFound,
  } = useBookStore();

  // Initial demo query
  useEffect(() => {
    if (!query) {
      setQuery("The Hobbit");
      setTimeout(() => searchBooks(true), 150);
    }
  }, []);

  const onSearch = async (e?: React.FormEvent) => {
    e?.preventDefault();
    await searchBooks(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-sky-50 p-6">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-5xl mx-auto"
      >
        <div className="text-center mb-6">
          <h1 className="text-3xl md:text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-700 to-sky-600">
            📚 Book Finder
          </h1>
          <p className="text-gray-600 mt-2">
            Search books from Open Library & explore details
          </p>
        </div>

        <form
          onSubmit={onSearch}
          className="flex flex-col sm:flex-row items-center gap-3 mb-10"
        >
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="input input-bordered glass w-full sm:flex-1 rounded-full shadow-md placeholder-gray-400 focus:ring-2 focus:ring-sky-300 focus:border-transparent transition-all"
            placeholder="Search books by title (e.g. The Hobbit)"
          />
          <button
            type="submit"
            className="btn btn-primary rounded-full px-6 py-2 shadow-md hover:scale-105 transition-transform"
          >
            Search
          </button>
        </form>

        <div className="text-right text-gray-500 text-sm">
          Favorites: <strong>{favorites.length}</strong>
        </div>
      </motion.header>

      {/* Main content */}
      <main className="max-w-5xl mx-auto">
        {loading && (
          <p className="text-center text-gray-500 mb-4 animate-pulse">
            Loading books...
          </p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {books.map((b, i) => (
            <BookCard
              key={b.key}
              book={b}
              index={i}
              onClick={(book) => selectBook(book)}
              isFav={favorites.includes(b.key)}
              onToggleFav={toggleFav}
            />
          ))}
        </div>

        {books.length > 0 && books.length < numFound && (
          <div className="text-center mt-8">
            <button
              onClick={() => loadMore()}
              className="btn btn-outline rounded-full shadow hover:scale-105 transition-transform"
            >
              Load more
            </button>
          </div>
        )}

        {!loading && books.length === 0 && (
          <div className="text-center text-gray-400 mt-14">
            Try searching for <strong>The Hobbit</strong>,{" "}
            <strong>Harry Potter</strong>, or <strong>Atomic Habits</strong>.
          </div>
        )}
      </main>

      {/* Modal */}
      <AnimatePresence>
        {selected && (
          <BookModal book={selected} onClose={() => selectBook(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}
