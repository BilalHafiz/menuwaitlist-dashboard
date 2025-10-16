"use client";

import { useState } from "react";
import {
  Send,
  Mail,
  Link,
  MessageSquare,
  Users,
  AlertCircle,
} from "lucide-react";
import { WaitlistUser } from "@/lib/supabase";

interface EmailComposerProps {
  selectedUsers: WaitlistUser[];
  onSendComplete: (result: any) => void;
}

export default function EmailComposer({
  selectedUsers,
  onSendComplete,
}: EmailComposerProps) {
  const [subject, setSubject] = useState(
    "TestFlight Invitation - Join Our Beta!"
  );
  const [customMessage, setCustomMessage] = useState("");
  const [testFlightLink, setTestFlightLink] = useState("");
  const [sending, setSending] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);

  const handleSend = async () => {
    if (!testFlightLink.trim()) {
      alert("Please enter a TestFlight link");
      return;
    }

    if (selectedUsers.length === 0) {
      alert("Please select at least one user");
      return;
    }

    setSending(true);
    try {
      const emails = selectedUsers.map((user) => user.email);

      const response = await fetch("/api/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          emails,
          subject,
          customMessage: customMessage.trim() || undefined,
          testFlightLink: testFlightLink.trim(),
        }),
      });

      const result = await response.json();
      onSendComplete(result);

      if (result.success) {
        // Reset form after successful send
        setCustomMessage("");
        setTestFlightLink("");
      }
    } catch (error) {
      console.error("Error sending emails:", error);
      onSendComplete({
        success: false,
        error: "Failed to send emails. Please try again.",
      });
    } finally {
      setSending(false);
    }
  };

  const generatePreviewHTML = () => {
    if (!testFlightLink.trim()) return "";

    const recipientName = selectedUsers[0]?.email.split("@")[0] || "there";

    return `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="margin: 0;">🚀 TestFlight Invitation</h1>
          <p style="margin: 10px 0 0 0;">You're invited to test our app!</p>
        </div>
        
        <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
          <h2 style="margin-top: 0;">Hello ${recipientName}!</h2>
          
          <p>Great news! You've been selected to participate in our app's beta testing program.</p>
          
          ${
            customMessage.trim()
              ? `<p><em>"${customMessage.trim()}"</em></p>`
              : ""
          }
          
          <p>To get started:</p>
          <ol>
            <li>Click the button below to join TestFlight</li>
            <li>Install the TestFlight app if you haven't already</li>
            <li>Download and test our app</li>
            <li>Share your feedback with us!</li>
          </ol>
          
          <div style="text-align: center; margin: 20px 0;">
            <a href="${testFlightLink.trim()}" style="display: inline-block; background: #007AFF; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold;">
              Join TestFlight
            </a>
          </div>
          
          <p><strong>What to expect:</strong></p>
          <ul>
            <li>Early access to new features</li>
            <li>Ability to provide feedback directly to our team</li>
            <li>Help shape the future of our app</li>
          </ul>
          
          <p>If you have any questions or need help, just reply to this email!</p>
          
          <p>Best regards,<br>The Development Team</p>
        </div>
      </div>
    `;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border">
      <div className="p-6 border-b">
        <div className="flex items-center space-x-2">
          <Mail className="h-5 w-5 text-primary-600" />
          <h2 className="text-xl font-semibold text-gray-900">
            Email Composer
          </h2>
          <span className="bg-green-100 text-green-800 text-sm px-2 py-1 rounded-full">
            {selectedUsers.length} selected
          </span>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Subject */}
        {/* <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Subject
          </label>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="Email subject"
          />
        </div> */}

        {/* TestFlight Link */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <div className="flex items-center space-x-1">
              <Link className="h-4 w-4" />
              <span>Emails</span>
              <span className="text-red-500">*</span>
            </div>
          </label>
          <input
            type="url"
            value={testFlightLink}
            onChange={(e) => setTestFlightLink(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="https://testflight.apple.com/join/your_code"
            required
          />
          <p className="text-sm text-gray-500 mt-1">
            Enter the TestFlight invitation link
          </p>
        </div>

        {/* Custom Message */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <div className="flex items-center space-x-1">
              <MessageSquare className="h-4 w-4" />
              <span>Content</span>
            </div>
          </label>
          <textarea
            value={customMessage}
            onChange={(e) => setCustomMessage(e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="Add a personal message to include in the email..."
          />
          <p className="text-sm text-gray-500 mt-1">
            This message will be included in the content body
          </p>
        </div>

        {/* Preview Toggle */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setPreviewMode(!previewMode)}
            className="text-sm text-primary-600 hover:text-primary-700"
          >
            {previewMode ? "Hide Preview" : "Show Preview"}
          </button>
        </div>

        {/* Email Preview */}
        {previewMode && (
          <div className="border border-gray-200 rounded-lg p-4">
            <h3 className="text-sm font-medium text-gray-700 mb-3">
              Email Preview
            </h3>
            <div
              className="border border-gray-200 rounded-lg p-4 bg-gray-50 max-h-96 overflow-y-auto"
              dangerouslySetInnerHTML={{ __html: generatePreviewHTML() }}
            />
          </div>
        )}

        {/* Selected Users Summary */}
        {selectedUsers.length > 0 && (
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-3">
              <Users className="h-4 w-4 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">
                Recipients ({selectedUsers.length})
              </span>
            </div>
            <div className="max-h-32 overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {selectedUsers.slice(0, 10).map((user) => (
                  <div
                    key={user.id}
                    className="text-sm text-gray-600 bg-white px-2 py-1 rounded"
                  >
                    {user.email}
                  </div>
                ))}
                {selectedUsers.length > 10 && (
                  <div className="text-sm text-gray-500 italic">
                    ... and {selectedUsers.length - 10} more
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Send Button */}
        <div className="flex items-center justify-between pt-4 border-t">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <AlertCircle className="h-4 w-4" />
            <span>
              {selectedUsers.length === 0
                ? "Select users from the table above to send emails"
                : `Ready to send to ${selectedUsers.length} user${
                    selectedUsers.length === 1 ? "" : "s"
                  }`}
            </span>
          </div>

          <button
            onClick={handleSend}
            disabled={
              sending || selectedUsers.length === 0 || !testFlightLink.trim()
            }
            className="flex items-center space-x-2 px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {sending ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Sending...</span>
              </>
            ) : (
              <>
                <Send className="h-4 w-4" />
                <span>Send Emails</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
