import { Alert, Button, Checkbox, Label, Radio, Select, TextInput } from 'flowbite-react';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const SurveyForm = () => {
  const { currentUser } = useSelector(state => state.user);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    surveyUsername: currentUser.surveyUsername,
    gender: '',
    ageGroup: '',
    profession: '',
    education: '',
    country: '',
    state: '',
    city: '',
    consent: false,
  });
  const [surveyAnswers, setSurveyAnswers] = useState(Array(14).fill(null));
  const [unansweredQuestions, setUnansweredQuestions] = useState([]);
  const [showSurvey, setShowSurvey] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setFormData(prevData => ({
      surveyUsername: currentUser.surveyUsername,
      ...prevData,
    }));
  }, [currentUser.surveyUsername]);

  const handleFormChange = (e) => {
    const { id, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [id]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSurveyChange = (index, value) => {
    const newAnswers = [...surveyAnswers];
    newAnswers[index] = value;
    setSurveyAnswers(newAnswers);
    setUnansweredQuestions(unansweredQuestions.filter(i => i !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const requiredFields = ['gender', 'ageGroup', 'profession', 'education', 'country', 'state', 'city'];
    const missingFields = requiredFields.filter(field => !formData[field]);
    if (missingFields.length > 0) {
      setError(`Please fill out all required fields: ${missingFields.join(', ')}`);
      return;
    }
    if (!formData.consent) {
      setError('You must consent to use data for research and educational purposes.');
      return;
    }
    setLoading(true);
    setError(null);

    setTimeout(() => {
      setLoading(false);
      setShowSurvey(true);
    }, 1000);
  };

  const handleSurveySubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const unanswered = surveyAnswers.map((answer, index) => answer === null ? index : null).filter(i => i !== null);
    if (unanswered.length > 0) {
        setUnansweredQuestions(unanswered);
        setLoading(false);
        setError('Please answer all survey questions before submitting.');
        return;
    }

    const totalScore = surveyAnswers.reduce((acc, answer) => acc + (answer || 0), 0);

    const surveyData = {
        ...formData,
        surveyAnswers,
        totalScore,
        user: currentUser._id,
    };

    try {
        const res = await fetch('http://localhost:3000/api/survey/surveyQuestion', {
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
              <Label htmlFor='gender' value='Gender' />
              <Select id='gender' value={formData.gender} onChange={handleFormChange}>
                <option value=''>Select...</option>
                <option value='Male'>Male</option>
                <option value='Female'>Female</option>
                <option value='Prefer not to say'>Prefer not to say</option>
                <option value='Others'>Others</option>
              </Select>
            </div>
            <div>
              <Label htmlFor='ageGroup' value='Age Group' />
              <Select id='ageGroup' value={formData.ageGroup} onChange={handleFormChange}>
                <option value=''>Select...</option>
                <option value='16 to 24'>16 to 24</option>
                <option value='25 to 34'>25 to 34</option>
                <option value='35 to 44'>35 to 44</option>
                <option value='45 to 54'>45 to 54</option>
                <option value='55 & above'>55 & above</option>
              </Select>
            </div>
            <div>
              <Label htmlFor='profession' value='Profession' />
              <Select id='profession' value={formData.profession} onChange={handleFormChange}>
                <option value=''>Select...</option>
                <option value='Software Developer'>Software Developer</option>
                <option value='Teacher'>Teacher</option>
                <option value='Engineer'>Engineer</option>
                <option value='Doctor'>Doctor</option>
                <option value='Other'>Other</option>
              </Select>
            </div>
            <div>
              <Label htmlFor='education' value='Education' />
              <Select id='education' value={formData.education} onChange={handleFormChange}>
                <option value=''>Select...</option>
                <option value='High School'>High School</option>
                <option value="Associate's Degree">Associate's Degree</option>
                <option value="Bachelor's Degree">Bachelor's Degree</option>
                <option value="Master's Degree">Master's Degree</option>
                <option value='Doctorate'>Doctorate</option>
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
            {error && (
              <Alert color='failure' className='mb-4'>
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
            {[
              "I’ve been living in a safe and healthy home environment",
              "I’ve been able to enjoy a safe and healthy environment outside my home",
              "I’ve been financially secure and so have had enough income to meet my needs",
              "I’ve been doing worthwhile activities (paid/unpaid) when I’ve wanted",
              "I’ve been able to carry out what I’ve set out to do when I’ve wanted",
              "I’ve met up with family and friends and we have done things together when I’ve wanted",
              "I've been free from harassment and discrimination",
              "I’ve been able to use local services and facilities when I’ve needed",
              "I’ve felt useful when I help and support other people",
              "I’ve had my opinions taken seriously",
              "I’ve interacted with others in person when I’ve wanted",
              "I’ve interacted with others digitally, online and/or using a phone when I’ve wanted",
              "I've been involved with community groups and/or activities when I’ve wanted",
              "I’ve learnt about the world",
            ].map((question, index) => (
              <div key={index} className={`border p-4 mb-4 rounded-lg ${unansweredQuestions.includes(index) ? 'border-red-500' : 'border-gray-300'}`}>
                <p className='text-lg font-medium text-gray-700 dark:text-gray-300 mb-2'>
                  Question {index + 1}: {question}
                </p>
                <div className='flex flex-wrap gap-4'>
                  {['None of the time', 'Rarely', 'Some of the time', 'Often', 'All of the time'].map((option, i) => (
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
              <Alert color='failure' className='mb-4'>
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
