# Loom Demo Script (3-4 mins)

This script is designed to help you record the walkthrough video required for the assessment.

**Goal:** Explain your implementation, demonstrating the requirements (Search, Graph, Filters, Responsive) and your design decisions.

---

## 1. Introduction (0:00 - 0:30)
- **Action:** Start on the landing page (Desktop).
- **Script:**
  > "Hi, I'm [Your Name]. This is my submission for the Flight Search Engine assessment. I've built a responsive React application using Vite, TypeScript, and the Amadeus Self-Service API."
  > "My goal was to create a modern, fast, and utility-focused experience similar to Google Flights but with a unique, premium design."

## 2. Search Functionality (0:30 - 1:00)
- **Action:** Interact with the Search Form. Type "New" in Origin to show autocomplete.
- **Script:**
  > "Let's start with the search. I implemented a custom autocomplete component that debounces API calls to fetch airport codes in real-time."
  > "I'm using `TanStack Query` to handle data fetching and caching, ensuring that recent searches load instantly."
- **Action:** Select Dates and click "Search Flights".

## 3. Results & Live Price Graph (1:00 - 2:00)
- **Action:** Allow results to load. Point to the graph.
- **Script:**
  > "Here are the results. The core feature requested was the Live Price Graph. I built this using `Recharts`."
  > "It visualizes the lowest price per airline. Notice that if I hover, I get a custom tooltip with details."
  > "Wait for it... watch what happens when I filter."

## 4. Complex Filtering & State Sync (2:00 - 3:00)
- **Action:** Open the Filter Sidebar. Uncheck "1 Stop" or adjust the Price Slider.
- **Script:**
  > "I'm using `Zustand` for state management. This allows for **instant synchronization**."
  > "As I slide the price range or uncheck stops, you'll see both the flight list AND the graph update immediately without re-fetching from the API."
  > "This provides a highly responsive 'app-like' feel, which was a key technical requirement."

## 5. Mobile Responsiveness & Polish (3:00 - 3:30)
- **Action:** Switch to Mobile View (DevTools) or resize the window.
- **Script:**
  > "The app is fully responsive. On mobile, the filter sidebar transforms into a touch-friendly drawer."
  > "I've also added polish features like **Skeleton Loading** states and a **'Best Value' badge** that automatically highlights the cheapest flight."

## 6. Code Architecture (3:30 - 4:00)
- **Action:** Briefly show VS Code (optional) or just sum up.
- **Script:**
  > "Updates are optimized using React `useMemo` selectors to avoid unnecessary re-renders."
  > "The codebase is production-ready with full TypeScript strict mode, global Error Boundaries, and automated unit tests using Vitest."
  > "Thank you for watching!"
