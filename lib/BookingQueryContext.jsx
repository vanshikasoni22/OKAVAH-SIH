"use client";

import { createContext, useContext, useState } from "react";

const BookingQueryContext = createContext(null);

export function BookingQueryProvider({ children }) {
  const [query, setQuery] = useState(null);

  return (
    <BookingQueryContext.Provider value={{ query, setQuery }}>
      {children}
    </BookingQueryContext.Provider>
  );
}

export function useBookingQuery() {
  const ctx = useContext(BookingQueryContext);
  if (!ctx) {
    throw new Error("useBookingQuery must be used within a BookingQueryProvider");
  }
  return ctx;
}
