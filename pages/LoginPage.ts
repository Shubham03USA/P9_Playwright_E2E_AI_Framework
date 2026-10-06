import { Page, Locator } from '@playwright/test';
import { ProductsPage } from './ProductsPage';

export class LoginPage {
    private readonly page: Page;

    // Locators
    private readonly txtUsername: Locator;
    private readonly txtPassword: Locator;
    private readonly btnLogin: Locator;
    private readonly lblError: Locator;

    constructor(page: Page) {
        this.page = page;

        // Initialize locators with CSS selectors
        this.txtUsername = page.locator('[data-test="username"]');
        this.txtPassword = page.locator('[data-test="password"]');
        this.btnLogin = page.locator('[data-test="login-button"]');
        this.lblError = page.locator('[data-test="error"]');
    }

    /**
     * Verifies the login page is displayed
     * @returns Promise<boolean> - true if the login button is visible
     */
    async isLoginPageExists(): Promise<boolean> {
        try {
            return await this.btnLogin.isVisible();
        } catch (error) {
            console.log(`Error checking login page: ${error}`);
            return false;
        }
    }

    /**
     * Logs in with the given credentials
     * @param username - The login username
     * @param password - The login password
     * @returns Promise<ProductsPage> - The products page after successful login
     */
    async login(username: string, password: string): Promise<ProductsPage> {
        await this.txtUsername.fill(username);
        await this.txtPassword.fill(password);
        await this.btnLogin.click();
        return new ProductsPage(this.page);
    }

    /**
     * Gets the current login error message
     * @returns Promise<string> - The error message text
     */
    async getErrorMessage(): Promise<string> {
        return (await this.lblError.textContent())?.trim() ?? '';
    }
}
