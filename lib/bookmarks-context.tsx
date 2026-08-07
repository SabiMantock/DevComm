"use client";

import { createContext, useContext, useState } from "react";

type BookmarksContextValue = {
  savedIds: Set<string>;
  archivedIds: Set<string>;
  isSaved: (postId: string) => boolean;
  isArchived: (postId: string) => boolean;
  toggleSave: (postId: string) => void;
  archive: (postId: string) => void;
  unarchive: (postId: string) => void;
};

const BookmarksContext = createContext<BookmarksContextValue | null>(null);

export const BookmarksProvider = ({ children }: { children: React.ReactNode }) => {
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());
  const [archivedIds, setArchivedIds] = useState<Set<string>>(new Set());

  const isSaved = (postId: string) => savedIds.has(postId);
  const isArchived = (postId: string) => archivedIds.has(postId);

  const toggleSave = (postId: string) => {
    setSavedIds((prev) => {
      const next = new Set(prev);
      if (next.has(postId)) {
        next.delete(postId);
      } else {
        next.add(postId);
      }
      return next;
    });
  };

  const archive = (postId: string) => {
    setSavedIds((prev) => {
      if (!prev.has(postId)) return prev;
      const next = new Set(prev);
      next.delete(postId);
      return next;
    });
    setArchivedIds((prev) => {
      const next = new Set(prev);
      next.add(postId);
      return next;
    });
  };

  const unarchive = (postId: string) => {
    setArchivedIds((prev) => {
      if (!prev.has(postId)) return prev;
      const next = new Set(prev);
      next.delete(postId);
      return next;
    });
    setSavedIds((prev) => {
      const next = new Set(prev);
      next.add(postId);
      return next;
    });
  };

  return (
    <BookmarksContext.Provider value={{ savedIds, archivedIds, isSaved, isArchived, toggleSave, archive, unarchive }}>
      {children}
    </BookmarksContext.Provider>
  );
};

export const useBookmarks = () => {
  const context = useContext(BookmarksContext);
  if (!context) {
    throw new Error("useBookmarks must be used within a BookmarksProvider");
  }
  return context;
};
