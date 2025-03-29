// File: /app/api/users/route.js
import { NextResponse } from "next/server";
import { ref, update } from "firebase/database";
import { database } from "@/utils/firebase"; // adjust the import to your firebase config

export async function PUT(request) {
  try {
    const { searchParams } = new URL(request.url);
    const uid = searchParams.get("uid");
    if (!uid) {
      return NextResponse.json({ error: "Missing uid" }, { status: 400 });
    }

    const body = await request.json();
    // The update method will merge the data. If the user node does not exist, it creates it.
    await update(ref(database, `users/${uid}`), body);

    return NextResponse.json({ message: "User data updated successfully." });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
