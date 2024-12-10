import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

router.post('/', async (req, res) => {
    // Check if user is logged in
    if (!req.session || !req.session.customer_id) {
        return res.status(401).send('Unauthorized: Please log in to complete a purchase.');
    }

    // Extract and validate inputs
    const {
        street,
        city,
        province,
        country,
        postal_code,
        credit_card,
        credit_expire,
        credit_cvv,
        cart,  // Cart should be an array of product objects or product IDs
    } = req.body;

    // Check if any required fields are missing
    if (!street || !city || !province || !country || !postal_code || !credit_card || !credit_expire || !credit_cvv || !cart) {
        return res.status(400).send('Missing required fields.');
    }

    // Validate credit card number (16 digits)
    if (!/^\d{16}$/.test(credit_card)) {
        return res.status(400).send('Invalid credit card number. It must be 16 digits.');
    }

    // Validate expiration date (MM/YY format)
    if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(credit_expire)) {
        return res.status(400).send('Invalid expiration date format. Use MM/YY.');
    }

    // Validate CVV (3 digits)
    if (!/^\d{3}$/.test(credit_cvv)) {
        return res.status(400).send('CVV must be 3 digits.');
    }

    // Convert data types
    const creditCVV = parseInt(credit_cvv, 10);

    // Process cart: Assuming cart is an array of product objects like [{ id: 1, quantity: 2 }, { id: 2, quantity: 1 }]
    const productIDs = cart.map(item => item.id);  // Extract product IDs from cart
    const productQuantity = {};

    // Count the quantity of each product ID in the cart
    cart.forEach(item => {
        productQuantity[item.id] = item.quantity || 1;  // Default quantity to 1 if not provided
    });

    // Validate that all product IDs exist in the database
    const products = await prisma.product.findMany({
        where: {
            product_id: {
                in: productIDs
            }
        }
    });

    // Extract the valid product IDs from the database results and identify any invalid product IDs
    const validProductIds = products.map(product => product.product_id);
    const invalidProductIds = productIDs.filter(id => !validProductIds.includes(id));

    // If there are any invalid product IDs, return an error
    if (invalidProductIds.length > 0) {
        return res.status(400).send(`Invalid product IDs: ${invalidProductIds.join(', ')}`);
    }

    // Create the purchase in the database (in a transaction for consistency)
    const purchase = await prisma.purchase.create({
        data: {
            customer_id: req.session.customer_id,
            street,
            city,
            province,
            country,
            postal_code,
            credit_card,
            credit_expire: new Date(credit_expire), // Make sure it's a Date
            credit_cvv: creditCVV,
            order_date: new Date(), // Set the current date
        },
    });

    // Create purchase items for each product in the cart
    const purchaseItems = Object.entries(productQuantity).map(([product_id, quantity]) => ({
        purchase_id: purchase.purchase_id,
        product_id: parseInt(product_id, 10),
        quantity,
    }));

    // Insert purchase items into the database
    await prisma.purchaseItem.createMany({
        data: purchaseItems,
    });

    // Clear cart from the session or database if needed
    // For example, clear the session cart
    // req.session.cart = [];

    // Success response
    return res.json({ message: 'Purchase successful', purchase_id: purchase.purchase_id });
});

export default router;
