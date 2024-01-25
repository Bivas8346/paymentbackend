const express = require('express');
const router = express.Router();
const Razorpay = require('razorpay');
const crypto = require('crypto');


router.post("/orders", async (req, res) => {
    try {
        const razorpay = new Razorpay({
            key_id: process.env.RAZORPAY_API_KEY_ID,
            key_secret: process.env.RAZORPAY_API_SECRET,

        });

        const options = {
            "amount": req.body.amount * 100, // amount in the smallest
            currency: "INR",
            receipt: crypto.randomBytes(10).toString("hex")
        };
        razorpay.orders.create(options,(error, order)=> {
            if (error) {
                console.log(error);
                return res.status(500).send("Error");
            }
            res.status(200).json({data: order});
        })

        
    } catch (error) {
        console.log(error);
        res.status(500).send("Error");
    }
})


router.post("/verify",async (req, res) =>{
    try {
        const { 
            razorpay_order_id, 
            razorpay_payment_id, 
            razorpay_signature } = req.body;

            const sign = razorpay_order_id + "|" +razorpay_payment_id;
            const expectedSign = crypto.createHmac('SHA256',process.env.KEY_SECRET)
            .update(sign.toString())
            .digest("hex");

            if (razorpay_signature === expectedSign) {
                return res.status(200).json({ message: "Transaction verified successfully" });
            }else{
                return res.status(400).json({ message: "Transaction is not done poperly" });
            }
        
    } catch (error) {
        console.log(error);
        res.status(500).send("Error");
    }
})

module.exports = router;