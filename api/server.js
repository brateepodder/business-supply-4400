require('dotenv').config();


const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const app = express();

// Setup CORS to allow frontend to communicate with backend
app.use(cors());
app.use(express.json());


const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT // Default MySQL port
});

  app.get('/ping', (req, res) => {
    res.send('Server is up and running!');
  });

// Get the port from the environment variable (or default to 5000)
const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

// Send the port to the frontend
app.get('/api/config', (req, res) => {
  res.json({ port: process.env.PORT || 5000 });
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

// Fetching worker's usernames
app.get("/api/worker-usernames", async (req, res) => {
  const query = "SELECT username FROM business_supply.workers";
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

// Fetching driver's usernames
app.get("/api/driver-usernames", async (req, res) => {
  const query = "SELECT username FROM business_supply.display_driver_view";
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

// Fetching employee's usernames
app.get("/api/employee-usernames", async (req, res) => {
  const query = "SELECT username FROM business_supply.display_employee_view";
  try {
    db.query(query, (err, results) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).json({ message: "Database error" });
      }

      const usernames = results.map((row) => row.username);
      console.log("Employee usernames: ", usernames);
      res.json(usernames);
    });
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Fetching businesses's names
app.get("/api/businesses-names", async (req, res) => {
  const query = "SELECT long_name FROM business_supply.businesses;";
  try {
    db.query(query, (err, results) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).json({ message: "Database error" });
      }

      const business_names = results.map((row) => row.long_name);
      console.log("Business Names Fetching API result: ", business_names);
      res.json(business_names);
    });
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Fetching delivery service's IDs
app.get("/api/service-ids", async (req, res) => {
  const query = "SELECT id FROM business_supply.delivery_services;";
  try {
    db.query(query, (err, results) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).json({ message: "Database error" });
      }

      const serviceIDs = results.map((row) => row.id);
      console.log("Delivery Service IDs Fetching API result: ", serviceIDs);
      res.json(serviceIDs);
    });
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Fetching all product barcodes
app.get("/api/product-barcodes", async (req, res) => {
  const query = "SELECT barcode FROM business_supply.products;";
  try {
    db.query(query, (err, results) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).json({ message: "Database error" });
      }

      const usernames = results.map((row) => row.barcode);
      console.log("Product barcodes: ", usernames);
      res.json(usernames);
    });
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Fetching locations
app.get("/api/location-names", async (req, res) => {
  const query = "SELECT label FROM business_supply.locations";
  try {
    db.query(query, (err, results) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).json({ message: "Database error" });
      }

      const usernames = results.map((row) => row.label);
      console.log("Owner usernames: ", usernames);
      res.json(usernames);
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

// Workers View
app.get('/api/workers', async (req, res) => {
  try {
    const query = 'SELECT * FROM workers';
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

// Contains Table 
app.get('/api/contains', async (req, res) => {
  try {
    const query = 'SELECT * FROM business_supply.contain';
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

// Locations Table 
app.get('/api/all-locations', async (req, res) => {
  try {
    const query = 'SELECT * FROM business_supply.locations';
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

// Funds Table 
app.get('/api/funds', async (req, res) => {
  try {
    const query = 'SELECT * FROM business_supply.fund';
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

// STORED PROCEDURES

// ADD OWNER - add_owner()
app.post("/api/add-owner", async (req, res) => {
    const { username, first_name, last_name, address, birthdate } = req.body;
    
  // Normalize empty strings to null in the request body
  Object.keys(req.body).forEach((key) => {
    if (req.body[key] === '') {
      req.body[key] = null;
    }
  });

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
    const { owner, amount, business, fundDate } = req.body;
    
  // Normalize empty strings to null in the request body
  Object.keys(req.body).forEach((key) => {
    if (req.body[key] === '') {
      req.body[key] = null;
    }
  });

    console.log("Received data:", req.body);

    // Validate form fields
    if ( !owner || !amount || !business || !fundDate ) {
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
  const { username, first_name, last_name, address, birthdate, taxID, salary, employee_experience, hired } = req.body;
  
  // Normalize empty strings to null in the request body
  Object.keys(req.body).forEach((key) => {
    if (req.body[key] === '') {
      req.body[key] = null;
    }
  });

  console.log("Received data:", req.body);

  // Validate form fields
  if (!username || !first_name || !last_name || !address || !birthdate || !taxID || !hired || !salary || !employee_experience) {
      console.log("Validation failed: No fields can be left null.");
      return res.status(400).json({ message: "No fields can be left null" });
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
  const { username, id } = req.body;
  
  // Normalize empty strings to null in the request body
  Object.keys(req.body).forEach((key) => {
    if (req.body[key] === '') {
      req.body[key] = null;
    }
  });

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
  const { username, id } = req.body;
  
  // Normalize empty strings to null in the request body
  Object.keys(req.body).forEach((key) => {
    if (req.body[key] === '') {
      req.body[key] = null;
    }
  });

  console.log("Received data:", req.body);

  // Validate form fields
  if (!username || !id) {
      console.log("Validation failed: No fields can be null.");
      return res.status(400).json({ message: "No fields can be null." });
  }

  const query = `CALL business_supply.fire_employee(?, ?);`;
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
    username,
    license_id,
    license_type,
    driver_experience,
  } = req.body;
  
  // Normalize empty strings to null in the request body
  Object.keys(req.body).forEach((key) => {
    if (req.body[key] === '') {
      req.body[key] = null;
    }
  });

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
  const { username, id, tag} = req.body;
  
  
  // Normalize empty strings to null in the request body
  Object.keys(req.body).forEach((key) => {
    if (req.body[key] === '') {
      req.body[key] = null;
    }
  });

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
  const { username } = req.body;
  
  // Normalize empty strings to null in the request body
  Object.keys(req.body).forEach((key) => {
    if (req.body[key] === '') {
      req.body[key] = null;
    }
  });

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

// ADD LOCATION add_location()
app.post("/api/add-location", async (req, res) => {
  // Map received fields to expected names
  const { label, x_coord, y_coord, space } = req.body;
  
  // Normalize empty strings to null in the request body
  Object.keys(req.body).forEach((key) => {
    if (req.body[key] === '') {
      req.body[key] = null;
    }
  });

  console.log("Received data:", req.body);

  // Validate form fields
  if (!label || !x_coord || !y_coord || !space ) {
      console.log("Validation failed: No fields can be left null..");
      return res.status(400).json({ message: "No fields can be left null.." });
  }

  const query = `CALL business_supply.add_location(?, ?, ?, ?);`;
  const values = [label, x_coord, y_coord, space];

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

          console.log("Added location successfully.");
          return res.json({ message: "Added location successfully." });
      });
  } catch (error) {
      console.error("Server Error:", error);
      res.status(500).json({ message: "Internal server error." });
  }
});

// ADD SERVICE add_service()
app.post("/api/add-service", async (req, res) => {
  // Map received fields to expected names
  const { id, long_name, home_base, manager } = req.body;
  
  // Normalize empty strings to null in the request body
  Object.keys(req.body).forEach((key) => {
    if (req.body[key] === '') {
      req.body[key] = null;
    }
  });

  console.log("Received data:", req.body);

  // Validate form fields
  if (!id || !long_name || !home_base ) {
      console.log("Validation failed: Id, name and home base cannot be null.");
      return res.status(400).json({ message: "Id, name and home base cannot be null." });
  }

  const query = `CALL business_supply.add_service(?, ?, ?, ?);`;
  const values = [id, long_name, home_base, manager];

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

          console.log("Added service successfully.");
          return res.json({ message: "Added service successfully." });
      });
  } catch (error) {
      console.error("Server Error:", error);
      res.status(500).json({ message: "Internal server error." });
  }
});

// MANAGE SERVICE manage_service()
app.post("/api/manage-service", async (req, res) => {
  // Map received fields to expected names
  const { username, id } = req.body;
  
  // Normalize empty strings to null in the request body
  Object.keys(req.body).forEach((key) => {
    if (req.body[key] === '') {
      req.body[key] = null;
    }
  });

  console.log("Received data:", req.body);

  // Validate form fields
  if (!username || !id ) {
      console.log("Validation failed: No fields can be null.");
      return res.status(400).json({ message: "No fields can be null." });
  }

  const query = `CALL business_supply.manage_service(?, ?);`;
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

          console.log("Successfully added manager.");
          return res.json({ message: "Successfully added manager." });
      });
  } catch (error) {
      console.error("Server Error:", error);
      res.status(500).json({ message: "Internal server error." });
  }
});

// ADD PRODUCT add_product()
app.post("/api/add-product", async (req, res) => {
  // Map received fields to expected names
  const { barcode, name, weight } = req.body;

  // Normalize empty strings to null in the request body
  Object.keys(req.body).forEach((key) => {
    if (req.body[key] === '') {
      req.body[key] = null;
    }
  });

  console.log("Received data:", req.body);

  // Validate form fields
  if (!barcode || !name || !weight) {
      console.log("Validation failed: No fields can be null.");
      return res.status(400).json({ message: "No fields can be null." });
  }

  const query = `CALL business_supply.add_product(?, ?, ?);`;
  const values = [barcode, name, weight];

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

          console.log("Successfully added product.");
          return res.json({ message: "Successfully added product." });
      });
  } catch (error) {
      console.error("Server Error:", error);
      res.status(500).json({ message: "Internal server error." });
  }
});

// REMOVE PRODUCT remove_product()
app.post("/api/remove-product", async (req, res) => {
  // Map received fields to expected names
  const { barcode } = req.body;

  // Normalize empty strings to null in the request body
  Object.keys(req.body).forEach((key) => {
    if (req.body[key] === '') {
      req.body[key] = null;
    }
  });
  console.log("Received data:", req.body);

  // Validate form fields
  if (!barcode ) {
      console.log("Validation failed: No field can be null.");
      return res.status(400).json({ message: "No field can be null." });
  }

  const query = `CALL business_supply.remove_product(?);`;
  const values = [barcode];

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

          console.log("Successfully removed product.");
          return res.json({ message: "Successfully removed product." });
      });
  } catch (error) {
      console.error("Server Error:", error);
      res.status(500).json({ message: "Internal server error." });
  }
});

// ADD VAN add_van()
app.post("/api/add-van", async (req, res) => {
  // Map received fields to expected names
  const { id, tag, fuel, capacity, sales, driven_by } = req.body;

  // Normalize empty strings to null in the request body
  Object.keys(req.body).forEach((key) => {
    if (req.body[key] === '') {
      req.body[key] = null;
    }
  });

  console.log("Received data:", req.body);

  // Validate form fields
  if ( !id || !tag || !fuel || !capacity || !sales ) {
      console.log("Validation failed: Only driven by can be a null field.");
      return res.status(400).json({ message: "Only driven by can be a null field." });
  }

  const query = `CALL business_supply.add_van(?, ?, ?, ?, ?, ?);`;
  const values = [id, tag, fuel, capacity, sales, driven_by];

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

          console.log("Successfully added van.");
          return res.json({ message: "Successfully added van." });
      });
  } catch (error) {
      console.error("Server Error:", error);
      res.status(500).json({ message: "Internal server error." });
  }
});

// LOAD VAN load_van()
app.post("/api/load-van", async (req, res) => {
  // Map received fields to expected names
  const { id, tag, barcode, product_amount, price } = req.body;
  
  // Normalize empty strings to null in the request body
  Object.keys(req.body).forEach((key) => {
    if (req.body[key] === '') {
      req.body[key] = null;
    }
  });

  console.log("Received data:", req.body);

  // Validate form fields
  if ( !id || !tag || !barcode || !product_amount || !price ) {
      console.log("Validation failed: No fields can be null.");
      return res.status(400).json({ message: "No fields can be null." });
  }

  const query = `CALL business_supply.load_van(?, ?, ?, ?, ?);`;
  const values = [id, tag, barcode, product_amount, price];

  try {
      db.query(query, values, (err, results) => {
          if (err) {
              console.error("MySQL Error:", err);
              return res.status(500).json({ message: "Database error." });
          }

          console.log("Stored procedure raw results:", JSON.stringify(results, null, 2));

          // Extract the message from the first result set
          const procedureMessage = Object.values(results[0]?.[0] || {})[0]; // Get the first key-value pair

          if (procedureMessage) {
              console.log("Procedure message:", procedureMessage);
              return res.json({ message: procedureMessage });
          }

          console.log("Successfully loaded van.");
          return res.json({ message: "Successfully loaded van." });
      });
  } catch (error) {
      console.error("Server Error:", error);
      res.status(500).json({ message: "Internal server error." });
  }
});


// REFUEL VAN refuel_van()
app.post("/api/refuel-van", async (req, res) => {
  // Map received fields to expected names
  const { id, tag, fuel } = req.body;
  
  // Normalize empty strings to null in the request body
  Object.keys(req.body).forEach((key) => {
    if (req.body[key] === '') {
      req.body[key] = null;
    }
  });

  console.log("Received data:", req.body);

  // Validate form fields
  if ( !id || !tag || !fuel ) {
      console.log("Validation failed: No fields can be null.");
      return res.status(400).json({ message: "No fields can be null." });
  }

  const query = `CALL business_supply.refuel_van(?, ?, ?);`;
  const values = [id, tag, fuel];

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

          console.log("Successfully refueled van.");
          return res.json({ message: "Successfully refueled van." });
      });
  } catch (error) {
      console.error("Server Error:", error);
      res.status(500).json({ message: "Internal server error." });
  }
});

// DRIVE VAN drive_van()
app.post("/api/drive-van", async (req, res) => {
  // Map received fields to expected names
  const { id, tag, destination } = req.body;
  
  // Normalize empty strings to null in the request body
  Object.keys(req.body).forEach((key) => {
    if (req.body[key] === '') {
      req.body[key] = null;
    }
  });

  console.log("Received data:", req.body);

  // Validate form fields
  if ( !id || !tag || !destination ) {
      console.log("Validation failed: No fields can be null.");
      return res.status(400).json({ message: "No fields can be null." });
  }

  const query = `CALL business_supply.drive_van(?, ?, ?);`;
  const values = [id, tag, destination];

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

          console.log("Successfully driven van.");
          return res.json({ message: "Successfully driven van." });
      });
  } catch (error) {
      console.error("Server Error:", error);
      res.status(500).json({ message: "Internal server error." });
  }
});

