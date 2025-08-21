###Architecture Decisions

##Frontend

Redux + thunks: UI dispatches async thunks (startCancellation, updateCancellationAnswers, acceptDownsell, completeCancellation). Thunks call server routes and, when needed, update local state (e.g., cancellationId, userVariant, navigation).

Modal-first UX: The flow runs inside a modal shell. Screens are driven by the Redux pageName and answers.

Deterministic variant in state: When cancellation begins, the API assigns A/B variant and the thunk stores it in Redux to keep UI consistent.

##Backend

Supabase Postgres with three tables: users, subscriptions, cancellations.

API-only write path: Next.js server routes (Node runtime) using a service-role Supabase client perform all writes.

POST /api/cancellation/create — create or return the single in-progress cancellation (enforced by a partial unique index). Also moves the subscription to pending_cancellation.

POST /api/cancellation/update — merge/replace answers.

POST /api/cancellation/accept-downsell — sets accepted_downsell=true, submits the cancellation, and flips subscription to active.

POST /api/cancellation/complete — submits the cancellation; if downsell not accepted, flips subscription to cancelled.

##Row Level Security (RLS)

RLS is enabled on all tables. For end-user reads/writes from the client you’d use the anon key + policies.

Server API writes use service role (bypass RLS) but still validate business rules in code (e.g., subscription must belong to user).

##A/B Testing Approach

Assignment

Variant is derived deterministically from the generated cancellation UUID: even last hex digit → A, odd → B. This is:
