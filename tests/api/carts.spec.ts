import { test, expect } from '@playwright/test';
import { Routes } from '../../api/endpoints/routes';
import { RandomDataUtil } from '../../utils/dataGenerator';
import dotenv from 'dotenv';

dotenv.config();

test.describe('Carts API Tests', () => {

    // ---------------------------------------------------------
    // Configuration
    // ---------------------------------------------------------

    const BASE_URL = process.env.API_BASE_URL || Routes.BASE_URL;
    const CART_ID = Number(process.env.CART_ID ?? 1);
    const USER_ID = Number(process.env.USER_ID ?? 1);
    const LIMIT = Number(process.env.LIMIT ?? 3);
    const START_DATE = process.env.START_DATE || '2019-12-10';
    const END_DATE = process.env.END_DATE || '2020-10-10';

    // ---------------------------------------------------------
    // GET - All Carts
    // ---------------------------------------------------------

    test('GET - All Carts @master @sanity @api', async ({ request }) => {
        const response = await request.get(`${BASE_URL}${Routes.GET_ALL_CARTS}`);

        expect(response.status()).toBe(200);

        const carts = await response.json();

        expect(Array.isArray(carts)).toBeTruthy();
        expect(carts.length).toBeGreaterThan(0);
    });

    // ---------------------------------------------------------
    // GET - Cart by ID
    // ---------------------------------------------------------

    test('GET - Cart by ID @master @sanity @api', async ({ request }) => {
        const url = Routes.GET_CART_BY_ID.replace('{id}', String(CART_ID));

        const response = await request.get(`${BASE_URL}${url}`);

        expect(response.status()).toBe(200);

        const cart = await response.json();

        expect(cart.id).toBe(CART_ID);
        expect(cart.userId).toBeTruthy();
    });

    // ---------------------------------------------------------
    // GET - Carts by Date Range
    // ---------------------------------------------------------

    test('GET - Carts by Date Range @master @sanity @api', async ({ request }) => {
        const url = Routes.GET_CARTS_BY_DATE_RANGE
            .replace('{startdate}', START_DATE)
            .replace('{enddate}', END_DATE);

        const response = await request.get(`${BASE_URL}${url}`);

        expect(response.status()).toBe(200);

        const carts = await response.json();

        expect(Array.isArray(carts)).toBeTruthy();

        for (const cart of carts) {
            expect(cart.date).toBeTruthy();
            const cartDate = String(cart.date).slice(0, 10);
            expect(cartDate >= START_DATE).toBeTruthy();
            expect(cartDate <= END_DATE).toBeTruthy();
        }
    });

    // ---------------------------------------------------------
    // GET - User Cart
    // ---------------------------------------------------------

    test('GET - User Cart @master @sanity @api', async ({ request }) => {
        const url = Routes.GET_USER_CART.replace('{userId}', String(USER_ID));

        const response = await request.get(`${BASE_URL}${url}`);

        expect(response.status()).toBe(200);

        const carts = await response.json();

        expect(Array.isArray(carts)).toBeTruthy();

        for (const cart of carts) {
            expect(cart.userId).toBe(USER_ID);
        }
    });

    // ---------------------------------------------------------
    // GET - Carts with Limit
    // ---------------------------------------------------------

    test('GET - Carts with Limit @master @sanity @api', async ({ request }) => {
        const url = Routes.GET_CARTS_WITH_LIMIT.replace('{limit}', String(LIMIT));

        const response = await request.get(`${BASE_URL}${url}`);

        expect(response.status()).toBe(200);

        const carts = await response.json();

        expect(Array.isArray(carts)).toBeTruthy();
        expect(carts.length).toBe(LIMIT);
    });

    // ---------------------------------------------------------
    // GET - Sort Carts (Ascending and Descending)
    // ---------------------------------------------------------

    test('GET - Sort Carts @master @sanity @api', async ({ request }) => {
        for (const order of ['asc', 'desc']) {
            const url = Routes.GET_CARTS_SORTED.replace('{order}', order);

            const response = await request.get(`${BASE_URL}${url}`);

            expect(response.status()).toBe(200);

            const carts = await response.json();
            const ids: number[] = carts.map((cart: any) => cart.id);
            const sortedIds: number[] = [...ids].sort((a, b) => (order === 'asc' ? a - b : b - a));

            expect(ids).toEqual(sortedIds);
        }
    });

    // ---------------------------------------------------------
    // POST - Create Cart
    // ---------------------------------------------------------

    test('POST - Create Cart @master @regression @api', async ({ request }) => {
        const payload = RandomDataUtil.generateCartPayload(USER_ID);

        const response = await request.post(`${BASE_URL}${Routes.CREATE_CART}`, { data: payload });

        expect(response.status()).toBe(201);

        const cart = await response.json();

        expect(cart.id).toBeTruthy();
        expect(cart.userId).toBe(USER_ID);
        expect(Array.isArray(cart.products)).toBeTruthy();
    });

    // ---------------------------------------------------------
    // PUT - Update Cart
    // ---------------------------------------------------------

    test('PUT - Update Cart @master @regression @api', async ({ request }) => {
        const payload = RandomDataUtil.generateUpdatedCartPayload(USER_ID);
        const url = Routes.UPDATE_CART.replace('{id}', String(CART_ID));

        const response = await request.put(`${BASE_URL}${url}`, { data: payload });

        expect(response.status()).toBe(200);

        const cart = await response.json();

        expect(cart.id).toBe(CART_ID);
        expect(Array.isArray(cart.products)).toBeTruthy();
    });

    // ---------------------------------------------------------
    // DELETE - Delete Cart
    // ---------------------------------------------------------

    test('DELETE - Delete Cart @master @regression @api', async ({ request }) => {
        const url = Routes.DELETE_CART.replace('{id}', String(CART_ID));

        const response = await request.delete(`${BASE_URL}${url}`);

        expect(response.status()).toBe(200);

        const cart = await response.json();

        expect(cart.id).toBe(CART_ID);
    });
});
