const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken'); 
const bcrypt = require('bcryptjs');     
const nodemailer = require('nodemailer'); 
require('dotenv').config();

// ==========================================
// 1. DATABASE BLUEPRINTS
// ==========================================
const Inquiry = require('./models/Inquiry');
const Career = require('./models/Career');
const Vendor = require('./models/Vendor');
const Subscriber = require('./models/Subscriber'); 
const Client = require('./models/Client');

const app = express();
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

const JWT_SECRET = process.env.JWT_SECRET || 'C&O_ENTERPRISE_VAULT_KEY_2026'; 

app.use(cors());
app.use(express.json());

// ==========================================
// 1.5 EMAIL ENGINE SETUP (Nodemailer)
// ==========================================
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS  
    }
});

const sendWelcomeEmail = async (toEmail, name, rawPassword, portalType) => {
    const portalUrl = portalType === 'Client' 
        ? 'http://localhost:5500/client-login.html' 
        : 'http://localhost:5500/vendor-portal.html';
    
    const mailOptions = {
        from: `"C&O Group Admin" <${process.env.EMAIL_USER}>`,
        to: toEmail,
        subject: `OFFICIAL DOSSIER: Your Secure Credentials for C&O Group Private Vault`,
        html: `
            <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: auto; padding: 40px; background-color: #ffffff; border: 1px solid #eeeeee; color: #111111;">
                <div style="text-align: center; margin-bottom: 30px;">
                    <h1 style="font-size: 24px; letter-spacing: 2px; margin: 0; color: #000;">C&O<span style="color: #D4AF37;">.</span> GROUP</h1>
                    <p style="font-size: 10px; text-transform: uppercase; letter-spacing: 4px; color: #888; margin-top: 5px;">Internal Command Access</p>
                </div>

                <p style="font-size: 14px; line-height: 1.6; color: #444;">Dear <strong>${name}</strong>,</p>
                
                <p style="font-size: 14px; line-height: 1.6; color: #444;">Welcome to the C&O Group inner circle. Your private event vault has been officially provisioned. This encrypted environment will serve as the single source of truth for your project’s architectural blueprints, financial frameworks, and direct communications.</p>

                <div style="background-color: #F4F4F2; padding: 25px; border-left: 3px solid #D4AF37; margin: 30px 0;">
                    <p style="margin: 0 0 10px 0; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; color: #888; font-weight: bold;">Your Secure Access Identifiers</p>
                    <p style="margin: 5px 0; font-size: 15px;"><strong>Access ID:</strong> <span style="color: #111;">${toEmail}</span></p>
                    <p style="margin: 5px 0; font-size: 15px;"><strong>Security Key:</strong> <span style="font-family: monospace; color: #8A1538; font-weight: bold; font-size: 18px;">${rawPassword}</span></p>
                </div>

                <div style="margin-bottom: 30px;">
                    <p style="font-size: 12px; text-transform: uppercase; letter-spacing: 1px; color: #D4AF37; font-weight: bold; margin-bottom: 15px;">Inside Your Command Center</p>
                    <ul style="font-size: 13px; color: #555; line-height: 2; padding-left: 20px;">
                        <li><strong>Spatial Blueprints:</strong> Review and approve high-fidelity renders.</li>
                        <li><strong>Financial Matrix:</strong> Track real-time budget allocations and payouts.</li>
                        <li><strong>Guest Manifest:</strong> Coordinate RSVPs and logistics.</li>
                        <li><strong>Secure Comms:</strong> Direct encrypted line to our architectural team.</li>
                    </ul>
                </div>

                <div style="border-top: 1px solid #eee; pt-30px; margin-top: 30px; padding-top: 20px;">
                    <p style="font-size: 13px; color: #888; margin-bottom: 10px;">To access your dashboard, please navigate to the following secure link:</p>
                    <p style="font-size: 13px; font-family: monospace; word-break: break-all; color: #D4AF37;">${portalUrl}</p>
                </div>

                <p style="font-size: 11px; color: #aaa; margin-top: 40px; text-align: center; font-style: italic;">
                    This is an automated security transmission. For your protection, please archive this email and do not share your security key.
                </p>
            </div>
        `
    };
    try {
        await transporter.sendMail(mailOptions);
        console.log(`📧 Detailed Dossier dispatched to ${toEmail}`);
    } catch (err) {
        console.error(`❌ Email failed to send to ${toEmail}:`, err);
    }
};

