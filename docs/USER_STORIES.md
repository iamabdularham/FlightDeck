# User Stories
## FlightDeck (formerly SkyScanner Pro)

**Sprint:** MVP Release  
**Author:** Abdul Arham  
**Date:** January 16, 2026  

---

## Epic: Flight Search & Discovery

### US-001: Search for Flights by Route and Date
**As a** traveler,  
**I want to** search for flights by entering origin, destination, and travel dates,  
**So that** I can find available flight options for my trip.

#### Acceptance Criteria
- [ ] Search form displays origin and destination input fields with autocomplete
- [ ] Typing 2+ characters triggers airport suggestions within 500ms
- [ ] Date picker prevents selection of past dates
- [ ] "Search Flights" button is disabled until all required fields are valid
- [ ] Successful search displays results list and price graph
- [ ] Loading skeleton appears while fetching results

#### Technical Notes
- Use Amadeus Airport & City Search API for autocomplete
- Debounce input by 300ms to reduce API calls

---

### US-002: Filter Flights by Number of Stops
**As a** busy traveler,  
**I want to** filter flights by the number of stops (non-stop, 1 stop, 2+ stops),  
**So that** I can find flights that match my schedule preferences.

#### Acceptance Criteria
- [ ] Three checkbox options available: "Non-stop", "1 stop", "2+ stops"
- [ ] All options are checked by default
- [ ] Unchecking an option instantly removes matching flights from results
- [ ] Flight count updates in real-time (e.g., "23 flights" → "15 flights")
- [ ] Filtering completes in < 200ms (no visible lag)
- [ ] Empty state message if no flights match filters

---

### US-003: Filter Flights by Price Range
**As a** budget-conscious traveler,  
**I want to** filter flights within a specific price range,  
**So that** I can find options that fit my budget.

#### Acceptance Criteria
- [ ] Dual-handle slider displays min ($0) to max (dynamic based on results)
- [ ] Slider handles can be dragged to set custom range
- [ ] Price labels update as handles move
- [ ] Results update instantly as slider values change
- [ ] Price range can be entered manually via input fields
- [ ] Graph Y-axis adjusts to show only filtered price range

---

### US-004: Filter Flights by Airline
**As a** frequent flyer with airline loyalty,  
**I want to** filter flights by specific airlines,  
**So that** I can earn miles and enjoy familiar service.

#### Acceptance Criteria
- [ ] Dynamic list of airlines extracted from search results
- [ ] Each airline displays checkbox with name and flight count
- [ ] Selecting/deselecting airline updates results instantly
- [ ] "Select All" and "Clear All" buttons available
- [ ] Airlines with 0 matching flights after other filters are dimmed

---

## Epic: Visual Price Analysis

### US-005: View Live Price Graph ⭐ (Critical Feature)
**As a** data-driven traveler,  
**I want to** see a visual graph of flight prices by airline,  
**So that** I can quickly identify the best value options.

#### Acceptance Criteria
- [ ] Bar chart displays with airlines on X-axis and prices on Y-axis
- [ ] Chart renders within 1 second of search results loading
- [ ] **CRITICAL:** Graph updates instantly when any filter is applied
- [ ] Hover/tap on bar shows tooltip with:
  - Airline name
  - Minimum price
  - Number of flights
- [ ] Chart is responsive and readable on mobile devices
- [ ] Animation smoothly transitions when data changes
- [ ] Clicking a bar filters results to only that airline

#### Definition of Done
- [ ] Performance test confirms filter → graph update < 200ms
- [ ] Visual regression test passes for chart rendering
- [ ] Accessibility audit confirms chart has proper ARIA labels

#### Technical Implementation Details
```
Component: PriceGraph.tsx
Library: Recharts (BarChart)
Data Flow: 
  Zustand filteredResults → useMemo transformation → ChartData → Recharts
State Sync:
  - Graph subscribes to `filteredResults` in Zustand store
  - Memoized selector prevents unnecessary re-renders
  - Recharts AnimationDuration: 300ms
```

---

