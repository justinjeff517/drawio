const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

// Connect to MongoDB
mongoose.connect('mongodb://localhost/coffee-shop', { useNewUrlParser: true, useUnifiedTopology: true });

// Define schemas
const ItemSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true }
});

const OrderSchema = new mongoose.Schema({
    items: { type: [ItemSchema], required: true },
    total: { type: Number, required: true },
    customer: { type: String, required: true }
});

const CustomerSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true }
});

// Create models
const Item = mongoose.model('Item', ItemSchema);
const Order = mongoose.model('Order', OrderSchema);
const Customer = mongoose.model('Customer', CustomerSchema);

// Enable CORS
app.use(cors());

// Enable body parsing
app.use(bodyParser.json());

// API to manage items
app.get('/api/items', (req, res) => {
    Item.find().then(items => res.json(items));
});

app.post('/api/items', (req, res) => {
    const item = new Item(req.body);
    item.save().then(() => res.json(item));
});

app.put('/api/items/:id', (req, res) => {
    Item.findByIdAndUpdate(req.params.id, req.body).then(() => res.json({}));
});

app.delete('/api/items/:id', (req, res) => {
    Item.findByIdAndDelete(req.params.id).then(() => res.json({}));
});

// API to manage orders
app.get('/api/orders', (req, res) => {
    Order.find().then(orders => res.json(orders));
});

app.post('/api/orders', (req, res) => {
    const order = new Order(req.body);
    order.save().then(() => res.json(order));
});

app.put('/api/orders/:id', (req, res) => {
    Order.findByIdAndUpdate(req.params.id, req.body).then(() => res.json({}));
});

app.delete('/api/orders/:id', (req, res) => {
    Order.findByIdAndDelete(req.params.id).then(() => res.json({}));
});

// API to manage customers
app.get('/api/customers', (req, res) => {
    Customer.find().then(customers => res.json(customers));
});

app.post('/api/customers', (req, res) => {
    const customer = new Customer(req.body);
    customer.save().then(() => res.json(customer));
});

app.put('/api/customers/:id', (req, res) => {
    Customer.findByIdAndUpdate(req.params.id, req.body).then(() => res.json({}));
});

app.delete('/api/customers/:id', (req, res) => {
    Customer.findByIdAndDelete(req.params.id).then(() => res.json({}));
});

// Basic Authentication
const auth = require('http-auth');
const basic = auth.basic({
    realm: "Coffee Shop"
}, (username, password, callback) => {
    // Verify your username and password here
    callback(username === "admin" && password === "password");
});

// Use basic authentication for all routes
app.use(auth.connect(basic));

// Serve static files from the React app
app.use(express.static('client/build'));

// Start server
const port = process.env.PORT || 3001;
app.listen(port, () => console.log(`Server started on port ${port}`));
