const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());
const pythonScriptPath = 'predict.py';
// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/Fall_detection');

// Define Mongoose schemas and models
const ClientSchema = new mongoose.Schema({
  Day: { type: Number, required: false },
  Hours: { type: String, required: false },
  ID: { type: Number, required: true },
  Name: { type: String, required: true },
  Status: { type: String, required: true },
  falling: { type: String, required: true },
  month: { type: String, required: false },
  year: { type: Number, required: false }
});
const Client = mongoose.model('Client', ClientSchema);

const RTDBSchema = new mongoose.Schema({
  GPS: {
    LAT: Number,
    LNG: Number,
  },
  Sensor: {
    data: String,
  },
  ID: Number,
  // Include any other properties that may be missing from the provided example
});
const RTDB = mongoose.model('RTDB', RTDBSchema);

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },  // Changed from Buffer to String for simplicity
  role: { type: String, default: 'user' }
});
const User = mongoose.model('User', UserSchema);

const reportSchema = new mongoose.Schema({
  ID: Number,
  time: Date,
  GPS: {
    LAT: Number,
    LNG: Number
  },
  Acceleration: {
    X: Number,
    Y: Number,
    Z: Number
  },
  Gyroscope: {
    X: Number,
    Y: Number,
    Z: Number
  },
  falling: String
});

const Report = mongoose.model('report', reportSchema);





// GET latest RTDB entry
app.get('/api/GetFall', async (req, res) => {
  try {
    const doc = await RTDB.findOne().sort({_id: -1}).select({_id: 0});
    res.json(doc);
  } catch (e) {
    res.status(400).json({'error': `Error retrieving data: ${e}`});
  }
});

// GET last 5 RTDB GPS data entries
app.get('/api/getRTDB', async (req, res) => {
  try {
    const data = await RTDB.find()
      .sort({_id: -1})
      .limit(5)
      .select({ID: 1, 'GPS.LAT': 1, 'GPS.LNG': 1, _id: 0})
      .lean(); // This ensures we get a plain JavaScript object
    
    // We now need to map over the data and create a new array with the desired structure
    const flatData = data.map(item => ({
      ID: item.ID,
      LAT: item.GPS.LAT,
      LNG: item.GPS.LNG
    }));

    res.json(flatData);
  } catch (e) {
    res.status(400).json({'error': `Error retrieving data: ${e}`});
  }
});
app.get('/api/getAllPredictionData', async (req, res) => {
  try {
    const data = await RTDB.find()
      .sort({_id: -1})  // Sort by descending order
      .limit(5)          // Limit to 5 entries
      .lean();           // Return plain JavaScript objects

    // Map data to include all necessary fields for prediction
    const flatData = data.map(item => ({
      ID: item.ID,
      GPS: {
        LAT: item.GPS.LAT,
        LNG: item.GPS.LNG
      },
      Acceleration: {
        X: item.Acceleration.X,
        Y: item.Acceleration.Y,
        Z: item.Acceleration.Z
      },
      Gyroscope: {
        X: item.Gyroscope.X,
        Y: item.Gyroscope.Y,
        Z: item.Gyroscope.Z
      },
      falling: item.falling
    }));

    res.json(flatData);
  } catch (e) {
    res.status(400).json({'error': `Error retrieving data: ${e}`});
  }
});


const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

app.post('/api/predict-fall', (req, res) => {
  const features = req.body.features;

  // Validate input
  if (!Array.isArray(features) || features.length !== 8) {
      return res.status(400).json({ message: 'Invalid input features' });
  }

  // Prepare input data
  const inputData = { features };

  // Write input data to a temporary JSON file
  const inputFilePath = path.join(__dirname, 'input.json');
  fs.writeFileSync(inputFilePath, JSON.stringify(inputData));

  // Execute Python script
  const pythonScriptPath = 'predict.py'; // Path to your Python script
  const pythonProcess = spawn('c:/Users/MSI/OneDrive/Bureau/AzizPI2/fall_detection_project/BACKEND/myenv/Scripts/python.exe', [pythonScriptPath, inputFilePath]);
  let scriptOutput = '';

  pythonProcess.stdout.on('data', (data) => {
    scriptOutput += data.toString();
  });

  pythonProcess.stderr.on('data', (data) => {
    console.error(`Python script error: ${data}`);
  });

  pythonProcess.on('close', (code) => {
    if (code !== 0) {
      console.error('Python script exited with non-zero exit code:', code);
      return res.status(500).json({ message: 'Error executing Python script' });
    }

    // Extract JSON string from scriptOutput
    const jsonStartIndex = scriptOutput.indexOf('{');
    const jsonEndIndex = scriptOutput.lastIndexOf('}');
    const jsonStr = scriptOutput.substring(jsonStartIndex, jsonEndIndex + 1);

    try {
      const result = JSON.parse(jsonStr);
      res.json(result);
    } catch (parseError) {
      console.error('Error parsing Python script output:', parseError);
      console.error('Original Output:', scriptOutput);
      res.status(500).json({ message: 'Error parsing prediction output' });
    }
  });
});



