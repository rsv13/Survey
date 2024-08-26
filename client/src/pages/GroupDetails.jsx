// GroupDetails.jsx
import { Button, Label, ListGroup, TextInput } from 'flowbite-react';
import React from 'react';
import { useLocation } from 'react-router-dom';

export default function GroupDetails() {
  const location = useLocation();
  const { group } = location.state || {};

  // Check if group data is present
  if (!group) {
    return <p>No group data available.</p>;
  }

  // Destructure group data with default values
  const { name = 'N/A', description = 'N/A', createdAt = '', admins = [], members = [] } = group;

  return (
    <div className='min-h-screen flex justify-center items-center bg-gray-100 dark:bg-gray-800'>
      <div className='max-w-4xl w-full p-8 bg-white dark:bg-gray-700 shadow-lg rounded-lg'>
        <h1 className='text-3xl font-semibold text-center text-gray-800 dark:text-gray-200 mb-6'>Group Details</h1>
        <div className='space-y-6'>
          <div>
            <Label htmlFor='groupName' value='Group Name' />
            <TextInput id='groupName' value={name} readOnly disabled />
          </div>
          <div>
            <Label htmlFor='description' value='Description' />
            <TextInput id='description' value={description} readOnly disabled />
          </div>
          <div>
            <Label htmlFor='createdAt' value='Created At' />
            <TextInput id='createdAt' value={new Date(createdAt).toLocaleDateString()} readOnly disabled />
          </div>
          <div>
            <h2 className='text-lg font-semibold text-gray-800 dark:text-gray-200'>Admins</h2>
            <ListGroup className='max-h-40 overflow-y-auto'>
              {admins.length > 0 ? (
                admins.map((admin) => (
                  <ListGroup.Item key={admin._id}>
                    {admin.username || admin.email}
                  </ListGroup.Item>
                ))
              ) : (
                <ListGroup.Item>No admins found.</ListGroup.Item>
              )}
            </ListGroup>
          </div>
          <div>
            <h2 className='text-lg font-semibold text-gray-800 dark:text-gray-200'>Members</h2>
            <ListGroup className='max-h-40 overflow-y-auto'>
              {members.length > 0 ? (
                members.map((member) => (
                  <ListGroup.Item key={member._id}>
                    {member.username || member.email}
                  </ListGroup.Item>
                ))
              ) : (
                <ListGroup.Item>No members found.</ListGroup.Item>
              )}
            </ListGroup>
          </div>
          <div className='flex justify-end'>
            <Button gradientMonochrome="info" onClick={() => window.history.back()}>
              Back to Groups
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
