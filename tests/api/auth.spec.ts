import { test, expect } from '@playwright/test';
import { Routes } from '../../api/endpoints/routes';
import { RandomDataUtil } from '../../utils/dataGenerator';
import dotenv from 'dotenv';

dotenv.config();

test.describe('Authentication API Tests', () => {

    // ---------------------------------------------------------
    // Configuration
    // ---------------------------------------------------------

    const BASE_URL = process.env.API_BASE_URL || Routes.BASE_URL;
    const VALID_USERNAME = process.env.FAKESTORE_USERNAME || 'mor_2314';
    const VALID_PASSWORD = process.env.FAKESTORE_PASSWORD || '83r5^_';

    // ---------------------------------------------------------
    // POST - Successful Login
    // ---------------------------------------------------------

    test('POST - Successful Login @master @sanity @api', async ({ request }) => {
        const response = await request.post(`${BASE_URL}${Routes.AUTH_LOGIN}`, {
            data: { username: VALID_USERNAME, password: VALID_PASSWORD },
        });

        expect(response.status()).toBe(201);

        const responseBody = await response.json();
        expect(responseBody.token).toBeTruthy();
        expect(typeof responseBody.token).toBe('string');
        expect(responseBody.token.length).toBeGreaterThan(0);
    });

    // ---------------------------------------------------------
    // POST - Invalid Login
    // ---------------------------------------------------------

    test('POST - Invalid Login @master @sanity @api', async ({ request }) => {
        const payload = RandomDataUtil.generateInvalidLoginPayload();

        const response = await request.post(`${BASE_URL}${Routes.AUTH_LOGIN}`, {
            data: payload,
        });

        expect(response.status()).toBe(401);

        const responseBody = await response.json();
        expect(responseBody.message).toBe('username or password is incorrect');
    });
});
