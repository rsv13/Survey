import React from 'react';

export default function ContactUs() {
  return (
    <div className='bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100'>
      {/* Hero Section */}
      <section className='bg-gradient-to-r from-teal-400 to-cyan-500 text-white py-20'>
        <div className='container mx-auto px-6 text-center'>
          <h1 className='text-4xl font-bold mb-4'>Contact Us</h1>
          <p className='text-lg mb-6'>
            We are here to assist you. Please feel free to reach out with any questions or concerns you may have.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <main className='py-12'>
        <section className='container mx-auto px-6'>
          <div className='mb-12'>
            <h2 className='text-3xl font-semibold mb-4'>Get in Touch</h2>
            <p className='text-lg mb-6'>
              For any queries or further information about the South Wales Social Well-being Scale (SWSWBS), 
              please contact the University of South Wales. Our dedicated team is ready to help you with any 
              questions you might have.
            </p>
          </div>

          <div className='bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg'>
            <h3 className='text-2xl font-semibold mb-4'>University of South Wales</h3>
            <p className='text-lg mb-4'>
              <strong>Address:</strong> <br />
              Treforest Campus, <br />
              University of South Wales, <br />
              Treforest, Pontypridd, <br />
              CF37 1DL, United Kingdom
            </p>
            <p className='text-lg mb-4'>
              <strong>Email:</strong> <br />
              <a href='mailto:info@southwales.ac.uk' className='text-blue-600 hover:underline'>
                info@southwales.ac.uk
              </a>
            </p>
            <p className='text-lg mb-4'>
              <strong>Phone:</strong> <br />
              +44 (0)1443 482 000
            </p>
            <p className='text-lg mb-4'>
              For additional support or inquiries, you can also visit the <a href='https://www.wsspr.wales' target='_blank' rel='noopener noreferrer' className='text-blue-600 hover:underline'>Wales School for Social Prescribing Research (WSSPR)</a>.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
