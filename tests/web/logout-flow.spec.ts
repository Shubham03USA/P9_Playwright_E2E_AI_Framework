import { test, expect } from '../../fixtures/pageFixtures';
import { Helper } from '../../utils/helper';

test('Logout Flow @master @sanity @web', async ({ page, homePage, loginPage, productsPage }) => {
    const { email, password } = Helper.getLoginDetails();

    await test.step('Open the application and sign in with configured credentials', async () => {
        expect(await homePage.isLoginPageExists()).toBeTruthy();
        await loginPage.login(email, password);
        await expect(page).toHaveURL(/inventory\.html$/);
        expect(await productsPage.isProductsPageExists()).toBeTruthy();
    });

    await test.step('Open the account menu and select Logout', async () => {
        await page.locator('#react-burger-menu-btn').click();
        const logoutLink = page.locator('#logout_sidebar_link');
        await expect(logoutLink).toBeVisible();
        await logoutLink.click();
    });

    await test.step('Verify logout redirects to the login page', async () => {
        await expect(page).toHaveURL(/\/$/);
        expect(await homePage.isLoginPageExists()).toBeTruthy();
        await expect(page.locator('[data-test="username"]')).toBeVisible();
        await expect(page.locator('[data-test="password"]')).toBeVisible();
        await expect(page.locator('[data-test="login-button"]')).toBeVisible();
    });

    await test.step('Verify authenticated account navigation is no longer available', async () => {
        await expect(page.locator('#react-burger-menu-btn')).toHaveCount(0);
        await expect(page.locator('.shopping_cart_link')).toHaveCount(0);
    });
});
