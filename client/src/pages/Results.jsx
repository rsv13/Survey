import { Button } from 'flowbite-react';
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Results() {
  const location = useLocation();
  const { score, answers } = location.state || {};

  if (score === undefined || answers === undefined) {
    return <p className="text-red-500 text-center">No results available.</p>;
  }

  const getInsight = () => {
    if (score >= 14 && score <= 28) {
      return 'Your responses indicate that you may be facing significant challenges in social well-being. Consider seeking additional support or resources to address these challenges and improve your social environment.';
    } else if (score >= 29 && score <= 42) {
      return 'You seem to have a mixed experience with social well-being. Reflect on both positive aspects and areas where you could improve your social interactions and support network.';
    } else if (score >= 43 && score <= 56) {
      return 'Your social well-being appears to be generally positive. You have a good support system and engage well in social activities. Continue to build on these strengths and maintain a balanced approach.';
    } else if (score >= 57 && score <= 70) {
      return 'You are experiencing a high level of social well-being. You are well-connected and have a strong support network. Keep nurturing these positive aspects and continue to engage in meaningful social interactions.';
    } else {
      return 'There seems to be an issue with the score. Please ensure that all responses are correctly submitted.';
    }
  };

  return (
    <div className='min-h-screen flex flex-col justify-center items-center bg-gray-100 dark:bg-gray-800'>
      <div className='max-w-4xl w-full p-8 bg-white dark:bg-gray-700 shadow-lg rounded-lg'>

        <h1 className='text-4xl font-extrabold text-gray-800 dark:text-gray-200 mb-6'>
          Survey Results
        </h1>

        <div className='bg-blue-200 dark:bg-blue-300 p-6 rounded-lg shadow-md mb-6'>
          <p className='text-lg font-semibold text-blue-800 dark:text-blue-800 mb-4'>
            Remember, no matter how strong or positive you may feel, it's okay to ask for help if you're struggling mentally or emotionally. Reaching out is a sign of strength. Whether it's talking to a friend, family member, or a professional, support is always available. You deserve to be heard and supported, so never hesitate to seek help when you need it.
          </p>
        </div>



        <div className='text-center'>
          <p className='text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-4'>
            Your total score is: <span className='text-4xl font-bold text-blue-600'>{score}</span>
          </p>
          <p className='text-lg text-gray-700 dark:text-gray-300 mb-6'>
            {getInsight()}
          </p>

          {score <= 45 && (
          <div className='bg-yellow-200 dark:bg-yellow-300 p-6 rounded-lg shadow-md mb-6'>
            <p className='text-lg font-semibold text-yellow-800 dark:text-yellow-800'>
              If you are not feeling well, we encourage you to reach out to your nearest local healthcare provider for support. You can also explore the following resources for additional help and guidance:
            </p>
          </div>
        )}

          <div className="grid md:grid-cols-2 gap-8">
            <div className='p-6 rounded-lg shadow-md border-4 border-blue-500 bg-blue-50 dark:bg-blue-900'>
              <h3 className="text-xl font-semibold mb-2 text-blue-700 dark:text-blue-300">
                Dewis Cymru
              </h3>
              <p className='text-lg text-gray-700 dark:text-gray-300'>
                Dewis Cymru is the place to go for information that can help you with your well-being. They offer a comprehensive directory of local services and resources across Wales, focused on health, social care, and well-being. Whether you're looking for mental health support, community activities, or advice on improving your social connections, Dewis Cymru can help you find the right services to meet your needs.
                <a href='https://www.dewis.wales/' target='_blank' rel='noopener noreferrer' className='text-blue-600 hover:underline'> Visit Dewis Cymru</a>.
              </p>
            </div>

            <div className='p-6 rounded-lg shadow-md border-4 border-blue-500 bg-blue-50 dark:bg-blue-900'>
              <h3 className="text-xl font-semibold mb-2 text-blue-700 dark:text-blue-300">
                InfoEngine
              </h3>
              <p className='text-lg text-gray-700 dark:text-gray-300'>
                InfoEngine is an online directory of third-sector services in Wales. It highlights a wide range of services that can support your social and mental well-being, from community groups and social activities to counseling and mental health services. InfoEngine helps you connect with local organizations that can provide the support and guidance you need to enhance your social well-being.
                <a href='https://www.pavs.org.uk/help-for-organisations/infoengine/' target='_blank' rel='noopener noreferrer' className='text-blue-600 hover:underline'> Explore InfoEngine</a>.
              </p>
            </div>
          </div>

          <div className='flex justify-center gap-6 mt-6'>
            <Link to='/contactus'>
              <Button gradientDuoTone='purpleToPink'>
                Contact Us
              </Button>
            </Link>
            <Link to='/projects'>
              <Button gradientDuoTone='purpleToPink'>
                Explore More
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
