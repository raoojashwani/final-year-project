const mongoose = require('mongoose');

const subscriberSchema = new mongoose.Schema({
    email: { 
        type: String, 
        required: true,
        unique: true, // Prevents duplicate subscriptions
        lowercase: true, // Standardizes input (e.g., "Email@Domain.com" -> "email@domain.com")
        trim: true // Removes accidental spaces
    },
    status: { 
        type: String, 
        default: 'Active' // Could later be changed to 'Unsubscribed' if they opt-out
    },
    subscribedAt: { 
        type: Date, 
        default: Date.now 
    }
});

module.exports = mongoose.model('Subscriber', subscriberSchema);