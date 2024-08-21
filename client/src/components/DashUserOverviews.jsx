import { Button, Modal, Table, TextInput } from 'flowbite-react';
import React, { useEffect, useState } from 'react';
import { AiOutlineSearch } from 'react-icons/ai'; // Import the search icon
import { HiOutlineExclamationCircle } from 'react-icons/hi';
import { useNavigate } from 'react-router-dom';

export default function DashUserOverview() {
  const [usersInGroups, setUsersInGroups] = useState([]);
  const [usersNotInGroups, setUsersNotInGroups] = useState([]);
  const [filteredUsersInGroups, setFilteredUsersInGroups] = useState([]);
  const [filteredUsersNotInGroups, setFilteredUsersNotInGroups] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [searchQuery, setSearchQuery] = useState(''); // State for search query
  const navigate = useNavigate();

  // Fetch users data from the server
  const fetchUsersData = async () => {
    try {
      const res = await fetch('/api/user/users-grouped-and-ungrouped', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!res.ok) {
        throw new Error('Failed to fetch users data');
      }

      const data = await res.json();
      setUsersInGroups(data.usersInGroups || []);
      setUsersNotInGroups(data.usersNotInGroups || []);
    } catch (error) {
      console.error('Error fetching users data:', error.message);
    }
  };

  // Filter users based on search query
  useEffect(() => {
    const query = searchQuery.toLowerCase();

    const filteredInGroups = usersInGroups.filter(user =>
      (user.surveyUsername || '').toLowerCase().includes(query) ||
      (user.email || '').toLowerCase().includes(query) ||
      (user.groupId?.name || '').toLowerCase().includes(query)
    );

    const filteredNotInGroups = usersNotInGroups.filter(user =>
      (user.surveyUsername || '').toLowerCase().includes(query) ||
      (user.email || '').toLowerCase().includes(query)
    );

    setFilteredUsersInGroups(filteredInGroups);
    setFilteredUsersNotInGroups(filteredNotInGroups);
  }, [searchQuery, usersInGroups, usersNotInGroups]);

  // Handle delete button click
  const handleDeleteClick = (userId) => {
    setSelectedUserId(userId);
    setShowModal(true);
  };

  // Handle user deletion
  const handleDelete = async () => {
    setShowModal(false);

    try {
      const res = await fetch(`/api/users/${selectedUserId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!res.ok) {
        throw new Error('Failed to delete user');
      }

      setUsersInGroups(prev => prev.filter(user => user._id !== selectedUserId));
      setUsersNotInGroups(prev => prev.filter(user => user._id !== selectedUserId));
      setFilteredUsersInGroups(prev => prev.filter(user => user._id !== selectedUserId));
      setFilteredUsersNotInGroups(prev => prev.filter(user => user._id !== selectedUserId));
    } catch (error) {
      console.error('Error deleting user:', error.message);
    } finally {
      setSelectedUserId(null);
    }
  };

  useEffect(() => {
    fetchUsersData();
  }, []);

  return (
    <div className='p-6 bg-gray-100 dark:bg-gray-900 min-h-screen flex flex-col items-center'>
      <div className='w-full max-w-6xl bg-white dark:bg-gray-800 p-6 shadow-lg rounded-lg'>
        <div className='mb-6'>
          <TextInput
            type='text'
            placeholder='Search by group name, username, or email'
            rightIcon={AiOutlineSearch}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className='w-full max-w-md border-gray-300 dark:border-gray-700'
          />
        </div>

        <div className='mb-8'>
          <h2 className='text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4'>
            Users in Groups
          </h2>
          {filteredUsersInGroups.length > 0 ? (
            <Table hoverable className='shadow-md bg-white dark:bg-gray-800'>
              <Table.Head>
                <Table.HeadCell>Created At</Table.HeadCell>
                <Table.HeadCell>Username</Table.HeadCell>
                <Table.HeadCell>Email</Table.HeadCell>
                <Table.HeadCell>Group Name</Table.HeadCell>
                <Table.HeadCell>Group Description</Table.HeadCell>
                <Table.HeadCell>Actions</Table.HeadCell>
              </Table.Head>
              <Table.Body className='divide-y divide-gray-200 dark:divide-gray-700'>
                {filteredUsersInGroups.map(user => (
                  <Table.Row
                    key={user._id}
                    className='bg-gray-50 dark:bg-gray-900'
                  >
                    <Table.Cell>{new Date(user.createdAt).toLocaleDateString()}</Table.Cell>
                    <Table.Cell>{user.surveyUsername || 'N/A'}</Table.Cell>
                    <Table.Cell>{user.email || 'N/A'}</Table.Cell>
                    <Table.Cell>{user.groupId?.name || 'No Group'}</Table.Cell>
                    <Table.Cell>{user.groupId?.description || 'No Description'}</Table.Cell>
                    <Table.Cell>
                      <Button
                        onClick={() => handleDeleteClick(user._id)}
                        color='failure'
                        size='sm'
                      >
                        Delete
                      </Button>
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
          ) : (
            <p className='text-gray-600 dark:text-gray-400'>No users found in groups.</p>
          )}
        </div>

        <div>
          <h2 className='text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4'>
            Users Not in Groups
          </h2>
          {filteredUsersNotInGroups.length > 0 ? (
            <Table hoverable className='shadow-md bg-white dark:bg-gray-800'>
              <Table.Head>
                <Table.HeadCell>Created At</Table.HeadCell>
                <Table.HeadCell>Username</Table.HeadCell>
                <Table.HeadCell>Email</Table.HeadCell>
                <Table.HeadCell>Actions</Table.HeadCell>
              </Table.Head>
              <Table.Body className='divide-y divide-gray-200 dark:divide-gray-700'>
                {filteredUsersNotInGroups.map(user => (
                  <Table.Row
                    key={user._id}
                    className='bg-gray-50 dark:bg-gray-900'
                  >
                    <Table.Cell>{new Date(user.createdAt).toLocaleDateString()}</Table.Cell>
                    <Table.Cell>{user.surveyUsername || 'N/A'}</Table.Cell>
                    <Table.Cell>{user.email || 'N/A'}</Table.Cell>
                    <Table.Cell>
                      <Button
                        onClick={() => handleDeleteClick(user._id)}
                        color='failure'
                        size='sm'
                      >
                        Delete
                      </Button>
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
          ) : (
            <p className='text-gray-600 dark:text-gray-400'>No users found not in groups.</p>
          )}
        </div>
      </div>

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
              <Button color='failure' onClick={handleDelete}>
                Yes, I'm sure
              </Button>
              <Button color='gray' onClick={() => setShowModal(false)}>
                No, cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}
