import { mongooseConnect } from "@/lib/mongoose";
import { Order } from "@/models/Orders";
const stripe = require("stripe")(process.env.STRIPE_SK);
import {buffer} from "micro";

// This is your Stripe CLI webhook secret for testing your endpoint locally.
const endpointSecret = process.env.STRIPE_WEBHOOK;

export default async function handler(req, res) {
    await mongooseConnect();

    const sig = req.headers['stripe-signature'];

    let event;

    try {
        event = stripe.webhooks.constructEvent(await buffer(req), sig, endpointSecret);
    } catch (err) {
        res.status(400).send(`Webhook Error: ${err.message}`);
        return;
    }

    // Handle the event
    switch (event.type) {
    case 'checkout.session.completed':
      const data = event.data.object;
      const orderId = data.metadata.orderId;
      const paid = data.payment_status === 'paid';
      if (orderId && paid) {
        await Order.findByIdAndUpdate(orderId,{
          paid:true,
        })
      }
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

    res.status(200).send("ok");
}

export const config = {
    api: {bodyParser:false,}
};

//revive-reward-nifty-cute
//acct_1PD2QaRvfhuRMWVw
//whsec_4476d3c8da21a4513aa8e6e11e996f2a81a6a3c419a59c6e821037dd80fd6e86
