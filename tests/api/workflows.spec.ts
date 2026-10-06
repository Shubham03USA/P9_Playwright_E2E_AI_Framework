import { test, expect } from '@playwright/test';
import { Routes } from '../../api/endpoints/routes';
import { RandomDataUtil } from '../../utils/dataGenerator';
import dotenv from 'dotenv';

dotenv.config();

const BASE_URL = process.env.API_BASE_URL || Routes.BASE_URL;
const USER_ID = Number(process.env.USER_ID ?? 1);

// ---------------------------------------------------------
// Product CRUD Workflow (Create -> Update -> Delete)
// ---------------------------------------------------------

test.describe.serial('Product CRUD Workflow API Tests', () => {

    let productId = 0;
    let createdPayload: any;

    test('Create Product @master @regression @api', async ({ request }) => {
        createdPayload = RandomDataUtil.generateProductPayload();

        const response = await request.post(`${BASE_URL}${Routes.CREATE_PRODUCT}`, { data: createdPayload });

        expect(response.status()).toBe(201);

        const product = await response.json();

        productId = product.id;
        expect(productId).toBeTruthy();
        expect(product.title).toBe(createdPayload.title);
    });

    test('Update Product @master @regression @api', async ({ request }) => {
        const url = Routes.UPDATE_PRODUCT.replace('{id}', String(productId));
        const updatedPayload = RandomDataUtil.generateUpdatedProductPayload();

        const response = await request.put(`${BASE_URL}${url}`, { data: updatedPayload });

        expect(response.status()).toBe(200);

        const product = await response.json();

        expect(product.id).toBe(productId);
        expect(product.title).toBe(updatedPayload.title);
    });

    test('Delete Product @master @regression @api', async ({ request }) => {
        const url = Routes.DELETE_PRODUCT.replace('{id}', String(productId));

        const response = await request.delete(`${BASE_URL}${url}`);

        expect(response.status()).toBe(200);

        const product = await response.json();

        expect(product.id).toBe(productId);
    });
});

// ---------------------------------------------------------
// User CRUD Workflow (Create -> Update -> Delete)
// ---------------------------------------------------------

test.describe.serial('User CRUD Workflow API Tests', () => {

    let userId = 0;
    let createdPayload: any;

    test('Create User @master @regression @api', async ({ request }) => {
        createdPayload = RandomDataUtil.generateUserPayload();

        const response = await request.post(`${BASE_URL}${Routes.CREATE_USER}`, { data: createdPayload });

        expect(response.status()).toBe(201);

        const user = await response.json();

        userId = user.id;
        expect(userId).toBeTruthy();
        expect(user.username).toBe(createdPayload.username);
    });

    test('Update User @master @regression @api', async ({ request }) => {
        const url = Routes.UPDATE_USER.replace('{id}', String(userId));
        const updatedPayload = RandomDataUtil.generateUserUpdatePayload();

        const response = await request.put(`${BASE_URL}${url}`, { data: updatedPayload });

        expect(response.status()).toBe(200);

        const user = await response.json();

        expect(user.id).toBe(userId);
        expect(user.username).toBe(updatedPayload.username);
    });

    test('Delete User @master @regression @api', async ({ request }) => {
        const url = Routes.DELETE_USER.replace('{id}', String(userId));

        const response = await request.delete(`${BASE_URL}${url}`);

        expect(response.status()).toBe(200);

        const user = await response.json();

        expect(user.id).toBe(userId);
    });
});

// ---------------------------------------------------------
// Cart CRUD Workflow (Create -> Update -> Delete)
// ---------------------------------------------------------

test.describe.serial('Cart CRUD Workflow API Tests', () => {

    let cartId = 0;

    test('Create Cart @master @regression @api', async ({ request }) => {
        const payload = RandomDataUtil.generateCartPayload(USER_ID);

        const response = await request.post(`${BASE_URL}${Routes.CREATE_CART}`, { data: payload });

        expect(response.status()).toBe(201);

        const cart = await response.json();

        cartId = cart.id;
        expect(cartId).toBeTruthy();
        expect(cart.userId).toBe(USER_ID);
        expect(Array.isArray(cart.products)).toBeTruthy();
    });

    test('Update Cart @master @regression @api', async ({ request }) => {
        const url = Routes.UPDATE_CART.replace('{id}', String(cartId));
        const updatedPayload = RandomDataUtil.generateUpdatedCartPayload(USER_ID);

        const response = await request.put(`${BASE_URL}${url}`, { data: updatedPayload });

        expect(response.status()).toBe(200);

        const cart = await response.json();

        expect(cart.id).toBe(cartId);
        expect(Array.isArray(cart.products)).toBeTruthy();
    });

    test('Delete Cart @master @regression @api', async ({ request }) => {
        const url = Routes.DELETE_CART.replace('{id}', String(cartId));

        const response = await request.delete(`${BASE_URL}${url}`);

        expect(response.status()).toBe(200);

        const cart = await response.json();

        expect(cart.id).toBe(cartId);
    });
});
