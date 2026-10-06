/**
 * Test Case: End-to-End Shopping Flow
 *
 * Tags: @master @sanity @regression @end-to-end @web
 *
 * Steps:
 * 1) Open the application
 * 2) Enter the valid username and password
 * 3) Verify successful authentication
 * 4) Select a known product
 * 5) Open the product details page
 * 6) Add the product to the cart
 * 7) Open the shopping cart
 * 8) Verify the correct product
 * 9) Verify the product price
 * 10) Verify the applicable cart total
 * 11) Click on Checkout button
 * 12) Enter the First Name, Last Name and Zip Code
 * 13) Click on Continue button
 * 14) Check Overview of the product details
 * 15) Click on Finish button
 * 16) Verify that the complete journey finishes without errors
 */

import { test, expect } from '../../fixtures/pageFixtures';
import { Helper } from '../../utils/helper';
import { RandomDataUtil } from '../../utils/dataGenerator';

test('End-to-End Shopping Flow @master @sanity @regression @end-to-end @web', async ({
    homePage,
    loginPage,
    productsPage,
    productDetailsPage,
    cartPage,
    checkoutPage,
    checkoutOverviewPage,
    checkoutCompletePage,
}) => {
    const { email, password } = Helper.getLoginDetails();
    const { productName, totalPrice } = Helper.getProductDetails();
    const firstName = RandomDataUtil.getFirstName();
    const lastName = RandomDataUtil.getLastName();
    const zipCode = RandomDataUtil.getZipCode();

    await test.step('1) Open the application and verify the login page is displayed', async () => {
        expect(await homePage.isLoginPageExists()).toBeTruthy();
    });

    await test.step('2) Enter the valid username and password', async () => {
        await loginPage.login(email, password);
    });

    await test.step('3) Verify successful authentication', async () => {
        expect(await productsPage.isProductsPageExists()).toBeTruthy();
    });

    await test.step('4) Select a known product', async () => {
        await productsPage.clickProduct(productName);
    });

    await test.step('5) Open the product details page', async () => {
        expect(await productDetailsPage.isProductDetailsVisible(productName)).toBeTruthy();
    });

    await test.step('6) Add the product to the cart', async () => {
        await productDetailsPage.clickAddToCart();
    });

    await test.step('7) Open the shopping cart', async () => {
        await productDetailsPage.clickCart();
        expect(await cartPage.isCartPageExists()).toBeTruthy();
    });

    await test.step('8) Verify the correct product', async () => {
        expect(await cartPage.getItemName()).toBe(productName);
    });

    await test.step('9) Verify the product price', async () => {
        expect(await cartPage.getItemPrice()).toBe(totalPrice);
    });

    await test.step('10) Verify the applicable cart total', async () => {
        expect(await cartPage.getItemPrice()).toBe(totalPrice);
    });

    await test.step('11) Click on Checkout button', async () => {
        await cartPage.clickCheckout();
    });

    await test.step('12) Enter the First Name, Last Name and Zip Code', async () => {
        await checkoutPage.fillCheckoutInformation(firstName, lastName, zipCode);
    });

    await test.step('13) Click on Continue button', async () => {
        await checkoutPage.clickContinue();
        expect(await checkoutOverviewPage.isOverviewPageExists()).toBeTruthy();
    });

    await test.step('14) Check Overview of the product details', async () => {
        expect(await checkoutOverviewPage.getItemName()).toBe(productName);
        expect(await checkoutOverviewPage.getItemTotal()).toContain(totalPrice);
        expect(await checkoutOverviewPage.getTotal()).toContain('$');
    });

    await test.step('15) Click on Finish button', async () => {
        await checkoutOverviewPage.clickFinish();
    });

    await test.step('16) Verify that the complete journey finishes without errors', async () => {
        expect(await checkoutCompletePage.isCheckoutCompletePageExists()).toBeTruthy();
        expect(await checkoutCompletePage.getCompleteHeader()).toBe('Thank you for your order!');
    });

    console.log('✅ End-to-End shopping flow completed successfully!');
});
