import { instance } from "../server.js";
import crypto from "crypto";

export const checkout = async (req, res) => {

    console.log(req.body.amount)

    const options = {
        amount: Number(req.body.amount * 100),  // amount in the smallest currency unit
        currency: "INR",
    };

    const order = await instance.orders.create(options);
    console.log(order);

    res.status(200).json({
        success: true,
        order,
    })
}

export const paymentVerification = async (req, res) => {
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSingnature = crypto.createHmac("sha256", process.env.RAZORPAY_API_SECRET).update(body.toString()).digest("hex");
    const isAuthentic = razorpay_signature === expectedSingnature;
    console.log(res);
    if (isAuthentic) {
        res.redirect(`${process.env.BASEURL}/paymentsuccess?reference=${razorpay_order_id}`)
    } else {
        res.redirect(`${process.env.BASEURL}/paymentcancel?reference=${razorpay_order_id}`)
        res.status(400).json({
            success: false,
        });
    }
}