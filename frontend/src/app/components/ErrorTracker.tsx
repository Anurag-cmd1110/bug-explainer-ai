"use client";

import { useEffect } from "react";
import { initializeAiObservabilityTracker } from "../tracker";

export function ErrorTracker() {
  useEffect(() => {
    // This starts tracking errors automatically as soon as the client browser loads
    initializeAiObservabilityTracker("verisight_frontend_app");
  }, []);

  return null; // Runs silently in the background
}