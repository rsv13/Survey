import { Alert, Button, Checkbox, Label, Radio, Select, TextInput } from 'flowbite-react';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { surveyInputs } from '../../../api/utils/surveyInputs';

const SurveyForm = () => {

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
  
  const { currentUser } = useSelector(state => state.user);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    surveyUsername: currentUser.surveyUsername || '', // Ensure default is string
    gender: '',
    ageGroup: '',
    sector: '', 
    designation: '', 
    education: '',
    country: '',
    state: '',
    city: '',
    consent: false,
  });
  const [surveyAnswers, setSurveyAnswers] = useState(Array(surveyInputs.questions.length).fill(null));
  const [unansweredQuestions, setUnansweredQuestions] = useState([]);
  const [showSurvey, setShowSurvey] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setFormData({
      surveyUsername: currentUser.surveyUsername || '', // Ensure default is string
      gender: '',
      ageGroup: '',
      sector: '',
      designation: '',
      education: '',
      country: '',
      state: '',
      city: '',
      consent: false,
    });
    setSurveyAnswers(Array(surveyInputs.questions.length).fill(null));
    setUnansweredQuestions(Array.from(Array(surveyInputs.questions.length).keys()));
    setShowSurvey(false);
    setSubmitted(false);
    setError(null);
    setLoading(false);
  }, [currentUser.surveyUsername]);

  // Handle changes to the form fields
  const handleFormChange = (e) => {
    const { id, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [id]: type === 'checkbox' ? checked : value,
    });
  };

  // Handle changes to the survey answers
  const handleSurveyChange = (index, value) => {
    const newAnswers = [...surveyAnswers];
    newAnswers[index] = value;
    setSurveyAnswers(newAnswers);
    setUnansweredQuestions(unansweredQuestions.filter(i => i !== index));
  };

  // Handle form submission to start the survey
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.consent) {
      setError('You must consent to use data for research and educational purposes.');
      return;
    }
    if (!formData.gender || !formData.ageGroup || !formData.sector || !formData.designation || !formData.education || !formData.country || !formData.state || !formData.city) {
      setError('Please fill out all fields.');
      return;
    }
    setLoading(true);
    setError(null);

    // Simulate an API call or async operation
    setTimeout(() => {
      setLoading(false);
      setShowSurvey(true);
    }, 1000);
  };

  // Handle survey submission
  const handleSurveySubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Check if all survey questions are answered
    const unanswered = surveyAnswers.map((answer, index) => answer === null ? index : null).filter(i => i !== null);
    if (unanswered.length > 0) {
        setUnansweredQuestions(unanswered);
        setLoading(false);
        setError('Please answer all survey questions before submitting.');
        return;
    }

    // Calculate total score
    const totalScore = surveyAnswers.reduce((acc, answer) => acc + (answer || 0), 0);

    const surveyData = {
        ...formData,
        surveyAnswers,
        totalScore,  // Include total score in survey data
        user: currentUser._id,
    };

    try {
        const res = await fetch(`${API_URL}/api/survey/surveyQuestion`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(surveyData),
        });

        const data = await res.json();
        setLoading(false);

        if (!res.ok) {
            setError(data.message || 'Failed to submit survey. Please try again.');
            return;
        }

        setSubmitted(true);
    } catch (error) {
        setLoading(false);
        setError('Failed to submit survey. Please try again.');
    }
  };

  // Handle viewing results after submission
  const handleViewResults = () => {
    const score = surveyAnswers.reduce((acc, answer) => acc + (answer || 0), 0);
    navigate('/results', { state: { score, answers: surveyAnswers } });
  };

  return (
    <div className='min-h-screen flex justify-center items-center bg-gray-100 dark:bg-gray-800'>
      <div className='max-w-4xl w-full p-8 bg-white dark:bg-gray-700 shadow-lg rounded-lg'>
        {!showSurvey ? (
          <form className='space-y-6' onSubmit={handleSubmit}>
            <h1 className='text-3xl font-semibold text-center text-gray-800 dark:text-gray-200 mb-6'>
              Survey Registration
            </h1>
            <p className='text-lg text-gray-700 dark:text-gray-300 mb-6 text-center'>
              Welcome! We appreciate your participation in our survey. Your responses will help us better understand community needs and improve our services. Please provide your information and consent to proceed to the survey questions.
            </p>
            <div>
              <Label htmlFor='surveyUsername' value='Survey Username' />
              <TextInput
                id='surveyUsername'
                value={formData.surveyUsername}
                readOnly
                disabled
              />
            </div>
            <div>
              <Label htmlFor='gender' value='Gender:' />
              <Select id='gender' value={formData.gender} onChange={handleFormChange}>
                <option value=''>Select...</option>
                {surveyInputs.fields.gender.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </Select>
            </div>
            <div>
              <Label htmlFor='ageGroup' value='Age Group:' />
              <Select id='ageGroup' value={formData.ageGroup} onChange={handleFormChange}>
                <option value=''>Select...</option>
                {surveyInputs.fields.ageGroup.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </Select>
            </div>
            <div>
              <Label htmlFor='sector' value='Your sector of work:' />
              <Select id='sector' value={formData.sector} onChange={handleFormChange}>
                <option value=''>Select...</option>
                {surveyInputs.fields.sector.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </Select>
            </div>
            <div>
              <Label htmlFor='designation' value='Designation' />
              <TextInput
                id='designation'
                value={formData.designation}
                onChange={handleFormChange}
                placeholder='Enter your designation'
              />
            </div>
            <div>
              <Label htmlFor='education' value='Education' />
              <Select id='education' value={formData.education} onChange={handleFormChange}>
                <option value=''>Select...</option>
                {surveyInputs.fields.education.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </Select>
            </div>
            <div>
              <Label htmlFor='country' value='Country' />
              <TextInput id='country' value={formData.country} onChange={handleFormChange} />
            </div>
            <div>
              <Label htmlFor='state' value='State' />
              <TextInput id='state' value={formData.state} onChange={handleFormChange} />
            </div>
            <div>
              <Label htmlFor='city' value='City' />
              <TextInput id='city' value={formData.city} onChange={handleFormChange} />
            </div>
            <div className='flex items-center'>
              <Checkbox id='consent' checked={formData.consent} onChange={handleFormChange} />
              <Label htmlFor='consent' className='ml-2'>
                I consent to use this data for research and educational purposes.
              </Label>
            </div>
            {error && !showSurvey && (
              <Alert color='failure' className='my-4'>
                {error}
              </Alert>
            )}
            <Button
              gradientDuoTone='purpleToPink'
              className='w-full mt-4'
              type='submit'
              disabled={loading}
            >
              {loading ? 'Starting Survey...' : 'Start Survey'}
            </Button>
          </form>
        ) : (
          <form className='space-y-6' onSubmit={handleSurveySubmit}>
            <h1 className='text-3xl font-semibold text-center text-gray-800 dark:text-gray-200 mb-6'>
              Survey Questions
            </h1>
            {surveyInputs.questions.map((question, index) => (
              <div key={index} className={`border p-4 mb-4 rounded-lg ${unansweredQuestions.includes(index) ? 'border-red-500' : 'border-gray-300'}`}>
                <p className='text-lg font-medium text-gray-700 dark:text-gray-300 mb-2'>
                  Question {index + 1}: {question}
                </p>
                <div className='flex flex-wrap gap-4'>
                  {surveyInputs.options.map((option, i) => (
                    <div key={i} className='flex items-center'>
                      <Radio
                        id={`q${index}-opt${i}`}
                        name={`q${index}`}
                        value={i + 1}
                        checked={surveyAnswers[index] === i + 1}
                        onChange={() => handleSurveyChange(index, i + 1)}
                      />
                      <Label htmlFor={`q${index}-opt${i}`} className='ml-2'>
                        {option}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            ))}
            {error && showSurvey && (
              <Alert color='failure' className='my-4'>
                {error}
              </Alert>
            )}
            <Button
              gradientDuoTone='purpleToPink'
              className='w-full mt-4'
              type='submit'
              disabled={loading}
            >
              {loading ? 'Submitting...' : 'Submit Survey'}
            </Button>
          </form>
        )}
        {submitted && !error && (
          <div className='text-center'>
            <p className='text-green-600 dark:text-green-400 text-lg mt-6'>
              Thank you for completing the survey!
            </p>
            <Button
              gradientDuoTone='purpleToPink'
              className='mt-4'
              onClick={handleViewResults}
            >
              Check Results
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SurveyForm;
