"use client";

import { useState } from "react";

export default function DebugPage() {
  const [envCheck, setEnvCheck] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const checkEnvironment = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/check-env");
      const data = await response.json();
      setEnvCheck(data);
    } catch (error) {
      setEnvCheck({ error: "Failed to check environment" });
    } finally {
      setLoading(false);
    }
  };

  const testSupabase = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/test-supabase");
      const data = await response.json();
      setEnvCheck(data);
    } catch (error) {
      setEnvCheck({ error: "Failed to test Supabase" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Environment Debug Page
        </h1>

        <div className="space-y-4 mb-8">
          <button
            onClick={checkEnvironment}
            disabled={loading}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Checking..." : "Check Environment Variables"}
          </button>

          <button
            onClick={testSupabase}
            disabled={loading}
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 ml-4"
          >
            {loading ? "Testing..." : "Test Supabase Connection"}
          </button>
        </div>

        {envCheck && (
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-xl font-semibold mb-4">Results:</h2>
            <pre className="bg-gray-100 p-4 rounded-lg overflow-auto text-sm">
              {JSON.stringify(envCheck, null, 2)}
            </pre>
          </div>
        )}

        <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-yellow-800 mb-4">
            Quick Fix Steps:
          </h3>
          <ol className="text-yellow-700 space-y-2 list-decimal list-inside">
            <li>
              <strong>Create .env.local file</strong> in your project root (same
              level as package.json)
            </li>
            <li>
              <strong>Add these lines:</strong>
              <pre className="bg-yellow-100 p-3 rounded mt-2 text-sm overflow-x-auto">
                {`NEXT_PUBLIC_SUPABASE_URL=https://izjnryuoujzfxjyptnli.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here`}
              </pre>
            </li>
            <li>
              <strong>Get your keys from Supabase:</strong>
              <ul className="ml-4 mt-2 space-y-1">
                <li>
                  • Go to:{" "}
                  <a
                    href="https://supabase.com/dashboard/project/izjnryuoujzfxjyptnli"
                    target="_blank"
                    className="text-blue-600 underline"
                  >
                    Supabase Dashboard
                  </a>
                </li>
                <li>• Click Settings → API</li>
                <li>• Copy the "anon public" key</li>
              </ul>
            </li>
            <li>
              <strong>Restart your server:</strong>
              <pre className="bg-yellow-100 p-2 rounded mt-2 text-sm">
                npm run dev
              </pre>
            </li>
            <li>
              <strong>Test again:</strong> Click the buttons above
            </li>
          </ol>
        </div>

        <div className="mt-6 text-center">
          <a
            href="/"
            className="inline-block px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            Go to Dashboard
          </a>
        </div>
      </div>
    </div>
  );
}
