import { Page, Locator } from '@playwright/test';

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
            await this.lblTitle.waitFor({ state: 'visible' });
            return (await this.lblTitle.textContent())?.trim() === 'Checkout: Complete!';
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
