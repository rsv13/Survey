import { Button, Modal, Table } from 'flowbite-react';
import React, { useEffect, useState } from 'react';
import { HiOutlineExclamationCircle } from 'react-icons/hi';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

export default function DashSurvey() {
  const { currentUser } = useSelector(state => state.user);
  const [userSurveys, setUserSurveys] = useState([]);
  const [showMore, setShowMore] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedSurveyId, setSelectedSurveyId] = useState(null);
  const navigate = useNavigate();

  const fetchSurveys = async () => {
    try {
      // Fetch all surveys for admins or only the current user's surveys for non-admins
      const url = currentUser.isAdmin
        ? '/api/survey/getSurveys'
        : `/api/survey/getSurveys?userId=${currentUser._id}`;

      const res = await fetch(url);
      const data = await res.json();

      if (res.ok) {
        setUserSurveys(data.surveys);
        if (data.surveys.length < 10) {
          setShowMore(false);
        }
      } else {
        console.error("Failed to fetch surveys:", data.message);
      }
    } catch (error) {
      console.error("Error fetching surveys:", error.message);
    }
  };

  useEffect(() => {
    fetchSurveys();
  }, [currentUser._id, currentUser.isAdmin]);

  const handleViewClick = (survey) => {
    navigate('/survey-details', { state: { survey } });
  };

  const handleDeleteClick = (surveyId) => {
    setSelectedSurveyId(surveyId);
    setShowModal(true);
  };

  const handleDelete = async () => {
    try {
      const res = await fetch(`/api/survey/deleteSurvey/${selectedSurveyId}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (res.ok) {
        setUserSurveys(userSurveys.filter(survey => survey._id !== selectedSurveyId));
        setShowModal(false);
        setSelectedSurveyId(null);
      } else {
        console.error("Failed to delete survey:", data.message);
      }
    } catch (error) {
      console.error("Error deleting survey:", error.message);
    }
  };

  return (
    <div className='table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500'>
      {userSurveys.length > 0 ? (
        <Table hoverable className='shadow-md'>
          <Table.Head>
            <Table.HeadCell>Date Updated</Table.HeadCell>
            <Table.HeadCell>Email</Table.HeadCell>
            <Table.HeadCell>Gender</Table.HeadCell>
            <Table.HeadCell>Age Group</Table.HeadCell>
            <Table.HeadCell>Profession</Table.HeadCell>
            <Table.HeadCell>Education</Table.HeadCell>
            <Table.HeadCell>Place</Table.HeadCell>
            <Table.HeadCell>View</Table.HeadCell>
            {currentUser.isAdmin && <Table.HeadCell>Delete</Table.HeadCell>}
          </Table.Head>
          <Table.Body className='divide-y'>
            {userSurveys.map((survey) => (
              <Table.Row key={survey._id} className='bg-white dark:border-gray-700 dark:bg-gray-800'>
                <Table.Cell>{new Date(survey.updatedAt).toLocaleDateString()}</Table.Cell>
                <Table.Cell>{survey.email}</Table.Cell>
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
                {currentUser.isAdmin && (
                  <Table.Cell>
                    <Button onClick={() => handleDeleteClick(survey._id)} color="failure">Delete</Button>
                  </Table.Cell>
                )}
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      ) : (
        <p>You don't have any surveys yet. Please create a new survey.</p>
      )}
      <Modal
        show={showModal}
        onClose={() => setShowModal(false)}
        popup
        size='md'
      >
        <Modal.Header />
        <Modal.Body>
          <div className='text-center'>
            <HiOutlineExclamationCircle className='h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto' />
            <h3 className='mb-5 text-lg text-gray-500 dark:text-gray-400'>
              Are you sure you want to delete this survey?
            </h3>
            <div className='flex justify-center gap-4'>
              <Button color='failure' onClick={handleDelete}>
                Yes, I'm sure
              </Button>
              <Button color='gray' onClick={() => setShowModal(false)}>
                No, cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}
