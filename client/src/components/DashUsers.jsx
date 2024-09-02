import { Button, Modal, Select, Table } from 'flowbite-react';
import React, { useEffect, useState } from 'react';
import { HiOutlineExclamationCircle } from 'react-icons/hi';
import { useSelector } from 'react-redux';

export default function DashUsers() {

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

  const { currentUser } = useSelector((state) => state.user);
  const [users, setUsers] = useState([]);
  const [groups, setGroups] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [userIdToDelete, setUserIdToDelete] = useState('');
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [userIdToEdit, setUserIdToEdit] = useState('');
  const [newRole, setNewRole] = useState('normalUser');
  const [selectedGroup, setSelectedGroup] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch(`${API_URL}/api/user/getUsers`);
        if (res.ok) {
          const data = await res.json();
          if (data && Array.isArray(data.users)) {
            setUsers(data.users);
            setShowMore(data.users.length >= 9);
          } else {
            console.error('Unexpected response format for users:', data);
          }
        } else {
          console.error('Failed to fetch users:', await res.text());
        }
      } catch (error) {
        console.error('Error fetching users:', error.message);
      }
    };

    const fetchGroups = async () => {
      try {
        const res = await fetch(`${API_URL}/api/group/allGroup`);
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data)) {
            setGroups(data);
          } else {
            console.error('Unexpected response format for groups:', data);
          }
        } else {
          console.error('Failed to fetch groups:', await res.text());
        }
      } catch (error) {
        console.error('Error fetching groups:', error.message);
      }
    };

    if (currentUser.role === 'Admin') {
      fetchUsers();
      fetchGroups();
    }
  }, [currentUser.role]);

  const handleShowMore = async () => {
    const startIndex = users.length;
    try {
      const res = await fetch(`${API_URL}/api/user/getUsers?startIndex=${startIndex}`);
      if (res.ok) {
        const data = await res.json();
        if (data && Array.isArray(data.users)) {
          setUsers((prev) => [...prev, ...data.users]);
          setShowMore(data.users.length >= 9);
        } else {
          console.error('Unexpected response format for more users:', data);
        }
      } else {
        console.error('Failed to fetch more users:', await res.text());
      }
    } catch (error) {
      console.error('Error fetching more users:', error.message);
    }
  };

  const handleDeleteUser = async () => {
    try {
      const res = await fetch(`${API_URL}/api/user/delete/${userIdToDelete}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setUsers((prev) => prev.filter((user) => user._id !== userIdToDelete));
        setShowModal(false);
      } else {
        console.error('Failed to delete user:', await res.text());
      }
    } catch (error) {
      console.error('Error deleting user:', error.message);
    }
  };

  const handleOpenRoleModal = (userId, currentRole) => {
    setUserIdToEdit(userId);
    setNewRole(currentRole);
    setSelectedGroup(''); // Reset the selected group
    setShowRoleModal(true);
  };

  const handleAssignRole = async () => {
    try {
      const res = await fetch(`${API_URL}/api/user/assignRole`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: userIdToEdit,
          role: newRole,
          groupId: selectedGroup,
        }),
      });
      if (res.ok) {
        setUsers((prev) =>
          prev.map((user) =>
            user._id === userIdToEdit ? { ...user, role: newRole } : user
          )
        );
        setShowRoleModal(false);
      } else {
        console.error('Failed to assign role:', await res.text());
      }
    } catch (error) {
      console.error('Error assigning role:', error.message);
    }
  };

  return (
    <div className='table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500'>
      {currentUser.role === 'Admin' && users.length > 0 ? (
        <>
          <Table hoverable className='shadow-md'>
            <Table.Head>
              <Table.HeadCell>Date created</Table.HeadCell>
              <Table.HeadCell>User image</Table.HeadCell>
              <Table.HeadCell>Username</Table.HeadCell>
              <Table.HeadCell>Email</Table.HeadCell>
              <Table.HeadCell>User Role</Table.HeadCell>
              <Table.HeadCell colSpan={2} className='text-center'>
                Actions
              </Table.HeadCell>
            </Table.Head>
            <Table.Body className='divide-y'>
              {users.map((user) => (
                <Table.Row key={user._id} className='bg-white dark:border-gray-700 dark:bg-gray-800'>
                  <Table.Cell>{new Date(user.createdAt).toLocaleDateString()}</Table.Cell>
                  <Table.Cell>
                    <img
                      src={user.profilePicture}
                      alt={user.username}
                      className='w-10 h-10 object-cover bg-gray-500 rounded-full'
                    />
                  </Table.Cell>
                  <Table.Cell>{user.username}</Table.Cell>
                  <Table.Cell>{user.email}</Table.Cell>
                  <Table.Cell className={
                      user.role === 'Admin' ? 'text-red-500' :
                      user.role === 'Group Admin' ? 'text-teal-500' :
                      user.role === 'normalUser' ? 'text-blue-500' :
                      'text-gray-500'
                    }
                  >
                    {user.role === 'normalUser' ? 'User' : user.role}
                  </Table.Cell>
                  <Table.Cell colSpan={2} className='flex justify-center gap-4'>
                    <span
                      onClick={() => handleOpenRoleModal(user._id, user.role)}
                      className='font-medium text-green-500 hover:underline cursor-pointer'
                    >
                      Change Role
                    </span>
                    <span
                      onClick={() => {
                        setShowModal(true);
                        setUserIdToDelete(user._id);
                      }}
                      className='font-medium text-red-500 hover:underline cursor-pointer'
                    >
                      Delete
                    </span>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
          {showMore && (
            <button
              onClick={handleShowMore}
              className='w-full text-teal-500 self-center text-sm py-7'
            >
              Show more
            </button>
          )}
        </>
      ) : (
        <p>You have no users yet!</p>
      )}

      {/* Delete User Modal */}
      <Modal
        show={showModal}
        onClose={() => setShowModal(false)}
        popup
        size='md'
      >
        <Modal.Header />
        <Modal.Body>
          <div className='text-center'>
            <HiOutlineExclamationCircle className='h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto' />
            <h3 className='mb-5 text-lg text-gray-500 dark:text-gray-400'>
              Are you sure you want to delete this user?
            </h3>
            <div className='flex justify-center gap-4'>
              <Button color='failure' onClick={handleDeleteUser}>
                Yes, I'm sure
              </Button>
              <Button color='gray' onClick={() => setShowModal(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>

      {/* Change Role Modal */}
      <Modal
        show={showRoleModal}
        onClose={() => setShowRoleModal(false)}
        popup
        size='md'
      >
        <Modal.Header />
        <Modal.Body>
          <div className='text-center'>
            <h3 className='mb-5 text-lg text-gray-500 dark:text-gray-400'>
              Assign a new role to the user
            </h3>
            <Select
              value={newRole}
              onChange={(e) => setNewRole(e.target.value)}
              className='mb-4'
            >
              <option value='normalUser'>User</option>
              <option value='Group Admin'>Group Admin</option>
              <option value='Admin'>Admin</option>
            </Select>
            {newRole === 'Group Admin' && (
              <Select
                value={selectedGroup}
                onChange={(e) => setSelectedGroup(e.target.value)}
                className='mb-4'
              >
                <option value=''>Select Group</option>
                {groups.length > 0 ? (
                  groups.map((group) => (
                    <option key={group._id} value={group._id}>
                      {group.name}
                    </option>
                  ))
                ) : (
                  <option value=''>No Groups Available</option>
                )}
              </Select>
            )}
            <div className='flex justify-center gap-4'>
              <Button color='success' onClick={handleAssignRole}>
                Assign Role
              </Button>
              <Button color='gray' onClick={() => setShowRoleModal(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}
