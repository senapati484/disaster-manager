// components/DonationForm.js
"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Loader2 } from "lucide-react";

export default function DonationForm() {
  const [amount, setAmount] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const presetAmounts = [100, 500, 1000, 2000, 5000];
  const raisedAmount = 1234567;
  const goalAmount = 5000000;
  const progressPercentage = (raisedAmount / goalAmount) * 100;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!amount || !phoneNumber) {
      setError("Please fill all required fields");
      return;
    }

    setLoading(true);

    // Simulating form submission - replace with actual implementation later
    setTimeout(() => {
      setLoading(false);
      alert(
        `Donation of ₹${amount} initiated. We'll send a verification to ${phoneNumber}`
      );
      // Reset form after submission
      setAmount("");
      setPhoneNumber("");
    }, 1500);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card className="w-full border-0 shadow-md">
        <CardHeader className="bg-slate-50 border-b">
          <CardTitle className="text-2xl font-medium text-slate-800">
            Donation Details
          </CardTitle>
          <CardDescription>
            Your contribution helps communities in need
          </CardDescription>
        </CardHeader>

        <div className="px-6 py-4 bg-slate-100">
          <div className="flex justify-between items-baseline mb-2">
            <span className="text-lg font-medium text-slate-800">
              ₹{raisedAmount.toLocaleString()}
            </span>
            <span className="text-sm text-slate-500">
              Goal: ₹{goalAmount.toLocaleString()}
            </span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </div>

        <CardContent className="p-6 space-y-6">
          <div className="space-y-2">
            <Label htmlFor="preset-amount">Select amount</Label>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {presetAmounts.map((amt) => (
                <Button
                  key={amt}
                  type="button"
                  variant={amount === amt.toString() ? "default" : "outline"}
                  onClick={() => setAmount(amt.toString())}
                  className="h-12"
                >
                  ₹{amt}
                </Button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Custom amount (₹)</Label>
            <Input
              id="amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
              min="1"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone number</Label>
            <Input
              id="phone"
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="10-digit mobile number"
              pattern="[0-9]{10}"
              required
            />
            <p className="text-sm text-slate-500">
              Payment verification will be sent to this number
            </p>
          </div>

          {error && <p className="text-sm font-medium text-red-500">{error}</p>}
        </CardContent>

        <CardFooter className="border-t p-6">
          <Button type="submit" className="w-full h-12" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing
              </>
            ) : (
              "Complete Donation"
            )}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}

// 6jVvL5jGJ1SsPEbzHTTye6E20Vz1{
//   assistantChat[{},];
//   disaster[{},];
//   documentStatus: "pending";
//   documentSubmitted: true;
//   documentTimestamp: 1743243176251;
//   email: "sayansenapaticoder@gmail.com";
//   location: {
//     lat: "28.6139";
//     lon: "77.2090";
//   };
//   name: "Sayan Senapati";
// }
