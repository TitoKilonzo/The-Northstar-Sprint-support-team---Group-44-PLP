# Day 3 Reflection — August 15

## What happened

Most of the technical development and debugging came together on this day. Tito had initially developed a substantial portion of the project and provided the files, while we continued developing and troubleshooting the system together during our sessions.

As the work progressed, I ended up making many of the changes needed to get the combined project functioning correctly. This included working through the frontend, API behaviour, database-related issues, and the overall user flow.

The audit trail shows a substantial amount of project activity from Tito on this date, including changes to:

- `route.ts`
- `db.ts`
- `seed.mjs`
- `page.tsx`
- `README.md`
- `.gitignore`
- Return eligibility functionality
- System documentation

My own audit activity included:

- `78ed84c` — Add project updates
- `fd7f5b2` — Merge branch from the team's repository
- `9d31388` — Establish Northstar design system
- `0a07d2c` — Update gitignore
- `e6f099a` — Working MVP checkpoint

I also worked through the user-facing experience, including the order-status and return/refund flows, and checked that the interface and functionality made sense together.

## What went well

- I managed to take a project that had been developed in different pieces and work through the integration problems instead of abandoning the existing work.
- I became more comfortable debugging API and frontend issues.
- I was able to identify visual problems and make UI adjustments based on how the actual application looked and behaved.
- The core MVP flows became functional: customers can check an order and check return eligibility.
- I also became more aware of the difference between something merely appearing on screen and actually working end-to-end.

## What was harder than expected

- Debugging was the biggest challenge. There were times when I was unsure whether an issue was caused by the component structure, API, database, or incorrect data.
- Working with code initially created by another teammate meant I had to understand the existing logic before changing it.
- Some changes that seemed small visually affected other parts of the application, so I had to test repeatedly.
- Because the team was behind schedule, I had to take on more of the implementation and integration work than originally planned.

## Self-assessment

This was probably the most technically challenging part of the sprint for me. I did not understand every piece immediately, but I improved by testing, asking questions, tracing the code, and making changes one at a time. I also learned that debugging is not necessarily about knowing the answer immediately; it is about systematically finding where the problem is.