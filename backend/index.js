// backend/index.js
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const mongoose = require('mongoose');

const app = express();
const PORT = 5000;

// MongoDB Connection
mongoose.connect('mongodb+srv://itman673:itman673@cluster0.6g7pf.mongodb.net/email_assignment', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

// Define the Email schema and model
const emailSchema = new mongoose.Schema({
    email: {type: String, required: true, unique: true}
});
const Email = mongoose.model('Email', emailSchema);

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Route to add an email
app.post('/add-email', async (req, res) => {
    const {email} = req.body;
    try {
        const newEmail = new Email({email});
        await newEmail.save();
        res.status(201).json({message: 'Email added successfully!'});
    } catch (error) {
        res.status(500).json({message: 'Failed to add email.'});
    }
});

// Route to delete an email
app.delete('/delete-email/:email', async (req, res) => {
    const {email} = req.params;
    try {
        await Email.findOneAndDelete({email});
        res.status(200).json({message: 'Email deleted successfully!'});
    } catch (error) {
        res.status(500).json({message: 'Failed to delete email.'});
    }
});

// Route to get all emails
app.get('/emails', async (req, res) => {
    try {
        const emails = await Email.find();
        res.status(200).json(emails);
    } catch (error) {
        res.status(500).json({message: 'Failed to fetch emails.'});
    }
});

// Route to send a message to all emails
app.post('/send-message', async (req, res) => {
    const {message, subject} = req.body;

    try {
        const emails = await Email.find();
        const emailList = emails.map(emailObj => emailObj.email);

        // Configure nodemailer
        let transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: 'cui1234567890987654321@gmail.com',
                pass: 'gejhbpplxhzsbhou'
            }
        });

        await Promise.all(
            emailList.map(email =>
                transporter.sendMail({
                    from: 'barkatbhai@gmail.com',
                    to: email,
                    subject: subject || 'Message from Email Sender App',
                    text: message
                })
            )
        );

        res.status(200).json({message: 'Message sent successfully to all emails!'});
    } catch (error) {
        console.error("Error sending message:", error);
        res.status(500).json({message: 'Failed to send message.'});
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