app.post('/api/forgot-password', async (req, res) => {
  const { email, newPassword } = req.body;
  if (!email || !newPassword) {
    return res.status(400).json({ message: 'Email and new password must be provided' });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found with this email' });
    }

    // Update user's password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: 'Password has been successfully reset' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
// GET the last GPS data entry
app.get('/api/getRTDB2', async (req, res) => {
  try {
    const data = await RTDB.findOne().sort({_id: -1}).select({'GPS.LAT': 1, 'GPS.LNG': 1, _id: 0});
    res.json(data);
  } catch (e) {
    res.status(400).json({'error': `Error retrieving data: ${e}`});
  }
});

// POST user signup
app.post('/api/signup', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({'message': 'Error missing email or password'});
  }
  
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({'message': 'User already exists'});
  }
  
  const hashedPassword = await bcrypt.hash(password, await bcrypt.genSalt());
  const newUser = new User({ email, password: hashedPassword });
  
  try {
    const savedUser = await newUser.save();
    res.status(200).json({'message': `Successfully created user with ID ${savedUser._id}`});
  } catch (e) {
    res.status(400).json({'message': `Error creating user: ${e}`});
  }
});

// POST user login
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  if (typeof email !== 'string' || typeof password !== 'string') {
    return res.status(400).json({ 'message': 'Email and password must be strings' });
  }

  try {
    const user = await User.findOne({ email }).exec();
    if (!user) {
      return res.status(404).json({ 'message': 'User not found' });
    }
    const hashedPassword = user.password instanceof Buffer ? user.password.toString() : user.password;

    const isMatch = await bcrypt.compare(password, hashedPassword);
    if (isMatch) {
      // Include the role in the response; assume user schema has a 'role' field
      res.status(200).json({
        'message': 'Login successful',
        'user': {
          'role': user.role, // Send the user's role
          'email': user.email
        }
      });
    } else {
      res.status(401).json({ 'message': 'Invalid email or password' });
    }
  } catch (e) {
    res.status(500).json({ 'error': e.message });
  }
});

app.post('/api/clients', async (req, res) => {
  const { ID, Name, Day, month, year } = req.body;

  if (!ID || !Name || !Day || !month || !year) {
    return res.status(400).json({'message': 'Missing one or more required fields'});
  }

  try {
    const newClient = new Client({
      ID,
      Name,
      Day,
      month,
      year,
      Status: 'offline',  // Default status
      falling: 'NO'  // Default falling status
    });
    await newClient.save();
    res.status(201).json({'message': 'Client added successfully', 'client': newClient});
  } catch (error) {
    res.status(500).json({'error': `Error adding client: ${error.message}`});
  }
});

// GET all clients
app.get('/api/get', async (req, res) => {
  try {
    const clients = await Client.find().select({_id: 0});
    res.json(clients);
  } catch (e) {
    res.status(400).json({'error': `Error retrieving data: ${e}`});
  }
});
app.get('/api/reports', async (req, res) => {
  try {
    const reports = await Report.find(); // Adjust query as needed (e.g., sorting or limiting)
    res.json(reports);
  } catch (error) {
    res.status(500).json({ 'error': `Error retrieving reports: ${error.message}` });
  }
});

app.post('/api/createAdmin', async (req, res) => {
  // This route should be protected and only accessible by existing admins
  // You would typically check the role of the requester here...

  const { email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, await bcrypt.genSalt());
  
  const newUser = new User({
    email,
    password: hashedPassword,
    role: 'admin'
  });

  // Save the new user with admin role...
});

app.put('/api/clients/:id', async (req, res) => {
  const clientId = parseInt(req.params.id); // Parse the client ID as a number

  // Check if required fields are present in the request body
  const { Name, Status, falling } = req.body;
  if (!Name || !Status || !falling) {
    return res.status(400).json({'message': 'Missing one or more required fields'});
  }

  try {
    // Find the client by ID field and update its details
    const updatedClient = await Client.findOneAndUpdate({ ID: clientId }, {
      Name,
      Status,
      falling,
    }, { new: true }); // To return the updated document

    // If the client is not found, return a 404 status
    if (!updatedClient) {
      return res.status(404).json({'message': 'Client not found'});
    }

    // Return success message along with the updated client details
    res.status(200).json({'message': 'Client updated successfully', 'client': updatedClient});
  } catch (error) {
    // Handle any errors that occur during the update operation
    res.status(500).json({'error': `Error updating client: ${error.message}`});
  }
});



// Inside the route handler
app.delete('/api/clients/:id', async (req, res) => {
  const clientId = parseInt(req.params.id); // Parse the ID as a number

  try {
    await Client.findOneAndDelete({ ID: clientId });
    res.status(200).json({'message': 'Client deleted successfully'});
  } catch (error) {
    res.status(500).json({'error': `Error deleting client: ${error.message}`});
  }
});

app.get('/api/clients/:id', async (req, res) => {
  const clientId = req.params.id;

  try {
    let client;
    if (mongoose.Types.ObjectId.isValid(clientId)) {
      client = await Client.findById(clientId);
    } else {
      client = await Client.findOne({ ID: parseInt(clientId) });
    }

    if (!client) {
      return res.status(404).json({ 'message': 'Client not found' });
    }

    res.status(200).json(client);
  } catch (error) {
    res.status(500).json({ 'error': `Error fetching client details: ${error.message}` });
  }
});


const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
