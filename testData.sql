\c companiesdb_test

DROP TABLE IF EXISTS invoices;
DROP TABLE IF EXISTS companies;

CREATE TABLE companies(
    code TEXT PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    description TEXT
);

CREATE TABLE invoices(
    id SERIAL PRIMARY KEY,
    comp_code TEXT NOT NULL REFERENCES companies ON DELETE CASCADE,
    amt FLOAT NOT NULL,
    paid BOOLEAN DEFAULT false NOT NULL,
    add_date DATE DEFAULT CURRENT_DATE NOT NULL,
    paid_date DATE,
    CONSTRAINT invoices_amt_check CHECK ((amt > 0::double precision))
);

INSERT INTO companies(code, name, description)
VALUES('apple', 'Apple Computer', 'Maker of OSX'),
('ibm', 'IBM', 'Big blue');

INSERT INTO invoices (comp_Code, amt, paid, paid_date)
VALUES 
('apple', 100, false, null),
('apple', 200, false, null),
('apple', 300, true, '2018-01-01'),
('ibm', 400, false, null);