fetch('https://cando-backend-api.onrender.com\/api/enquiries', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({
        clientName: "Aisha Sharma (Test)",
        email: "aisha.test@outlook.com",
        division: "Thread & Knot",
        eventDetails: "Testing the C&O Command Center Database Link!"
    })
})
.then(response => response.json())
.then(data => console.log("✅ SYSTEM RESPONSE:", data))
.catch(error => console.error("❌ FIRING ERROR:", error))