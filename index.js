const express = require("express");
// TODO: add a stripe key
const app = express();
const stripe = require("stripe")("sk_test_51Kdb6pSAgZAMy2B2EX8MwWM3D079T4S7t95wWCUqmO8QIldPik3EPt9RnjdHWP9o3sLNnBW6fFyfwo99HgVsoIWb0043k74OaA");
const uuid = require("uuid");

// middleware
app.use(express.static("public"));
app.use(express.json());
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

const calculateOrderAmount = (items) => {
    // Replace this constant with a calculation of the order's amount
    // Calculate the order total on the server to prevent
    // people from directly manipulating the amount on the client
    return 1400;
};

// routes

app.post("/create-payment-intent", async (req, res) => {
    const { items } = req.body;

    // Create a PaymentIntent with the order amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
        amount: calculateOrderAmount(items),
        currency: "eur",
        automatic_payment_methods: {
            enabled: true,
        },
    });

    res.send({
        paymentIntent: paymentIntent,
    });
});

// app.get("/", (req, res) => {
//     res.send("Get WORKS");
// });

// app.get('/secret', async (req, res) => {
//     // ... Fetch or create the SetupIntent
//     const setupIntent = await stripe.setupIntents.create({
//         // customer: '{{CUSTOMER_ID}}',
//         payment_method_types: ['bancontact', 'card', 'ideal'],
//     });
//     if (err) {
//         return send(req, res, err, 500);
//     }
//     return res.json({ client_secret: setupIntent.client_secret });
// });


// app.post("/payment", (req, res) => {
//     const { product, token } = req.body;
//     console.log("Product", product);
//     console.log("Price", product.price);
//     const idempotencyKey = uuid();

//     return stripe.customers.create({
//         email: token.email,
//         source: token.id
//     })
//         .then(customer => {
//             stripe.charges.create({
//                 amount: product.price * 100,
//                 currency: 'usd',
//                 customer: customer.id,
//                 receipt_email: token.email,
//                 decsription: product.name,
//                 shipping: {
//                     name: token.card.name,
//                     address: {
//                         country: token.card.address_country
//                     }
//                 }
//             }, { idempotencyKey })
//         })
//         .then(result => res.status(200).json(result))
//         .catch(err => console.log(err))
// })

app.listen(4000, () => console.log("Node server listening on port 4000!"));
