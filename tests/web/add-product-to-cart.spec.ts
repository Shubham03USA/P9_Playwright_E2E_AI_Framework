import { test, expect } from '../../fixtures/pageFixtures';
import { Helper } from '../../utils/helper';

test('Add Product to Cart @master @sanity @web', async ({
    page,
    homePage,
    loginPage,
    productsPage,
    productDetailsPage,
    cartPage,
}) => {
    const { email, password } = Helper.getLoginDetails();
    const { productName, productQuantity } = Helper.getProductDetails();

    await test.step('Open the application and sign in', async () => {
        expect(await homePage.isLoginPageExists()).toBeTruthy();
        await loginPage.login(email, password);
        await expect(page).toHaveURL(/inventory\.html$/);
        expect(await productsPage.isProductsPageExists()).toBeTruthy();
    });

    await test.step('Select the configured product and verify its details', async () => {
        await productsPage.clickProduct(productName);
        await expect(page).toHaveURL(/inventory-item\.html/);
        expect(await productDetailsPage.isProductDetailsVisible(productName)).toBeTruthy();
        await expect(page.locator('.inventory_details_price')).toBeVisible();
    });

    await test.step('Add the product to the cart and verify confirmation', async () => {
        await productDetailsPage.clickAddToCart();
        await expect(page.locator('[data-test="remove"]')).toBeVisible();
        await expect(page.locator('.shopping_cart_badge')).toHaveText(productQuantity);
    });

    await test.step('Open the cart and verify the product and quantity', async () => {
        await productDetailsPage.clickCart();
        expect(await cartPage.isCartPageExists()).toBeTruthy();
        await expect(page.locator('[data-test="inventory-item-name"]')).toHaveText(productName);
        await expect(page.locator('.cart_quantity')).toHaveText(productQuantity);
    });
});
