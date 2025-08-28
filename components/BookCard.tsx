import React from "react";
import { type BookDoc } from "../store/useBookStore";
import { motion } from "framer-motion";

interface Props {
  book: BookDoc;
  onClick: (b: BookDoc) => void;
  isFav: boolean;
  onToggleFav: (key: string) => void;
  index: number;
}

export default function BookCard({
  book,
  onClick,
  isFav,
  onToggleFav,
  index,
}: Props) {
  const cover = book.cover_i
    ? `https://covers.openlibrary.org/b/id/${book.cover_i}-L.jpg`
    : null;
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: index * 0.04 }}
      className="card glass shadow-lg rounded-2xl overflow-hidden cursor-pointer hover:scale-[1.02] transition-transform"
      onClick={() => onClick(book)}
    >
      {cover ? (
        <img
          src={cover}
          alt={book.title}
          className="w-full h-56 object-cover"
        />
      ) : (
        <div className="w-full h-56 bg-gray-200 flex items-center justify-center text-gray-500">
          No Cover
        </div>
      )}
      <div className="p-4">
        <h3 className="font-semibold text-lg line-clamp-2">{book.title}</h3>
        <p className="text-sm text-gray-600 mt-1">
          {book.author_name?.join(", ") || "Unknown"}
        </p>
        <div className="flex items-center justify-between mt-3">
          <p className="text-xs text-gray-500">
            {book.first_publish_year || "Year N/A"}
          </p>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleFav(book.key);
            }}
            className={`btn btn-ghost btn-sm ${
              isFav ? "text-yellow-400" : "text-gray-400"
            }`}
          >
            {isFav ? "★" : "☆"}
          </button>
        </div>
      </div>
    </motion.div>
  );
}
