import { Button, Modal, Table, TextInput } from 'flowbite-react';
import React, { useEffect, useState } from 'react';
import { AiOutlineSearch } from 'react-icons/ai';
import { HiOutlineExclamationCircle } from 'react-icons/hi';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

export default function DashGroups() {
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);
  const [groups, setGroups] = useState([]);
  const [filteredGroups, setFilteredGroups] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [groupIdToDelete, setGroupIdToDelete] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch groups from the server
  useEffect(() => {
    const fetchGroups = async () => {
      try {
        let url = '/api/group/allGroup';
        if (currentUser.role === 'Group Admin') {
          url = '/api/group/group-admin/groups'; // URL for Group Admins
        }

        const res = await fetch(url, {
          headers: {
            'Authorization': `Bearer ${currentUser.token}`, // Include token in headers
          },
        });

        if (!res.ok) {
          const errorText = await res.text();
          console.error('Failed to fetch groups:', errorText);
          return;
        }

        const data = await res.json();

        // Set groups and filteredGroups state
        const groupsData = data.groups || data;
        setGroups(groupsData);
        setFilteredGroups(groupsData);
      } catch (error) {
        console.error('Error fetching groups:', error.message);
      }
    };

    fetchGroups();
  }, [currentUser]);

  // Filter groups based on search query
  useEffect(() => {
    if (searchQuery) {
      setFilteredGroups(
        groups.filter(group =>
          group.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    } else {
      setFilteredGroups(groups);
    }
  }, [searchQuery, groups]);

  // Handle group deletion
  const handleDeleteGroup = async () => {
    try {
      const res = await fetch(`/api/group/${groupIdToDelete}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${currentUser.token}`, // Include token in headers
        },
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error('Failed to delete group:', errorText);
        return;
      }

      const data = await res.json();
      console.log('Delete response data:', data);

      // Update state after deletion
      setGroups(prev => prev.filter(group => group._id !== groupIdToDelete));
      setFilteredGroups(prev => prev.filter(group => group._id !== groupIdToDelete));
      setShowDeleteModal(false);
    } catch (error) {
      console.error('Error deleting group:', error.message);
    }
  };

  // Handle view details button click
  const handleViewDetails = (groupId) => {
    navigate('/group-details', { state: { groupId } });
  };

  return (
    <div className='p-6 bg-gray-100 dark:bg-gray-900 min-h-screen'>
      <div className='container mx-auto bg-white dark:bg-gray-800 p-6 shadow-lg rounded-lg'>
        <div className='flex items-center mb-4'>
          <TextInput
            type='text'
            placeholder='Search groups...'
            rightIcon={AiOutlineSearch}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className='w-full max-w-md border-gray-300 dark:border-gray-700'
          />
        </div>

        {filteredGroups.length > 0 ? (
          <div className='overflow-x-auto'>
            <Table hoverable className='min-w-full bg-white dark:bg-gray-800'>
              <Table.Head>
                <Table.HeadCell>Created At</Table.HeadCell>
                <Table.HeadCell>Group Name</Table.HeadCell>
                <Table.HeadCell>Description</Table.HeadCell>
                <Table.HeadCell>No. of Users</Table.HeadCell>
                {(currentUser.role === 'Admin' || currentUser.role === 'Group Admin') && (
                  <Table.HeadCell>Actions</Table.HeadCell>
                )}
              </Table.Head>
              <Table.Body className='divide-y divide-gray-200 dark:divide-gray-700'>
                {filteredGroups.map((group) => (
                  <Table.Row key={group._id} className='bg-gray-50 dark:bg-gray-900'>
                    <Table.Cell>{new Date(group.createdAt).toLocaleDateString()}</Table.Cell>
                    <Table.Cell>{group.name || 'N/A'}</Table.Cell>
                    <Table.Cell>{group.description || 'N/A'}</Table.Cell>
                    <Table.Cell>{group.members.length || 0}</Table.Cell>
                    {(currentUser.role === 'Admin' || currentUser.role === 'Group Admin') && (
                      <Table.Cell>
                        <div className='flex space-x-2'>
                          <Button onClick={() => handleViewDetails(group._id)} color='light'>
                            View Details
                          </Button>
                          {currentUser.role === 'Admin' && (
                            <Button
                              onClick={() => {
                                setGroupIdToDelete(group._id);
                                setShowDeleteModal(true);
                              }}
                              color='failure'
                            >
                              Delete
                            </Button>
                          )}
                        </div>
                      </Table.Cell>
                    )}
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
          </div>
        ) : (
          <div className='text-center mt-4'>
            <p>No groups found!</p>
          </div>
        )}
      </div>

      <Modal
        show={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        popup
        size='md'
      >
        <Modal.Header>Confirm Deletion</Modal.Header>
        <Modal.Body>
          <div className='text-center'>
            <HiOutlineExclamationCircle className='w-16 h-16 text-red-500 mx-auto mb-4' />
            <p className='mb-4'>Are you sure you want to delete this group?</p>
            <div className='flex justify-center gap-4'>
              <Button color='failure' onClick={handleDeleteGroup}>
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
