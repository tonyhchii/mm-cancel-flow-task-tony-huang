# Architecture Decisions

## Frontend
- **Redux + Thunks**  
  UI dispatches async thunks (`startCancellation`, `updateCancellationAnswers`, `acceptDownsell`, `completeCancellation`).  
  Thunks call server routes and, when needed, update local state (e.g., `cancellationId`, `userVariant`, `navigation`).

- **Modal-first UX**  
  The flow runs inside a modal shell. Screens are driven by the Redux `pageName` and `answers`.

- **Deterministic Variant in State**  
  When cancellation begins, the API assigns an A/B variant. The thunk stores it in Redux to keep the UI consistent.

---

## Backend
- **Database**  
  Supabase Postgres with three tables: `users`, `subscriptions`, `cancellations`.

- **API-only Write Path**  
  Next.js server routes (Node runtime) using a service-role Supabase client perform all writes.

- **Endpoints**
  - `POST /api/cancellation/create`  
    Creates (or returns) the single in-progress cancellation (enforced by a partial unique index).  
    Also moves the subscription to `pending_cancellation`.

  - `POST /api/cancellation/update`  
    Merges/replaces answers.

  - `POST /api/cancellation/accept-downsell`  
    Sets `accepted_downsell = true`, submits the cancellation, and flips subscription to `active`.

  - `POST /api/cancellation/complete`  
    Submits the cancellation; if downsell not accepted, flips subscription to `cancelled`.

---

## Row Level Security (RLS)
- RLS is enabled on all tables.  
- **Client:** End-user reads/writes use the **anon key** + policies.  
- **Server:** API writes use **service role** (bypass RLS) but still validate business rules in code (e.g., subscription must belong to user).

---

## A/B Testing Approach
- **Assignment Rule**  
  Variant is derived deterministically from the generated cancellation UUID:  
  - Even last hex digit → **Variant A**  
  - Odd last hex digit → **Variant B**
