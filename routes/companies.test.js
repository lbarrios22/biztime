process.env.NODE_ENV = 'test';


const request = require('supertest');
const app = require('../app');
const db = require('../db');

let company;

beforeEach(async () => {
    const results = await db.query(`INSERT INTO companies (code, name, description) VALUES ('snap','Snapchat','Photo sharing') RETURNING code, name, description`);
    company = results.rows[0];
});

afterEach(async () => {
    await db.query('DELETE FROM companies');
});

afterAll(async () => {
    await db.end();
});

describe('GET /companies', () => {
    test('Gets all companies', async () => {
        const res = await request(app).get('/companies');
        expect(res.status).toBe(200);
        expect(res.body).toEqual({
            companies: [company]
        });
    });

    test('Expecting error', async () => {
        const res = await request(app).get('/djksahhda');
        expect(res.status).toBe(404);
    });
});

describe('GET /companies/:code', () => {
    test('Gets company by code', async () => {
        const res = await request(app).get(`/companies/${company.code}`);
        expect(res.status).toBe(200);
        expect(res.body).toEqual({
            company: company
        });
    });

    test('Expecting error', async () => {
        const res = await request(app).get('/companies/0');
        expect(res.status).toBe(404);
    });
});

describe('POST /companies', () => {
    test('Makes a new company', async () => {

        const newCompany = { code: 'insta', name: 'Instagram', description: 'Photo sharing' };
        const res = await request(app).post('/companies').send(newCompany);
        expect(res.status).toBe(201);
        expect(res.body).toEqual({
            company: newCompany
        });
    });
});

describe('PUT /companies/:code', () => {
    test('Changes company by code', async () => {
        const companyChanges = { code: 'snap', name: 'SnapChat', description: 'Ability to share photos' };
        const res = await request(app).put(`/companies/${company.code}`).send(companyChanges);
        expect(res.status).toBe(200);
        expect(res.body).toEqual({
            company: companyChanges
        });
    });

    test('Expecting error', async () => {
        const res = await request(app).get('/companies/0');
        expect(res.status).toBe(404);
    });
});

describe('DELETE /companies/:code', () => {
    test('Deletes company by code', async () => {
        const res = await request(app).delete(`/companies/${company.code}`);
        expect(res.status).toBe(200);
        expect(res.body).toEqual({
            status: 'Deleted'
        });
    });

    test('Expecting error', async () => {
        const res = await request(app).get('/companies/0');
        expect(res.status).toBe(404);
    });
});

