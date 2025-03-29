// src/app/api/data/route.js

import { database } from "@/utils/firebase";
import { ref, get, update } from "firebase/database";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const uid = searchParams.get("uid");

    // Read data from Firebase at the "users" node
    const snapshot = await get(ref(database, "users"));
    if (!snapshot.exists()) {
      return NextResponse.json(
        { data: null, message: "No data available" },
        { status: 404 }
      );
    }
    const data = snapshot.val();

    if (uid) {
      // Return only the requested user's data.
      const userData = data[uid] || null;
      return NextResponse.json({ data: userData });
    }

    // Otherwise, return all users (if needed)
    return NextResponse.json({ data });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const { searchParams } = new URL(request.url);
    const uid = searchParams.get("uid");
    if (!uid) {
      return NextResponse.json({ error: "Missing uid" }, { status: 400 });
    }

    const body = await request.json();
    await update(ref(database, `users/${uid}`), body);

    return NextResponse.json({ message: "User data updated successfully." });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
