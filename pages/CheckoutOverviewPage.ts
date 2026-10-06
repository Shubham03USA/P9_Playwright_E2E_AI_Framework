import { Page, Locator } from '@playwright/test';
import { CheckoutCompletePage } from './CheckoutCompletePage';

export class CheckoutOverviewPage {
    private readonly page: Page;

    // Locators
    private readonly lblTitle: Locator;
    private readonly lblItemName: Locator;
    private readonly lblItemTotal: Locator;
    private readonly lblTotal: Locator;
    private readonly btnFinish: Locator;

    constructor(page: Page) {
        this.page = page;

        // Initialize locators with CSS selectors
        this.lblTitle = page.locator('.title');
        this.lblItemName = page.locator('[data-test="inventory-item-name"]');
        this.lblItemTotal = page.locator('[data-test="subtotal-label"]');
        this.lblTotal = page.locator('[data-test="total-label"]');
        this.btnFinish = page.locator('[data-test="finish"]');
    }

    /**
     * Verifies the checkout overview page is displayed
     * @returns Promise<boolean> - true if the overview title is visible
     */
    async isOverviewPageExists(): Promise<boolean> {
        try {
            await this.lblTitle.waitFor({ state: 'visible' });
            return (await this.lblTitle.textContent())?.trim() === 'Checkout: Overview';
        } catch (error) {
            console.log(`Error checking overview page: ${error}`);
            return false;
        }
    }

    /**
     * Gets the overview item name
     * @returns Promise<string> - The item name
     */
    async getItemName(): Promise<string> {
        return (await this.lblItemName.textContent())?.trim() ?? '';
    }

    /**
     * Gets the item total label text
     * @returns Promise<string> - The item total text
     */
    async getItemTotal(): Promise<string> {
        return (await this.lblItemTotal.textContent())?.trim() ?? '';
    }

    /**
     * Gets the grand total label text
     * @returns Promise<string> - The grand total text
     */
    async getTotal(): Promise<string> {
        return (await this.lblTotal.textContent())?.trim() ?? '';
    }

    /**
     * Finishes the order
     * @returns Promise<CheckoutCompletePage> - The checkout complete page
     */
    async clickFinish(): Promise<CheckoutCompletePage> {
        await this.btnFinish.click();
        return new CheckoutCompletePage(this.page);
    }
}
