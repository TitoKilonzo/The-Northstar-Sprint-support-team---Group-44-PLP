# Northstar Support Desk — System Documentation

## 1. System Overview

### 1.1 Project Name

**Northstar Support Desk**

### 1.2 Purpose

Northstar Support Desk is a self-service Support Deflection MVP developed for **Northstar Retail Co.**

The system is designed to reduce repetitive support requests by allowing customers to resolve common questions without contacting a support agent.

The MVP currently covers two support categories:

1. **Order Status**
2. **Returns / Refund Eligibility**

The implementation follows a rules-based self-service approach rather than a chatbot or AI-based support system.

## 2. MVP Scope

The system provides customers with two primary self-service journeys.

### Flow 1 — Order Status

A customer enters their order number and receives:

* Order number
* Customer name
* Current order status
* Delivery progress
* Order placement date
* Delivery date, where applicable

The supported order stages are:

**Processing → Shipped → In Transit → Delivered**

If the order number cannot be found, the system displays an error message rather than requiring the customer to contact a support agent.

### Flow 2 — Returns / Refund Eligibility

A customer first enters their order number.

After the order is found, the system allows the customer to:

1. Select the item they want to return.
2. Select a reason for the return.
3. Select the item's current condition.
4. Submit the request for an eligibility check.

The system then evaluates the request against the configured return policy and returns either:

* **Eligible**
* **Not eligible**

The response also provides the reason for the decision.

# 3. Technology Stack

The MVP uses the following technologies:

* **Next.js** — application framework
* **React** — user interface
* **JavaScript / TypeScript** — application logic
* **Tailwind CSS** — interface styling
* **SQLite / libSQL** — local database
* **Node.js** — development/runtime environment
* **Git & GitHub** — version control and collaboration

The application is designed to run locally without requiring a production database or external service configuration.

# 4. System Architecture

The system follows a simple frontend/API/database structure.

```text
Customer
   │
   ▼
Northstar Support Desk UI
   │
   ├───────────────┐
   │               │
   ▼               ▼
Order Status     Return Eligibility
API              API
   │               │
   └───────┬───────┘
           ▼
      SQLite / libSQL
           │
           ▼
      Mock Order Data
```

The frontend communicates with backend API routes.

The API routes retrieve order information and apply the return eligibility rules.

The database contains mock order and item information used for the MVP and QA testing.

---

# 5. Project Structure

The main application structure is:

```text
app/
  api/
    order-status/
      route.ts

    return-eligibility/
      route.ts

  page.tsx

lib/
  db.ts

scripts/
  seed.mjs

local.db
```

### `app/page.tsx`

Contains the main customer-facing interface and both self-service flows.

It includes:

* Order status interface
* Return/refund interface
* Status tracking component
* Return eligibility form
* Error handling
* Loading states
* Customer-facing results

### `app/api/order-status/route.ts`

Handles order lookup requests.

Example:

```text
GET /api/order-status?order_id=NS-90001
```

The endpoint retrieves the requested order and returns its information.

It is also used by the return flow to retrieve the order and its associated items.

### `app/api/return-eligibility/route.ts`

Handles return eligibility checks.

Example:

```text
POST /api/return-eligibility
```

The request contains:

```json
{
  "order_id": "NS-90001",
  "item_id": "ITEM-001",
  "reason": "Changed my mind",
  "condition": "New, unused, original packaging"
}
```

The endpoint evaluates the request against the configured return rules.

### `lib/db.ts`

Contains the database configuration, schema-related information, and policy constants used by the application.

### `scripts/seed.mjs`

Creates the local database data used by the MVP.

The seed script includes seven specifically designed QA cases as well as additional randomized orders.

# 6. Order Status Flow

## Customer Journey

```text
Enter Order Number
        │
        ▼
Search Order
        │
   ┌────┴────┐
   │         │
Found      Not Found
   │         │
   ▼         ▼
Display     Error
Status
```

When an order is found, the customer can see its current delivery stage.

### Supported Statuses

