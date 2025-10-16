"use client";

import { useState, useEffect } from "react";
import { Check, Mail, Search, Users, Calendar } from "lucide-react";

// WaitlistUser interface matching your backend API
interface WaitlistUser {
  id: number;
  email: string;
  created_at: string;
  updated_at: string;
}

interface WaitlistTableProps {
  onUserSelect: (users: WaitlistUser[]) => void;
  selectedUsers: WaitlistUser[];
}

interface PaginationInfo {
  total: number;
}

export default function WaitlistTable({
  onUserSelect,
  selectedUsers,
}: WaitlistTableProps) {
  const [users, setUsers] = useState<WaitlistUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [pagination, setPagination] = useState<PaginationInfo>({
    total: 0,
  });

  const fetchUsers = async (search = "") => {
    setLoading(true);
    try {
      // Your backend API endpoint
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
      let endpoint = `${apiUrl}/api/v1/waitlist`;

      // Add search parameter if provided
      if (search && search.trim()) {
        endpoint += `?search=${encodeURIComponent(search.trim())}`;
      }

      console.log("Fetching users from:", endpoint);

      let response;
      let data;

      try {
        // Try external API first
        response = await fetch(endpoint, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        data = await response.json();
        console.log("External API Response:", data);
      } catch (externalError) {
        console.log("External API failed, trying Next.js API:", externalError);

        // Fallback to Next.js API
        const fallbackEndpoint = `/api/waitlist${
          search ? `?search=${encodeURIComponent(search)}` : ""
        }`;
        response = await fetch(fallbackEndpoint);
        data = await response.json();
        console.log("Next.js API Response:", data);
      }

      if (response.ok) {
        let users = [];
        let total = 0;

        // Handle different response formats
        if (data.success && data.data && data.data.users) {
          // External API format
          users = data.data.users;
          total = data.data.count || users.length;
        } else if (data.users) {
          // Next.js API format
          users = data.users;
          total = data.total || users.length;
        }

        setUsers(users);
        setPagination({ total: users.length });
        console.log(`Successfully loaded ${users.length} users`);
      } else {
        console.error("Failed to fetch users:", data.message || data.error);
        setUsers([]);
        setPagination({ total: 0 });
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      setUsers([]);
      setPagination({ total: 0 });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchUsers(searchTerm);
  };

  const handleUserToggle = (user: WaitlistUser) => {
    const isSelected = selectedUsers.some((u) => u.id === user.id);
    if (isSelected) {
      onUserSelect(selectedUsers.filter((u) => u.id !== user.id));
    } else {
      onUserSelect([...selectedUsers, user]);
    }
  };

  const handleSelectAll = () => {
    if (selectedUsers.length === users.length) {
      onUserSelect([]);
    } else {
      onUserSelect([...users]);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border">
      <div className="p-6 border-b">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Users className="h-5 w-5 text-primary-600" />
            <h2 className="text-xl font-semibold text-gray-900">
              Waitlist Users
            </h2>
            <span className="bg-primary-100 text-primary-800 text-sm px-2 py-1 rounded-full">
              {pagination.total} total
            </span>
          </div>

          <form onSubmit={handleSearch} className="flex items-center space-x-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              Search
            </button>
          </form>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={
                  selectedUsers.length === users.length && users.length > 0
                }
                onChange={handleSelectAll}
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <span className="text-sm text-gray-600">
                Select All ({selectedUsers.length} selected)
              </span>
            </label>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Select
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Created At
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Updated At
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan={4} className="px-6 py-12 text-center">
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                    <span className="ml-2 text-gray-600">Loading users...</span>
                  </div>
                </td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  className="px-6 py-12 text-center text-gray-500"
                >
                  No users found
                </td>
              </tr>
            ) : (
              users.map((user) => {
                const isSelected = selectedUsers.some((u) => u.id === user.id);
                return (
                  <tr
                    key={user.id}
                    className={`hover:bg-gray-50 transition-colors ${
                      isSelected ? "bg-primary-50" : ""
                    }`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleUserToggle(user)}
                        className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <Mail className="h-4 w-4 text-gray-400" />
                        <span className="text-sm font-medium text-gray-900">
                          {user.email}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(user.created_at)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(user.updated_at)}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <div className="px-6 py-4 border-t bg-gray-50">
        <div className="text-sm text-gray-700">
          Showing {pagination.total} total users
        </div>
      </div>
    </div>
  );
}
