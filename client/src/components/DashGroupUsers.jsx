import { Button, Modal, Table, TextInput } from 'flowbite-react';
import React, { useEffect, useState } from 'react';
import { AiOutlineSearch } from 'react-icons/ai';
import { HiOutlineExclamationCircle } from 'react-icons/hi';
import { useSelector } from 'react-redux';

export default function DashGroupUsers() {
  const { currentUser } = useSelector((state) => state.user); // Access currentUser from Redux
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userIdToDelete, setUserIdToDelete] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Extract groupId from currentUser
  const groupId = currentUser?.groupId;

  useEffect(() => {
    // Debugging log
    console.log('Group ID:', groupId);
    console.log('Current User:', currentUser);

    const fetchUsers = async () => {
      if (!currentUser || !groupId) {
        console.log('No currentUser or groupId'); // Debugging
        return;
      }

      try {
        const res = await fetch(`/api/group/${groupId}/users`, {
          headers: {
            'Authorization': `Bearer ${currentUser.token}`, // Include token in headers
          },
        });

        if (!res.ok) {
          const errorText = await res.text();
          console.error('Failed to fetch users:', errorText);
          return;
        }

        const data = await res.json();
        console.log('Fetched users:', data); // Debugging
        setUsers(data); // Adjust based on response structure
        setFilteredUsers(data);
      } catch (error) {
        console.error('Error fetching users:', error.message);
      }
    };

    fetchUsers();
  }, [currentUser, groupId]); // Depend on currentUser and groupId

  useEffect(() => {
    if (searchQuery) {
      setFilteredUsers(
        users.filter(user =>
          user.surveyUsername.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    } else {
      setFilteredUsers(users);
    }
  }, [searchQuery, users]);

  const handleDeleteUser = async () => {
    try {
      const res = await fetch(`/api/group/${groupId}/users/${userIdToDelete}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${currentUser.token}`, // Include token in headers
        },
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error('Failed to delete user:', errorText);
        return;
      }

      const data = await res.json();
      console.log('Delete response data:', data); // Debugging
      setUsers(prev => prev.filter(user => user._id !== userIdToDelete));
      setFilteredUsers(prev => prev.filter(user => user._id !== userIdToDelete));
      setShowDeleteModal(false);
    } catch (error) {
      console.error('Error deleting user:', error.message);
    }
  };

  if (!currentUser) return <div>Loading...</div>; // Handle loading state

  if (currentUser.role !== 'Admin' && currentUser.role !== 'Group Admin') {
    return <div>Access Denied</div>; // Handle access denial
  }

  return (
    <div className='p-3'>
      <div className='flex items-center mb-4'>
        <TextInput
          type='text'
          placeholder='Search users...'
          rightIcon={AiOutlineSearch}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className='w-full max-w-md'
        />
      </div>
      {filteredUsers.length > 0 ? (
        <Table hoverable className='shadow-md'>
          <Table.Head>
            <Table.HeadCell>Created At</Table.HeadCell>
            <Table.HeadCell>Survey Username</Table.HeadCell>
            <Table.HeadCell>Email</Table.HeadCell>
            {currentUser.role === 'Group Admin' && <Table.HeadCell>Actions</Table.HeadCell>}
          </Table.Head>
          <Table.Body className='divide-y'>
            {filteredUsers.map((user) => (
              <Table.Row key={user._id} className='bg-white dark:border-gray-700 dark:bg-gray-800'>
                <Table.Cell>{new Date(user.createdAt).toLocaleDateString()}</Table.Cell>
                <Table.Cell>{user.surveyUsername || 'N/A'}</Table.Cell>
                <Table.Cell>{user.email || 'N/A'}</Table.Cell>
                {currentUser.role === 'Group Admin' && (
                  <Table.Cell>
                    <Button
                      onClick={() => {
                        setUserIdToDelete(user._id);
                        setShowDeleteModal(true);
                      }}
                      color='failure'
                    >
                      Delete
                    </Button>
                  </Table.Cell>
                )}
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      ) : (
        <div className='text-center mt-4'>
          <p>No users found!</p>
        </div>
      )}
      <Modal
        show={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        popup
        size='md'
      >
        <Modal.Header>Confirm Deletion</Modal.Header>
        <Modal.Body>
          <div className='text-center'>
            <HiOutlineExclamationCircle className='w-16 h-16 text-red-500 mx-auto' />
            <p>Are you sure you want to delete this user?</p>
            <div className='flex justify-center mt-4 gap-4'>
              <Button color='failure' onClick={handleDeleteUser}>
                Yes, delete
              </Button>
              <Button color='gray' onClick={() => setShowDeleteModal(false)}>
                No, cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}
