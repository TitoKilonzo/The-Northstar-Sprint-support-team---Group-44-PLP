# Day 3 Reflection — August 15

## What happened

With the real scope confirmed — Order Status and Return/Refund Eligibility — I built the first working version of the MVP. That meant the database schema, both API routes (`order-status` and `return-eligibility`), seed data covering valid and invalid test scenarios, the dashboard UI for both flows, and a README explaining how to run it and what the rules were. I used AI-assisted tooling to scaffold the Next.js/Tailwind/Turso boilerplate quickly, then went through the generated code myself, adjusted the rule logic, ran the seed script, built the project, and tested each flow by hand before treating it as done.

My commits for the day:

- `75ff4c6` — Update README.md
- `2fa1c37` — Update .gitignore
- `423cae1` — Update page.tsx
- `412395b` — Update db.ts
- `a89a4ac` — Update route.ts
- `0bb9616` — Update route.ts
- `463f2e2` — Update seed.mjs
- `7975b48` — Update TEAM_CHARTER.md

## What went well

- Once the requirements were actually locked in, the build itself came together quickly — schema, endpoints, and UI all lined up with what we'd agreed on.
- I tested each rule directly (order not found, delivered-in-window, delivered-too-late, still in transit, final sale) against the running app rather than just eyeballing the code, and every case came back with the right result before I called it working.
- The return-eligibility logic was written as a clear sequence of checks, which made it easy to reason about and test one rule at a time.

## What was harder than expected

- I'd already burned time on Day 2 building against the wrong two categories, so part of today was redoing groundwork I could have avoided by confirming scope earlier.
- Getting the local database and seed data to a state that actually demonstrated both a working and a failing case for every rule took more iteration than I expected — it's easy to seed data that only shows the happy path.

## Self-assessment

I'm comfortable owning the technical build once the requirements are actually settled, and I made a point of testing behaviour rather than just shipping code that compiled. The main thing I'd change is upstream of the code: confirming scope with the team before building it, not after.