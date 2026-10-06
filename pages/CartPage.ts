import { Page, Locator } from '@playwright/test';
import { CheckoutPage } from './CheckoutPage';

export class CartPage {
    private readonly page: Page;

    // Locators
    private readonly lblTitle: Locator;
    private readonly lblItemName: Locator;
    private readonly lblItemPrice: Locator;
    private readonly btnCheckout: Locator;

    constructor(page: Page) {
        this.page = page;

        // Initialize locators with CSS selectors
        this.lblTitle = page.locator('.title');
        this.lblItemName = page.locator('[data-test="inventory-item-name"]');
        this.lblItemPrice = page.locator('[data-test="inventory-item-price"]');
        this.btnCheckout = page.locator('[data-test="checkout"]');
    }

    /**
     * Verifies the cart page is displayed
     * @returns Promise<boolean> - true if the Your Cart title is visible
     */
    async isCartPageExists(): Promise<boolean> {
        try {
            await this.lblTitle.waitFor({ state: 'visible' });
            return (await this.lblTitle.textContent())?.trim() === 'Your Cart';
        } catch (error) {
            console.log(`Error checking cart page: ${error}`);
            return false;
        }
    }

    /**
     * Gets the name of the item in the cart
     * @returns Promise<string> - The item name
     */
    async getItemName(): Promise<string> {
        return (await this.lblItemName.textContent())?.trim() ?? '';
    }

    /**
     * Gets the price of the item in the cart
     * @returns Promise<string> - The item price
     */
    async getItemPrice(): Promise<string> {
        return (await this.lblItemPrice.textContent())?.trim() ?? '';
    }

    /**
     * Proceeds to checkout
     * @returns Promise<CheckoutPage> - The checkout page
     */
    async clickCheckout(): Promise<CheckoutPage> {
        await this.btnCheckout.click();
        return new CheckoutPage(this.page);
    }
}
