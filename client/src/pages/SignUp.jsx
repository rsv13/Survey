import { Button, Label, TextInput } from 'flowbite-react';
import React from 'react';
import { Link } from 'react-router-dom';

export default function SignUp() {
  return (
    <div className='min-h-screen flex justify-center items-center bg-gray-100 dark:bg-gray-800'>
      <div className='max-w-4xl w-full p-8 bg-white shadow-lg rounded-lg'>
        {/* Header */}
        <div className='text-center mb-8'>
          <Link to='/' className='font-bold text-4xl dark:text-white'>
            <span className='px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white'>
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
            <span className='font-bold text-purple-600 dark:text-purple-400'> Sign up now</span> 
            to take the survey and be a part of this important initiative!
          </p>
        </div>

        <div className='text-center'>
          <form className='inline-block w-full max-w-md mx-auto'>
            <div className='mb-4'>
              <Label htmlFor='username' value="Your username" />
              <TextInput type='text' placeholder='username' id='username' className='w-full' />
            </div>
            <div className='mb-4'>
              <Label htmlFor='email' value="Email" />
              <TextInput type='email' placeholder='name@company.com' id='email' className='w-full' />
            </div>
            <div className='mb-4'>
              <Label htmlFor='password' value="Password" />
              <TextInput type='password' placeholder='********' id='password' className='w-full' />
            </div>
            <Button gradientDuoTone='purpleToPink' className='w-full mt-4' type='submit'>
              Sign Up
            </Button>
          </form>
          <div className='mt-4'>
            <span>Have an account? 
              <Link to='/signin' className='font-bold text-purple-600 dark:text-purple-400 ml-1'> Sign In</Link>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