// ==========================================
// 2. CONNECT TO MONGODB VAULT 
// ==========================================
mongoose.connect(process.env.MONGO_URI, {
    tls: true,
    serverSelectionTimeoutMS: 5000 
})
.then(() => console.log('✅ C&O Group Database Vault: SECURE CONNECTION established.'))
.catch((err) => console.error('❌ Database Connection Error:', err));

// ==========================================
// 3. SECURITY MIDDLEWARE (THE GATEKEEPER)
// ==========================================
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; 
    if (!token) return res.status(401).json({ error: "Access Denied. Missing Token." });

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ error: "Invalid or Expired Security Token." });
        req.user = user; 
        next(); 
    });
};

// ==========================================
// 4. PUBLIC ROUTES (Frontend -> Database)
// ==========================================
app.post('/api/clients', async (req, res) => {
    try { const newClient = new Client(req.body); await newClient.save(); res.status(201).json(newClient); } 
    catch (err) { if (err.code === 11000) return res.status(400).json({ error: "Email already registered." }); res.status(500).json({ error: "Failed to create client request." }); }
});
app.post('/api/enquiries', async (req, res) => {
    try { const n = new Inquiry(req.body); await n.save(); res.status(201).json(n); } catch (e) { res.status(500).send(); }
});
app.post('/api/subscribe', async (req, res) => {
    try { const n = new Subscriber(req.body); await n.save(); res.status(201).json({ success: true, message: "Subscribed." }); } 
    catch (err) { if (err.code === 11000) return res.status(400).json({ error: "Already subscribed." }); res.status(500).json({ error: "Failed to subscribe." }); }
});
app.post('/api/vendors', async (req, res) => {
    try { const n = new Vendor(req.body); await n.save(); res.status(201).json(n); } catch (e) { res.status(500).send(); }
});
app.post('/api/careers', async (req, res) => {
    try { const n = new Career(req.body); await n.save(); res.status(201).json(n); } catch (e) { res.status(500).send(); }
});

// ==========================================
// 5. PORTAL AUTHENTICATION LOGINS (Updated for 1-hour timeout)
// ==========================================
app.post('/api/admin/login', (req, res) => {
    const { username, password } = req.body;
    const masterUser = process.env.ADMIN_USERNAME || "admin";
    const masterPass = process.env.ADMIN_PASSWORD || "coadmin2026";
    if (username === masterUser && password === masterPass) {
        const token = jwt.sign({ role: 'admin' }, JWT_SECRET, { expiresIn: '1h' }); res.json({ success: true, token }); // CHANGED TO 1h
    } else { res.status(401).json({ success: false, error: "Invalid Admin Credentials." }); }
});

app.post('/api/portal/client-login', async (req, res) => {
    const { email, passcode } = req.body;
    try {
        const client = await Client.findOne({ email: { $regex: new RegExp('^' + email + '$', 'i') }, status: 'Approved' });
        if (!client) return res.status(401).json({ error: "Access Denied: Invalid Credentials or Account Pending." });

        const isMatch = await bcrypt.compare(passcode, client.accessKey);
        if (!isMatch) return res.status(401).json({ error: "Access Denied: Invalid Passcode." });

        const token = jwt.sign({ id: client._id, role: 'client' }, JWT_SECRET, { expiresIn: '1h' }); // CHANGED TO 1h
        res.status(200).json({ success: true, token, clientName: client.clientName });
    } catch (error) { res.status(500).json({ error: "Vault handshake failed." }); }
});

app.post('/api/vendor/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const vendor = await Vendor.findOne({ email: { $regex: new RegExp('^' + email + '$', 'i') }, status: 'Approved' });
        if (!vendor) return res.status(401).json({ error: "Invalid Credentials or Account Pending." });

        const isMatch = await bcrypt.compare(password, vendor.password);
        if (!isMatch) return res.status(401).json({ error: "Invalid Password." });

        const token = jwt.sign({ id: vendor._id, role: 'vendor' }, JWT_SECRET, { expiresIn: '1h' }); // CHANGED TO 1h
        res.status(200).json({ success: true, token, companyName: vendor.companyName });
    } catch (error) { res.status(500).json({ error: "Authentication failed." }); }
});

