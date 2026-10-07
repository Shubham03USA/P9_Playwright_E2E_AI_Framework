import { Page, Locator, expect } from '@playwright/test';

export class CheckoutCompletePage {
    private readonly page: Page;

    // Locators
    private readonly lblTitle: Locator;
    private readonly lblCompleteHeader: Locator;

    constructor(page: Page) {
        this.page = page;

        // Initialize locators with CSS selectors
        this.lblTitle = page.locator('.title');
        this.lblCompleteHeader = page.locator('[data-test="complete-header"]');
    }

    /**
     * Verifies the checkout complete page is displayed
     * @returns Promise<boolean> - true if the complete title is visible
     */
    async isCheckoutCompletePageExists(): Promise<boolean> {
        try {
            await expect(this.lblTitle).toHaveText('Checkout: Complete!', { timeout: 15000 });
            return true;
        } catch (error) {
            console.log(`Error checking checkout complete page: ${error}`);
            return false;
        }
    }

    /**
     * Gets the order completion header text
     * @returns Promise<string> - The completion header text
     */
    async getCompleteHeader(): Promise<string> {
        return (await this.lblCompleteHeader.textContent())?.trim() ?? '';
    }
}
