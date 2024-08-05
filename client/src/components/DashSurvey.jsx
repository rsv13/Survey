import { Button, Table } from 'flowbite-react';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

export default function DashSurvey() {
  const { currentUser } = useSelector(state => state.user);
  const [userSurveys, setUserSurveys] = useState([]);
  const navigate = useNavigate();

  const fetchSurveys = async () => {
    try {
      const response = await fetch(`/api/survey/getSurveys?userId=${currentUser._id}`);
      const data = await response.json();

      if (response.ok) {
        setUserSurveys(data.surveys);
      } else {
        console.error("Failed to fetch surveys:", data.message);
      }
    } catch (error) {
      console.error("Error fetching surveys:", error.message);
    }
  };

  useEffect(() => {
    if (currentUser.isAdmin) {
      fetchSurveys();
    }
  }, [currentUser._id, currentUser.isAdmin]);

  const handleViewClick = (survey) => {
    navigate('/survey-details', { state: { survey } });
  };

  return (
    <div className='table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500'>
      {currentUser.isAdmin && userSurveys.length > 0 ? (
        <Table hoverable className='shadow-md'>
          <Table.Head>
            <Table.HeadCell>Date Updated</Table.HeadCell>
            <Table.HeadCell>Gender</Table.HeadCell>
            <Table.HeadCell>Age Group</Table.HeadCell>
            <Table.HeadCell>Profession</Table.HeadCell>
            <Table.HeadCell>Education</Table.HeadCell>
            <Table.HeadCell>Place</Table.HeadCell>
            <Table.HeadCell>View</Table.HeadCell>
            <Table.HeadCell>Delete</Table.HeadCell>
          </Table.Head>
          <Table.Body>
            {userSurveys.map((survey) => (
              <Table.Row key={survey._id}>
                <Table.Cell>{new Date(survey.updatedAt).toLocaleDateString()}</Table.Cell>
                <Table.Cell>{survey.gender || 'N/A'}</Table.Cell>
                <Table.Cell>{survey.ageGroup || 'N/A'}</Table.Cell>
                <Table.Cell>{survey.profession || 'N/A'}</Table.Cell>
                <Table.Cell>{survey.education || 'N/A'}</Table.Cell>
                <Table.Cell>{[
                  survey.country || 'N/A',
                  survey.state || 'N/A',
                  survey.city || 'N/A'
                ].join(', ')}</Table.Cell>
                <Table.Cell>
                  <Button onClick={() => handleViewClick(survey)}>View</Button>
                </Table.Cell>
                <Table.Cell>
                  <Button>Delete</Button>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      ) : (
        <p>You don't have any surveys yet. Please create a new survey.</p>
      )}
    </div>
  );
}
