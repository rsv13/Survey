// components/DashUserOverview.js

import { Button, Modal, Select, Table, TextInput } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { AiOutlineSearch } from "react-icons/ai";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export default function DashUserOverview() {
  const [usersInGroups, setUsersInGroups] = useState([]);
  const [usersNotInGroups, setUsersNotInGroups] = useState([]);
  const [filteredUsersInGroups, setFilteredUsersInGroups] = useState([]);
  const [filteredUsersNotInGroups, setFilteredUsersNotInGroups] = useState([]);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [selectedGroupId, setSelectedGroupId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [groups, setGroups] = useState([]);
  const [error, setError] = useState("");

  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const isAdmin = currentUser?.role === "Admin";

  useEffect(() => {
    if (!isAdmin) {
      setError("You are not allowed to access this");
    } else {
      fetchUsersData();
      fetchGroupsData();
    }
  }, [isAdmin]);

  const fetchUsersData = async () => {
    try {
      const res = await fetch(`/api/user/users-grouped-and-ungrouped`, {
        method: "GET",
        headers: { "Content-Type": "application/json" }
      });

      if (!res.ok) {
        throw new Error("Failed to fetch users data");
      }

      const data = await res.json();
      setUsersInGroups(data.usersInGroups || []);
      setUsersNotInGroups(data.usersNotInGroups || []);
    } catch (error) {
      console.error("Error fetching users data:", error.message);
      setError("Failed to fetch users data.");
    }
  };

  const fetchGroupsData = async () => {
    try {
      const res = await fetch(`/api/group/allGroup`, {
        method: "GET",
        headers: { "Content-Type": "application/json" }
      });

      if (!res.ok) {
        throw new Error("Failed to fetch groups data");
      }

      const data = await res.json();
      setGroups(data || []);
    } catch (error) {
      console.error("Error fetching groups data:", error.message);
      setError("Failed to fetch groups data.");
    }
  };

  useEffect(() => {
    const query = searchQuery.toLowerCase();

    const filteredInGroups = usersInGroups.filter(
      (user) => (user.surveyUsername || "").toLowerCase().includes(query) || (user.email || "").toLowerCase().includes(query) || (user.groupId?.name || "").toLowerCase().includes(query)
    );

    const filteredNotInGroups = usersNotInGroups.filter((user) => (user.surveyUsername || "").toLowerCase().includes(query) || (user.email || "").toLowerCase().includes(query));

    setFilteredUsersInGroups(filteredInGroups);
    setFilteredUsersNotInGroups(filteredNotInGroups);
  }, [searchQuery, usersInGroups, usersNotInGroups]);

  const handleAddToGroupClick = (userId) => {
    setSelectedUserId(userId);
    setShowAddUserModal(true);
  };

  const handleAddUserToGroup = () => {
    setShowAddUserModal(false);
    setShowConfirmModal(true);
  };

  const handleConfirmAddUser = async () => {
    setShowConfirmModal(false);

    console.log("Adding user to group:", { selectedGroupId, selectedUserId });

    // Check if groupId and userId are set
    if (!selectedGroupId || !selectedUserId) {
      setError("Please select both a user and a group before proceeding.");
      return;
    }

    try {
      const res = await fetch(`/api/group/add-user`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ groupId: selectedGroupId, userId: selectedUserId })
      });

      console.log("Response status:", res.status, res.statusText);

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to add user to group");
      }

      await fetchUsersData(); // Refresh data to reflect changes
    } catch (error) {
      console.error("Error adding user to group:", error.message);
      setError(`Failed to add user to group. ${error.message}`);
    }
  };

  return (
    <div className="p-6 bg-gray-100 dark:bg-gray-900 min-h-screen flex flex-col items-center">
      {error ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          <strong className="font-bold">Error:</strong>
          <span className="block sm:inline">{error}</span>
        </div>
      ) : (
        <div className="w-full max-w-6xl bg-white dark:bg-gray-800 p-6 shadow-lg rounded-lg">
          <div className="mb-6">
            <TextInput
              type="text"
              placeholder="Search by group name, username, or email"
              rightIcon={AiOutlineSearch}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full max-w-md border-gray-300 dark:border-gray-700"
            />
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">Users in Groups</h2>
            {filteredUsersInGroups.length > 0 ? (
              <Table hoverable className="shadow-md bg-white dark:bg-gray-800">
                <Table.Head>
                  <Table.HeadCell>Created At</Table.HeadCell>
                  <Table.HeadCell>Username</Table.HeadCell>
                  <Table.HeadCell>Email</Table.HeadCell>
                  <Table.HeadCell>User Role</Table.HeadCell>
                  <Table.HeadCell>Group Name</Table.HeadCell>
                  <Table.HeadCell>Group Description</Table.HeadCell>
                  <Table.HeadCell>Actions</Table.HeadCell>
                </Table.Head>
                <Table.Body className="divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredUsersInGroups.map((user) => (
                    <Table.Row key={user._id} className="bg-gray-50 dark:bg-gray-900">
                      <Table.Cell>{new Date(user.createdAt).toLocaleDateString()}</Table.Cell>
                      <Table.Cell>{user.surveyUsername || "N/A"}</Table.Cell>
                      <Table.Cell>{user.email || "N/A"}</Table.Cell>
                      <Table.Cell>{user.role || "N/A"} </Table.Cell>
                      <Table.Cell>{user.groupId?.name || "No Group"}</Table.Cell>
                      <Table.Cell>{user.groupId?.description || "No Description"}</Table.Cell>
                      <Table.Cell>
                        <Button onClick={() => handleDeleteClick(user._id)} color="failure" size="sm">
                          Delete
                        </Button>
                      </Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table>
            ) : (
              <p className="text-gray-600 dark:text-gray-400">No users found in groups.</p>
            )}
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">Users Not in Groups</h2>
            {filteredUsersNotInGroups.length > 0 ? (
              <Table hoverable className="shadow-md bg-white dark:bg-gray-800">
                <Table.Head>
                  <Table.HeadCell>Created At</Table.HeadCell>
                  <Table.HeadCell>Username</Table.HeadCell>
                  <Table.HeadCell>Email</Table.HeadCell>
                  <Table.HeadCell colSpan={2}>Actions</Table.HeadCell>
                </Table.Head>
                <Table.Body className="divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredUsersNotInGroups.map((user) => (
                    <Table.Row key={user._id} className="bg-gray-50 dark:bg-gray-900">
                      <Table.Cell>{new Date(user.createdAt).toLocaleDateString()}</Table.Cell>
                      <Table.Cell>{user.surveyUsername || "N/A"}</Table.Cell>
                      <Table.Cell>{user.email || "N/A"}</Table.Cell>
                      <Table.Cell>
                        {isAdmin && (
                          <Button onClick={() => handleAddToGroupClick(user._id)} color="primary" size="sm">
                            Add to Group
                          </Button>
                        )}
                      </Table.Cell>
                      <Table.Cell>
                        {isAdmin && (
                          <Button onClick={() => handleDeleteClick(user._id)} color="failure" size="sm">
                            Delete
                          </Button>
                        )}
                      </Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table>
            ) : (
              <p className="text-gray-600 dark:text-gray-400">No users found not in groups.</p>
            )}
          </div>
        </div>
      )}

      <Modal show={showAddUserModal} onClose={() => setShowAddUserModal(false)} popup size="md">
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">Select Group to Add User</h3>
            <Select value={selectedGroupId || ""} onChange={(e) => setSelectedGroupId(e.target.value)} className="mb-4">
              <option value="" disabled>
                Select a group
              </option>
              {groups.map((group) => (
                <option key={group._id} value={group._id}>
                  {group.name}
                </option>
              ))}
            </Select>
            <Button onClick={handleAddUserToGroup}>Proceed</Button>
          </div>
        </Modal.Body>
      </Modal>

      <Modal show={showConfirmModal} onClose={() => setShowConfirmModal(false)} popup size="md">
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto" />
            <h3 className="mb-5 text-lg text-gray-500 dark:text-gray-400">
              Are you sure you want to add this user "{filteredUsersNotInGroups.find((user) => user._id === selectedUserId)?.surveyUsername}" to the group "
              {groups.find((group) => group._id === selectedGroupId)?.name}"?
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="success" onClick={handleConfirmAddUser}>
                Yes, Add User
              </Button>
              <Button color="gray" onClick={() => setShowConfirmModal(false)}>
                No, Cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}
