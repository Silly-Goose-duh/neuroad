"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { WaitlistDialog } from "@/components/waitlist-dialog";
import { track } from "@/lib/analytics";

type Ctx = {
  open: boolean;
  openWaitlist: () => void;
  setOpen: (v: boolean) => void;
};

const WaitlistContext = createContext<Ctx | null>(null);

export function WaitlistProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const openWaitlist = useCallback(() => {
    setOpen(true);
    track("waitlist_open");
  }, []);
  const value = useMemo(
    () => ({ open, openWaitlist, setOpen }),
    [open, openWaitlist],
  );
  return (
    <WaitlistContext.Provider value={value}>
      {children}
      <WaitlistDialog />
    </WaitlistContext.Provider>
  );
}

export function useWaitlist() {
  const ctx = useContext(WaitlistContext);
  if (!ctx) throw new Error("useWaitlist must be used within WaitlistProvider");
  return ctx;
}
