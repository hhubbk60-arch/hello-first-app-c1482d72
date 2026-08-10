import { useEffect } from "react";
import { trackPageView } from "@/lib/tracking";

/** Records the page view (IP/geo resolved server-side) and time spent. */
export function VisitorTracker() {
  useEffect(() => trackPageView(), []);
  return null;
}