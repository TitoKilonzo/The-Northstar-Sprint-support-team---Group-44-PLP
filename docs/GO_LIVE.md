# Northstar Retail Co. - Go-Live Readiness

## What Works

The MVP supports two ticket-deflection categories end to end: **order status** and **returns/refund eligibility**.

* Customers can enter an order number and retrieve order details, including the current delivery status and relevant dates.
* Order progress is displayed through the stages **Processing → Shipped → In Transit → Delivered**.
* Customers can look up an order and select an individual item when checking a return.
* The returns flow checks eligibility against the defined MVP rules, including delivery status, the 30-day return window, final-sale status, and item condition.
* The system returns a clear eligible or not-eligible result together with the reason for the decision.
* The MVP includes seeded QA cases covering eligible returns, orders outside the return window, undelivered orders, final-sale items, multiple-item orders, and item-condition scenarios.
* Invalid order numbers and failed API requests provide clear feedback to the customer.
* The application runs locally using the included SQLite/libSQL database setup and seed script.
* The application is structured so that the database can later be connected to a managed **Turso/libSQL** database through environment variables.

## Known Limitations

* Stock availability, the third original ticket category, was not built. The MVP scope was limited to order status and returns/refund eligibility.
* The current database uses seeded/mock data and is not connected to Northstar's live order system.
* There is no customer account or authentication system.
* There is no live shipping-carrier integration or real-time carrier tracking.
* The system checks return eligibility but does not process an actual refund, payment, return label, or physical return.
* There is no automated handoff to a human support agent for cases that cannot be resolved by the MVP.
* The MVP does not include production deployment, monitoring, or operational alerting.
* The return rules are based on the MVP requirements and should be confirmed against Northstar's final business policy before being used with real customer transactions.
* The current implementation is intended for demonstration and validation rather than direct production use with real customer data.

## What Northstar's Team Needs to Operate This

1. Install the project dependencies:

   ```bash
   npm install
   ```

2. For local development, populate the included database with the provided QA and sample orders:

   ```bash
   npm run seed
   ```

3. Start the application:

   ```bash
   npm run dev
   ```

4. For a shared or production environment, configure a managed **Turso/libSQL** database using the application's environment variables:

   ```env
   TURSO_DATABASE_URL=libsql://your-db-url
   TURSO_AUTH_TOKEN=your-token
   ```

5. Replace the seeded/mock data with Northstar's approved order and item data source.

6. Connect the order-status flow to Northstar's live order/shipping systems if real-time customer information is required.

7. Confirm the final Northstar return/refund policy and update the eligibility rules where necessary before using the flow with real customers.

8. Before production deployment, Northstar's technical team should add the appropriate authentication, security controls, monitoring, error logging, and operational escalation process.

9. The repository README provides the application setup instructions, API flows, return rules, QA cases, limitations, and project structure needed for continued development.

**Handoff status:** The MVP demonstrates the two required support-deflection flows end to end. Northstar's team can take over the next phase by connecting the application to its production data, business rules, and operational systems.
