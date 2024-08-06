import React from 'react';

export default function Projects() {
  return (
    <div className='bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100'>
      {/* Hero Section */}
      <section className='bg-gradient-to-r from-teal-400 to-cyan-500 text-white py-20'>
        <div className='container mx-auto px-6 text-center'>
          <h1 className='text-4xl font-bold mb-4'>Our Projects</h1>
          <p className='text-lg mb-6'>
            Explore our ongoing projects and research initiatives aimed at enhancing social well-being.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <main className='py-12'>
        <section className='container mx-auto px-6'>
          <div className='mb-12'>
            <h2 className='text-3xl font-semibold mb-4'>Projects & Tools</h2>
            <p className='text-lg mb-6'>
              We are committed to advancing social well-being through a range of research and practical tools. 
              Our projects span various aspects of social prescribing, including innovative tools and collaborative 
              research initiatives.
            </p>
          </div>

          {/* WSSPR Tools */}
          <div className='bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg mb-12'>
            <h3 className='text-2xl font-semibold mb-4'>Wales School for Social Prescribing Research (WSSPR) Tools</h3>
            <p className='text-lg mb-4'>
              WSSPR provides a range of tools designed to support social prescribing practices. These tools are 
              valuable for researchers, practitioners, and policymakers working to enhance social well-being. 
              For more details on available tools and resources, visit the <a href='https://www.wsspr.wales/tools/' target='_blank' rel='noopener noreferrer' className='text-blue-600 hover:underline'>WSSPR Tools Page</a>.
            </p>
          </div>

          {/* Prime Centre Wales Projects */}
          <div className='bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg'>
            <h3 className='text-2xl font-semibold mb-4'>Prime Centre Wales Projects</h3>
            <p className='text-lg mb-4'>
              Prime Centre Wales focuses on enhancing primary care through research and practical projects. 
              Their work covers various aspects of healthcare improvement and social well-being. For more 
              information on their current projects and initiatives, please visit the <a href='https://www.primecentre.wales/' target='_blank' rel='noopener noreferrer' className='text-blue-600 hover:underline'>Prime Centre Wales Website</a>.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
