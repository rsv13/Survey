import { Alert, Button, Label, Select, Spinner, TextInput, Textarea } from 'flowbite-react';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import OAuth from '../components/OAuth';

export default function SignUp() {
  const [formData, setFormData] = useState({});
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [groups, setGroups] = useState([]);
  const [role, setRole] = useState('normalUser'); // Default to normalUser
  const [groupName, setGroupName] = useState('');
  const [groupDescription, setGroupDescription] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    // Fetch available groups on component mount
    const fetchGroups = async () => {
      try {
        const response = await fetch('/api/group/allGroup');
        const data = await response.json();
        if (response.ok) {
          setGroups(data.groups);
        } else {
          setErrorMessage(data.message);
        }
      } catch (error) {
        setErrorMessage('Failed to fetch groups');
      }
    };

    fetchGroups();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
  };

  const handleRoleChange = (e) => {
    setRole(e.target.value);
    if (e.target.value === 'normalUser') {
      setGroupName('');
      setGroupDescription('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate required fields based on role
    if (role === 'normalUser') {
      if (!formData.username || !formData.email || !formData.password) {
        return setErrorMessage('Please fill out all fields');
      }
    } else if (role === 'Group Admin') {
      if (!groupName || !groupDescription || !formData.username || !formData.email || !formData.password) {
        return setErrorMessage('Please fill out all fields');
      }
    }

    try {
      setLoading(true);
      setErrorMessage(null);

      // Prepare payload for the API request
      const payload = {
        ...formData,
        role,
        groupName: role === 'Group Admin' ? groupName : undefined,
        groupDescription: role === 'Group Admin' ? groupDescription : undefined,
        groupId: role === 'normalUser' ? formData.groupId || null : undefined // Send groupId only for normal users
      };

      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      setLoading(false);

      if (res.ok) {
        setErrorMessage(null);
        alert(data.message); // Show success message

        navigate('/sign-in'); // Redirect to sign-in page
      } else {
        setErrorMessage(data.message);
      }
    } catch (error) {
      setErrorMessage(error.message);
      setLoading(false);
    }
  };

  return (
    <div className='min-h-screen flex justify-center items-center bg-gray-100 dark:bg-gray-800'>
      <div className='max-w-4xl w-full p-8 bg-white dark:bg-gray-700 shadow-lg rounded-lg'>
        {/* Header */}
        <div className='text-center mb-8'>
          <Link to='/' className='font-bold text-4xl dark:text-white'>
            <span className='px-2 py-1 bg-red-700 rounded-lg text-white'>
              SWSWBS
            </span>
            <span className='ml-2 text-gray-800 dark:text-gray-200'>Survey</span>
          </Link>
        </div>

        <div className='text-lg leading-relaxed text-gray-700 dark:text-gray-300 text-center'>
          <p className='mb-4'>
            We invite you to participate in our insightful survey designed with the 
            <span className='font-bold text-indigo-600 dark:text-indigo-400'> South Wales Social Well-being Scale (SWSWBS)</span> 
            to uncover the multifaceted aspects of social well-being.
          </p>
          <p className='mb-4'>
            Your valuable input will help shape and enhance health policies and practices, ensuring they comprehensively address the physical, mental, and social dimensions of well-being.
          </p>
          <p className='mb-4'>
            Join us in making a meaningful impact on our community's quality of life. 
            <span className='font-bold text-purple-600 dark:text-purple-400'> Sign up now </span> 
            to take the survey and be a part of this important initiative!
          </p>
        </div>

        <div className='text-center'>
          <form className='inline-block w-full max-w-md mx-auto' onSubmit={handleSubmit}>
            {/* Role Selection */}
            <div className='mb-4'>
              <Label htmlFor='role' value='Select Role' />
              <Select id='role' onChange={handleRoleChange} value={role}>
                <option value='normalUser'>Normal User</option>
                <option value='Group Admin'>Group Admin</option>
              </Select>
            </div>

            {/* Conditional Rendering for Group Admin */}
            {role === 'Group Admin' && (
              <>
                <div className='mb-4'>
                  <Label htmlFor='groupName' value='Group Name' /><span className='text-red-500'>*</span>
                  <TextInput type='text' placeholder='Enter group name' id='groupName' className='w-full' onChange={(e) => setGroupName(e.target.value.trim())} />
                </div>
                <div className='mb-4'>
                  <Label htmlFor='groupDescription' value='Group Description' /><span className='text-red-500'>*</span>
                  <Textarea placeholder='Describe your group' id='groupDescription' className='w-full' onChange={(e) => setGroupDescription(e.target.value.trim())} />
                </div>
              </>
            )}

            {/* Conditional Rendering for Both Roles */}
            {(role === 'normalUser' || role === 'Group Admin') && (
              <>
                <div className='mb-4'>
                  <Label htmlFor='username' value='Your username' /><span className='text-red-500'>*</span>
                  <TextInput type='text' placeholder='username' id='username' className='w-full' onChange={handleChange} />
                </div>
                <div className='mb-4'>
                  <Label htmlFor='email' value='Email' /><span className='text-red-500'>*</span>
                  <TextInput type='email' placeholder='name@company.com' id='email' className='w-full' onChange={handleChange} />
                </div>
                <div className='mb-4'>
                  <Label htmlFor='password' value='Password' /><span className='text-red-500'>*</span>
                  <TextInput type='password' placeholder='********' id='password' className='w-full' onChange={handleChange} />
                </div>
                {role === 'normalUser' && (
                  <div className='mb-4'>
                    <Label htmlFor='groupId' value='Select Group (Optional)' />
                    <Select id='groupId' onChange={handleChange} value={formData.groupId || ''}>
                      <option value=''>Select a group (optional)</option>
                      {groups.map((g) => (
                        <option key={g._id} value={g._id}>
                          {g.name}
                        </option>
                      ))}
                    </Select>
                  </div>
                )}
              </>
            )}

            <Button className='w-full mt-4 bg-red-700' type='submit' disabled={loading} outline>
              {loading ? (
                <>
                  <Spinner size='sm' />
                  <span className='p-3'> Loading... </span>
                </>
              ) : (
                'Sign Up'
              )}
            </Button>
            <OAuth />
          </form>
          <div className='mt-4'>
            <span>Have an account? 
              <Link to='/sign-in' className='font-bold text-purple-600 dark:text-purple-400 ml-1'> Sign In</Link>
            </span>
          </div>
          {errorMessage && (
            <Alert className='mt-4' color='failure'>
              {errorMessage}
            </Alert>
          )}
        </div>
      </div>
    </div>
  );
}
