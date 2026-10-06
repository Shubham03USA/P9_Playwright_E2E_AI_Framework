import { test, expect } from '@playwright/test';
import { Routes } from '../../api/endpoints/routes';
import { RandomDataUtil } from '../../utils/dataGenerator';
import dotenv from 'dotenv';

dotenv.config();

test.describe('Users API Tests', () => {

    // ---------------------------------------------------------
    // Configuration
    // ---------------------------------------------------------

    const BASE_URL = process.env.API_BASE_URL || Routes.BASE_URL;
    const USER_ID = Number(process.env.USER_ID ?? 1);
    const LIMIT = Number(process.env.LIMIT ?? 3);

    // ---------------------------------------------------------
    // GET - All Users
    // ---------------------------------------------------------

    test('GET - All Users @master @sanity @api', async ({ request }) => {
        const response = await request.get(`${BASE_URL}${Routes.GET_ALL_USERS}`);

        expect(response.status()).toBe(200);

        const users = await response.json();

        expect(Array.isArray(users)).toBeTruthy();
        expect(users.length).toBeGreaterThan(0);
    });

    // ---------------------------------------------------------
    // GET - User by ID
    // ---------------------------------------------------------

    test('GET - User by ID @master @sanity @api', async ({ request }) => {
        const url = Routes.GET_USER_BY_ID.replace('{id}', String(USER_ID));

        const response = await request.get(`${BASE_URL}${url}`);

        expect(response.status()).toBe(200);

        const user = await response.json();

        expect(user.id).toBe(USER_ID);
        expect(user.username).toBeTruthy();
    });

    // ---------------------------------------------------------
    // GET - Users with Limit
    // ---------------------------------------------------------

    test('GET - Users with Limit @master @sanity @api', async ({ request }) => {
        const url = Routes.GET_USERS_WITH_LIMIT.replace('{limit}', String(LIMIT));

        const response = await request.get(`${BASE_URL}${url}`);

        expect(response.status()).toBe(200);

        const users = await response.json();

        expect(Array.isArray(users)).toBeTruthy();
        expect(users.length).toBe(LIMIT);
    });

    // ---------------------------------------------------------
    // GET - Sort Users (Ascending and Descending)
    // ---------------------------------------------------------

    test('GET - Sort Users @master @sanity @api', async ({ request }) => {
        for (const order of ['asc', 'desc']) {
            const url = Routes.GET_USERS_SORTED.replace('{order}', order);

            const response = await request.get(`${BASE_URL}${url}`);

            expect(response.status()).toBe(200);

            const users = await response.json();
            const ids: number[] = users.map((user: any) => user.id);
            const sortedIds: number[] = [...ids].sort((a, b) => (order === 'asc' ? a - b : b - a));

            expect(ids).toEqual(sortedIds);
        }
    });

    // ---------------------------------------------------------
    // POST - Create User
    // ---------------------------------------------------------

    test('POST - Create User @master @regression @api', async ({ request }) => {
        const payload = RandomDataUtil.generateUserPayload();

        const response = await request.post(`${BASE_URL}${Routes.CREATE_USER}`, { data: payload });

        expect(response.status()).toBe(201);

        const user = await response.json();

        expect(user.id).toBeTruthy();
        expect(user.username).toBe(payload.username);
    });

    // ---------------------------------------------------------
    // PUT - Update User
    // ---------------------------------------------------------

    test('PUT - Update User @master @regression @api', async ({ request }) => {
        const payload = RandomDataUtil.generateUserUpdatePayload();
        const url = Routes.UPDATE_USER.replace('{id}', String(USER_ID));

        const response = await request.put(`${BASE_URL}${url}`, { data: payload });

        expect(response.status()).toBe(200);

        const user = await response.json();

        expect(user.id).toBe(USER_ID);
        expect(user.username).toBe(payload.username);
    });

    // ---------------------------------------------------------
    // DELETE - Delete User
    // ---------------------------------------------------------

    test('DELETE - Delete User @master @regression @api', async ({ request }) => {
        const url = Routes.DELETE_USER.replace('{id}', String(USER_ID));

        const response = await request.delete(`${BASE_URL}${url}`);

        expect(response.status()).toBe(200);

        const user = await response.json();

        expect(user.id).toBe(USER_ID);
    });
});
