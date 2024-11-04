// frontend/src/App.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
    const [email, setEmail] = useState('');
    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');
    const [emailList, setEmailList] = useState([]);

    useEffect(() => {
        fetchEmails();
    }, []);

    const fetchEmails = async () => {
        try {
            const response = await axios.get('http://localhost:5000/emails');
            setEmailList(response.data);
        } catch (error) {
            console.error('Error fetching emails:', error);
        }
    };

    const addEmail = async () => {
        if (!email) return alert('Please enter a valid email address.');
        try {
            await axios.post('http://localhost:5000/add-email', { email });
            setEmail('');
            fetchEmails();
        } catch (error) {
            console.error('Error adding email:', error);
        }
    };

    const deleteEmail = async (emailToDelete) => {
        try {
            await axios.delete(`http://localhost:5000/delete-email/${emailToDelete}`);
            fetchEmails();
        } catch (error) {
            console.error('Error deleting email:', error);
        }
    };

    const sendMessage = async () => {
        if (!message || !subject) return alert('Please fill in both the subject and message.');
        try {
            await axios.post('http://localhost:5000/send-message', { subject, message });
            alert('Message sent to all emails!');
            setSubject('');
            setMessage('');
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
            <div className="w-3/4 max-w-5xl p-10 bg-white shadow-lg rounded-xl">
                <h1 className="text-3xl font-extrabold text-center mb-6">Email Sender App</h1>

                {/* Email Input and List */}
                <div className="flex items-center mb-6">
                    <input
                        type="email"
                        placeholder="Enter email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="flex-grow p-4 text-lg border rounded mr-4"
                    />
                    <button
                        onClick={addEmail}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 text-lg rounded"
                    >
                        Add Email
                    </button>
                </div>

                <div className="flex mb-8 space-x-8">
                    {/* Email List */}
                    <div className="w-1/2 p-4 border rounded-lg bg-gray-50 text-lg">
                        <h2 className="font-semibold text-xl mb-3">Email List</h2>
                        {emailList.length === 0 ? (
                            <p className="text-gray-500">No emails added.</p>
                        ) : (
                            <ul>
                                {emailList.map((emailObj) => (
                                    <li key={emailObj.email} className="flex justify-between items-center mb-3">
                                        <span>{emailObj.email}</span>
                                        <button
                                            onClick={() => deleteEmail(emailObj.email)}
                                            className="text-red-600 hover:text-red-800 text-lg"
                                        >
                                            Delete
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    {/* Subject and Message */}
                    <div className="w-1/2 space-y-6">
                        <input
                            type="text"
                            placeholder="Enter subject"
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                            className="w-full p-4 text-lg border rounded"
                        />
                        <textarea
                            placeholder="Enter your message"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            className="w-full p-4 text-lg border rounded"
                            rows="6"
                        />
                        <button
                            onClick={sendMessage}
                            className="w-full bg-green-600 hover:bg-green-700 text-white px-6 py-3 text-lg rounded"
                        >
                            Send Message to All
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default App;
