"use client";

import { createContext, useContext, useState } from "react";

const BookingQueryContext = createContext(null);

export function BookingQueryProvider({ children }) {
  const [query, setQueryState] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);

  function setQuery(next) {
    setQueryState(next);
    // A fresh query invalidates any date picked against the previous one.
    setSelectedDate(null);
  }

  return (
    <BookingQueryContext.Provider
      value={{ query, setQuery, selectedDate, setSelectedDate }}
    >
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
