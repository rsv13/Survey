import { Alert, Button, Label, Spinner, TextInput } from 'flowbite-react';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import OAuth from '../components/OAuth';

export default function SignUp() {

  const [formData, setFormData] = useState({});
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();


  const handleChange = (e) => {
    setFormData({...formData, [e.target.id]: e.target.value.trim() })
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(!formData.username  || !formData.email || !formData.password) {
      return setErrorMessage('Please fill out all fields');
    }
    try {
      setLoading(true);
      setErrorMessage(null);
      const res = await fetch('/api/auth/signup', {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      setLoading(false);
      if(res.ok) {
        setErrorMessage(null);
        alert(data.message); // Show success message
        navigate('/sign-in'); // Redirect to sign-in page
      } else {
        setErrorMessage(data.message);
      }
    } catch (error){
      setErrorMessage(error.message);
      setLoading(false);
    }
  }

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
            <div className='mb-4'>
              <Label htmlFor='username' value="Your username" /><span className="text-red-500">*</span>
              <TextInput type='text' placeholder='username' id='username' className='w-full' onChange={handleChange}/>
            </div>
            <div className='mb-4'>
              <Label htmlFor='email' value="Email" /><span className="text-red-500">*</span>
              <TextInput type='email' placeholder='name@company.com' id='email' className='w-full' onChange={handleChange}/>
            </div>
            <div className='mb-4'>
              <Label htmlFor='password' value="Password" /><span className="text-red-500">*</span>
              <TextInput type='password' placeholder='********' id='password' className='w-full' onChange={handleChange}/>
            </div>
            <Button className='w-full mt-4 bg-red-700' type='submit' disabled={loading} outline>
              {
                loading ? (
                  <>
                  <Spinner size='sm' />
                    <span className='p-3'> Loading... </span>
                  </>
                  ) : (  'Sign Up' )
              }
            </Button>
            <OAuth />
          </form>
          <div className='mt-4'>
            <span>Have an account? 
              <Link to='/sign-in' className='font-bold text-purple-600 dark:text-purple-400 ml-1'> Sign In</Link>
            </span>
          </div>
          { errorMessage && ( 
            <Alert className='mt-4' color='failure'>
              {errorMessage}
              </Alert>
          )}
        </div>
      </div>
    </div>
  );
}
