import { Page, Locator } from '@playwright/test';
import { CartPage } from './CartPage';

export class ProductDetailsPage {
    private readonly page: Page;

    // Locators
    private readonly lblProductName: Locator;
    private readonly lblProductPrice: Locator;
    private readonly btnAddToCart: Locator;
    private readonly lnkCart: Locator;

    constructor(page: Page) {
        this.page = page;

        // Initialize locators with CSS selectors
        this.lblProductName = page.locator('.inventory_details_name');
        this.lblProductPrice = page.locator('.inventory_details_price');
        this.btnAddToCart = page.locator('[data-test="add-to-cart"]');
        this.lnkCart = page.locator('[data-test="shopping-cart-link"]');
    }

    /**
     * Verifies the product details page is displayed for the given product
     * @param productName - The expected product name
     * @returns Promise<boolean> - true if the product name matches
     */
    async isProductDetailsVisible(productName: string): Promise<boolean> {
        try {
            return (await this.lblProductName.textContent())?.trim() === productName;
        } catch (error) {
            console.log(`Error checking product details: ${error}`);
            return false;
        }
    }

    /**
     * Adds the product to the cart
     */
    async clickAddToCart(): Promise<void> {
        await this.btnAddToCart.click();
    }

    /**
     * Opens the shopping cart
     * @returns Promise<CartPage> - The cart page
     */
    async clickCart(): Promise<CartPage> {
        await this.lnkCart.click();
        return new CartPage(this.page);
    }
}
