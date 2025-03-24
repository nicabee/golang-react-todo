// @ts-check
import { test, expect } from '@playwright/test';


test.describe("Home Page", () => {
  test("should have correct metadata and elements", async({page}) => {
    await page.goto('http://localhost:3000/');
    await expect(page).toHaveTitle("To Do List");
    await expect(
      page.getByRole("heading", {
        name: "TO DO LIST",
      })
    ).toBeVisible();
    await expect(page.getByPlaceholder("Create Task")).toBeVisible();

    const input = page.getByPlaceholder("Create Task");

    await input.fill("Buy medicine")

    // Assert that the input contains the typed text
    await expect(input).toHaveValue("Buy medicine");

    await input.press("Enter");

    await expect(page.getByText("Buy medicine")).toBeVisible();

    await expect(input).toBeEmpty();

    await expect(page.getByTestId("complete-task").last()).toBeVisible();

    await page.getByTestId("complete-task").last().click();

    await expect(page.getByTestId("undo-task").last()).toBeVisible();

    await page.getByTestId("undo-task").last().click();

    await expect(page.getByTestId("delete-task").last()).toBeVisible();

    await page.getByTestId("delete-task").last().click();

  })
})