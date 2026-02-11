import { test, expect } from '@playwright/test';

const BASE = 'https://www.saucedemo.com/';

async function login(page: any, username = 'standard_user', password = 'secret_sauce') {
  await page.goto(BASE);
  await page.fill('[data-test="username"]', username);
  await page.fill('[data-test="password"]', password);
  await page.click('[data-test="login-button"]');
  await expect(page.locator('.inventory_list')).toBeVisible();
}

test.describe('SauceDemo shopping flows', () => {
  test('product browsing and sorting', async ({ page }) => {
    await login(page);

    const getNames = async () => (await page.$$eval('.inventory_item_name', els => els.map(e => e.textContent?.trim() || ''))).filter(Boolean);
    const getPrices = async () => (await page.$$eval('.inventory_item_price', els => els.map(e => parseFloat((e.textContent || '').replace('$', '')))));

    await page.selectOption('.product_sort_container', { label: 'Name (A to Z)' });
    let names = await getNames();
    expect(names).toEqual([...names].sort((a, b) => a.localeCompare(b)));

    await page.selectOption('.product_sort_container', { label: 'Name (Z to A)' });
    names = await getNames();
    expect(names).toEqual([...names].sort((a, b) => b.localeCompare(a)));

    await page.selectOption('.product_sort_container', { label: 'Price (low to high)' });
    let prices = await getPrices();
    expect(prices).toEqual([...prices].sort((a, b) => a - b));

    await page.selectOption('.product_sort_container', { label: 'Price (high to low)' });
    prices = await getPrices();
    expect(prices).toEqual([...prices].sort((a, b) => b - a));
  });

  test('adding items to cart and verifying badge', async ({ page }) => {
    await login(page);

    // add first three items
    const items = page.locator('.inventory_item');
    await items.nth(0).locator('button').click();
    await items.nth(1).locator('button').click();
    await items.nth(2).locator('button').click();

    await expect(page.locator('.shopping_cart_badge')).toHaveText('3');

    // open cart and verify items
    await page.click('.shopping_cart_link');
    await expect(page.locator('.cart_item')).toHaveCount(3);
  });

  test('cart management: remove items and persistence', async ({ page }) => {
    await login(page);

    const items = page.locator('.inventory_item');
    await items.nth(0).locator('button').click();
    await items.nth(1).locator('button').click();

    await page.click('.shopping_cart_link');
    await expect(page.locator('.cart_item')).toHaveCount(2);

    // remove one item
    await page.locator('.cart_item').nth(0).locator('button').click();
    await expect(page.locator('.cart_item')).toHaveCount(1);
    await expect(page.locator('.shopping_cart_badge')).toHaveText('1');

    // navigate away and back, then refresh to confirm persistence for session
    await page.click('[data-test="continue-shopping"]');
    await page.reload();
    await expect(page.locator('.shopping_cart_badge')).toHaveText('1');
  });

  test('checkout happy path', async ({ page }) => {
    await login(page);

    // ensure at least one item in cart
    await page.locator('.inventory_item').nth(0).locator('button').click();
    await page.click('.shopping_cart_link');

    await page.click('[data-test="checkout"]');
    await page.fill('[data-test="firstName"]', 'Test');
    await page.fill('[data-test="lastName"]', 'User');
    await page.fill('[data-test="postalCode"]', '12345');
    await page.click('[data-test="continue"]');

    // overview visible then finish
    await expect(page.locator('.cart_list')).toBeVisible();
    await expect(page.locator('.summary_info')).toBeVisible();

    await page.click('[data-test="finish"]');
    await expect(page.locator('.complete-header')).toBeVisible();
  });

  test('checkout validation prevents progress with missing required fields', async ({ page }) => {
    await login(page);
    await page.locator('.inventory_item').nth(0).locator('button').click();
    await page.click('.shopping_cart_link');

    await page.click('[data-test="checkout"]');
    // leave first name empty, fill others
    await page.fill('[data-test="lastName"]', 'User');
    await page.fill('[data-test="postalCode"]', '12345');
    await page.click('[data-test="continue"]');

    // should remain on the info step when validation fails
    await expect(page).toHaveURL(/checkout-step-one.html/);
  });

  test('logout clears session and returns to login', async ({ page }) => {
    await login(page);

    // open menu and logout
    await page.click('#react-burger-menu-btn');
    await page.click('#logout_sidebar_link');

    // login inputs visible again
    await expect(page.locator('[data-test="username"]')).toBeVisible();
  });
});
