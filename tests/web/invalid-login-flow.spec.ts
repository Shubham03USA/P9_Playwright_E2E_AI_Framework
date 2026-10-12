import path from 'path';
import { test, expect } from '../../fixtures/pageFixtures';
import { DataProvider } from '../../utils/DataReader';

type LoginTestData = {
    testName: string;
    email: string;
    password: string;
    expected: string;
};

const loginTestData = DataProvider.readJson(
    path.resolve(__dirname, '../../testdata/swaglabs_logindata.json')
) as LoginTestData[];
const lockedOutUser = loginTestData.find((data) => data.email === 'locked_out_user');

if (!lockedOutUser) {
    throw new Error('Missing locked-out user credentials in testdata/swaglabs_logindata.json');
}

test('Invalid Login Flow @master @sanity @web', async ({ page, homePage, loginPage }) => {
    await test.step('Open the application and verify the login page', async () => {
        expect(await homePage.isLoginPageExists()).toBeTruthy();
        await expect(page.locator('[data-test="username"]')).toBeVisible();
        await expect(page.locator('[data-test="password"]')).toBeVisible();
    });

    await test.step('Submit the locked-out customer credentials', async () => {
        await loginPage.login(lockedOutUser.email, lockedOutUser.password);
    });

    await test.step('Verify login is rejected with the expected warning', async () => {
        await expect(page.locator('[data-test="error"]')).toHaveText(
            'Epic sadface: Sorry, this user has been locked out.'
        );
    });

    await test.step('Verify the customer remains unauthenticated', async () => {
        await expect(page).not.toHaveURL(/inventory\.html$/);
        await expect(page.locator('[data-test="username"]')).toBeVisible();
        await expect(page.locator('[data-test="login-button"]')).toBeVisible();
        await expect(page.locator('#react-burger-menu-btn')).toHaveCount(0);
    });
});
