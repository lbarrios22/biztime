const express = require('express');
const router = express.Router();
const db = require('../db');
const expressErrors = require('../expressErrors');
const ExpressErrors = require('../expressErrors');

router.get('/', async (req, res, next) => {
    try {
        const results = await db.query('SELECT id, comp_code FROM invoices');
        return res.json({
            invoices: results.rows
        });
    } catch (err) {
        return next(err);
    }
});

router.get('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        const results = await db.query(
            `SELECT i.id, 
                i.comp_code, 
                i.amt, 
                i.paid, 
                i.add_date, 
                i.paid_date, 
                c.name, 
                c.description 
                FROM 
                invoices AS i 
                INNER JOIN companies as c 
                ON i.comp_code = c.code 
                WHERE id=$1`,
            [id]);
        if (results.rows.length === 0) {
            throw new ExpressErrors('Invoice not found', 404);
        }
        const data = results.rows[0];
        const invoice = {
            invoice: {
                id: data.id,
                company: {
                    comp_code: data.comp_code,
                    name: data.name,
                    description: data.description
                },
                amt: data.amt,
                paid: data.paid,
                add_date: data.add_date,
                paid_date: data.paid_date
            }
        };
        return res.json({
            invoice: invoice
        });
    } catch (err) {
        return next(err);
    }
});

router.post('/', async (req, res, next) => {
    try {
        const { comp_code, amt } = req.body;
        const results = await db.query('INSERT INTO invoices (comp_code, amt) VALUES ($1, $2) RETURNING comp_code, amt', [comp_code, amt]);

        return res.json({
            invoice: results.rows[0]
        });
    } catch (err) {
        return next(err);
    }
});

router.put('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        const { amt } = req.body;
        const results = await db.query('UPDATE invoices SET amt=$1 WHERE id=$2 RETURNING id, amt', [amt, id]);
        if (results.rows.length === 0) {
            throw new ExpressErrors('Invoice not found', 404);
        }
        return res.json({
            invoice: results.rows[0]
        });
    } catch (err) {
        return next(err);
    }
});

router.delete('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        const results = await db.query('DELETE invoices WHERE id=$1', [id]);

        if (results.rows.length === 0) {
            throw new ExpressErrors('Invoice not found', 404);
        }

        return res.json({
            status: 'Deleted'
        });
    } catch (err) {
        return next(err);
    }
});

router.get('/companies/:code', async (req, res, next) => {
    try {
        const { code } = req.params;
        const results = await db.query('SELECT * FROM companies WHERE code=$1', [code]);
        if (results.rows.length === 0) {
            throw new ExpressErrors('Company not found', 404);
        }
        return res.json({
            company: results.rows[0]
        });
    } catch (err) {
        return next(err);
    }
});

module.exports = router;
