import { test, expect } from '@playwright/test';
import { Routes } from '../../api/endpoints/routes';
import { RandomDataUtil } from '../../utils/dataGenerator';
import dotenv from 'dotenv';

dotenv.config();

test.describe('Products API Tests', () => {

    // ---------------------------------------------------------
    // Configuration
    // ---------------------------------------------------------

    const BASE_URL = process.env.API_BASE_URL || Routes.BASE_URL;
    const PRODUCT_ID = Number(process.env.PRODUCT_ID ?? 1);
    const LIMIT = Number(process.env.LIMIT ?? 3);

    // ---------------------------------------------------------
    // GET - All Products
    // ---------------------------------------------------------

    test('GET - All Products @master @sanity @api', async ({ request }) => {
        const response = await request.get(`${BASE_URL}${Routes.GET_ALL_PRODUCTS}`);

        expect(response.status()).toBe(200);

        const products = await response.json();

        expect(Array.isArray(products)).toBeTruthy();
        expect(products.length).toBeGreaterThan(0);

        const firstProduct = products[0];
        expect(firstProduct.id).toBeTruthy();
        expect(firstProduct.title).toBeTruthy();
        expect(firstProduct.price).toBeTruthy();
        expect(firstProduct.category).toBeTruthy();
        expect(firstProduct.image).toBeTruthy();
    });

    // ---------------------------------------------------------
    // GET - Product by ID
    // ---------------------------------------------------------

    test('GET - Product by ID @master @sanity @api', async ({ request }) => {
        const url = Routes.GET_PRODUCT_BY_ID.replace('{id}', String(PRODUCT_ID));

        const response = await request.get(`${BASE_URL}${url}`);

        expect(response.status()).toBe(200);

        const product = await response.json();

        expect(product.id).toBe(PRODUCT_ID);
        expect(product.title).toBeTruthy();
        expect(product.price).toBeTruthy();
    });

    // ---------------------------------------------------------
    // GET - Products with Limit
    // ---------------------------------------------------------

    test('GET - Products with Limit @master @sanity @api', async ({ request }) => {
        const url = Routes.GET_PRODUCTS_WITH_LIMIT.replace('{limit}', String(LIMIT));

        const response = await request.get(`${BASE_URL}${url}`);

        expect(response.status()).toBe(200);

        const products = await response.json();

        expect(Array.isArray(products)).toBeTruthy();
        expect(products.length).toBe(LIMIT);
    });

    // ---------------------------------------------------------
    // GET - Sort Products (Ascending)
    // ---------------------------------------------------------

    test('GET - Sort Products Ascending @master @sanity @api', async ({ request }) => {
        const url = Routes.GET_PRODUCTS_SORTED.replace('{order}', 'asc');

        const response = await request.get(`${BASE_URL}${url}`);

        expect(response.status()).toBe(200);

        const products = await response.json();
        const ids: number[] = products.map((product: any) => product.id);
        const sortedIds: number[] = [...ids].sort((a, b) => a - b);

        expect(ids).toEqual(sortedIds);
    });

    // ---------------------------------------------------------
    // GET - Sort Products (Descending)
    // ---------------------------------------------------------

    test('GET - Sort Products Descending @master @sanity @api', async ({ request }) => {
        const url = Routes.GET_PRODUCTS_SORTED.replace('{order}', 'desc');

        const response = await request.get(`${BASE_URL}${url}`);

        expect(response.status()).toBe(200);

        const products = await response.json();
        const ids: number[] = products.map((product: any) => product.id);
        const sortedIds: number[] = [...ids].sort((a, b) => b - a);

        expect(ids).toEqual(sortedIds);
    });

    // ---------------------------------------------------------
    // GET - All Categories
    // ---------------------------------------------------------

    test('GET - All Categories @master @sanity @api', async ({ request }) => {
        const response = await request.get(`${BASE_URL}${Routes.GET_ALL_CATEGORIES}`);

        expect(response.status()).toBe(200);

        const categories = await response.json();

        expect(Array.isArray(categories)).toBeTruthy();
        expect(categories.length).toBeGreaterThan(0);
    });

    // ---------------------------------------------------------
    // GET - Products by Category
    // ---------------------------------------------------------

    test('GET - Products by Category @master @sanity @api', async ({ request }) => {
        const category = 'electronics';
        const url = Routes.GET_PRODUCTS_BY_CATEGORY.replace('{category}', category);

        const response = await request.get(`${BASE_URL}${url}`);

        expect(response.status()).toBe(200);

        const products = await response.json();

        expect(Array.isArray(products)).toBeTruthy();
        expect(products.length).toBeGreaterThan(0);

        for (const product of products) {
            expect(product.category).toBe(category);
        }
    });

    // ---------------------------------------------------------
    // POST - Create Product
    // ---------------------------------------------------------

    test('POST - Create Product @master @regression @api', async ({ request }) => {
        const payload = RandomDataUtil.generateProductPayload();

        const response = await request.post(`${BASE_URL}${Routes.CREATE_PRODUCT}`, { data: payload });

        expect(response.status()).toBe(201);

        const product = await response.json();

        expect(product.id).toBeTruthy();
        expect(product.title).toBe(payload.title);
        expect(product.price).toBe(payload.price);
    });

    // ---------------------------------------------------------
    // PUT - Update Product
    // ---------------------------------------------------------

    test('PUT - Update Product @master @regression @api', async ({ request }) => {
        const payload = RandomDataUtil.generateUpdatedProductPayload();
        const url = Routes.UPDATE_PRODUCT.replace('{id}', String(PRODUCT_ID));

        const response = await request.put(`${BASE_URL}${url}`, { data: payload });

        expect(response.status()).toBe(200);

        const product = await response.json();

        expect(product.id).toBe(PRODUCT_ID);
        expect(product.title).toBe(payload.title);
    });

    // ---------------------------------------------------------
    // DELETE - Delete Product
    // ---------------------------------------------------------

    test('DELETE - Delete Product @master @regression @api', async ({ request }) => {
        const url = Routes.DELETE_PRODUCT.replace('{id}', String(PRODUCT_ID));

        const response = await request.delete(`${BASE_URL}${url}`);

        expect(response.status()).toBe(200);

        const product = await response.json();

        expect(product.id).toBe(PRODUCT_ID);
    });
});
