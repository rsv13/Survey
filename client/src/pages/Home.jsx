import React from 'react';
import { Link } from 'react-router-dom';

export default function HomePage() {
  return (
    <div className='bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100'>
      {/* Hero Section */}
      <section className='bg-gradient-to-r from-teal-400 to-cyan-500 text-white py-20'>
        <div className='container mx-auto px-6 text-center'>
          <h1 className='text-4xl font-bold mb-4'>Welcome to the South Wales Social Well-being Scale</h1>
          <p className='text-lg mb-6'>
            Discover how our tool measures the quality of your social well-being through the resources you possess,
            your perceived ability to engage in and enjoy your social world, and your capacity for human functioning and flourishing.
          </p>
          <Link to='/signup'>
            <button className='bg-white text-teal-500 font-semibold py-2 px-6 rounded-lg shadow-md hover:bg-gray-100 dark:hover:bg-gray-800'>
              Sign Up
            </button>
          </Link>
        </div>
      </section>

      {/* Main Content */}
      <main className='py-12'>
        <section className='container mx-auto px-6'>
          <div className='flex flex-col md:flex-row gap-8'>
            <div className='flex-1 max-w-lg mx-auto'>
              <h2 className='text-2xl font-semibold mb-4'>Understanding Social Well-being</h2>
              <div className='aspect-w-16 aspect-h-9'>
                <iframe
                  width='560'
                  height='315'
                  src='https://www.youtube.com/embed/Pyd3r0xTkI0'
                  title='Understanding Social Well-being'
                  frameBorder='0'
                  allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
                  allowFullScreen
                  className='rounded-lg shadow-lg'
                ></iframe>
              </div>
            </div>
            
            <div className='flex-1 max-w-lg mx-auto'>
              <h2 className='text-2xl font-semibold mb-4'>Building Strong Social Connections</h2>
              <div className='aspect-w-16 aspect-h-9'>
                <iframe
                  width='560'
                  height='315'
                  src='https://www.youtube.com/embed/bfCZBXQYSlw'
                  title='Building Strong Social Connections'
                  frameBorder='0'
                  allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
                  allowFullScreen
                  className='rounded-lg shadow-lg'
                ></iframe>
              </div>
            </div>
          </div>
        </section>
        
        <section className='bg-gray-100 dark:bg-gray-700 p-6 rounded-lg shadow-md mt-12'>
          <div className='container mx-auto px-6'>
            <h2 className='text-2xl font-semibold mb-4'>Why Social Well-being Matters</h2>
            <p className='mb-4'>
              Social well-being is crucial for a fulfilling and balanced life. It encompasses your ability to connect with others, engage 
              in meaningful relationships, and contribute positively to your community.
            </p>
            <ul className='list-disc list-inside pl-5'>
              <li>Enhances mental and emotional health</li>
              <li>Strengthens community bonds</li>
              <li>Promotes personal growth and development</li>
            </ul>
          </div>
        </section>
      </main>
    </div>
  );
}
