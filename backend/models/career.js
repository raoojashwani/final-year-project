const mongoose = require('mongoose');

const careerSchema = new mongoose.Schema({
    // --- APPLICANT IDENTITY ---
    fullName: { 
        type: String, 
        required: true,
        trim: true 
    },
    email: { 
        type: String, 
        required: true,
        trim: true,
        lowercase: true 
    },
    phone: { 
        type: String, 
        required: true,
        trim: true 
    },
    
    // --- PROFESSIONAL DETAILS ---
    position: { 
        type: String, 
        required: true,
        trim: true 
    },
    experience: { 
        type: String,
        trim: true 
    },
    
    // --- EXTERNAL ASSETS ---
    linkedin: { 
        type: String,
        trim: true 
    },
    portfolioLink: { 
        type: String, 
        required: true, // This acts as the Resume / G-Drive Link
        trim: true 
    },
    
    // --- APPLICATION MESSAGE ---
    coverLetter: { 
        type: String,
        trim: true 
    },
    
    // --- SYSTEM TRACKING ---
    status: { 
        type: String, 
        default: 'Pending Review' // Options: Pending Review, Shortlisted, Rejected, Hired
    },
    appliedAt: { 
        type: Date, 
        default: Date.now 
    }
});

// Export the blueprint for the backend engine
module.exports = mongoose.model('Career', careerSchema);