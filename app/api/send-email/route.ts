import { NextRequest, NextResponse } from "next/server";
import { sendEmail, generateTestFlightEmailHTML } from "@/lib/email";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { emails, subject, customMessage, testFlightLink } = body;

    if (!emails || !Array.isArray(emails) || emails.length === 0) {
      return NextResponse.json(
        { error: "Emails array is required" },
        { status: 400 }
      );
    }

    if (!testFlightLink) {
      return NextResponse.json(
        { error: "TestFlight link is required" },
        { status: 400 }
      );
    }

    const results = [];
    const defaultSubject = subject || "TestFlight Invitation - Join Our Beta!";

    for (const email of emails) {
      const html = generateTestFlightEmailHTML(
        email.split("@")[0], // Use email prefix as name
        testFlightLink,
        customMessage
      );

      const result = await sendEmail({
        to: email,
        subject: defaultSubject,
        html,
      });

      results.push({
        email,
        success: result.success,
        messageId: result.messageId,
        error: result.error,
      });

      // Add a small delay between emails to avoid rate limiting
      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    const successCount = results.filter((r) => r.success).length;
    const failureCount = results.length - successCount;

    return NextResponse.json({
      success: true,
      message: `Emails sent: ${successCount} successful, ${failureCount} failed`,
      results,
      summary: {
        total: results.length,
        successful: successCount,
        failed: failureCount,
      },
      emailDetails: {
        subject: defaultSubject,
        customMessage: customMessage || null,
        testFlightLink: testFlightLink,
        recipientCount: emails.length,
      },
    });
  } catch (error) {
    console.error("Email sending error:", error);
    return NextResponse.json(
      { error: "Failed to send emails" },
      { status: 500 }
    );
  }
}
