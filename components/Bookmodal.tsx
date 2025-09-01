import { useEffect, useState } from "react";
import type { BookDoc } from "../store/useBookStore.ts";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
  book: BookDoc | null;
  onClose: () => void;
}

export default function BookModal({ book, onClose }: Props) {
  const [desc, setDesc] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!book) return;
    const key = book.key;
    const fetchDetails = async () => {
      setLoading(true);
      setDesc(null);
      try {
        const res = await axios.get(`https://openlibrary.org${key}.json`);
        const d = res.data.description;
        setDesc(typeof d === "string" ? d : d?.value || null);
      } catch {
        setDesc(null);
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [book]);

  if (!book) return null;

  const cover = book.cover_i
    ? `https://covers.openlibrary.org/b/id/${book.cover_i}-L.jpg`
    : null;
  const openUrl = `https://openlibrary.org${book.key}`;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* Overlay */}
        <div
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        />

        {/* Modal card */}
        <motion.div
          initial={{ y: 50, opacity: 0, scale: 0.95 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 20, opacity: 0, scale: 0.95 }}
          transition={{ type: "spring", stiffness: 200, damping: 25 }}
          className="relative max-w-3xl w-full mx-4 bg-white/90 backdrop-blur-lg rounded-3xl shadow-2xl overflow-hidden border border-white/20"
        >
          <div className="flex flex-col md:flex-row">
            {/* Cover Image */}
            <div className="md:w-1/3 bg-gradient-to-b from-sky-100/30 to-indigo-100/30 flex items-center justify-center">
              {cover ? (
                <motion.img
                  src={cover}
                  alt={book.title}
                  className="w-full h-72 object-cover rounded-b-3xl md:rounded-none"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                />
              ) : (
                <div className="w-full h-72 flex items-center justify-center bg-gray-200 rounded-b-3xl md:rounded-none text-gray-500 text-lg">
                  No Cover
                </div>
              )}
            </div>

            {/* Details */}
            <div className="p-6 md:w-2/3 flex flex-col justify-between">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-indigo-700">
                  {book.title}
                </h2>
                <p className="text-sm md:text-base text-gray-600 mt-1">
                  {book.author_name?.join(", ") || "Unknown Author"}
                </p>
                <p className="text-xs md:text-sm text-gray-500 mt-1">
                  First published: {book.first_publish_year || "N/A"}
                </p>

                {/* Description */}
                <div
                  className="mt-4 text-gray-700 text-sm md:text-base max-h-48 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 pr-2"
                >
                  {loading ? (
                    <p className="animate-pulse text-gray-500">Loading details...</p>
                  ) : desc ? (
                    <p>{desc}</p>
                  ) : (
                    <p className="text-gray-400">No description available.</p>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="mt-6 flex flex-col sm:flex-row gap-3">
                <a
                  href={openUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-primary w-full sm:w-auto rounded-full hover:scale-105 transition-transform"
                >
                  Open on OpenLibrary
                </a>
                <button
                  onClick={onClose}
                  className="btn btn-ghost w-full sm:w-auto rounded-full hover:bg-gray-100 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
