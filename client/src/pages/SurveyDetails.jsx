import { Button, Checkbox, Label, Radio, Select, TextInput } from 'flowbite-react';
import React from 'react';
import { useLocation } from 'react-router-dom';

const SurveyDetails = () => {
  const location = useLocation();
  const { survey } = location.state; // Get survey data from location state

  if (!survey) {
    return <p>No survey data available.</p>;
  }

  // Define the options for the survey questions
  const options = ['None of the time', 'Rarely', 'Some of the time', 'Often', 'All of the time'];

  return (
    <div className='min-h-screen flex justify-center items-center bg-gray-100 dark:bg-gray-800'>
      <div className='max-w-4xl w-full p-8 bg-white dark:bg-gray-700 shadow-lg rounded-lg'>
        <h1 className='text-3xl font-semibold text-center text-gray-800 dark:text-gray-200 mb-6'>Survey Details</h1>
        <form className='space-y-6'>
          <div>
            <Label htmlFor='surveyUsername' value='Survey Username' />
            <TextInput
              id='surveyUsername'
              value={survey.surveyUsername || ''}
              readOnly
              disabled
            />
          </div>
          <div>
            <Label htmlFor='gender' value='Gender' />
            <Select
              id='gender'
              value={survey.gender || ''}
              disabled
            >
              <option value=''>Select...</option>
              <option value='Male'>Male</option>
              <option value='Female'>Female</option>
              <option value='Prefer not to say'>Prefer not to say</option>
              <option value='Others'>Others</option>
            </Select>
          </div>
          <div>
            <Label htmlFor='ageGroup' value='Age Group' />
            <Select
              id='ageGroup'
              value={survey.ageGroup || ''}
              disabled
            >
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
            <Select
              id='profession'
              value={survey.profession || ''}
              disabled
            >
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
            <Select
              id='education'
              value={survey.education || ''}
              disabled
            >
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
            <TextInput
              id='country'
              value={survey.country || ''}
              readOnly
            />
          </div>
          <div>
            <Label htmlFor='state' value='State' />
            <TextInput
              id='state'
              value={survey.state || ''}
              readOnly
            />
          </div>
          <div>
            <Label htmlFor='city' value='City' />
            <TextInput
              id='city'
              value={survey.city || ''}
              readOnly
            />
          </div>
          <div className='flex items-center'>
            <Checkbox
              id='consent'
              checked={survey.consent || false}
              disabled
            />
            <Label htmlFor='consent' className='ml-2'>
              I consent to use this data for research and educational purposes.
            </Label>
          </div>
          <div>
            <strong>Survey Answers:</strong>
            <div>
              {survey.surveyAnswers.map((answer, index) => (
                <div key={index} className='border p-4 mb-4 rounded-lg'>
                  <p className='text-lg font-medium text-gray-700 dark:text-gray-300 mb-2'>
                    Question {index + 1}: {[
                      'None of the time',
                      'Rarely',
                      'Some of the time',
                      'Often',
                      'All of the time'
                    ][answer - 1]}
                  </p>
                  {/* Display the selected option */}
                  <div className='flex flex-wrap gap-4'>
                    {options.map((option, i) => (
                      <div key={i} className='flex items-center'>
                        <Radio
                          id={`q${index}-opt${i}`}
                          name={`q${index}`}
                          value={i + 1}
                          checked={answer === i + 1}
                          disabled
                        />
                        <Label htmlFor={`q${index}-opt${i}`} className='ml-2'>
                          {option}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </form>
        <Button className='w-full mt-4' onClick={() => window.history.back()}>
          Go Back
        </Button>
      </div>
    </div>
  );
};

export default SurveyDetails;
