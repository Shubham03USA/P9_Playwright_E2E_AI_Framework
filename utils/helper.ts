import dotenv from 'dotenv';

dotenv.config();

export class Helper {
    static convertPriceToNumber(price: string): number {
        const cleaned = price.replace(/[^0-9.]/g, '');
        return Number(cleaned);
    }

    static getProductDetails() {
        return {
            productName: (process.env.PRODUCT_NAME || 'Sauce Labs Fleece Jacket').trim(),
            productQuantity: '1',
            totalPrice: (process.env.TOTAL_PRICE || '$49.99').trim(),
        };
    }

    static getLoginDetails() {
        return {
            email: (process.env.APP_EMAIL || 'standard_user').trim(),
            password: (process.env.APP_PASSWORD || 'secret_sauce').trim(),
        };
    }
}
