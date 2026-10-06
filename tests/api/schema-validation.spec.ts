import { test, expect } from '@playwright/test';
import { Routes } from '../../api/endpoints/routes';
import { DataProvider } from '../../utils/DataReader';
import Ajv from 'ajv';
import dotenv from 'dotenv';

dotenv.config();

test.describe('API Schema Validation Tests', () => {

    // ---------------------------------------------------------
    // Configuration
    // ---------------------------------------------------------

    const BASE_URL = process.env.API_BASE_URL || Routes.BASE_URL;
    const PRODUCT_ID = Number(process.env.PRODUCT_ID ?? 1);
    const USER_ID = Number(process.env.USER_ID ?? 1);
    const CART_ID = Number(process.env.CART_ID ?? 1);

    const ajv = new Ajv();

    // ---------------------------------------------------------
    // Product Response Schema
    // ---------------------------------------------------------

    test('Product Response Schema @master @sanity @api', async ({ request }) => {
        const url = Routes.GET_PRODUCT_BY_ID.replace('{id}', String(PRODUCT_ID));

        const response = await request.get(`${BASE_URL}${url}`);

        expect(response.status()).toBe(200);

        const responseBody = await response.json();
        const schema = DataProvider.readJson('./api/schemas/product_api_schema.json');
        const validate = ajv.compile(schema);
        const isValid = validate(responseBody);

        expect(isValid, `Product schema validation failed: ${JSON.stringify(validate.errors)}`).toBeTruthy();
    });

    // ---------------------------------------------------------
    // User Response Schema
    // ---------------------------------------------------------

    test('User Response Schema @master @sanity @api', async ({ request }) => {
        const url = Routes.GET_USER_BY_ID.replace('{id}', String(USER_ID));

        const response = await request.get(`${BASE_URL}${url}`);

        expect(response.status()).toBe(200);

        const responseBody = await response.json();
        const schema = DataProvider.readJson('./api/schemas/user_api_schema.json');
        const validate = ajv.compile(schema);
        const isValid = validate(responseBody);

        expect(isValid, `User schema validation failed: ${JSON.stringify(validate.errors)}`).toBeTruthy();
    });

    // ---------------------------------------------------------
    // Cart Response Schema
    // ---------------------------------------------------------

    test('Cart Response Schema @master @sanity @api', async ({ request }) => {
        const url = Routes.GET_CART_BY_ID.replace('{id}', String(CART_ID));

        const response = await request.get(`${BASE_URL}${url}`);

        expect(response.status()).toBe(200);

        const responseBody = await response.json();
        const schema = DataProvider.readJson('./api/schemas/cart_api_schema.json');
        const validate = ajv.compile(schema);
        const isValid = validate(responseBody);

        expect(isValid, `Cart schema validation failed: ${JSON.stringify(validate.errors)}`).toBeTruthy();
    });
});
