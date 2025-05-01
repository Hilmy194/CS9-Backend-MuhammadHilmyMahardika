require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

// Middleware CORS
const corsOptions = {
  origin: [  
    "https://os.netlabdte.com",  
    "http://localhost:5173",       
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: "Content-Type, Authorization",
};
app.use(cors(corsOptions));


app.use(express.json());

// Import Routes
const userRoute = require('./src/routes/user.route');
const storeRoute = require('./src/routes/store.route');
const itemRoute = require('./src/routes/item.route');
const transactionRoute = require('./src/routes/transaction.route');

app.get('/health', (req, res) => {
  res.json({ success: true, message: 'API running properly' });
});

// Menggunakan Routes
app.use('/user', userRoute);
app.use('/store', storeRoute);
app.use('/item', itemRoute);
app.use('/transaction', transactionRoute);

app.listen(port, () => {
  console.log(` Server running on port ${port}`);
});
