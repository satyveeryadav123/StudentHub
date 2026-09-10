"use client";

import { useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

export default function VisitorTracker() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    const trackVisit = async () => {
      try {
        // Get or create persistent visitor ID
        let visitorId = localStorage.getItem("sh_visitor_id");
        if (!visitorId) {
          visitorId = `v_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
          localStorage.setItem("sh_visitor_id", visitorId);
        }

        const todayDate = new Date().toISOString().split("T")[0];
        const lastTracked = localStorage.getItem("sh_last_tracked_date");

        if (lastTracked !== todayDate) {
          const supabase = createClient();
          const { error } = await supabase
            .from("daily_visits")
            .upsert(
              {
                visited_date: todayDate,
                visitor_id: visitorId,
              },
              { onConflict: "visited_date,visitor_id", ignoreDuplicates: true }
            );

          if (!error) {
            localStorage.setItem("sh_last_tracked_date", todayDate);
          }
        }
      } catch {
        // Silently fail if table not created yet in Supabase or client storage blocked
      }
    };

    trackVisit();
  }, []);

  return null;
}
