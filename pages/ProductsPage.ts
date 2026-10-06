import { Page, Locator } from '@playwright/test';
import { ProductDetailsPage } from './ProductDetailsPage';

export class ProductsPage {
    private readonly page: Page;

    // Locators
    private readonly lblTitle: Locator;

    constructor(page: Page) {
        this.page = page;

        // Initialize locators with CSS selectors
        this.lblTitle = page.locator('.title');
    }

    /**
     * Verifies the products page is displayed
     * @returns Promise<boolean> - true if the Products title is visible
     */
    async isProductsPageExists(): Promise<boolean> {
        try {
            await this.lblTitle.waitFor({ state: 'visible' });
            return (await this.lblTitle.textContent())?.trim() === 'Products';
        } catch (error) {
            console.log(`Error checking products page: ${error}`);
            return false;
        }
    }

    /**
     * Opens the product details page for the given product
     * @param productName - The name of the product to open
     * @returns Promise<ProductDetailsPage> - The product details page
     */
    async clickProduct(productName: string): Promise<ProductDetailsPage> {
        await this.page
            .locator('[data-test="inventory-item"]', { hasText: productName })
            .locator('[data-test="inventory-item-name"]')
            .click();
        return new ProductDetailsPage(this.page);
    }
}
