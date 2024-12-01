const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const app = express();

// Setup CORS to allow frontend to communicate with backend
app.use(cors());
app.use(express.json());

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

// STORED PROCEDURES

// ADD OWNER - add_owner()
app.post("/api/add-owner", async (req, res) => {
    const { username, first_name, last_name, address, birthdate } = req.body;

    console.log("Received data:", req.body);

    // Validate form fields
    if (!username || !birthdate) {
        console.log("Validation failed: Username and birthday are required.");
        return res.status(400).json({ message: "Username and birthday are required." });
    }

    const query = `CALL business_supply.add_owner(?, ?, ?, ?, ?);`;
    const values = [username, first_name, last_name, address, birthdate];

    try {
        db.query(query, values, (err, results) => {
            if (err) {
                console.error("MySQL Error:", err);
                return res.status(500).json({ message: "Database error." });
            }

            console.log("Stored procedure raw results:", JSON.stringify(results, null, 2));

            // Extract the message from the first result set
            const procedureMessage = results?.[0]?.[0]?.message;

            if (procedureMessage) {
                console.log("Procedure message:", procedureMessage);
                // Send the procedure message to the frontend and exit
                return res.json({ message: procedureMessage });
            }

            // Default success case
            console.log("Owner added successfully.");
            return res.json({ message: "Owner added successfully!" });
        });
    } catch (error) {
        console.error("Server Error:", error);
        res.status(500).json({ message: "Internal server error." });
    }
});


  

