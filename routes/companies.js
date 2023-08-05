const express = require('express');
const router = express.Router();
const db = require('../db');
const ExpressErrors = require('../expressErrors');

router.get('/', async (req, res, next) => {
    try {
        const results = await db.query('SELECT * FROM companies');
        return res.json({
            companies: results.rows
        });
    } catch (err) {
        return next(err);
    }
});

router.get('/:code', async (req, res, next) => {
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

router.post('/', async (req, res, next) => {
    try {
        const { code, name, description } = req.body;
        const results = await db.query('INSERT INTO companies (code, name, description) VALUES ($1, $2, $3)RETURNING code, name, description', [code, name, description]);
        return res.status(201).json({
            company: results.rows[0]
        });

    } catch (err) {
        return next(err);
    }
});

router.put('/:code', async (req, res, next) => {
    try {
        const { code } = req.params;
        const { name, description } = req.body;
        const results = await db.query('UPDATE companies SET name=$2, description=$3 WHERE code=$1 RETURNING code,name,description', [code, name, description]);

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

router.delete('/:code', async (req, res, next) => {
    try {
        const { code } = req.params;
        const results = await db.query('DELETE FROM companies WHERE code=$1 RETURNING code', [code]);
        if (results.rows.length == 0) {
            throw new ExpressErrors('Company not found', 404);
        } else {
            return res.json({
                status: 'Deleted'
            });
        }
    } catch (e) {
        return next(e);
    }
});

module.exports = router;