import { test, expect } from "@playwright/test";

test.describe("Trip Creation", () => {
  test.beforeEach(async ({ page }) => {
    // Login first
    await page.goto("/login");
    await page.fill('input[type="email"]', "user@traveloop.com");
    await page.fill('input[type="password"]', "UserPassword123");
    await page.click('button[type="submit"]');
  });

  test("should create a new trip and navigate to builder", async ({ page }) => {
    await page.goto("/trips/new");
    
    const tripTitle = `Test Trip ${Date.now()}`;
    await page.fill('input[id="title"]', tripTitle);
    await page.fill('input[id="startDate"]', "2026-12-01");
    await page.fill('input[id="endDate"]', "2026-12-10");
    await page.fill('input[id="totalBudget"]', "1500");
    
    await page.click('button[type="submit"]');
    
    await expect(page).toHaveURL(/\/trips\/.*\/build/);
    await expect(page.locator("h1")).toContainText("Itinerary Builder");
    await expect(page.locator("p")).toContainText(tripTitle);
  });
});
