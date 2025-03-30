import { NextResponse } from "next/server";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import crypto from "crypto";
import { firestore } from "@/utils/firebase";

async function POST(req) {
  try {
    const { amount, phoneNumber } = await req.json();

    // PhonePe API configuration
    const phonepeConfig = {
      merchantId: process.env.PHONEPE_MERCHANT_ID,
      merchantTransactionId: `MT_${Date.now()}_${uuidv4().substring(0, 8)}`,
      amount: amount * 100, // Convert to paise
      phone: phoneNumber,
      redirectUrl: `${process.env.NEXTAUTH_URL}/payment-callback`,
      redirectMode: "POST",
    };

    // Create payment request
    const saltKey = process.env.PHONEPE_API_KEY;
    const payload = Buffer.from(JSON.stringify(phonepeConfig)).toString(
      "base64"
    );
    const xVerify =
      crypto
        .createHash("sha256")
        .update(payload + "/pg/v1/pay" + saltKey)
        .digest("hex") + "###1";

    const paymentResponse = await axios.post(
      "https://api.phonepe.com/apis/hermes/pg/v1/pay",
      {
        request: payload,
      },
      {
        headers: {
          "Content-Type": "application/json",
          "X-VERIFY": xVerify,
          accept: "application/json",
        },
      }
    );

    // Log transaction in Firebase
    await firestore.collection("transactions").add({
      amount,
      phoneNumber,
      transactionId: phonepeConfig.merchantTransactionId,
      status: "initiated",
      timestamp: new Date().toISOString(),
    });

    if (paymentResponse.success) {
      return NextResponse.json({
        success: true,
        transactionId: paymentResponse.transactionId,
      });
    } else {
      return NextResponse.json({ error: "Payment failed" }, { status: 500 });
    }
  } catch (error) {
    console.error("Error processing payment:", error);
    return NextResponse.json(
      { error: "Error processing payment" },
      { status: 500 }
    );
  }
}

export { POST };
