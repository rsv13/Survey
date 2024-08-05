import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

export default function DashSurvey() {
  const {currentUser} = useSelector(state => state.user);
  const [userSurveys, setUserSurveys] = useState([]);

  const fetchSurveys = async () => {
  
    try {
      const response = await fetch(`/api/survey/getSurveys?userId=${currentUser._id}`); // Fetch surveys for the user
      const data = await response.json();

      if (response.ok) {
        console.log(data)
        setUserSurveys(data.surveys); // Update state with fetched surveys
      } else {
        console.error("Failed to fetch surveys:", data.message);
      }
    } catch (error) {
      console.error("Error fetching surveys:", error.message);
    }
  };
  useEffect(() => {
    console.log(currentUser)
    if (currentUser.isAdmin) {
      console.log("Admin")
      fetchSurveys(); // Fetch surveys if user is an admin
    }
  }, [currentUser._id]);



  return (
    <div>
      <h1>Survey Dashboard</h1>
      {userSurveys.length > 0 ? (
        <p>No surveys found.</p>
      ) : (
        <ul>
          {userSurveys.map((survey, index) => (
            <li key={index}>
              <div>Gender: {survey.gender}</div>
              <div>Age Group: {survey.ageGroup}</div>
              <div>Email: {survey.email}</div>
              <div>Profession: {survey.profession}</div>
              <div>Education: {survey.education}</div>
              <div>Country: {survey.country}</div>
              <div>State: {survey.state}</div>
              <div>City: {survey.city}</div>
              <div>Consent: {survey.consent ? 'Yes' : 'No'}</div>
              <div>Survey Answers: {survey.surveyAnswers.join(', ')}</div>
              <div>Survey Identifier: {survey.surveyIdentifier}</div>
              <hr />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
