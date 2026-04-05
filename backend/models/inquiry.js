const mongoose = require('mongoose');

const inquirySchema = new mongoose.Schema({
    // ==========================================
    // 1. LEAD IDENTITY
    // ==========================================
    clientName: { 
        type: String, 
        required: true,
        trim: true 
    },
    email: { 
        type: String, 
        required: true,
        trim: true,
        lowercase: true // Automatically converts "Name@Gmail.com" to "name@gmail.com"
    },
    
    // ==========================================
    // 2. EVENT SPECIFICS
    // ==========================================
    division: { 
        type: String, 
        required: true,
        enum: ['Thread & Knot', 'Prism Planner', 'General'], // Strictly locks inputs to these exact divisions
        trim: true
    },
    eventDetails: { 
        type: String, 
        required: true,
        trim: true 
    },
    
    // ==========================================
    // 3. PIPELINE TRACKING
    // ==========================================
    status: { 
        type: String, 
        default: 'New Lead' // Progression flow: New Lead -> Contacted -> Converted -> Archived
    },
    
    // ==========================================
    // 4. SYSTEM TIMESTAMP
    // ==========================================
    createdAt: { 
        type: Date, 
        default: Date.now 
    }
});

module.exports = mongoose.model('Inquiry', inquirySchema);