| Status     | Meaning                             |
| ---------- | ----------------------------------- |
| Processing | Order is being prepared             |
| Shipped    | Order has been shipped              |
| In Transit | Order is moving toward the customer |
| Delivered  | Order has been delivered            |

The interface presents these stages as a visual progress tracker.


# 7. Returns / Refund Eligibility Flow

The return process has two stages.

### Stage 1 — Find Order

The customer enters their order number.

The system uses:

```text
GET /api/order-status?order_id=...
```

The returned order information also includes the order's items.

### Stage 2 — Check Eligibility

The customer selects:

* Item
* Return reason
* Item condition

The information is submitted to:

```text
POST /api/return-eligibility
```

The system then evaluates the request.


# 8. Return Eligibility Rules

The return policy is evaluated in a specific order.

### Rule 1 — Return Reason

A return reason must be provided.

If no reason is supplied, the request is rejected.

### Rule 2 — Delivery Status

The order must already have the status:

```text
Delivered
```

Orders that are still Processing, Shipped, or In Transit cannot be returned through the MVP.

### Rule 3 — 30-Day Return Window

The return must be requested within **30 days of the delivery date**.

Orders outside the return window are rejected.

### Rule 4 — Final Sale

Items marked as final sale are not eligible for return.

### Rule 5 — Item Condition

The accepted conditions are:

* New, unused, original packaging
* Opened but unused

The following conditions are not eligible:

* Used
* Damaged

The system stops at the first failed rule and returns a clear explanation to the customer.

---

# 9. Built-in QA Cases

The MVP contains specific test orders designed to demonstrate different outcomes.

| Order      | Test Scenario                                 |
| ---------- | --------------------------------------------- |
| `NS-90001` | Straightforward eligible return               |
| `NS-90002` | Delivered 45 days ago — outside return window |
| `NS-90003` | Still Shipped — not delivered                 |
| `NS-90004` | Final sale item                               |
| `NS-90005` | Delivered today with two items                |
| `NS-90006` | In Transit — not delivered                    |
| `NS-90007` | Within return window but final sale           |

Additional condition testing can be performed by selecting:

* Used
* Damaged

on an otherwise eligible order.

# 10. Error Handling

The system provides customer-facing error messages for common failure situations.

Examples include:

### Order Not Found

The customer receives a clear message when an order number does not exist.

### API / Connection Failure

If the frontend cannot reach the API, the system displays a message explaining that the order lookup or eligibility check could not be completed.

### Missing Return Information

The eligibility form prevents submission until the required return reason and condition have been selected.

# 11. Loading and Interaction States

The interface provides feedback while requests are being processed.

Examples include:

* `Checking…`
* `Looking…`
* `Checking eligibility…`

Buttons are disabled when an operation is loading or when required information has not been provided.

This prevents unnecessary duplicate submissions and provides feedback to the customer.


# 12. Data Model

The MVP uses mock order and item data stored in the local database.

Orders contain information required for the support flows, including:

* Order ID
* Customer name
* Status
* Order placement date
* Delivery date
* Items

Items contain information required for return eligibility, including:

* Item ID
* Product information
* Final-sale status

The data is intentionally limited to the MVP's demonstration requirements.


# 13. Local Setup

## Requirements

The project requires:

* Node.js
* npm
* Git

## Installation

Clone the repository and enter the project directory.

Then install dependencies:

```bash
npm install
```

## Seed the Database

Run:

```bash
npm run seed
```

This creates the local database and populates the test data.

## Start the Development Server

Run:

```bash
npm run dev
```

The application should then be available at:

```text
http://localhost:3000
```

---

# 14. Optional Database Configuration

The MVP uses a local SQLite/libSQL database by default.

A future implementation can connect to a real Turso database by creating a `.env.local` file containing:

```text
TURSO_DATABASE_URL=libsql://your-db-url
TURSO_AUTH_TOKEN=your-token
```

These values should not be committed to GitHub.

---

# 15. Testing Guide

A new team member can verify the main functionality using the following scenarios.

## Test 1 — Order Status

1. Open the application.
2. Select **Track an order**.
3. Enter:

```text
NS-90001
```

4. Select **Check order**.
5. Confirm that the order information and delivery progress are displayed.

