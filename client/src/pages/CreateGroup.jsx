import { Button, Label, TextInput, Textarea } from 'flowbite-react';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

export default function CreateGroup() {
  const { currentUser } = useSelector(state => state.user);
  const [formData, setFormData] = useState({ name: '', description: '' });
  const [publishError, setPublishError] = useState(null);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (currentUser) {
      if (currentUser.role !== 'Admin' && currentUser.role !== 'Group Admin') {
        navigate('/');
      }
      setLoading(false);
    }
  }, [currentUser, navigate]);

  if (loading) {
    return <div>Loading...</div>; // or any other loading indicator
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch('/api/group/createGroup', {  
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData), // Send only name and description
      });

      const data = await res.json();

      if (!res.ok) {
        setPublishError(data.message);
        return;
      }

      setPublishError(null);
      navigate('/dashboard?tab=groups'); // Navigate to the dashboard with 'groups' tab active
    } catch (error) {
      console.log(error.message);
      setPublishError('Something went wrong. Please try again.');
    }
  };

  return (
    <div className='p-3 max-w-3xl mx-auto min-h-screen'>
      <h1 className='text-center text-3xl my-7 font-semibold'>Create a Group</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <Label htmlFor='name' value='Group Name' className='mt-4 flex' />
          <TextInput
            type="text"
            id="name"
            placeholder='Enter group name'
            required
            className='flex-1'
            autoComplete='off'
            value={formData.name}
            onChange={(e) => setFormData({
              ...formData, name: e.target.value
            })}
          />
        </div>
        <div>
          <Label htmlFor='description' value='Group Description' className='mt-4 flex' />
          <Textarea
            id="description"
            placeholder='Describe your group'
            required
            className='flex-1'
            autoComplete='off'
            value={formData.description}
            onChange={(e) => setFormData({
              ...formData, description: e.target.value
            })}
          />
        </div>
        {publishError && <Alert color='failure' className='mt-4'>{publishError}</Alert>}
        <Button type="submit" gradientDuoTone='purpleToBlue' className='mt-10 w-full'>
          Create Group
        </Button>
      </form>
    </div>
  );
}
