import {expect } from '@playwright/test';
import {test} from '../test-options'

test.beforeEach(async ({ page }) => {
  await page.goto('http://uitestingplayground.com/ajax');
  await page.getByRole('button', {name: 'Button Triggering AJAX Request' }).click();
});

test('auto waiting', async ({ page }) => {
    const successButton = page.locator('.bg-success');
    await expect(successButton).toHaveText('Data loaded with AJAX get request.', { timeout: 20000 });
  });

test('alternative waits', async ({ page }) => {
    const successButton = page.locator('.bg-success');
    await page.waitForLoadState('networkidle');
  
    const text = await successButton.allTextContents();
    expect(text).toContain('Data loaded with AJAX get request.');
  });