import { test, expect } from '../../fixtures/pageFixtures';
import { Helper } from '../../utils/helper';

test('Valid Login Flow @master @sanity @web', async ({ page, homePage, loginPage, productsPage }) => {
    const { email, password } = Helper.getLoginDetails();

    await test.step('Open the application and verify the login page', async () => {
        expect(await homePage.isLoginPageExists()).toBeTruthy();
        await expect(page.locator('[data-test="username"]')).toBeVisible();
        await expect(page.locator('[data-test="password"]')).toBeVisible();
    });

    await test.step('Sign in with configured valid credentials', async () => {
        await loginPage.login(email, password);
    });

    await test.step('Verify authentication and the Products section', async () => {
        await expect(page).toHaveURL(/inventory\.html$/);
        expect(await productsPage.isProductsPageExists()).toBeTruthy();
    });

    await test.step('Verify authenticated account navigation is visible', async () => {
        await expect(page.locator('#react-burger-menu-btn')).toBeVisible();
        await expect(page.locator('.shopping_cart_link')).toBeVisible();
    });
});
