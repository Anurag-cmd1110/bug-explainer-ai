/**
 * Production AI Observability Client Core SDK Script
 * Automatically intercepts runtime application crashes and dispatches telemetry logs.
 */
export function initializeAiObservabilityTracker(projectId = "verisight_prod_mesh") {
  if (typeof window === "undefined") return; // Keep server-side rendering isolated safely

  window.addEventListener("error", async (event) => {
    const telemetryPayload = {
      project_id: projectId,
      error_message: event.message || String(event.error),
      file_path: event.filename || "unknown_context_scope",
      line_number: event.lineno || 0,
      environment: "development",
      timestamp: new Date().toISOString(),
      stack_trace: event.error?.stack || `${event.message} at ${event.filename}:${event.lineno}`
    };

    console.warn("🚨 AI Observability SDK: Intercepted crash! Shipping to Atlas...", telemetryPayload);

    try {
      const response = await fetch("http://localhost:8000/api/v1/logs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(telemetryPayload),
      });

      if (response.ok) {
        const data = await response.json();
        console.log(`🚀 Telemetry recorded. Mongo Log ID: ${data.log_id}`);
      }
    } catch (dispatchError) {
      console.error("❌ SDK ingestion transport pipe failed:", dispatchError);
    }
  });
}