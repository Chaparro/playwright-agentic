import { test, expect } from '@playwright/test';

test('seed', async ({ page }) => {
  // Navigate to SauceDemo
  await page.goto('https://www.saucedemo.com/');
  
  // Login with standard user
  await page.locator('[data-test="username"]').fill('standard_user');
  await page.locator('[data-test="password"]').fill('secret_sauce');
  await page.locator('[data-test="login-button"]').click();
  
  // Verify we're on the inventory page
  await expect(page.locator('.inventory_list')).toBeVisible();
});