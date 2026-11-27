// Day 19: email notifications for appointment lifecycle events.
//
// Sends a plain-text + HTML email to the patient when an appointment
// is booked, rescheduled or cancelled. Transport is plain SMTP via
// nodemailer, configured entirely from environment variables:
//
//   SMTP_HOST, SMTP_PORT (default 587), SMTP_SECURE ("true" for 465),
//   SMTP_USER, SMTP_PASS, EMAIL_FROM
//
// When SMTP is not configured the app still works: sending is skipped
// and the message is logged instead, so local development and the
// demo deployment never break for want of credentials. Sending never
// throws into the API routes — a failed send is logged and the
// booking itself still succeeds, because losing a booking over a
// mail outage would be worse than a missing email.

import nodemailer from "nodemailer";

let transporter = null;

export function isEmailConfigured() {
  return Boolean(
    process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS
  );
}

function getTransporter() {
  if (!isEmailConfigured()) return null;
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      secure: process.env.SMTP_SECURE === "true",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }
  return transporter;
}

function formatWhen(date) {
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return String(date);
  return d.toLocaleString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

// Send one email. Returns { sent: true } on success, or
// { sent: false, reason } when skipped or failed — never throws.
export async function sendMail({ to, subject, text, html }) {
  if (!to) return { sent: false, reason: "no-recipient" };

  if (!isEmailConfigured()) {
    // Dev fallback: show what would have been sent, send nothing.
    console.log(
      `[email] SMTP not configured — would send to ${to}: ${subject}\n${text}`
    );
    return { sent: false, reason: "not-configured" };
  }

  try {
    await getTransporter().sendMail({
      from: process.env.EMAIL_FROM || process.env.SMTP_USER,
      to,
      subject,
      text,
      html,
    });
    return { sent: true };
  } catch (error) {
    console.error(`[email] Failed to send to ${to}:`, error.message);
    return { sent: false, reason: "send-failed", error: error.message };
  }
}

const SUBJECTS = {
  booked: "Your appointment is booked",
  rescheduled: "Your appointment has been rescheduled",
  cancelled: "Your appointment has been cancelled",
};

const HEADINGS = {
  booked: "Your appointment is booked",
  rescheduled: "Your appointment has been rescheduled",
  cancelled: "Your appointment has been cancelled",
};

const INTROS = {
  booked:
    "Thank you for booking with us. Here are the details of your appointment:",
  rescheduled:
    "Your appointment has been moved. Here are the updated details:",
  cancelled:
    "Your appointment has been cancelled as requested. Here are the details for your records:",
};

// Build the booked / rescheduled / cancelled email for one appointment.
// `appointment` is the Prisma record with patient and doctor included
// (see the appointments routes); the serializer shape works too as
// long as patientName / patientEmail / doctorName are present.
export function buildAppointmentEmail(type, appointment) {
  const patientName = appointment.patient?.name || appointment.patientName || "there";
  const doctorName = appointment.doctor?.user?.name || appointment.doctorName || "your doctor";
  const specialty = appointment.doctor?.specialization || appointment.specialty || "";
  const when = formatWhen(appointment.date);
  const reason = appointment.reason || null;

  const subject = `${SUBJECTS[type]} — Dr. ${doctorName}, ${when}`;
  const lines = [
    `Hi ${patientName},`,
    "",
    INTROS[type],
    "",
    `Doctor: Dr. ${doctorName}${specialty ? ` (${specialty})` : ""}`,
    `When: ${when}`,
    ...(reason ? [`Reason: ${reason}`] : []),
    "",
    type === "cancelled"
      ? "If this was a mistake, please book a new appointment from the doctors page."
      : "If you need to change or cancel, you can do so from your dashboard.",
    "",
    "— Healthcare Appointment App",
  ];
  const text = lines.join("\n");

  // Navy / mint theme, matching the app.
  const html = `
    <div style="font-family: Arial, sans-serif; color: #0f172a; max-width: 560px; margin: 0 auto;">
      <div style="background: #0f2a43; color: #ffffff; padding: 20px 24px; border-radius: 12px 12px 0 0;">
        <h1 style="margin: 0; font-size: 20px;">${HEADINGS[type]}</h1>
      </div>
      <div style="background: #f8fafc; padding: 24px; border: 1px solid #e2e8f0; border-top: none; border-radius: 0 0 12px 12px;">
        <p>Hi ${patientName},</p>
        <p>${INTROS[type]}</p>
        <table style="border-collapse: collapse; width: 100%;">
          <tr><td style="padding: 6px 0; color: #64748b;">Doctor</td><td style="padding: 6px 0; font-weight: bold;">Dr. ${doctorName}${specialty ? ` (${specialty})` : ""}</td></tr>
          <tr><td style="padding: 6px 0; color: #64748b;">When</td><td style="padding: 6px 0; font-weight: bold;">${when}</td></tr>
          ${reason ? `<tr><td style="padding: 6px 0; color: #64748b;">Reason</td><td style="padding: 6px 0;">${reason}</td></tr>` : ""}
        </table>
        <p style="color: #64748b; font-size: 14px;">${
          type === "cancelled"
            ? "If this was a mistake, please book a new appointment from the doctors page."
            : "If you need to change or cancel, you can do so from your dashboard."
        }</p>
        <p style="color: #14b8a6; font-weight: bold;">— Healthcare Appointment App</p>
      </div>
    </div>
  `;

  return { subject, text, html };
}

// Send the lifecycle email for an appointment. `type` is one of
// "booked" | "rescheduled" | "cancelled". Never throws.
export async function sendAppointmentEmail(type, appointment) {
  const to = appointment.patient?.email || appointment.patientEmail;
  if (!to) return { sent: false, reason: "no-recipient" };
  const { subject, text, html } = buildAppointmentEmail(type, appointment);
  return sendMail({ to, subject, text, html });
}
