# Day 2 Reflection — August 14

## What happened

No commits landed under my name today — this was more of a thinking-and-scoping day. With the charter settled, the open question was what the two MVP flows actually needed to do, especially the return/refund side, which is a lot fuzzier than "look up an order" if you don't pin it down first.

I put together a first version of the schema and rules based on my own read of the brief — I picked Order Status plus Stock Availability as the two categories and started sketching a schema around that. Once the team's actual agreed task list came through (Ann had logged it — order status and returns/refunds, not stock), it was clear I'd built against the wrong assumption. Nothing was committed yet at that point, so it didn't cost real rework in the repo, but it did mean scrapping a chunk of planning and starting the schema over against the right requirements.

## What went well

- Because I hadn't committed anything yet, correcting course cost me planning time, not a messy revert.
- Once I had the real requirements, the two-flow shape (status lookup + rules-based eligibility check) was quick to redesign properly.

## What was harder than expected

- I built ahead of confirming the requirement instead of checking with the team first, which is exactly the kind of thing our charter's "confirm before you build" spirit is meant to prevent. I didn't actually follow my own process here.
- With no commits to point to, this day is harder to evidence in the audit trail than the others — the actual work was requirements thinking, not code.

## Self-assessment

This was a useful mistake to make early and cheaply rather than later and expensively. The lesson is straightforward: confirm the agreed scope with the team before writing schema or rules for it, even if it feels obvious. I got lucky that "obvious" was wrong this time and I hadn't pushed anything yet.