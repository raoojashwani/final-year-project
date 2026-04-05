const mongoose = require('mongoose');

const vendorSchema = new mongoose.Schema({
    // ==========================================
    // 1. BUSINESS IDENTITY & CONTACT
    // ==========================================
    companyName: { type: String, required: true, trim: true },
    contactName: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    phone: { type: String, required: true, trim: true },
    location: { type: String, required: true, trim: true },
    serviceCategory: { type: String, required: true }, 
    portfolioLink: { type: String, required: true, trim: true },
    experience: { type: String, default: '', trim: true },
    message: { type: String, default: '', trim: true },
    
    // ==========================================
    // 2. AUTHENTICATION & ACCESS
    // ==========================================
    status: { type: String, default: 'Pending Review' }, // Pending Review, Approved
    accessKey: { type: String, default: '' }, // Legacy support
    password: { type: String, default: '' },  // Secure portal password
    plainKey: { type: String, default: '' },
    resetRequested: { type: Boolean, default: false }, // <-- NEW: Flags admin for password reset
    
    // ==========================================
    // 3. ACTIVE ALLOCATIONS
    // ==========================================
    assignedProjects: [{
        projectId: { type: String }, 
        projectName: { type: String, trim: true },
        division: { type: String, trim: true }, 
        eventDate: { type: String, trim: true },
        location: { type: String, trim: true },
        leadArchitect: { type: String, default: 'C&O Command', trim: true },
        cadLink: { type: String, default: '', trim: true },   // <-- ADDED FOR CAD/BRIEF FIX
        briefLink: { type: String, default: '', trim: true }  // <-- ADDED FOR CAD/BRIEF FIX
    }],

    // ==========================================
    // 4. FINANCIAL LEDGER
    // ==========================================
    invoices: [{
        invoiceNumber: { type: String, trim: true },
        projectName: { type: String, trim: true },
        amount: { type: Number, default: 0 },
        submissionDate: { type: Date, default: Date.now },
        status: { type: String, default: 'Processing' }, // Processing, Approved, Paid
        fileUrl: { type: String, trim: true } 
    }],

    // ==========================================
    // 5. HISTORICAL RECORD
    // ==========================================
    pastProjects: [{
        projectName: { type: String, trim: true },
        division: { type: String, trim: true },
        role: { type: String, trim: true },
        date: { type: String, trim: true },
        rating: { type: Number, default: 5.0 }
    }],

    // ==========================================
    // 6. COMPLIANCE VAULT
    // ==========================================
    compliance: {
        gstVerified: { type: Boolean, default: false },
        gstDocUrl: { type: String, default: '', trim: true }, 
        gstLink: { type: String, default: '', trim: true },
        gstAdminRemarks: { type: String, default: '', trim: true }, // <-- ADDED
        
        insuranceVerified: { type: Boolean, default: false },
        insuranceValidTill: { type: String, default: '', trim: true },
        insuranceDocUrl: { type: String, default: '', trim: true }, 
        insuranceAdminRemarks: { type: String, default: '', trim: true }, // <-- ADDED
        
        bankVerified: { type: Boolean, default: false },
        bankDocUrl: { type: String, default: '', trim: true },
        bankAdminRemarks: { type: String, default: '', trim: true } // <-- ADDED
    },

    // ==========================================
    // 6.5 COMPLIANCE REQUESTS (NEW SECTION ADDED)
    // ==========================================
    complianceRequests: [{
        docType: { type: String },
        reason: { type: String },
        newUrl: { type: String },
        timestamp: { type: Date, default: Date.now }
    }],

    // ==========================================
    // 7. SECURE COMMUNICATIONS (Chat Engine)
    // ==========================================
    messages: [{
        sender: { type: String, trim: true }, 
        text: { type: String, trim: true },
        timestamp: { type: Date, default: Date.now }
    }],

    // ==========================================
    // 8. SYSTEM AUDIT TRAIL
    // ==========================================
    auditLog: [{
        action: { type: String, required: true }, 
        user: { type: String, required: true },
        timestamp: { type: Date, default: Date.now }
    }],

    appliedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Vendor', vendorSchema);