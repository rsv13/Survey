import { Button, Label, ListGroup, TextInput } from 'flowbite-react';
import React from 'react';
import { useLocation } from 'react-router-dom';

export default function GroupDetails() {
  const location = useLocation();
  
  // Destructure the group from location.state
  const { group } = location.state || {};

  // Check if group data is present
  if (!group) {
    return <p>No group data available.</p>;
  }

  // Destructure group data with default values
  const { name = 'N/A', description = 'N/A', createdAt = '', members = [] } = group;

  return (
    <div className='min-h-screen flex justify-center items-center bg-gray-100 dark:bg-gray-800'>
      <div className='max-w-4xl w-full p-8 bg-white dark:bg-gray-700 shadow-lg rounded-lg'>
        <h1 className='text-3xl font-semibold text-center text-gray-800 dark:text-gray-200 mb-6'>Group Details</h1>
        <div className='space-y-6'>
          <div>
            <Label htmlFor='groupName' value='Group Name' />
            <TextInput
              id='groupName'
              value={name}
              readOnly
              disabled
            />
          </div>
          <div>
            <Label htmlFor='description' value='Description' />
            <TextInput
              id='description'
              value={description}
              readOnly
              disabled
            />
          </div>
          <div>
            <Label htmlFor='createdAt' value='Created At' />
            <TextInput
              id='createdAt'
              value={createdAt ? new Date(createdAt).toLocaleDateString() : 'N/A'}
              readOnly
              disabled
            />
          </div>
          <div>
            <Label htmlFor='members' value='Number of Members' />
            <TextInput
              id='members'
              value={members.length || 0}
              readOnly
              disabled
            />
          </div>
          <div>
            <Label htmlFor='memberList' value='Members' />
            <ListGroup>
              {members.length > 0 ? (
                members.map(member => (
                  <ListGroup.Item key={member._id} className='flex items-center'>
                    <img src={member.profilePicture} alt={member.username} className='w-10 h-10 rounded-full mr-4' />
                    <div>
                      <div className='font-medium'>{member.username}</div>
                      <div className='text-sm text-gray-500'>{member.email}</div>
                    </div>
                  </ListGroup.Item>
                ))
              ) : (
                <p>No members</p>
              )}
            </ListGroup>
          </div>
          <Button className='w-full mt-4' onClick={() => window.history.back()}>
            Go Back
          </Button>
        </div>
      </div>
    </div>
  );
}
