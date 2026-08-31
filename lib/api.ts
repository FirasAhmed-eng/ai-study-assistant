/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Fetches data with a built-in timeout and automatic retry logic.
 */
export async function fetchWithRetry(
  url: string,
  options: RequestInit = {},
  retries = 2,
  timeoutMs = 15000 // 15 seconds max per request
) {
  for (let i = 0; i < retries; i++) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const response = await fetch(url, { ...options, signal: controller.signal });
      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status}`);
      }

      const data = await response.json();
      
      // Empty-response guard
      if (!data) throw new Error("Empty response received from AI.");
      
      return data;
      
    } catch (error: any) {
      clearTimeout(timeoutId);
      
      // If it's the last attempt, bubble the error up to the UI
      if (i === retries - 1) {
        throw new Error(error.name === "AbortError" ? "Request timed out." : error.message);
      }
      
      console.warn(`Request failed. Retrying... (${i + 1}/${retries})`);
    }
  }
}