// REMOVE VAN remove_van()
app.post("/api/remove-van", async (req, res) => {
  // Map received fields to expected names
  const { id, tag } = req.body;
  
  // Normalize empty strings to null in the request body
  Object.keys(req.body).forEach((key) => {
    if (req.body[key] === '') {
      req.body[key] = null;
    }
  });

  console.log("Received data:", req.body);

  // Validate form fields
  if ( !id || !tag ) {
      console.log("Validation failed: No fields can be null.");
      return res.status(400).json({ message: "No fields can be null." });
  }

  const query = `CALL business_supply.remove_van(?, ?);`;
  const values = [id, tag];

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

          console.log("Successfully removed van.");
          return res.json({ message: "Successfully removed van." });
      });
  } catch (error) {
      console.error("Server Error:", error);
      res.status(500).json({ message: "Internal server error." });
  }
});

// ADD BUSINESS add_business()
app.post("/api/add-business", async (req, res) => {
  // Map received fields to expected names
  const { name, rating, spent, location } = req.body;
  
  // Normalize empty strings to null in the request body
  Object.keys(req.body).forEach((key) => {
    if (req.body[key] === '') {
      req.body[key] = null;
    }
  });

  console.log("Received data:", req.body);

  // Validate form fields
  if ( !name || !rating || !spent || !location ) {
      console.log("Validation failed: No fields can be null.");
      return res.status(400).json({ message: "No fields can be null." });
  }

  const query = `CALL business_supply.add_business(?, ?, ?, ?);`;
  const values = [name, rating, spent, location];

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

          console.log("Successfully added business.");
          return res.json({ message: "Successfully added business." });
      });
  } catch (error) {
      console.error("Server Error:", error);
      res.status(500).json({ message: "Internal server error." });
  }
});