// ==========================================
// 5.5 FORGOT PASSWORD PROTOCOLS (COMMAND WORKFLOW)
// ==========================================
app.post('/api/portal/client-forgot', async (req, res) => {
    const { email } = req.body;
    try {
        const client = await Client.findOne({ email: { $regex: new RegExp('^' + email + '$', 'i') } });
        if (!client) return res.status(404).json({ error: "No active client found with this email." });
        if (client.status !== 'Approved') return res.status(403).json({ error: "Account is pending approval." });

        // Command Workflow: Flag the account for Admin intervention, do not auto-change password
        client.resetRequested = true;
        client.auditLog.push({ action: "Client requested a security key reset.", user: "System Portal", timestamp: new Date() });
        await client.save();

        res.status(200).json({ message: "Reset request sent to Command Center. A new key will be deployed to your email shortly." });
    } catch (err) {
        res.status(500).json({ error: "System error during password reset request." });
    }
});

app.post('/api/portal/vendor-forgot', async (req, res) => {
    const { email } = req.body;
    try {
        const vendor = await Vendor.findOne({ email: { $regex: new RegExp('^' + email + '$', 'i') } });
        if (!vendor) return res.status(404).json({ error: "No active partner found with this email." });
        if (vendor.status !== 'Approved') return res.status(403).json({ error: "Account is pending approval." });

        // Command Workflow: Flag the account for Admin intervention
        vendor.resetRequested = true;
        vendor.auditLog.push({ action: "Partner requested a security key reset.", user: "System Portal", timestamp: new Date() });
        await vendor.save();

        res.status(200).json({ message: "Reset request sent to Command Center. A new key will be deployed to your email shortly." });
    } catch (err) {
        res.status(500).json({ error: "System error during password reset request." });
    }
});

// ==========================================
// 6. CLIENT PORTAL ROUTES (Protected)
// ==========================================
app.get('/api/portal/client-data', authenticateToken, async (req, res) => {
    try { const client = await Client.findById(req.user.id).select('-accessKey'); res.status(200).json(client); } catch(err) { res.status(500).json({ error: "Data retrieval failed." }); }
});
app.patch('/api/portal/client-update', authenticateToken, async (req, res) => {
    try {
        const client = await Client.findById(req.user.id);
        let updateQuery = {};
        if (req.body.guest) {
            updateQuery.$push = { guests: req.body.guest, auditLog: { action: `Guest Added: ${req.body.guest.name}`, user: "Client" } };
            const newTotal = (client.projectMetrics?.rsvpConfirmed || 0) + Number(req.body.guest.partySize || 1);
            updateQuery.$set = { "projectMetrics.rsvpConfirmed": newTotal };
        }
        if (req.body.deleteGuestId) {
            const guest = client.guests.id(req.body.deleteGuestId);
            if (guest) {
                updateQuery.$pull = { guests: { _id: req.body.deleteGuestId } };
                updateQuery.$push = { auditLog: { action: `Guest Removed: ${guest.name}`, user: "Client" } };
                const newTotal = Math.max(0, (client.projectMetrics?.rsvpConfirmed || 0) - Number(guest.partySize || 1));
                updateQuery.$set = { "projectMetrics.rsvpConfirmed": newTotal };
            }
        }
        if (req.body.message) {
            if (!updateQuery.$push) updateQuery.$push = {};
            updateQuery.$push.messages = req.body.message;
        }
        const updated = await Client.findByIdAndUpdate(req.user.id, updateQuery, { returnDocument: 'after' });
        res.status(200).json(updated);
    } catch (err) { res.status(500).json({ error: "Sync failed." }); }
});

app.delete('/api/portal/client-message-delete', authenticateToken, async (req, res) => {
    try {
        await Client.findByIdAndUpdate(req.user.id, { $pull: { messages: { _id: req.body.messageId } } });
        res.json({ success: true });
    } catch (err) { res.status(500).json({ error: "Delete failed" }); }
});

