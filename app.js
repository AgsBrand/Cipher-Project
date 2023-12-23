// app.js
const express = require('express');
const { VM } = require('vm2');
const path = require('path');
const User = require("./server side/models/User")
const Code = require("./server side/models/Code")
const app = express();
const cors = require('cors');
const jwt = require("jsonwebtoken")
const connectToDb = require("./server side/db")
const port = 3000;
const secretKey = "CipHerSecreTKey"

connectToDb()
app.use(cors());
const specificRouteCors = {
  origin: 'http://localhost:3000',
  methods: 'GET,POST',
};


// Serve static files from the 'public' folder
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json())
// Handle requests to the root URL
app.get('/', (req, res) => {
  const vm = new VM();

  // Code to be executed in the sandbox
  const code = `
    // Example user-generated code
    const result = 'Hello from the sandbox!';
    result;
  `;

  try {
    // Run the code in the sandbox
    const result = vm.run(code);

    // Send the 'index.html' file with the result
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
  } catch (error) {
    // Handle any errors that occurred during execution
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

// Login endpoint
app.post('/api/login', cors(specificRouteCors), async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(200).json({ message: 'User not found' });
  }
  let isValidPassword = (password === user.password)

  if (isValidPassword) {
    const payload = {
      email
    };

    jwt.sign(payload, secretKey, (err, token) => {
      if (err) {
        res.status(500).json({ error: 'Failed to generate token' });
      } else {
        return res.status(200).json({ "success": true, token, email })
      }
    });
  } else {
    return res.status(200).json({ message: 'Invalid password' });
  }
});

app.post('/api/signup', cors(specificRouteCors), async (req, res) => {

  const { fullName, email, password } = req.body;

  try {
    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(201).json({ message: 'User already exists', status: 201 });
    }
    const newUser = await User.create({ fullName, email, password });

    return res.status(200).json({ message: 'User registered successfully', status: 200, user: newUser });
  } catch (error) {
    return res.status(500).json({ message: 'Registration failed', error: error.message, status: 500 });
  }
});


// Endpoint to save the code
app.post('/api/save-code', cors(specificRouteCors), async (req, res) => {
  // res.send("working fine")
  // console.log("hitting here")
  const { code, email } = req.body;
  console.log(code, email)

  try {
    const codeOfUser = await Code.create({ code, email });
    return res.status(200).json({ message: 'Code saved successfully', status: 200 });
  }
  catch (error) {
    return res.status(500).json({ message: 'Failed to save code', error: error.message, status: 500 });
  }
});




app.get('/check-login', (req, res) => {
  const token = req.query.token;

  if (!token) {
    // If token is not provided in the request
    return res.status(401).json({ message: 'No token provided' });
  }
  // Verify the JWT token
  jwt.verify(token, secretKey, async (err, data) => {
    if (err) {
      return res.status(401).json({ message: 'Invalid token', isValid: false });
    } else {
      let user = await User.findOne({ email: data.email })
      return res.status(200).json({ isValid: true, data, fullName: user.fullName });
    }
  });
});



// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
