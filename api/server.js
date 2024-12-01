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

// FETCHING USERNAMES FOR AUTOCOMPLETES

// Fetching all usernames
// Endpoint to fetch all usernames
app.get("/api/usernames", async (req, res) => {
  const query = "SELECT username FROM users";
  try {
    db.query(query, (err, results) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).json({ message: "Database error" });
      }

      const usernames = results.map((row) => row.username);
      res.json(usernames);
    });
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Fetching owner's usernames
app.get("/api/owner-usernames", async (req, res) => {
  const query = "SELECT username FROM business_supply.display_owner_view";
  try {
    db.query(query, (err, results) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).json({ message: "Database error" });
      }

      const usernames = results.map((row) => row.username);
      console.log("Owner usernames: ", usernames);
      res.json(usernames);
    });
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Fetching businesses's names
app.get("/api/businesses-names", async (req, res) => {
  const query = "SELECT long_name FROM business_supply.businesses";
  try {
    db.query(query, (err, results) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).json({ message: "Database error" });
      }

      const business_names = results.map((row) => row.username);
      console.log("Business Names Fetching API result: ", business_names);
      res.json(business_names);
    });
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
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
            return res.json({ message: "Owner added successfully." });
        });
    } catch (error) {
        console.error("Server Error:", error);
        res.status(500).json({ message: "Internal server error." });
    }
});

// START FUNDING - start_funding()
app.post("/api/start-funding", async (req, res) => {
    // Map received fields to expected names
    const { ip_owner: owner, ip_amount: amount, ip_long_name: business, ip_fund_date: fundDate } = req.body;

    console.log("Received data:", req.body);

    // Validate form fields
    if (!owner || !amount || !business || !fundDate) {
        console.log("Validation failed: Some fields are null.");
        return res.status(400).json({ message: "All fields must have entries." });
    }

    const query = `CALL business_supply.start_funding(?, ?, ?, ?);`;
    const values = [owner, amount, business, fundDate];

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
                return res.json({ message: procedureMessage });
            }

            console.log("Started funding successfully.");
            return res.json({ message: "Started funding successfully." });
        });
    } catch (error) {
        console.error("Server Error:", error);
        res.status(500).json({ message: "Internal server error." });
    }
});

// ADD EMPLOYEE - add_employee()
app.post("/api/add-employee", async (req, res) => {
  // Map received fields to expected names
  const { ip_username: username, ip_first_name: first_name, ip_last_name: last_name, ip_address: address, ip_birthdate: birthdate, ip_taxID: taxID, ip_hired: hired, ip_employee_experience: employee_experience, ip_salary: salary } = req.body;

  console.log("Received data:", req.body);

  // Validate form fields
  if (!username || !birthdate || !taxID || !hired || !salary || !employee_experience) {
      console.log("Validation failed: Username, birthdate or tax ID are null.");
      return res.status(400).json({ message: "Username, birthdate or tax ID must have values." });
  }

  const query = `CALL business_supply.add_employee(?, ?, ?, ?, ?, ?, ?, ?, ?);`;
  const values = [username, first_name, last_name, address, birthdate, taxID, hired, employee_experience, salary];

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
              return res.json({ message: procedureMessage });
          }

          console.log("Added employee successfully.");
          return res.json({ message: "Added employee successfully." });
      });
  } catch (error) {
      console.error("Server Error:", error);
      res.status(500).json({ message: "Internal server error." });
  }
});

// HIRE EMPLOYEES - hire_employee()
app.post("/api/hire-employee", async (req, res) => {
  // Map received fields to expected names
  const { ip_username: username, ip_id: id } = req.body;

  console.log("Received data:", req.body);

  // Validate form fields
  if (!username || !id) {
      console.log("Validation failed: No fields can be null.");
      return res.status(400).json({ message: "No fields can be null." });
  }

  const query = `CALL business_supply.hire_employee(?, ?);`;
  const values = [username, id];

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
              return res.json({ message: procedureMessage });
          }

          console.log("Hired employee successfully.");
          return res.json({ message: "Hired employee successfully." });
      });
  } catch (error) {
      console.error("Server Error:", error);
      res.status(500).json({ message: "Internal server error." });
  }
});

// FIRE EMPLOYEES - fire_employee()
app.post("/api/fire-employee", async (req, res) => {
  // Map received fields to expected names
  const { ip_username: username, ip_id: id } = req.body;

  console.log("Received data:", req.body);

  // Validate form fields
  if (!username || !id) {
      console.log("Validation failed: No fields can be null.");
      return res.status(400).json({ message: "No fields can be null." });
  }

  const query = `CALL business_supply.hire_employee(?, ?);`;
  const values = [username, id];

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
              return res.json({ message: procedureMessage });
          }

          console.log("Fired employee successfully.");
          return res.json({ message: "Fired employee successfully." });
      });
  } catch (error) {
      console.error("Server Error:", error);
      res.status(500).json({ message: "Internal server error." });
  }
});

// ADD DRIVER ROLE - add_driver_role()
app.post("/api/add-driver-role", async (req, res) => {
  // Map received fields to expected names
  const {
    ip_username: username,
    ip_licenseID: license_id,
    ip_license_type: license_type,
    ip_driver_experience: driver_experience,
  } = req.body;

  console.log("Received data:", req.body);

  // Validate form fields
  if (!username || !license_id || !license_type || !driver_experience) {
      console.log("Validation failed: No fields can be null.");
      return res.status(400).json({ message: "No fields can be null." });
  }

  const query = `CALL business_supply.add_driver_role(?, ?, ?, ?);`;
  const values = [username, license_id, license_type, driver_experience];

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
              return res.json({ message: procedureMessage });
          }

          console.log("Added driver role successfully.");
          return res.json({ message: "Added driver role successfully." });
      });
  } catch (error) {
      console.error("Server Error:", error);
      res.status(500).json({ message: "Internal server error." });
  }
});

// TAKEOVER VAN ROLE - takeover_van()
app.post("/api/takeover-van", async (req, res) => {
  // Map received fields to expected names
  const { ip_username: username, ip_id: id, ip_tag: tag} = req.body;

  console.log("Received data:", req.body);

  // Validate form fields
  if (!username || !id || !tag) {
      console.log("Validation failed: No fields can be null.");
      return res.status(400).json({ message: "No fields can be null." });
  }

  const query = `CALL business_supply.takeover_van(?, ?, ?);`;
  const values = [username, id, tag];

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
              return res.json({ message: procedureMessage });
          }

          console.log("Tookover van successfully.");
          return res.json({ message: "Tookover van successfully." });
      });
  } catch (error) {
      console.error("Server Error:", error);
      res.status(500).json({ message: "Internal server error." });
  }
});

// REMOVE DRIVER ROLE - remove_driver_role()
app.post("/api/remove-driver-role", async (req, res) => {
  // Map received fields to expected names
  const { ip_username: username} = req.body;

  console.log("Received data:", req.body);

  // Validate form fields
  if (!username) {
      console.log("Validation failed: No fields can be null.");
      return res.status(400).json({ message: "No fields can be null." });
  }

  const query = `CALL business_supply.remove_driver_role(?);`;
  const values = [username];

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
              return res.json({ message: procedureMessage });
          }

          console.log("Removed driver role successfully.");
          return res.json({ message: "Removed driver role successfully." });
      });
  } catch (error) {
      console.error("Server Error:", error);
      res.status(500).json({ message: "Internal server error." });
  }
});

  