---

## Test 2 — Unknown Order

1. Open the order status flow.
2. Enter an order number that does not exist.
3. Submit the form.
4. Confirm that a clear error message is displayed.

---

## Test 3 — Eligible Return

1. Open **Start a return**.
2. Enter:

```text
NS-90001
```

3. Select an item.
4. Select a return reason.
5. Select:

```text
New, unused, original packaging
```

6. Select **Check eligibility**.
7. Confirm that the result is **Eligible**.

---

## Test 4 — Return Outside 30 Days

Use:

```text
NS-90002
```

The system should reject the return because the order was delivered outside the 30-day window.

## Test 5 — Undelivered Order

Use:

```text
NS-90003
```

The return should not be eligible because the order has not reached the Delivered state.


## Test 6 — Final Sale

Use:

```text
NS-90004
```

The system should reject the return because the item is marked as final sale.

---

## Test 7 — Item Condition

Use an otherwise eligible order and select:

```text
Used
```

or:

```text
Damaged
```

The system should reject the return based on the item-condition rule.

---

# 16. Known Limitations

This is an MVP and is not intended to represent a production-ready e-commerce support system.

The current implementation does **not** include:

* Customer accounts
* Authentication
* Real customer data
* Real payments
* Actual refunds
* Shipping-carrier integration
* Live shipment tracking
* Production deployment
* AI or chatbot functionality
* Automatic communication with customers
* Support-agent escalation workflow
* Real e-commerce platform integration

These limitations are intentional and keep the prototype within the scope of the Support Deflection MVP.

---

# 17. Production Readiness Considerations

Before a production deployment, Northstar Retail Co. would need to provide or integrate:

1. A production database.
2. Real order and customer data.
3. Authentication and appropriate authorization.
4. A real order-management or e-commerce backend.
5. Shipping-carrier integrations.
6. A production refund/payment workflow.
7. Security and privacy controls.
8. Monitoring and logging.
9. Error tracking.
10. A defined process for cases that cannot be resolved through self-service.
11. Production hosting and deployment configuration.
12. Testing against real business policies and customer scenarios.

# 18. Handover Instructions

A future developer or Northstar team member should be able to take over the MVP by following this sequence:

### Step 1

Clone the project repository.

### Step 2

Install dependencies:

```bash
npm install
```

### Step 3

Create the local test database:

```bash
npm run seed
```

### Step 4

Start the application:

```bash
npm run dev
```

### Step 5

Open:

```text
http://localhost:3000
```

### Step 6

Run the QA cases listed in this document.

### Step 7

Review the API routes:

```text
app/api/order-status/route.ts
app/api/return-eligibility/route.ts
```

### Step 8

Review the database and policy configuration:

```text
lib/db.ts
```

### Step 9

Review the seed data:

```text
scripts/seed.mjs
```

---

# 19. MVP Success Criteria

The MVP demonstrates support deflection when a customer can independently:

* Find an order.
* Understand its current status.
* See its delivery progress.
* Find the items associated with an order.
* Submit return information.
* Receive an eligibility decision.
* Understand why a return is or is not eligible.

The prototype therefore demonstrates self-service handling for the two selected support categories:

**Order Status** and **Returns / Refund Eligibility.**

---

# 20. Documentation Ownership

This documentation should be maintained alongside the application code.

When functionality changes, the relevant sections of this document should be updated so that the documentation remains consistent with the actual system.

Changes to system behavior, API routes, eligibility rules, setup requirements, or known limitations should be documented as part of the corresponding project change.

---

## Summary

Northstar Support Desk is a rules-based self-service MVP designed to reduce repetitive support requests.

It provides two end-to-end customer journeys:

```text
ORDER STATUS
Customer → Order Number → API → Order Data → Delivery Status
```

and:

```text
RETURN ELIGIBILITY
Customer → Order Number → Item → Reason → Condition
                    ↓
              Eligibility Rules
                    ↓
             Eligible / Not Eligible
```

The MVP intentionally focuses on demonstrating the support-deflection approach rather than implementing a complete production e-commerce support platform.
