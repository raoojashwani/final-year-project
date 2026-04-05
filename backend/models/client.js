const mongoose = require('mongoose');

const clientSchema = new mongoose.Schema({
    // ==========================================
    // 1. CORE IDENTITY & EVENT DETAILS
    // ==========================================
    clientName: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    eventName: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    eventDate: { type: String, required: true, trim: true },
    division: { type: String, required: true }, // 'Thread & Knot' or 'Prism Planner'
    referenceId: { type: String, trim: true },
    
    // ==========================================
    // 2. AUTHENTICATION & SECURITY
    // ==========================================
    status: { type: String, default: 'Pending' }, // Pending, Approved
    accessKey: { type: String, default: '' }, // The generated secure password
    plainKey: { type: String, default: '' },
    resetRequested: { type: Boolean, default: false }, // <-- NEW: Flags admin for password reset
    
    // ==========================================
    // 3. PROJECT METRICS (Financial & RSVP)
    // ==========================================
    projectMetrics: {
        timelineProgress: { type: Number, default: 0 },
        totalBudget: { type: Number, default: 0 },    
        budgetAllocated: { type: Number, default: 0 },
        rsvpExpected: { type: Number, default: 0 },   
        rsvpConfirmed: { type: Number, default: 0 }    
    },
    
    // ==========================================
    // 4. THE COMMAND ARRAYS (Pushed from Admin)
    // ==========================================
    tasks: [{
        title: { type: String, trim: true },
        description: { type: String, trim: true },
        dueDate: { type: String, trim: true },
        status: { type: String, default: 'Pending' }
    }],

    blueprints: [{
        title: { type: String, trim: true },
        fileUrl: { type: String, trim: true } 
    }],

    // Legal & Contracts Array
    contracts: [{
        title: { type: String, trim: true },
        fileUrl: { type: String, trim: true } 
    }],

    invoices: [{
        category: { type: String, trim: true },
        vendor: { type: String, default: 'C&O Group', trim: true },
        amount: { type: Number, default: 0 }, 
        dueDate: { type: String, default: 'TBD', trim: true },
        status: { type: String, default: 'Pending' }, 
        fileUrl: { type: String, trim: true } 
    }],

    // ==========================================
    // 5. GUEST MANIFEST & EXPANDED LOGISTICS
    // ==========================================
    guests: [{
        name: { type: String, trim: true },
        partySize: { type: Number, default: 1 },
        side: { type: String, trim: true },
        status: { type: String, default: 'Confirmed' },
        flightDetails: { type: String, default: 'TBD', trim: true }, 
        hotelRoom: { type: String, default: 'Pending Assignment', trim: true },
        
        // NEW: Expanded Logistics Fields
        dietaryNeeds: { type: String, default: 'None', trim: true },
        transport: { type: String, default: 'Self', trim: true }, 
        eventRsvp: { type: String, default: 'All Events', trim: true }
    }],
    
    // ==========================================
    // 6. SECURE COMMUNICATIONS (Chat Bridge)
    // ==========================================
    messages: [{
        sender: { type: String, trim: true }, 
        senderImg: { type: String, trim: true }, 
        text: { type: String, trim: true },
        timestamp: { type: Date, default: Date.now }
    }],

    // ==========================================
    // 7. SYSTEM AUDIT TRAIL
    // ==========================================
    auditLog: [{
        action: { type: String, required: true }, 
        user: { type: String, required: true },
        timestamp: { type: Date, default: Date.now }
    }],

    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Client', clientSchema);