// ==========================================
// 7. VENDOR PORTAL ROUTES (Protected)
// ==========================================
app.get('/api/vendor/data', authenticateToken, async (req, res) => {
    try { const vendor = await Vendor.findById(req.user.id).select('-password -accessKey'); res.status(200).json(vendor); } catch(err) { res.status(500).json({ error: "Dashboard sync failed." }); }
});

app.patch('/api/vendor/update', authenticateToken, async (req, res) => {
    try {
        let updateQuery = { $push: {}, $set: {} };
        if (req.body.invoice) updateQuery.$push.invoices = req.body.invoice;
        if (req.body.profile) updateQuery.$set = req.body.profile;
        if (req.body.message) updateQuery.$push.messages = req.body.message; 
        
        // --- ADDED: Allow vendor to submit compliance unlock requests ---
        if (req.body.complianceRequests) updateQuery.$set.complianceRequests = req.body.complianceRequests;
        
        if (Object.keys(updateQuery.$push).length === 0) delete updateQuery.$push;
        if (Object.keys(updateQuery.$set).length === 0) delete updateQuery.$set;
        
        const updated = await Vendor.findByIdAndUpdate(req.user.id, updateQuery, { returnDocument: 'after' });
        res.status(200).json(updated);
    } catch (err) { res.status(500).json({ error: "Vendor update failed." }); }
});

app.delete('/api/vendor/message/delete', authenticateToken, async (req, res) => {
    try {
        await Vendor.findByIdAndUpdate(req.user.id, { $pull: { messages: { _id: req.body.messageId } } });
        res.json({ success: true });
    } catch (err) { res.status(500).json({ error: "Delete failed" }); }
});

// ==========================================
// 8. ADMIN COMMAND ROUTES (Protected CRM)
// ==========================================
app.get('/api/analytics/stats', authenticateToken, async (req, res) => {
    try {
        const stats = { totalInquiries: await Inquiry.countDocuments(), activeClients: await Client.countDocuments({ status: 'Approved' }), totalVendors: await Vendor.countDocuments(), totalSubs: await Subscriber.countDocuments() };
        res.json(stats);
    } catch(err) { res.status(500).send(); }
});

// ---------- CLIENTS ADMIN ----------
app.get('/api/clients', authenticateToken, async (req, res) => {
    const data = await Client.find().sort({ createdAt: -1 }); res.json(data);
});
app.patch('/api/clients/:id', authenticateToken, async (req, res) => {
    try {
        let updateData = { ...req.body };
        if(req.body.status === 'Approved' && req.body.accessKey) {
            const rawPassword = req.body.accessKey;
            updateData.plainKey = rawPassword;
            const salt = await bcrypt.genSalt(10);
            updateData.accessKey = await bcrypt.hash(rawPassword, salt);
            
            if(!updateData.$push) updateData.$push = {};
            updateData.$push.auditLog = { action: "Access Authorized: Security Key Deployed.", user: "Admin Command" };

            const client = await Client.findById(req.params.id);
            await sendWelcomeEmail(client.email, client.clientName, rawPassword, 'Client');
        } else if(req.body.status === 'Approved') {
            await Client.findByIdAndUpdate(req.params.id, { $push: { auditLog: { action: "Access Authorized: Security Key Deployed.", user: "Admin Command" } } });
        }

        const u = await Client.findByIdAndUpdate(req.params.id, updateData, { returnDocument: 'after' });
        res.json(u);
    } catch (e) { res.status(500).send(); }
});
app.delete('/api/clients/:id', authenticateToken, async (req, res) => {
    await Client.findByIdAndDelete(req.params.id); res.json({ success: true });
});
app.patch('/api/admin/broadcast/:clientId', authenticateToken, async (req, res) => {
    try {
        const logEntry = { action: "System Update: Admin Broadcast pushed data.", user: req.body.adminPersona || "Admin Command", timestamp: new Date() };
        const updated = await Client.findByIdAndUpdate(req.params.clientId, { $set: req.body, $push: { auditLog: logEntry } }, { returnDocument: 'after' });
        res.status(200).json({ message: "Broadcast Complete.", updated });
    } catch (error) { res.status(500).json({ error: "Broadcast failed." }); }
});
app.patch('/api/admin/guest-logistics/:clientId/:guestId', authenticateToken, async (req, res) => {
    try {
        const { flightDetails, hotelRoom, dietaryNeeds, transport, eventRsvp } = req.body;
        const logEntry = { action: `Logistics Allocated for Guest ID: ${req.params.guestId}`, user: "Admin (Logistics)" };
        const updated = await Client.findOneAndUpdate(
            { _id: req.params.clientId, "guests._id": req.params.guestId }, 
            { 
                $set: { 
                    "guests.$.flightDetails": flightDetails, 
                    "guests.$.hotelRoom": hotelRoom,
                    "guests.$.dietaryNeeds": dietaryNeeds,
                    "guests.$.transport": transport,
                    "guests.$.eventRsvp": eventRsvp
                }, 
                $push: { auditLog: logEntry } 
            }, 
            { returnDocument: 'after' }
        );
        res.status(200).json(updated);
    } catch (error) { res.status(500).json({ error: "Logistics update failed." }); }
});
app.patch('/api/admin/delete-item/:clientId', authenticateToken, async (req, res) => {
    const { arrayName, itemId } = req.body; 
    try {
        const client = await Client.findById(req.params.clientId);
        let updateQuery = { $pull: { [arrayName]: { _id: itemId } } };
        let logAction = `Permanent Deletion from ${arrayName}`;
        if (arrayName === 'guests') {
            const guest = client.guests.id(itemId);
            if (guest) {
                const newTotal = Math.max(0, (client.projectMetrics.rsvpConfirmed || 0) - (guest.partySize || 1));
                updateQuery.$set = { "projectMetrics.rsvpConfirmed": newTotal };
                logAction = `Guest Removed: ${guest.name}. RSVP adjusted.`;
            }
        }
        const logEntry = { action: logAction, user: "Admin Command", timestamp: new Date() };
        const updated = await Client.findByIdAndUpdate(req.params.clientId, { ...updateQuery, $push: { auditLog: logEntry } }, { returnDocument: 'after' });
        res.status(200).json(updated);
    } catch (error) { res.status(500).json({ error: "Deletion failed." }); }
});

