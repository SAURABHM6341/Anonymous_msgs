import * as React from "react";
import { render } from "@react-email/render";
interface VerificationEmailProps {
  username: string;
  otp: string;
}

export function VerificationEmail({
  username,
  otp,
}: VerificationEmailProps) {
  return (
    <div
      style={{
        fontFamily: "Arial, Helvetica, sans-serif",
        backgroundColor: "#f5f7fb",
        padding: "40px 0",
      }}
    >
      <div
        style={{
          maxWidth: "520px",
          margin: "0 auto",
          backgroundColor: "#ffffff",
          borderRadius: "8px",
          padding: "32px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
        }}
      >
        <h1
          style={{
            fontSize: "22px",
            marginBottom: "16px",
            color: "#111827",
          }}
        >
          Verify Your Email
        </h1>

        <p
          style={{
            fontSize: "14px",
            color: "#374151",
            marginBottom: "16px",
          }}
        >
          Hello {username},
        </p>

        <p
          style={{
            fontSize: "14px",
            color: "#374151",
            marginBottom: "24px",
          }}
        >
          Use the OTP below to verify your email address. This OTP is valid for a
          short time only.
        </p>

        <div style={{ textAlign: "center", margin: "24px 0" }}>
          <span
            style={{
              display: "inline-block",
              fontSize: "28px",
              letterSpacing: "6px",
              fontWeight: 700,
              padding: "14px 24px",
              borderRadius: "6px",
              backgroundColor: "#f3f4f6",
              color: "#111827",
            }}
          >
            {otp}
          </span>
        </div>

        <p
          style={{
            fontSize: "13px",
            color: "#6b7280",
            marginBottom: "16px",
          }}
        >
          If you did not request this, please ignore this email.
        </p>

        <hr style={{ border: "none", borderTop: "1px solid #e5e7eb" }} />

        <p
          style={{
            fontSize: "12px",
            color: "#9ca3af",
            marginTop: "16px",
          }}
        >
          © {new Date().getFullYear()} Your Company. All rights reserved.
        </p>
      </div>
    </div>
  );
}
