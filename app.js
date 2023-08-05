const express = require('express');
const app = express();
const ExpressErrors = require('./expressErrors');
const companies = require('./routes/companies');
const invoices = require('./routes/invoices');


app.use(express.json());


app.use('/companies', companies);
app.use('/invoices', invoices);



app.use((req, res, next) => {
    const err = new ExpressErrors('Page not found', 404);

    return next(err);
});

app.use((err, req, res, next) => {
    let status = err.status || 500;
    let message = err.message;

    return res.status(status).json({
        error: {
            status: status,
            message: message
        }
    });
});

module.exports = app;