// ---------- VENDORS ADMIN ----------
app.get('/api/vendors', authenticateToken, async (req, res) => {
    const data = await Vendor.find().sort({ appliedAt: -1 }); res.json(data);
});
app.patch('/api/vendors/:id', authenticateToken, async (req, res) => {
    try { const u = await Vendor.findByIdAndUpdate(req.params.id, req.body, { returnDocument: 'after' }); res.json(u); } catch (e) { res.status(500).send(); }
});
app.delete('/api/vendors/:id', authenticateToken, async (req, res) => {
    await Vendor.findByIdAndDelete(req.params.id); res.json({ success: true });
});

app.patch('/api/admin/vendors/:id/authorize', authenticateToken, async (req, res) => {
    try {
        const rawPassword = req.body.password; 
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(rawPassword, salt);

        const vendor = await Vendor.findByIdAndUpdate(req.params.id, { 
            status: 'Approved', 
            password: hashedPassword, 
            accessKey: hashedPassword,
            plainKey: rawPassword 
        }, { returnDocument: 'after' });
        
        await sendWelcomeEmail(vendor.email, vendor.companyName, rawPassword, 'Vendor');
        res.status(200).json(vendor);
    } catch (err) { res.status(500).json({ error: 'Authorization failed.' }); }
});

app.patch('/api/admin/vendors/:id/assign', authenticateToken, async (req, res) => {
    try {
        const vendor = await Vendor.findById(req.params.id);
        vendor.assignedProjects.push(req.body); await vendor.save();
        res.status(200).json(vendor);
    } catch (err) { res.status(500).json({ error: 'Assignment failed.' }); }
});

app.patch('/api/admin/vendors/:id/invoice-status', authenticateToken, async (req, res) => {
    const { invoiceId, newStatus } = req.body;
    try {
        const logEntry = { action: `Invoice Status Updated to: ${newStatus}`, user: "Procurement Command", timestamp: new Date() };
        const updated = await Vendor.findOneAndUpdate(
            { _id: req.params.id, "invoices._id": invoiceId },
            { $set: { "invoices.$.status": newStatus }, $push: { auditLog: logEntry } },
            { returnDocument: 'after' }
        );
        res.status(200).json(updated);
    } catch (error) { res.status(500).json({ error: "Invoice update failed." }); }
});

