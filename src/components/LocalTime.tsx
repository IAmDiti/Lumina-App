"use client";

import { useEffect, useState } from "react";
import { formatDateLocal, formatDateStable } from "@/lib/formatDate";

export function LocalTime({ iso }: { iso: string }) {
  const [label, setLabel] = useState(() => formatDateStable(iso));
  useEffect(() => {
    // Upgrade to the viewer's real locale/timezone once mounted; can't run
    // during the initial render or it would mismatch the server's output.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLabel(formatDateLocal(iso));
  }, [iso]);
  return <time dateTime={iso}>{label}</time>;
}
