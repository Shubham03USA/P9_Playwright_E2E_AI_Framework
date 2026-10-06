import { Page, Locator } from '@playwright/test';
import { CheckoutOverviewPage } from './CheckoutOverviewPage';

export class CheckoutPage {
    private readonly page: Page;

    // Locators
    private readonly txtFirstName: Locator;
    private readonly txtLastName: Locator;
    private readonly txtZipCode: Locator;
    private readonly btnContinue: Locator;

    constructor(page: Page) {
        this.page = page;

        // Initialize locators with CSS selectors
        this.txtFirstName = page.locator('[data-test="firstName"]');
        this.txtLastName = page.locator('[data-test="lastName"]');
        this.txtZipCode = page.locator('[data-test="postalCode"]');
        this.btnContinue = page.locator('[data-test="continue"]');
    }

    /**
     * Fills the checkout information
     * @param firstName - Customer first name
     * @param lastName - Customer last name
     * @param zipCode - Postal/zip code
     */
    async fillCheckoutInformation(firstName: string, lastName: string, zipCode: string): Promise<void> {
        await this.txtFirstName.fill(firstName);
        await this.txtLastName.fill(lastName);
        await this.txtZipCode.fill(zipCode);
    }

    /**
     * Continues to the checkout overview
     * @returns Promise<CheckoutOverviewPage> - The checkout overview page
     */
    async clickContinue(): Promise<CheckoutOverviewPage> {
        await this.btnContinue.click();
        return new CheckoutOverviewPage(this.page);
    }
}