// PURCHASE PRODUCT purchase_product()
app.post("/api/purchase-product", async (req, res) => {
  // Map received fields to expected names
  const { business, id, tag, barcode, quantity } = req.body;
  
  // Normalize empty strings to null in the request body
  Object.keys(req.body).forEach((key) => {
    if (req.body[key] === '') {
      req.body[key] = null;
    }
  });

  console.log("Received data:", req.body);

  // Validate form fields
  if ( !business || !id || !tag || !barcode || !quantity ) {
      console.log("Validation failed: No fields can be null.");
      return res.status(400).json({ message: "No fields can be null." });
  }

  const query = `CALL business_supply.purchase_product(?, ?, ?, ?, ?);`;
  const values = [business, id, tag, barcode, quantity];

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

          console.log("Successfully purchased product.");
          return res.json({ message: "Successfully purchased product." });
      });
  } catch (error) {
      console.error("Server Error:", error);
      res.status(500).json({ message: "Internal server error." });
  }
});

// ADD WORKER ROLE add_worker_role()
app.post("/api/add-worker-role", async (req, res) => {
  // Map received fields to expected names
  const { username } = req.body;
  
  // Normalize empty strings to null in the request body
  Object.keys(req.body).forEach((key) => {
    if (req.body[key] === '') {
      req.body[key] = null;
    }
  });

  console.log("Received data:", req.body);

  // Validate form fields
  if ( !username ) {
      console.log("Validation failed: No fields can be null.");
      return res.status(400).json({ message: "No fields can be null." });
  }

  const query = `CALL business_supply.add_worker_role(?);`;
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

          console.log("Successfully added worker role.");
          return res.json({ message: "Successfully added worker role." });
      });
  } catch (error) {
      console.error("Server Error:", error);
      res.status(500).json({ message: "Internal server error." });
  }
});







