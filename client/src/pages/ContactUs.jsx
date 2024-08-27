import React from 'react';
import contactUsImage from '../assets/icons/ContactUs.jpeg'; // Import the background image

export default function ContactUs() {
  return (
    <div className='bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100'>
      {/* Hero Section with Background Image */}
      <section
        className='relative py-20 text-white bg-cover bg-center'
        style={{ backgroundImage: `url(${contactUsImage})` }}
      >
        <div className='absolute inset-0 bg-black opacity-50'></div>
        <div className='relative z-10 container mx-auto px-6 text-center'>
          <h1 className='text-4xl font-bold mb-4'>Contact Us</h1>
          <p className='text-lg mb-6'>
            We are here to assist you. Please feel free to reach out with any questions or concerns you may have.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <main className='py-12'>
        <section className='container mx-auto px-6'>
          {/* Contact Details and Support Resources */}
          <div className='flex flex-wrap -mx-4'>
            {/* University of South Wales Card */}
            <div className='w-full md:w-1/3 px-4 mb-6 md:mb-0'>
              <div className='bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg'>
                <h3 className='text-2xl font-semibold mb-4 text-blue-700 dark:text-blue-300'>
                  University of South Wales
                </h3>
                <p className='text-lg mb-4'>
                  For any queries or further information about the South Wales Social Well-being Scale (SWSWBS), please contact the University of South Wales. Our dedicated team is ready to help you with any questions you might have.
                </p>
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
            </div>

            {/* Dewis Cymru Card */}
            <div className='w-full md:w-1/3 px-4 mb-6 md:mb-0'>
              <div className='bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg'>
                <h3 className='text-2xl font-semibold mb-4 text-blue-700 dark:text-blue-300'>
                  Dewis Cymru
                </h3>
                <p className='text-lg mb-4'>
                  Dewis Cymru is a comprehensive resource for well-being information in Wales. It provides a directory of local services, including mental health support, community activities, and more. Dewis Cymru aims to help individuals find the right resources to enhance their social and mental well-being.
                </p>
                <p className='text-lg mb-4'>
                  <strong>Website:</strong> <br />
                  <a href='https://www.dewis.wales/' target='_blank' rel='noopener noreferrer' className='text-blue-600 hover:underline'>
                    Visit Dewis Cymru
                  </a>
                </p>
                <p className='text-lg'>
                  For personalized support or to find services near you, explore Dewis Cymru's extensive directory and connect with local resources.
                </p>
              </div>
            </div>

            {/* InfoEngine Card */}
            <div className='w-full md:w-1/3 px-4'>
              <div className='bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg'>
                <h3 className='text-2xl font-semibold mb-4 text-blue-700 dark:text-blue-300'>
                  InfoEngine
                </h3>
                <p className='text-lg mb-4'>
                  InfoEngine is a detailed directory of third-sector services available in Wales. It highlights a range of services aimed at improving social and mental well-being, including community groups, social activities, and counseling services. InfoEngine is designed to help you connect with organizations that can provide the support you need.
                </p>
                <p className='text-lg mb-4'>
                  <strong>Website:</strong> <br />
                  <a href='https://www.pavs.org.uk/help-for-organisations/infoengine/' target='_blank' rel='noopener noreferrer' className='text-blue-600 hover:underline'>
                    Explore InfoEngine
                  </a>
                </p>
                <p className='text-lg'>
                  For further assistance and to discover services that match your needs, visit InfoEngine to access a wealth of resources and support.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
