"use client";

import { createContext, useContext, useState, useCallback } from "react";

interface ThreadDialogContextValue {
  isOpen: boolean;
  open: () => void;
  close: () => void;
}

const ThreadDialogContext = createContext<ThreadDialogContextValue>({
  isOpen: false,
  open: () => {},
  close: () => {},
});

export function ThreadDialogProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);

  return (
    <ThreadDialogContext.Provider value={{ isOpen, open, close }}>
      {children}
    </ThreadDialogContext.Provider>
  );
}

export function useThreadDialog() {
  return useContext(ThreadDialogContext);
}
