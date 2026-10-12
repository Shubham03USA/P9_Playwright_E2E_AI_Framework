import { test, expect } from '@playwright/test';
import { Routes } from '../../api/endpoints/routes';
import { RandomDataUtil } from '../../utils/dataGenerator';
import dotenv from 'dotenv';

dotenv.config();

const BASE_URL = process.env.API_BASE_URL || Routes.BASE_URL;
const PRODUCT_ID = Number(process.env.PRODUCT_ID ?? 1);
const USER_ID = Number(process.env.USER_ID ?? 1);
const CART_ID = Number(process.env.CART_ID ?? 1);

test.describe('CRUD Operations API Tests', () => {
    test.describe('Product CRUD', () => {
        test('GET - Read Product @master @regression @api', async ({ request }) => {
            const url = Routes.GET_PRODUCT_BY_ID.replace('{id}', String(PRODUCT_ID));
            const response = await request.get(`${BASE_URL}${url}`);

            expect(response.status()).toBe(200);

            const product = await response.json();
            expect(product.id).toBe(PRODUCT_ID);
            expect(product.title).toBeTruthy();
        });

        test('POST - Create Product @master @regression @api', async ({ request }) => {
            const payload = RandomDataUtil.generateProductPayload();
            const response = await request.post(`${BASE_URL}${Routes.CREATE_PRODUCT}`, { data: payload });

            expect(response.status()).toBe(201);

            const product = await response.json();
            expect(product.id).toBeTruthy();
            expect(product.title).toBe(payload.title);
            expect(product.price).toBe(payload.price);
        });

        test('PUT - Update Product @master @regression @api', async ({ request }) => {
            const payload = RandomDataUtil.generateUpdatedProductPayload();
            const url = Routes.UPDATE_PRODUCT.replace('{id}', String(PRODUCT_ID));
            const response = await request.put(`${BASE_URL}${url}`, { data: payload });

            expect(response.status()).toBe(200);

            const product = await response.json();
            expect(product.id).toBe(PRODUCT_ID);
            expect(product.title).toBe(payload.title);
        });

        test('DELETE - Delete Product @master @regression @api', async ({ request }) => {
            const url = Routes.DELETE_PRODUCT.replace('{id}', String(PRODUCT_ID));
            const response = await request.delete(`${BASE_URL}${url}`);

            expect(response.status()).toBe(200);

            const product = await response.json();
            expect(product.id).toBe(PRODUCT_ID);
        });
    });

    test.describe('User CRUD', () => {
        test('GET - Read User @master @regression @api', async ({ request }) => {
            const url = Routes.GET_USER_BY_ID.replace('{id}', String(USER_ID));
            const response = await request.get(`${BASE_URL}${url}`);

            expect(response.status()).toBe(200);

            const user = await response.json();
            expect(user.id).toBe(USER_ID);
            expect(user.username).toBeTruthy();
        });

        test('POST - Create User @master @regression @api', async ({ request }) => {
            const payload = RandomDataUtil.generateUserPayload();
            const response = await request.post(`${BASE_URL}${Routes.CREATE_USER}`, { data: payload });

            expect(response.status()).toBe(201);

            const user = await response.json();
            expect(user.id).toBeTruthy();
        });

        test('PUT - Update User @master @regression @api', async ({ request }) => {
            const payload = RandomDataUtil.generateUserUpdatePayload();
            const url = Routes.UPDATE_USER.replace('{id}', String(USER_ID));
            const response = await request.put(`${BASE_URL}${url}`, { data: payload });

            expect(response.status()).toBe(200);

            const user = await response.json();
            expect(user.username).toBe(payload.username);
        });

        test('DELETE - Delete User @master @regression @api', async ({ request }) => {
            const url = Routes.DELETE_USER.replace('{id}', String(USER_ID));
            const response = await request.delete(`${BASE_URL}${url}`);

            expect(response.status()).toBe(200);

            const user = await response.json();
            expect(user.id).toBe(USER_ID);
        });
    });

    test.describe('Cart CRUD', () => {
        test('GET - Read Cart @master @regression @api', async ({ request }) => {
            const url = Routes.GET_CART_BY_ID.replace('{id}', String(CART_ID));
            const response = await request.get(`${BASE_URL}${url}`);

            expect(response.status()).toBe(200);

            const cart = await response.json();
            expect(cart.id).toBe(CART_ID);
            expect(cart.userId).toBeTruthy();
        });

        test('POST - Create Cart @master @regression @api', async ({ request }) => {
            const payload = RandomDataUtil.generateCartPayload(USER_ID);
            const response = await request.post(`${BASE_URL}${Routes.CREATE_CART}`, { data: payload });

            expect(response.status()).toBe(201);

            const cart = await response.json();
            expect(cart.id).toBeTruthy();
            expect(cart.userId).toBe(USER_ID);
            expect(Array.isArray(cart.products)).toBeTruthy();
        });

        test('PUT - Update Cart @master @regression @api', async ({ request }) => {
            const payload = RandomDataUtil.generateUpdatedCartPayload(USER_ID);
            const url = Routes.UPDATE_CART.replace('{id}', String(CART_ID));
            const response = await request.put(`${BASE_URL}${url}`, { data: payload });

            expect(response.status()).toBe(200);

            const cart = await response.json();
            expect(cart.id).toBe(CART_ID);
            expect(Array.isArray(cart.products)).toBeTruthy();
        });

        test('DELETE - Delete Cart @master @regression @api', async ({ request }) => {
            const url = Routes.DELETE_CART.replace('{id}', String(CART_ID));
            const response = await request.delete(`${BASE_URL}${url}`);

            expect(response.status()).toBe(200);

            const cart = await response.json();
            expect(cart.id).toBe(CART_ID);
        });
    });
});
