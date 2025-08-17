import React, { useEffect, useState } from "react";
import {
  Search,
  ToggleLeft,
  ToggleRight,
  Phone,
  Mail,
  Calendar,
} from "lucide-react";
import api from "../components/services/api.ts";
import { User } from "../types";

const Users: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [userList, setUserList] = useState<User[]>([]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    inactiveUsers: 0,
  });

  // fetch users from API
  const fetchUsers = async () => {
    try {
      const res = await api.get("/v1/admin/user?page=1&limit=10");
      setUserList(res.data.data);
      setStats(res.data.stats);
    } catch (err) {
      console.error("Error fetching users:", err);
    }
  };

  // toggle user status
  const toggleUserStatus = async (userId: string) => {
    try {
      await api.patch(`/v1/admin/user/${userId}`);
      fetchUsers(); // refresh list after toggle
    } catch (err) {
      console.error("Error toggling status:", err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = userList.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const UserCard = ({ user }: { user: User }) => (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 border border-gray-100 p-6">
      <div className="flex items-start space-x-4">
        {/* Profile Placeholder with First Letter */}
        <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center text-xl font-bold text-gray-700">
          {user.name.charAt(0).toUpperCase()}
        </div>

        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold text-gray-900">{user.name}</h3>
            <div className="flex items-center space-x-2">
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  user.status
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {user.status ? "Active" : "Inactive"}
              </span>
              <button
                onClick={() => toggleUserStatus(user._id)}
                className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
              >
                {user.status ? (
                  <ToggleRight className="text-green-600" size={24} />
                ) : (
                  <ToggleLeft className="text-red-600" size={24} />
                )}
              </button>
            </div>
          </div>

          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex items-center space-x-2">
              <Mail size={16} />
              <span>{user.email}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Phone size={16} />
              <span>{user.phoneNumber}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Calendar size={16} />
              <span>Joined: {new Date(user.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Users</h1>
          <p className="text-gray-600 mt-1">
            Manage user accounts and permissions
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Users</p>
              <p className="text-3xl font-bold text-gray-900">
                {stats.totalUsers}
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <Mail className="text-blue-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Users</p>
              <p className="text-3xl font-bold text-green-600">
                {stats.activeUsers}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <ToggleRight className="text-green-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Inactive Users
              </p>
              <p className="text-3xl font-bold text-red-600">
                {stats.inactiveUsers}
              </p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
              <ToggleLeft className="text-red-600" size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={20}
          />
          <input
            type="text"
            placeholder="Search users by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-maroon-500 focus:border-maroon-500"
          />
        </div>
      </div>

      {/* Users List */}
      <div className="space-y-4">
        {filteredUsers.map((user) => (
          <UserCard key={user._id} user={user} />
        ))}
      </div>

      {filteredUsers.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-lg">
            No users found matching your search criteria
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;
