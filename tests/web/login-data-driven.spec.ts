import path from 'path';
import { test, expect } from '../../fixtures/pageFixtures';
import { DataProvider } from '../../utils/DataReader';

type LoginDataRow = {
    testName?: string;
    TestName?: string;
    email: string;
    password: string;
    expected: 'success' | 'failure';
};

const dataFilePath = path.resolve(__dirname, '../../testdata/swaglabs_logindata.json');
const loginData = DataProvider.readJson(dataFilePath) as LoginDataRow[];

if (!Array.isArray(loginData) || loginData.length === 0) {
    throw new Error(`Login test data must contain at least one row: ${dataFilePath}`);
}

function getFailureMessage(email: string, password: string): string {
    if (!email) {
        return 'Epic sadface: Username is required';
    }

    if (!password) {
        return 'Epic sadface: Password is required';
    }

    if (email === 'locked_out_user') {
        return 'Epic sadface: Sorry, this user has been locked out.';
    }

    return 'Epic sadface: Username and password do not match any user in this service';
}

loginData.forEach((row, index) => {
    const testName = row.testName?.trim() || row.TestName?.trim() || `Login data row ${index + 1}`;
    const email = row.email.trim();
    const password = row.password.trim();

    if (row.expected !== 'success' && row.expected !== 'failure') {
        throw new Error(`Invalid expected result for login test data row ${index + 1}: ${row.expected}`);
    }

    test(`${testName} (row ${index + 1}) @master @sanity @datadriven @web`, async ({
        page,
        homePage,
        loginPage,
        productsPage,
    }) => {
        await test.step('Open the application and verify the login form', async () => {
            expect(await homePage.isLoginPageExists()).toBeTruthy();
            await expect(page.locator('[data-test="username"]')).toBeVisible();
            await expect(page.locator('[data-test="password"]')).toBeVisible();
        });

        await test.step('Submit the credentials from this data row', async () => {
            await loginPage.login(email, password);
        });

        if (row.expected === 'success') {
            await test.step('Verify successful login and the Products page', async () => {
                await expect(page).toHaveURL(/inventory\.html$/);
                expect(await productsPage.isProductsPageExists()).toBeTruthy();
            });
        } else {
            await test.step('Verify login failure and the application validation message', async () => {
                await expect(page).not.toHaveURL(/inventory\.html$/);
                await expect(page.locator('[data-test="error"]')).toHaveText(
                    getFailureMessage(email, password)
                );
                await expect(page.locator('[data-test="username"]')).toBeVisible();
                await expect(page.locator('[data-test="login-button"]')).toBeVisible();
                await expect(page.locator('#react-burger-menu-btn')).toHaveCount(0);
            });
        }
    });
});