### US-006: Identify Best Value Flight
**As a** price-conscious traveler,  
**I want to** quickly see which flight offers the best value,  
**So that** I don't have to manually compare all options.

#### Acceptance Criteria
- [ ] Cheapest flight in filtered results displays "Best Value" badge
- [ ] Badge is visually prominent (green color with icon)
- [ ] Badge updates if filters change the cheapest option
- [ ] Badge only appears if there are 2+ flights in results
- [ ] Hover on badge explains criteria ("Lowest price in your search")

---

## Epic: User Experience Polish

### US-007: Experience Fast, Skeleton Loading States
**As a** user with potentially slow internet,  
**I want to** see skeleton placeholders while content loads,  
**So that** I know the app is working and can anticipate the layout.

#### Acceptance Criteria
- [ ] Flight card skeletons appear during API fetch
- [ ] Graph area shows skeleton chart placeholder
- [ ] Skeleton animation is subtle (pulse or shimmer)
- [ ] Actual content replaces skeleton without layout shift
- [ ] Error state replaces skeleton if API fails

---

### US-008: Use the App Seamlessly on Mobile Devices
**As a** mobile user,  
**I want to** search and filter flights on my phone,  
**So that** I can book travel on the go.

#### Acceptance Criteria
- [ ] All features accessible on 375px viewport width
- [ ] Filter sidebar converts to bottom sheet on mobile
- [ ] Touch targets are minimum 44x44px
- [ ] Graph is horizontally scrollable if needed on small screens
- [ ] No horizontal overflow or layout breakage
- [ ] Virtual keyboard doesn't obstruct form inputs

---

## Story Map Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                          USER JOURNEY                               │
├─────────────┬─────────────┬─────────────┬─────────────┬────────────┤
│   SEARCH    │   FILTER    │   ANALYZE   │   SELECT    │   BOOK     │
├─────────────┼─────────────┼─────────────┼─────────────┼────────────┤
│  US-001     │  US-002     │  US-005 ⭐  │  US-006     │  (Future)  │
│  Search     │  Stops      │  Graph      │  Best Value │            │
│  Form       │  Filter     │  View       │  Badge      │            │
├─────────────┼─────────────┼─────────────┼─────────────┼────────────┤
│             │  US-003     │             │             │            │
│             │  Price      │             │             │            │
│             │  Filter     │             │             │            │
├─────────────┼─────────────┼─────────────┼─────────────┼────────────┤
│             │  US-004     │             │             │            │
│             │  Airline    │             │             │            │
│             │  Filter     │             │             │            │
├─────────────┴─────────────┴─────────────┴─────────────┴────────────┤
│                        SUPPORTING STORIES                           │
├─────────────┬─────────────────────────────────────────────────────┬─┤
│  US-007     │  US-008                                             │ │
│  Skeleton   │  Mobile Responsiveness                              │ │
│  Loading    │                                                     │ │
└─────────────┴─────────────────────────────────────────────────────┴─┘
```

---

## Priority Matrix

| Story | Priority | Effort | Value | Sprint |
|-------|----------|--------|-------|--------|
| US-001 | P0 | M | High | MVP |
| US-002 | P0 | S | High | MVP |
| US-003 | P0 | M | High | MVP |
| US-004 | P0 | S | Medium | MVP |
| US-005 | P0 | L | Critical | MVP |
| US-006 | P1 | S | Medium | MVP |
| US-007 | P1 | S | Medium | MVP |
| US-008 | P0 | M | High | MVP |

**Legend:** S = Small (< 4hrs), M = Medium (4-8hrs), L = Large (8-16hrs)

---

## Definition of Ready (DoR)

A story is ready for development when:
- [ ] Acceptance criteria are clear and testable
- [ ] Technical dependencies are identified
- [ ] Design mockups available (if UI-heavy)
- [ ] API endpoints documented
- [ ] Story is estimated and prioritized

## Definition of Done (DoD)

A story is complete when:
- [ ] All acceptance criteria pass
- [ ] Code reviewed and merged
- [ ] Unit tests written (if applicable)
- [ ] No console errors or warnings
- [ ] Works on mobile and desktop
- [ ] Accessibility check passed
