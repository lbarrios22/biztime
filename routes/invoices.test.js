process.env.NODE_ENV = 'test';


const request = require('supertest');
const app = require('../app');
const db = require('../db');

let invoice;

beforeEach(async () => {
    const res = await db.query(`INSERT INTO invoices (comp_code, amt) VALUES ('apple', '50000') RETURNING comp_code, amt`);
    invoice = res.rows[0];
});

afterEach(async () => {
    await db.query('DELETE FROM invoices');
});

afterAll(async () => {
    await db.end();
});

describe('GET /invoices', () => {
    test('Gets all invoices', async () => {
        const res = await request(app).get('/invoices');
        expect(res.status).toBe(200);
        expect(res.body).toEqual({
            invoices: [invoice]
        });
    });

    test('Expecting error', async () => {
        const res = await request(app).get('/djksahhda');
        expect(res.status).toBe(404);
    });
});

describe('GET /invoices/:id', () => {
    test('Gets invoice by code', async () => {
        const res = await request(app).get(`/invoices/${invoice.id}`);
        expect(res.status).toBe(200);
        expect(res.body).toEqual({
            invoice: invoice
        });
    });

    test('Expecting error', async () => {
        const res = await request(app).get('/invoices/0');
        expect(res.status).toBe(404);
    });
});

describe('POST /invoices', () => {
    test('Makes a new invoice', async () => {

        const newInvoice = [{ comp_code: 'ibm', amt: 4000, }];
        const res = await request(app).post('/invoices').send(newInvoice);
        expect(res.status).toBe(201);
        expect(res.body).toEqual({
            invoice: newInvoice
        });
    });
});

describe('PUT /invoices/:id', () => {
    test('Changes invoice by code', async () => {
        const invoiceChange = [{ amt: 9000 }];
        const res = await request(app).put(`/invoices/${invoice.id}`).send(invoiceChange);
        expect(res.status).toBe(200);
        expect(res.body).toEqual({
            invoice: invoiceChange
        });
    });

    test('Expecting error', async () => {
        const res = await request(app).get('/invoices/0');
        expect(res.status).toBe(404);
    });
});

describe('DELETE /invoices/:id', () => {
    test('Deletes invoice by code', async () => {
        const res = await request(app).delete(`/invoices/${invoice.id}`);
        expect(res.status).toBe(200);
        expect(res.body).toEqual({
            status: 'Deleted'
        });
    });

    test('Expecting error', async () => {
        const res = await request(app).get('/invoices/0');
        expect(res.status).toBe(404);
    });
});

