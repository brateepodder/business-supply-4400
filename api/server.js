const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const app = express();

// Setup CORS to allow frontend to communicate with backend
app.use(cors());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'lokonath',
    database: 'business_supply',
    port: 3306 // Default MySQL port (you can change it if necessary)
  });

// VIEWS AND TABLES

// Owners View
app.get('/api/owners', async (req, res) => {
    try {
      const query = 'SELECT * FROM display_owner_view';
      console.log('Running query:', query);
      db.query(query, (err, results) => {
        if (err) {
          console.error('Query error:', err);
          return res.status(500).json({ error: 'Failed to fetch data' });
        }
        console.log('Query results:', results);
        res.json(results);
      });
    } catch (err) {
      console.error('Unexpected error:', err);
      res.status(500).json({ error: 'Unexpected server error' });
    }
});

// Driver View
app.get('/api/drivers', async (req, res) => {
    try {
      const query = 'SELECT * FROM display_driver_view';
      console.log('Running query:', query);
      db.query(query, (err, results) => {
        if (err) {
          console.error('Query error:', err);
          return res.status(500).json({ error: 'Failed to fetch data' });
        }
        console.log('Query results:', results);
        res.json(results);
      });
    } catch (err) {
      console.error('Unexpected error:', err);
      res.status(500).json({ error: 'Unexpected server error' });
    }
});

// Employee View
app.get('/api/employees', async (req, res) => {
    try {
      const query = 'SELECT * FROM display_employee_view';
      console.log('Running query:', query);
      db.query(query, (err, results) => {
        if (err) {
          console.error('Query error:', err);
          return res.status(500).json({ error: 'Failed to fetch data' });
        }
        console.log('Query results:', results);
        res.json(results);
      });
    } catch (err) {
      console.error('Unexpected error:', err);
      res.status(500).json({ error: 'Unexpected server error' });
    }
});

// Location View
app.get('/api/locations', async (req, res) => {
    try {
      const query = 'SELECT * FROM display_location_view';
      console.log('Running query:', query);
      db.query(query, (err, results) => {
        if (err) {
          console.error('Query error:', err);
          return res.status(500).json({ error: 'Failed to fetch data' });
        }
        console.log('Query results:', results);
        res.json(results);
      });
    } catch (err) {
      console.error('Unexpected error:', err);
      res.status(500).json({ error: 'Unexpected server error' });
    }
});

// Product View
app.get('/api/products', async (req, res) => {
    try {
      const query = 'SELECT * FROM display_product_view';
      console.log('Running query:', query);
      db.query(query, (err, results) => {
        if (err) {
          console.error('Query error:', err);
          return res.status(500).json({ error: 'Failed to fetch data' });
        }
        console.log('Query results:', results);
        res.json(results);
      });
    } catch (err) {
      console.error('Unexpected error:', err);
      res.status(500).json({ error: 'Unexpected server error' });
    }
});

// Service View
app.get('/api/services', async (req, res) => {
    try {
      const query = 'SELECT * FROM display_service_view';
      console.log('Running query:', query);
      db.query(query, (err, results) => {
        if (err) {
          console.error('Query error:', err);
          return res.status(500).json({ error: 'Failed to fetch data' });
        }
        console.log('Query results:', results);
        res.json(results);
      });
    } catch (err) {
      console.error('Unexpected error:', err);
      res.status(500).json({ error: 'Unexpected server error' });
    }
});

// Vans Table 
app.get('/api/vans', async (req, res) => {
    try {
      const query = 'SELECT * FROM business_supply.vans';
      console.log('Running query:', query);
      db.query(query, (err, results) => {
        if (err) {
          console.error('Query error:', err);
          return res.status(500).json({ error: 'Failed to fetch data' });
        }
        console.log('Query results:', results);
        res.json(results);
      });
    } catch (err) {
      console.error('Unexpected error:', err);
      res.status(500).json({ error: 'Unexpected server error' });
    }
});

// Businesses Table 
app.get('/api/businesses', async (req, res) => {
    try {
      const query = 'SELECT * FROM business_supply.businesses';
      console.log('Running query:', query);
      db.query(query, (err, results) => {
        if (err) {
          console.error('Query error:', err);
          return res.status(500).json({ error: 'Failed to fetch data' });
        }
        console.log('Query results:', results);
        res.json(results);
      });
    } catch (err) {
      console.error('Unexpected error:', err);
      res.status(500).json({ error: 'Unexpected server error' });
    }
});

  app.get('/ping', (req, res) => {
    res.send('Server is up and running!');
  });

// Start the server
app.listen(5000, '0.0.0.0', () => {
  console.log('Server is running on http://localhost:5000');
});
