import { Button, Modal, Table, TextInput } from 'flowbite-react';
import React, { useEffect, useState } from 'react';
import { AiOutlineSearch } from 'react-icons/ai'; // Import the search icon
import { HiOutlineExclamationCircle } from 'react-icons/hi';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

export default function DashUsers() {
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);
  const [users, setUsers] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userIdToDelete, setUserIdToDelete] = useState('');
  const [selectedUserSurveys, setSelectedUserSurveys] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showSurveyModal, setShowSurveyModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredUsers, setFilteredUsers] = useState([]);

  const formatDate = (dateString) => {
    const [month, day, year] = dateString.split('/');
    return `${day.padStart(2, '0')}/${month.padStart(2, '0')}/${year}`;
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        let url = '/api/user/getusers';
        
        // For Group Admin, fetch users in the group
        if (currentUser.role === 'Group Admin') {
          url = `/api/user/getusersingroup?groupId=${currentUser.groupId}`;
        }
        
        const res = await fetch(url);
        const data = await res.json();
        if (res.ok) {
          setUsers(data.users || data);
          setFilteredUsers(data.users || data);
          if (data.users && data.users.length < 9) {
            setShowMore(false);
          }
        } else {
          console.log(data.message);
        }
      } catch (error) {
        console.log(error.message);
      }
    };

    fetchUsers();
  }, [currentUser]);

  useEffect(() => {
    if (searchQuery) {
      setFilteredUsers(
        users.filter(user =>
          user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.email.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    } else {
      setFilteredUsers(users);
    }
  }, [searchQuery, users]);

  const handleShowMore = async () => {
    try {
      let url = `/api/user/getusers?startIndex=${users.length}`;
      
      // For Group Admin, fetch more users in the group
      if (currentUser.role === 'Group Admin') {
        url = `/api/user/getusersingroup?groupId=${currentUser.groupId}&startIndex=${users.length}`;
      }
      
      const res = await fetch(url);
      const data = await res.json();
      if (res.ok) {
        setUsers(prev => [...prev, ...(data.users || data)]);
        setFilteredUsers(prev => [...prev, ...(data.users || data)]);
        if (data.users && data.users.length < 9) {
          setShowMore(false);
        }
      } else {
        console.log(data.message);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleDeleteUser = async () => {
    try {
      const res = await fetch(`/api/user/delete/${userIdToDelete}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (res.ok) {
        setUsers(prev => prev.filter(user => user._id !== userIdToDelete));
        setFilteredUsers(prev => prev.filter(user => user._id !== userIdToDelete));
        setShowDeleteModal(false);
      } else {
        console.log(data.message);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleUserClick = async (userId) => {
    try {
      const res = await fetch(`/api/survey/getSurveys?userId=${userId}`);
      const data = await res.json();
      if (res.ok) {
        setSelectedUserSurveys(data.surveys);
        setSelectedUser(users.find(user => user._id === userId)); // Set selected user
        setShowSurveyModal(true);
      } else {
        console.log(data.message);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleViewClick = (survey) => {
    navigate('/survey-details', { state: { survey } });
  };

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
      {(currentUser.role === 'Admin' || currentUser.role === 'Group Admin') ? (
        users.length > 0 ? (
          <>
            <Table hoverable className='shadow-md'>
              <Table.Head>
                <Table.HeadCell>Date Created</Table.HeadCell>
                <Table.HeadCell>Group Name</Table.HeadCell>
                <Table.HeadCell>Username</Table.HeadCell>
                <Table.HeadCell>Email</Table.HeadCell>
                <Table.HeadCell>User Role</Table.HeadCell>
                <Table.HeadCell>View Surveys</Table.HeadCell>
                <Table.HeadCell>Delete</Table.HeadCell>
              </Table.Head>
              <Table.Body className='divide-y'>
                {filteredUsers.map((user) => (
                  <Table.Row key={user._id} className='bg-white dark:border-gray-700 dark:bg-gray-800'>
                    <Table.Cell>
                      {formatDate(new Date(user.createdAt).toLocaleDateString())}
                    </Table.Cell>
                    <Table.Cell>{user.group ? user.group.name : 'N/A'}</Table.Cell>
                    <Table.Cell>{user.username}</Table.Cell>
                    <Table.Cell>{user.email}</Table.Cell>
                    <Table.Cell>{user.role}</Table.Cell>
                    <Table.Cell>
                      <Button onClick={() => handleUserClick(user._id)}>
                        View Surveys
                      </Button>
                    </Table.Cell>
                    {currentUser.role === 'Admin' && (
                      <Table.Cell>
                        <span
                          onClick={() => {
                            setShowDeleteModal(true);
                            setUserIdToDelete(user._id);
                          }}
                          className='font-medium text-red-500 hover:underline cursor-pointer'
                        >
                          Delete
                        </span>
                      </Table.Cell>
                    )}
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
          <p>No users found!</p>
        )
      ) : (
        <p>Access denied. You do not have permission to view users.</p>
      )}

      <Modal
        show={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
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
              <Button color='gray' onClick={() => setShowDeleteModal(false)}>
                No, cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>

      <Modal
        show={showSurveyModal}
        onClose={() => setShowSurveyModal(false)}
        popup
        size='md'
      >
        <Modal.Header />
        <Modal.Body>
          <div className='text-center'>
            <h3 className='mb-5 text-lg text-gray-500 dark:text-gray-400'>
              Surveys taken by {selectedUser?.username}
            </h3>
            {selectedUserSurveys.length > 0 ? (
              <ul>
                {selectedUserSurveys.map((survey) => (
                  <li key={survey._id}>
                    <Button onClick={() => handleViewClick(survey)}>
                      {survey.title}
                    </Button>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No surveys found for this user.</p>
            )}
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}
