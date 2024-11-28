import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

router.post('/', async (req, res) => {
    //Check if user is logged in
    if (!req.session || !req.session.customer_id) {
        return res.status(401).send('Unauthorized: Please log in to complete a purchase.');
    }

    //Extract and validate inputs
    const {
        street,
        city,
        province,
        country,
        postal_code,
        credit_card,
        credit_expire,
        credit_cvv,
        cart,
        invoice_amt,
        invoice_tax,
        invoice_total,
    } = req.body;

    //Check if any required fields are missing
    if (!street || !city || !province || !country || !postal_code || !credit_card || !credit_expire || !credit_cvv || !cart || !invoice_amt || !invoice_tax || !invoice_total) {
        return res.status(400).send('Missing required fields.');
    }

    //Convert data types
    const creditCVV = parseInt(credit_cvv);
    const invoiceAmount = parseFloat(invoice_amt);
    const invoiceTax = parseFloat(invoice_tax);
    const invoiceTotal = parseFloat(invoice_total);

    //Process cart: Mapping product IDs to quantities
    const productIDs = cart.split(',').map(id => parseInt(id, 10));
    const productQuantity = {};

    //Count the quantity of each product ID in the cart
    productIDs.forEach(id => {
        productQuantity[id] = (productQuantity[id] || 0) + 1;
    });

    //Validate that all product IDs exist in the database
    const products = await prisma.product.findMany({
        where: {
            product_id: {
                in: productIDs
            }
        }
    });

    //Extract the valid product IDs from the database results and identify any invalid product IDs
    const validProductIds = products.map(product => product.product_id);
    const invalidProductIds = productIDs.filter(id => !validProductIds.includes(id));

    //If there are any invalid product IDs, return an error(this may not be necessary for the UI part)
    if (invalidProductIds.length > 0) {
        return res.status(400).send(`Invalid product IDs: ${invalidProductIds.join(', ')}`);
    }

    //Create purchase in the database (in a transaction for consistency)
    const purchase = await prisma.purchase.create({
        data: {
            customer_id: req.session.customer_id,
            street,
            city,
            province,
            country,
            postal_code,
            credit_card,
            credit_expire: new Date(credit_expire), //Make sure it's date
            credit_cvv: creditCVV,
            invoice_amt: invoiceAmount,
            invoice_tax: invoiceTax,
            invoice_total: invoiceTotal,
            order_date: new Date(), //Set the current date
        },
    });

    //Create purchase items for each product in the cart
    const purchaseItems = Object.entries(productQuantity).map(([product_id, quantity]) => ({
        purchase_id: purchase.purchase_id,
        product_id: parseInt(product_id, 10),
        quantity,
    }));

    await prisma.purchaseItem.createMany({
        data: purchaseItems,
    });

    //Success response
    return res.json({ message: 'Purchase successful', purchase_id: purchase.purchase_id });
});

export default router;
