import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import BannerImage from '../assets/icons/BannerImage.jpg';

export default function HomePage() {
  const navigate = useNavigate();
  const { theme } = useSelector((state) => state.theme);

  const handleSurveyClick = () => {
    navigate('/survey');
  };

  return (
    <div className='bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100'>
      {/* Hero Section */}
      <section
        className="relative bg-cover bg-center text-white py-20"
        style={{ backgroundImage: `url(${BannerImage})` }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-black opacity-50"></div>

        {/* Content */}
        <div className="relative container mx-auto px-6 text-center">
          <h1 className="text-4xl font-bold mb-4">
            Welcome to the South Wales Social Well-being Scale
          </h1>
          <p className="text-lg mb-6">
            Measure and understand your social well-being through our comprehensive survey.
          </p>
          <button
            className={`bg-white bg-gradient-to-r from-indigo-500 from-10% via-sky-500 via-30% to-emerald-500 to-90% font-semibold py-2 px-6 rounded-lg shadow-md ${theme === 'dark' ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}
            onClick={handleSurveyClick}
          >
            Take the Survey
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
            <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} text-lg`}>
              The South Wales Social Well-being Scale (SWSWBS) is a validated tool designed to assess various aspects of your social environment and interactions over the past two weeks. It helps to measure how well you are integrated into your social world and how these interactions contribute to your overall well-being.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className={`${theme === 'dark' ? 'bg-gray-800 text-gray-100' : 'bg-white text-gray-900'} p-6 rounded-lg shadow-md`}>
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

            <div className={`${theme === 'dark' ? 'bg-gray-800 text-gray-100' : 'bg-white text-gray-900'} p-6 rounded-lg shadow-md`}>
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

        <section className={`${theme === 'dark' ? 'bg-gray-800 text-gray-100' : 'bg-gray-100 text-gray-900'} p-6 rounded-lg shadow-md mt-12`}>
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
