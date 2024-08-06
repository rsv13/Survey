import React from 'react';

export default function HomePage() {
  return (
    <div className='min-h-screen flex flex-col bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-200'>
      <header className='bg-gray-800 text-white text-center py-12'>
        <h1 className='text-4xl font-bold'>
          Welcome to the South Wales Social Well-being Scale
        </h1>
        <p className='mt-4 text-lg px-4'>
          Discover how our tool measures the quality of your social wellbeing through the resources you possess, 
          your perceived ability to engage in and enjoy your social world, and your capacity for human functioning and flourishing.
        </p>
      </header>
      
      <main className='p-6 flex-1'>
        <section className='mb-12'>
          <div className='flex flex-col md:flex-row gap-8 justify-center'>
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
        
        <section className='bg-gray-200 p-6 rounded-lg shadow-md max-w-3xl mx-auto'>
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
        </section>
      </main>
      
      <footer className='bg-gray-800 text-white text-center py-4'>
        <p>&copy; 2024 South Wales Social Well-being Scale. All rights reserved.</p>
      </footer>
    </div>
  );
}
