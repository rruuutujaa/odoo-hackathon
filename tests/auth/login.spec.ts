import { test, expect } from "@playwright/test";

test.describe("Login Flow", () => {
  test("should show error with invalid credentials", async ({ page }) => {
    await page.goto("/login");
    await page.fill('input[type="email"]', "wrong@example.com");
    await page.fill('input[type="password"]', "wrongpassword");
    await page.click('button[type="submit"]');
    
    const errorAlert = page.locator('div[role="alert"]');
    await expect(errorAlert).toBeVisible();
    await expect(errorAlert).toContainText("Invalid email or password");
  });

  test("should redirect to dashboard on successful login", async ({ page }) => {
    // Note: Requires seed data user
    await page.goto("/login");
    await page.fill('input[type="email"]', "user@traveloop.com");
    await page.fill('input[type="password"]', "UserPassword123");
    await page.click('button[type="submit"]');
    
    await expect(page).toHaveURL("/dashboard");
    await expect(page.locator("h1")).toContainText("Hey Alex");
  });
});
