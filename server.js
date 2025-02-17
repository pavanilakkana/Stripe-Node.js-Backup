const express = require("express");
const stripe = require("stripe")("sk_test_MT6ovgat1QWLrAtvFG0zhhB0"); // Use your secret key
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

// Route to create a PaymentIntent
app.post("/create-payment-intent", async (req, res) => {
    try {
        const { amount, currency, paymentMethodId } = req.body;

        const paymentIntent = await stripe.paymentIntents.create({
            amount,
            currency,
            payment_method: paymentMethodId,
            confirm: true, // Automatically confirm the payment
            return_url: "https://ureachdev.powerappsportals.com/Donate/", // Redirect users after payment
            automatic_payment_methods: {
                enabled: true,
                allow_redirects: "always",
            },
        });

        res.json({ 
            success: true, 
            paymentIntentId: paymentIntent.id, 
            clientSecret: paymentIntent.client_secret 
        });
    } catch (error) {
        console.error("Error creating PaymentIntent:", error);
        res.status(400).json({
            success: false,
            error: error.raw ? error.raw.message : error.message
        });
    }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));