app.patch('/api/admin/vendors/:id/delete-item', authenticateToken, async (req, res) => {
    const { arrayName, itemId } = req.body; 
    try {
        const logEntry = { action: `Permanent Deletion from ${arrayName}`, user: "Procurement Command", timestamp: new Date() };
        const updateQuery = { $pull: { [arrayName]: { _id: itemId } }, $push: { auditLog: logEntry } };
        const updated = await Vendor.findByIdAndUpdate(req.params.id, updateQuery, { returnDocument: 'after' });
        res.status(200).json(updated);
    } catch (error) { res.status(500).json({ error: "Deletion failed." }); }
});

app.delete('/api/admin/vendors/:id/message/:msgId', authenticateToken, async (req, res) => {
    try {
        await Vendor.findByIdAndUpdate(req.params.id, { $pull: { messages: { _id: req.params.msgId } } });
        res.json({ success: true });
    } catch (err) { res.status(500).json({ error: "Delete failed" }); }
});

app.patch('/api/admin/vendors/:id/broadcast', authenticateToken, async (req, res) => {
    try {
        let updateQuery = { $set: {}, $push: {} };
        
        if (req.body.message) { 
            updateQuery.$push = { messages: req.body.message }; 
        } else {
            const logEntry = { action: "System Update: Procurement pushed data.", user: req.body.adminPersona || "Procurement Command", timestamp: new Date() };
            updateQuery.$set.compliance = req.body.compliance;
            updateQuery.$push.auditLog = logEntry;
            
            // --- FIX 1: Save CAD/Briefs by accepting the full array from frontend ---
            if (req.body.assignedProjects) updateQuery.$set.assignedProjects = req.body.assignedProjects;
            
            // --- FIX 2: Allow clearing of Compliance Requests once handled ---
            if (req.body.complianceRequests !== undefined) updateQuery.$set.complianceRequests = req.body.complianceRequests;
            
            if (req.body.pastProjects) updateQuery.$set.pastProjects = req.body.pastProjects;
        }

        // Clean up empty objects
        if (Object.keys(updateQuery.$push).length === 0) delete updateQuery.$push;
        if (Object.keys(updateQuery.$set).length === 0) delete updateQuery.$set;
        
        const updated = await Vendor.findByIdAndUpdate(req.params.id, updateQuery, { returnDocument: 'after' });
        res.status(200).json({ message: "Broadcast Complete.", updated });
    } catch (error) { 
        console.error("Broadcast Error:", error);
        res.status(500).json({ error: "Broadcast failed." }); 
    }
});

// ---------- ENQUIRIES, SUBS, CAREERS ----------
app.get('/api/enquiries', authenticateToken, async (req, res) => {
    const data = await Inquiry.find().sort({ createdAt: -1 }); res.json(data);
});
app.delete('/api/enquiries/:id', authenticateToken, async (req, res) => {
    await Inquiry.findByIdAndDelete(req.params.id); res.json({ success: true });
});
app.get('/api/subscribers', authenticateToken, async (req, res) => {
    try { const data = await Subscriber.find(); res.json(data); } catch(err) { res.status(500).send(); }
});
app.get('/api/careers', authenticateToken, async (req, res) => {
    try { const data = await Career.find().sort({ appliedAt: -1 }); res.json(data); } catch(err) { res.status(500).send(); }
});
app.patch('/api/careers/:id', authenticateToken, async (req, res) => {
    try { const u = await Career.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true }); res.status(200).json(u); } catch(err) { res.status(500).send(); }
});
app.delete('/api/careers/:id', authenticateToken, async (req, res) => {
    try { await Career.findByIdAndDelete(req.params.id); res.status(200).json({ success: true }); } catch(err) { res.status(500).send(); }
});

// ==========================================
// 9. START THE ENGINE
// ==========================================
app.listen(PORT, () => {
    console.log(`
    -------------------------------------------
    🚀 C&O Group COMMAND SERVER V7.0 - ONLINE
    🛡️ Mode: Fully Audited & Encrypted (1-Hour Strict Session)
    📡 Access Terminal: http://localhost:${PORT}
    -------------------------------------------
    `);
});