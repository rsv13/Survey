import { Button, Modal, Table, TextInput } from 'flowbite-react';
import React, { useEffect, useState } from 'react';
import { AiOutlineSearch } from 'react-icons/ai'; // Import the search icon
import { HiOutlineExclamationCircle } from 'react-icons/hi';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

export default function DashSurveys() {
  const { currentUser } = useSelector((state) => state.user);
  const [userSurveys, setUserSurveys] = useState([]);
  const [filteredSurveys, setFilteredSurveys] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedSurveyId, setSelectedSurveyId] = useState(null);
  const [searchQuery, setSearchQuery] = useState(''); // State for search query
  const navigate = useNavigate();

  // Function to format date from mm/dd/yyyy to dd/mm/yyyy
  const formatDate = (dateString) => {
    const [month, day, year] = dateString.split('/');
    return `${day.padStart(2, '0')}/${month.padStart(2, '0')}/${year}`;
  };

  // Fetch surveys from the server
  const fetchSurveys = async () => {
    if (!currentUser) {
      console.error("Current user is not available.");
      return;
    }
  
    try {
      let url;
  
      if (currentUser.role === 'Admin' || currentUser.role === 'Group Admin') {
        url = '/api/survey/getSurveys';
      } else if (currentUser.role === 'normalUser') {
        url = `/api/survey/getSurveys?userId=${currentUser._id}`;
      } else {
        console.error("Access denied: Unrecognized role.");
        return;
      }
  
      const res = await fetch(url, {
        method: 'GET',
        credentials: 'include',
      });
      const data = await res.json();
  
      if (res.ok) {
        const sortedSurveys = data.surveys.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
        setUserSurveys(sortedSurveys);
        setFilteredSurveys(sortedSurveys);
      } else {
        alert("Failed to fetch surveys. " + (data.message || res.statusText));
      }
    } catch (error) {
      alert("Error fetching surveys: " + error.message);
    }
  };
  
  
  // Filter surveys based on search query
  useEffect(() => {
    const query = searchQuery.toLowerCase();
    const filtered = userSurveys.filter(survey =>
      (survey.surveyUsername || '').toLowerCase().includes(query) ||
      (survey.gender || '').toLowerCase().includes(query) ||
      (survey.profession || '').toLowerCase().includes(query) ||
      (survey.education || '').toLowerCase().includes(query) ||
      (survey.country || '').toLowerCase().includes(query) ||
      (survey.state || '').toLowerCase().includes(query) ||
      (survey.city || '').toLowerCase().includes(query)
    );
    setFilteredSurveys(filtered);
  }, [searchQuery, userSurveys]);

  // Handle view button click
  const handleViewClick = (survey) => {
    navigate('/survey-details', { state: { survey } });
  };

  // Handle delete button click
  const handleDeleteClick = (surveyId) => {
    setSelectedSurveyId(surveyId);
    setShowModal(true);
  };

  // Handle survey deletion
  const handleDelete = async () => {
    if (!currentUser) {
      console.error("Current user is not available for deletion.");
      setShowModal(false);
      return;
    }

    setShowModal(false);

    try {
      const res = await fetch(`/api/survey/deleteSurvey/${selectedSurveyId}`, {
        method: 'DELETE',
        credentials: 'include', // Include cookies with the request
      });
      const data = await res.json();

      if (!res.ok) {
        console.error("Failed to delete survey:", data.message || res.statusText);
      } else {
        setUserSurveys((prevSurveys) =>
          prevSurveys.filter((survey) => survey._id !== selectedSurveyId)
        );
        setFilteredSurveys((prevFilteredSurveys) =>
          prevFilteredSurveys.filter((survey) => survey._id !== selectedSurveyId)
        );
      }
    } catch (error) {
      console.error("Error deleting survey:", error.message);
    } finally {
      setSelectedSurveyId(null);
    }
  };

  useEffect(() => {
    fetchSurveys();
  }, [currentUser]);

  if (!currentUser) {
    return <p>Loading user information...</p>;
  }

  return (
    <div className='p-3'>
      <div className='flex items-center mb-4'>
        <TextInput
          type='text'
          placeholder='Search surveys...'
          rightIcon={AiOutlineSearch}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className='w-full max-w-md'
        />
      </div>
      {filteredSurveys.length > 0 ? (
        <>
          <Table hoverable className='shadow-md'>
            <Table.Head>
              <Table.HeadCell>Date Updated</Table.HeadCell>
              <Table.HeadCell>Survey Username</Table.HeadCell>
              <Table.HeadCell>Gender</Table.HeadCell>
              <Table.HeadCell>Age Group</Table.HeadCell>
              <Table.HeadCell>Sector</Table.HeadCell>
              <Table.HeadCell>Designation</Table.HeadCell>
              <Table.HeadCell>Education</Table.HeadCell>
              <Table.HeadCell>Place</Table.HeadCell>
              <Table.HeadCell>View</Table.HeadCell>
              {currentUser?.isAdmin && <Table.HeadCell>Delete</Table.HeadCell>}
            </Table.Head>
            <Table.Body className='divide-y'>
              {filteredSurveys.map((survey) => (
                <Table.Row
                  key={survey._id}
                  className='bg-white dark:border-gray-700 dark:bg-gray-800'
                >
                  <Table.Cell>{formatDate(new Date(survey.updatedAt).toLocaleDateString())}</Table.Cell>
                  <Table.Cell>{survey.surveyUsername || 'N/A'}</Table.Cell>
                  <Table.Cell>{survey.gender || 'N/A'}</Table.Cell>
                  <Table.Cell>{survey.ageGroup || 'N/A'}</Table.Cell>
                  <Table.Cell>{survey.sector || 'N/A'}</Table.Cell>
                  <Table.Cell>{survey.designation || 'N/A'}</Table.Cell>
                  <Table.Cell>{survey.education || 'N/A'}</Table.Cell>
                  <Table.Cell>
                    {[
                      survey.country || 'N/A',
                      survey.state || 'N/A',
                      survey.city || 'N/A',
                    ].join(', ')}
                  </Table.Cell>
                  <Table.Cell>
                    <Button gradientMonochrome="info" onClick={() => handleViewClick(survey)}>View</Button>
                  </Table.Cell>
                  {currentUser?.isAdmin && (
                    <Table.Cell>
                      <Button
                        onClick={() => handleDeleteClick(survey._id)}
                        color='failure'
                      >
                        Delete
                      </Button>
                    </Table.Cell>
                  )}
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </>
      ) : (
        <p>You don't have any surveys yet.</p>
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
