"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { WaitlistUser } from "@/lib/supabase";
import WaitlistTable from "@/components/WaitlistTable";
import EmailComposer from "@/components/EmailComposer";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/contexts/AuthContext";
import {
  CheckCircle,
  XCircle,
  AlertCircle,
  Mail,
  LogOut,
  User,
} from "lucide-react";

interface SendResult {
  success: boolean;
  message?: string;
  error?: string;
  results?: Array<{
    email: string;
    success: boolean;
    messageId?: string;
    error?: string;
  }>;
  summary?: {
    total: number;
    successful: number;
    failed: number;
  };
}

export default function Dashboard() {
  const [selectedUsers, setSelectedUsers] = useState<WaitlistUser[]>([]);
  const [sendResult, setSendResult] = useState<SendResult | null>(null);
  const { user, signOut } = useAuth();
  const router = useRouter();

  const handleUserSelect = (users: WaitlistUser[]) => {
    setSelectedUsers(users);
    setSendResult(null); // Clear previous results when selection changes
  };

  const handleSendComplete = (result: SendResult) => {
    setSendResult(result);
  };

  const clearResults = () => {
    setSendResult(null);
  };

  const handleLogout = async () => {
    await signOut();
    router.push("/login");
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center space-x-3">
                <div className="bg-primary-600 p-2 rounded-lg">
                  <Mail className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-semibold text-gray-900">
                    Waitlist Email Dashboard
                  </h1>
                  <p className="text-sm text-gray-500">
                    Send TestFlight invitations to your waitlist users
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="text-sm text-gray-600">
                  {selectedUsers.length} user
                  {selectedUsers.length === 1 ? "" : "s"} selected
                </div>

                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <User className="h-4 w-4" />
                    <span>{user?.email}</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-1 px-3 py-1 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Send Results */}
          {sendResult && (
            <div className="mb-6">
              <div
                className={`rounded-lg p-4 ${
                  sendResult.success
                    ? "bg-green-50 border border-green-200"
                    : "bg-red-50 border border-red-200"
                }`}
              >
                <div className="flex items-start space-x-3">
                  {sendResult.success ? (
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-600 mt-0.5" />
                  )}
                  <div className="flex-1">
                    <h3
                      className={`text-sm font-medium ${
                        sendResult.success ? "text-green-800" : "text-red-800"
                      }`}
                    >
                      {sendResult.success
                        ? "Emails Sent Successfully!"
                        : "Email Sending Failed"}
                    </h3>
                    <p
                      className={`text-sm mt-1 ${
                        sendResult.success ? "text-green-700" : "text-red-700"
                      }`}
                    >
                      {sendResult.message || sendResult.error}
                    </p>

                    {sendResult.summary && (
                      <div className="mt-3 grid grid-cols-3 gap-4 text-sm">
                        <div className="text-center">
                          <div className="font-medium text-gray-900">
                            {sendResult.summary.total}
                          </div>
                          <div className="text-gray-500">Total</div>
                        </div>
                        <div className="text-center">
                          <div className="font-medium text-green-600">
                            {sendResult.summary.successful}
                          </div>
                          <div className="text-gray-500">Successful</div>
                        </div>
                        <div className="text-center">
                          <div className="font-medium text-red-600">
                            {sendResult.summary.failed}
                          </div>
                          <div className="text-gray-500">Failed</div>
                        </div>
                      </div>
                    )}

                    {sendResult.results &&
                      sendResult.results.some((r) => !r.success) && (
                        <div className="mt-3">
                          <h4 className="text-sm font-medium text-red-800 mb-2">
                            Failed Emails:
                          </h4>
                          <div className="space-y-1">
                            {sendResult.results
                              .filter((r) => !r.success)
                              .map((result, index) => (
                                <div
                                  key={index}
                                  className="text-sm text-red-700"
                                >
                                  {result.email}: {result.error}
                                </div>
                              ))}
                          </div>
                        </div>
                      )}
                  </div>
                  <button
                    onClick={clearResults}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <XCircle className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Grid Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Waitlist Table */}
            <div className="lg:col-span-1">
              <WaitlistTable
                onUserSelect={handleUserSelect}
                selectedUsers={selectedUsers}
              />
            </div>

            {/* Email Composer */}
            <div className="lg:col-span-1">
              <EmailComposer
                selectedUsers={selectedUsers}
                onSendComplete={handleSendComplete}
              />
            </div>
          </div>

          {/* Footer */}
          {/* <footer className="mt-12 text-center text-sm text-gray-500">
            <p>
              Having issues? Check the{" "}
              <a
                href="/debug"
                className="text-primary-600 hover:text-primary-700 underline"
              >
                debug page
              </a>{" "}
              for environment setup help.
            </p>
          </footer> */}
        </main>
      </div>
    </ProtectedRoute>
  );
}
