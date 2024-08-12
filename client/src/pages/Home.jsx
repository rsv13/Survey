import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { signInFailure, signInSuccess } from '../redux/user/userSlice';

export default function HomePage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);
  const { theme } = useSelector((state) => state.theme);

  useEffect(() => {
    const checkSignInStatus = async () => {
      try {
        const response = await fetch('/api/auth/check-auth', {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to check authentication');
        }

        const data = await response.json();

        if (data.signedIn) {
          // Fetch additional user data if needed
          const userResponse = await fetch('/api/user/profile', {
            method: 'GET',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
            },
          });

          if (!userResponse.ok) {
            throw new Error('Failed to fetch user data');
          }

          const userData = await userResponse.json();
          dispatch(signInSuccess(userData));
        } else {
          dispatch(signInFailure('User is not signed in'));
        }
      } catch (error) {
        dispatch(signInFailure(error.message));
      }
    };

    checkSignInStatus();
  }, [dispatch]);

  const handleButtonClick = () => {
    if (currentUser) {
      navigate('/survey'); // Redirect to the survey page if signed in
    } else {
      navigate('/sign-up'); // Redirect to the sign-up page if not signed in
    }
  };

  return (
    <div className={`transition-colors duration-300 ${theme === 'dark' ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-900'}`}>
      {/* Hero Section */}
      <section className={`bg-gradient-to-r ${theme === 'dark' ? 'from-gray-800 to-gray-600' : 'from-violet-500 to-fuchsia-500'} text-white py-20`}>
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-4xl font-bold mb-4">
            Welcome to the South Wales Social Well-being Scale
          </h1>
          <p className="text-lg mb-6">
            Measure and understand your social well-being through our comprehensive survey.
          </p>
          <button
            onClick={handleButtonClick}
            className={`font-semibold py-2 px-6 rounded-lg shadow-md transition duration-300 ease-in-out ${
              currentUser
                ? theme === 'dark'
                  ? 'bg-teal-600 text-gray-100 hover:bg-teal-700'
                  : 'bg-teal-300 text-gray-900 hover:bg-teal-400'
                : theme === 'dark'
                ? 'bg-blue-600 text-gray-100 hover:bg-blue-700'
                : 'bg-blue-400 text-white hover:bg-blue-500'
            }`}
          >
            {currentUser ? 'Take the Survey' : 'Sign Up'}
          </button>
        </div>
      </section>

      {/* Main Content */}
      <main className="py-12">
        <section className="container mx-auto px-6">
          <div className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">
              About the South Wales Social Well-being Scale
            </h2>
            <p className={`text-lg ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
              The South Wales Social Well-being Scale (SWSWBS) is a validated tool designed to assess various aspects of your social environment and interactions over the past two weeks. It helps to measure how well you are integrated into your social world and how these interactions contribute to your overall well-being.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className={`p-6 rounded-lg shadow-md ${theme === 'dark' ? 'bg-gray-800 text-gray-100' : 'bg-white text-gray-700'}`}>
              <h3 className="text-xl font-semibold mb-2">
                Key Areas of Assessment
              </h3>
              <ul className="list-disc list-inside">
                <li>Home and external environment safety</li>
                <li>Financial security and sufficiency</li>
                <li>Engagement in meaningful activities</li>
                <li>Social interactions with family and friends</li>
                <li>Freedom from harassment and discrimination</li>
                <li>Use of local services and facilities</li>
                <li>Community involvement and group activities</li>
                <li>Learning and personal growth</li>
              </ul>
            </div>

            <div className={`p-6 rounded-lg shadow-md ${theme === 'dark' ? 'bg-gray-800 text-gray-100' : 'bg-white text-gray-700'}`}>
              <h3 className="text-xl font-semibold mb-2">
                How It Works
              </h3>
              <p className="mb-4">
                The survey consists of 14 items, each exploring a different aspect of your social well-being. You'll rate your experiences over the past two weeks using a 5-point scale ranging from "none of the time" to "all of the time."
              </p>
              <p>
                Your responses will help you understand how well you are socially integrated, and highlight areas where you may want to focus on improving your social well-being.
              </p>
            </div>
          </div>
        </section>

        <section className={`bg-gray-100 p-6 rounded-lg shadow-md mt-12 ${theme === 'dark' ? 'bg-gray-700 text-gray-100' : 'text-gray-700'}`}>
          <div className="container mx-auto px-6">
            <h2 className="text-2xl font-semibold mb-4">Why Social Well-being Matters</h2>
            <p className="mb-4">
              Social well-being is crucial for a fulfilling and balanced life. It encompasses your ability to connect with others, engage in meaningful relationships, and contribute positively to your community.
            </p>
            <ul className="list-disc list-inside pl-5">
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
