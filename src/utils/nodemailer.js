// src/app/api/sendEmail/route.js

import nodemailer from "nodemailer";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    // Parse the JSON body from the request
    const { to, subject, text, html } = await request.json();

    // Create a transporter using environment variables for configuration
    const transporter = nodemailer.createTransport({
      host: process.env.NEXT_PUBLIC_SMTP_EMAIL,
      port: Number(process.env.NEXT_PUBLIC_SMTP_EMAIL),
      secure: process.env.EMAIL_SECURE === "true", // true for port 465, false for other ports
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Define the email options
    const mailOptions = {
      from: process.env.EMAIL_FROM, // sender address
      to, // list of receivers
      subject, // Subject line
      text, // plain text body
      html, // HTML body (optional)
    };

    // Send email using the transporter
    const info = await transporter.sendMail(mailOptions);

    return NextResponse.json({ success: true, info });
  } catch (error) {
    console.error("Error sending email:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
