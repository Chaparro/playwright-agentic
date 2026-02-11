# SauceDemo Shopping — Test Plan

## Overview
This test plan covers end-to-end scenarios for the SauceDemo shopping application focused on browsing, sorting, cart management, checkout, validation, and logout flows.

## Scope
- Functional tests for product listing, sorting, add-to-cart, cart management, checkout happy path and negative validation cases, and logout.
- Cross-browser and visual tests are out of scope for this plan but recommended as follow-ups.

## Test Environment
- App URL: https://www.saucedemo.com (or local build under test)
- Browsers: Chrome (primary), Firefox, Edge (optional)
- Test accounts: standard_user (valid), locked_out_user (blocked), problem_user (for exploratory)

## Test Data
- Valid user credentials: `standard_user` / `secret_sauce`
- Invalid credentials: wrong username, wrong password
- Checkout valid info: First Name = "Test", Last Name = "User", Postal Code = "12345"
- Checkout missing fields: omit each required field in turn

## Preconditions
- Tester has a working browser and network access to the application.
- Tester is logged out at test start unless the test specifically needs login.

## Test Case Structure (for each test)
- Title
- Preconditions
- Steps
- Expected Result
- Priority
- Notes / Test data

---

## 1. Product browsing and sorting

1.1 Browse product list
- Preconditions: Logged in as `standard_user`.
- Steps:
  1. Log in.
  2. Observe products on the inventory page.
- Expected:
  - Product tiles show name, price, image, and an "Add to cart" button.
  - Default sort is applied (documented app default).
- Priority: High

1.2 Sort A → Z (name ascending)
- Preconditions: Logged in and on inventory page.
- Steps:
  1. Open sort dropdown and select "Name (A to Z)".
- Expected:
  - Product names are ordered alphabetically A → Z.
- Priority: High

1.3 Sort Z → A (name descending)
- Steps:
  1. Select "Name (Z to A)".
- Expected:
  - Product names are ordered Z → A.
- Priority: High

1.4 Sort Price low → high
- Steps:
  1. Select "Price (low to high)".
- Expected:
  - Products ordered by numeric price ascending.
- Priority: High

1.5 Sort Price high → low
- Steps:
  1. Select "Price (high to low)".
- Expected:
  - Products ordered by numeric price descending.
- Priority: High

1.6 Edge cases for sorting
- Steps:
  - Ensure products with identical names/prices preserve stable order or documented behavior.
  - Verify that the sort control is accessible (keyboard focus, ARIA where applicable).
- Expected: Stable or documented behavior, controls accessible.
- Priority: Medium

---

## 2. Adding items to cart

2.1 Add single item
- Steps:
  1. From inventory, click "Add to cart" on a single item.
  2. Observe the cart badge and button state.
- Expected:
  - Cart badge increments to 1.
  - Button changes to "Remove" (or as-applicable).
- Priority: High

2.2 Add multiple different items
- Steps:
  1. Add 2–3 distinct items.
  2. Open cart.
- Expected:
  - All selected items appear in the cart with correct names/prices.
  - Cart badge equals number of items added.
- Priority: High

2.3 Add same item multiple times
- Notes: SauceDemo typically supports quantity via multiple add/remove cycles; adapt if app has quantity field.
- Steps:
  1. Click "Add to cart" for same product twice (if available) or add then re-add after navigating.
- Expected:
  - App either prevents duplicate (button toggles) or reflects correct quantity in cart.
- Priority: Medium

---

## 3. Cart management (viewing, updating quantities, removing items)

3.1 View cart contents
- Steps:
  1. Add items, click cart icon.
- Expected:
  - Cart page lists items with name, price, quantity (if supported), and remove controls.
- Priority: High

3.2 Update quantity (if supported)
- Steps:
  1. On cart page change the quantity for an item to a different value.
  2. Observe subtotal and totals.
- Expected:
  - Quantity updates correctly; item subtotal and overall totals update accordingly.
- Priority: Medium

3.3 Remove item from cart
- Steps:
  1. Click "Remove" for a cart item.
  2. Observe cart badge and cart contents.
- Expected:
  - Item disappears; badge decrements; totals update.
- Priority: High

3.4 Empty cart behavior
- Steps:
  1. Remove all items.
  2. Verify UI when cart is empty.
- Expected:
  - Empty-state message or inventory view shown; cart badge hidden or zero.
- Priority: Medium

3.5 Persistence across navigation
- Steps:
  1. Add items, navigate away (e.g., to product page), return to cart, or refresh page.
- Expected:
  - Cart contents persist for session (or per documented app behavior).
- Priority: Medium

---

## 4. Complete checkout flow with valid information

4.1 Checkout happy path
- Preconditions: Cart contains at least one item.
- Steps:
  1. From cart, click "Checkout".
  2. On Checkout: Your Information page, fill First Name, Last Name, Postal Code with valid data.
  3. Continue to Overview, verify items and totals (including tax if applicable).
  4. Click "Finish".
- Expected:
  - Order completion page or confirmation is displayed with success message.
  - Cart is cleared or reset after completion per app behavior.
- Priority: High

4.2 Verify totals and tax calculation
- Steps:
  1. On Overview, verify item subtotal, tax, and total are calculated correctly for the selected items.
- Expected:
  - Totals match manual calculation using visible prices and documented tax rules.
- Priority: Medium

---

## 5. Checkout validation (missing required fields)

5.1 Missing First Name
- Steps:
  1. Start checkout, leave First Name empty, fill others, click Continue.
- Expected:
  - App displays an inline error or alert indicating First Name is required; cannot proceed.
- Priority: High

5.2 Missing Last Name
- Steps:
  1. Omit Last Name and attempt to continue.
- Expected: Validation prevents progress with appropriate message.
- Priority: High

5.3 Missing Postal Code
- Steps:
  1. Omit Postal Code and attempt to continue.
- Expected: Validation prevents progress with appropriate message.
- Priority: High

5.4 Invalid Postal Code format (if format enforced)
- Steps:
  1. Enter non-numeric or malformed postal code (e.g., letters if only digits allowed) and continue.
- Expected:
  - App either accepts (if not validated) or shows format-specific validation.
- Priority: Medium

5.5 Combined negative cases
- Steps:
  - Test combinations: all fields empty, only one field filled, extremely long inputs, special characters.
- Expected: Errors displayed clearly for required fields; inputs are sanitized correctly.
- Priority: Medium

---

## 6. Logout functionality

6.1 Logout from inventory
- Steps:
  1. From inventory or any page, open the menu and click "Logout".
- Expected:
  - User is returned to login page; session cleared; protected pages require login again.
- Priority: High

6.2 Ensure cart is cleared or preserved after logout (documented behavior)
- Steps:
  1. Add items, logout, then log back in as same user.
- Expected:
  - Verify whether cart persists across logout per app design (document expected behavior). Test both expectations if behavior is inconsistent.
- Priority: Medium

---

## Additional exploratory and non-functional checks
- Accessibility: keyboard nav, button roles, ARIA labels on sort and cart.
- Session/timeouts: confirm session expiration handling if applicable.
- Performance: inventory load time under typical network.

## Reporting and Acceptance Criteria
- Pass: All high-priority test cases pass across the primary browser.
- Blocker: Any inability to log in, add to cart, or complete checkout.

## Test Matrix (quick glance)
- Browsers: Chrome (primary), Firefox (regression), Edge (smoke).
- Environments: staging, production (read-only verification).

---

### Notes
- If app UI differs (e.g., quantity input present in inventory), adapt quantity tests.
- For automation: implement selectors as resilient CSS/XPath, avoid brittle absolute paths.

End of plan.
