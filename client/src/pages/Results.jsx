import { Button } from 'flowbite-react';
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const ResultsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { score, answers } = location.state || {};

  if (score === undefined || answers === undefined) {
    return <p className="text-red-500 text-center">No results available.</p>;
  }

  let insight;

  if (score >= 14 && score <= 28) {
    insight = 'Your responses indicate that you may be facing significant challenges in social well-being. Consider seeking additional support or resources to address these challenges and improve your social environment.';
  } else if (score >= 29 && score <= 42) {
    insight = 'You seem to have a mixed experience with social well-being. Reflect on both positive aspects and areas where you could improve your social interactions and support network.';
  } else if (score >= 43 && score <= 56) {
    insight = 'Your social well-being appears to be generally positive. You have a good support system and engage well in social activities. Continue to build on these strengths and maintain a balanced approach.';
  } else if (score >= 57 && score <= 70) {
    insight = 'You are experiencing a high level of social well-being. You are well-connected and have a strong support network. Keep nurturing these positive aspects and continue to engage in meaningful social interactions.';
  } else {
    insight = 'There seems to be an issue with the score. Please ensure that all responses are correctly submitted.';
  }

  const handleSignout = async () => {
    try {
      const res = await fetch('api/user/signout', {
        method: 'POST',
      });
      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);
      } else {
        navigate('/signin');
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className='min-h-screen flex flex-col justify-center items-center bg-gray-100 dark:bg-gray-800'>
      <div className='max-w-4xl w-full p-8 bg-white dark:bg-gray-700 shadow-lg rounded-lg'>
        <h1 className='text-4xl font-extrabold text-gray-800 dark:text-gray-200 mb-6'>
          Survey Results
        </h1>
        <div className='text-center'>
          <p className='text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-4'>
            Your total score is: <span className='text-4xl font-bold text-blue-600'>{score}</span>
          </p>
          <p className='text-lg text-gray-700 dark:text-gray-300 mb-6'>
            {insight}
          </p>
          <div className='flex justify-center gap-6'>
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
};

export default ResultsPage;
