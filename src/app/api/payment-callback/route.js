// import { NextResponse } from "next/server";
// import axios from "axios";
// import crypto from "crypto";
// import { firestore } from "@/utils/firebase"; // Adjust the import based on your Firebase setup

// export async function POST(req) {
//   try {
//     const transactionId = req.headers.get("x-transaction-id");
//     const saltKey = process.env.PHONEPE_API_KEY;

//     // Verify payment status
//     const verificationResponse = await axios.get(
//       `https://api.phonepe.com/apis/hermes/pg/v1/status/${process.env.PHONEPE_MERCHANT_ID}/${transactionId}`,
//       {
//         headers: {
//           "Content-Type": "application/json",
//           "X-VERIFY":
//             crypto
//               .createHash("sha256")
//               .update(
//                 `/pg/v1/status/${process.env.PHONEPE_MERCHANT_ID}/${transactionId}${saltKey}`
//               )
//               .digest("hex") + "###1",
//           accept: "application/json",
//         },
//       }
//     );

//     // Update Firebase transaction
//     await firestore
//       .collection("transactions")
//       .doc(transactionId)
//       .update({
//         status:
//           verificationResponse.data.code === "PAYMENT_SUCCESS"
//             ? "completed"
//             : "failed",
//         paymentData: verificationResponse.data,
//         updatedAt: new Date().toISOString(),
//       });

//     return NextResponse.redirect(
//       verificationResponse.data.code === "PAYMENT_SUCCESS"
//         ? `${process.env.NEXTAUTH_URL}/donate/success`
//         : `${process.env.NEXTAUTH_URL}/donate/failed`
//     );
//   } catch (error) {
//     console.error("Payment callback error:", error);
//     return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/donate/failed`);
//   }
// }
