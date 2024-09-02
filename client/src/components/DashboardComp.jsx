import { Button, Table } from 'flowbite-react';
import React, { useEffect, useState } from 'react';
import { FcSurvey } from 'react-icons/fc';
import { HiArrowNarrowUp, HiOutlineUserGroup } from 'react-icons/hi';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
export default function DashboardComp() {

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

  const [ users, setUsers] = useState([])
  const [surveys, setSurveys] = useState([])
  const [totalUsers, setTotalUsers] = useState(0)
  const [totalSurveys, setTotalSurveys] = useState(0)
  const [lastMonthUsers, setLastMonthUsers] = useState(0)
  const [lastMonthSurveys, setLastMonthSurveys] = useState(0)
  const { currentUser} = useSelector((state) => state.user)

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch(`${API_URL}/api/user/getUsers?limit=5`);
        const data = await res.json();
        if (res.ok) {
          setUsers(data.users);
          setTotalUsers(data.totalUsers);
          setLastMonthUsers(data.lastMonthUsers);
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    const fetchSurveys = async () => {
      try {
        const res = await fetch(`${API_URL}/api/survey/getSurveys?limit=5`);
        const data = await res.json();
        if (res.ok) {
          setSurveys(data.surveys);
          setTotalSurveys(data.totalSurveys);
          setLastMonthSurveys(data.lastMonthSurveys);
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    if (currentUser.isAdmin) {
      fetchUsers();
      fetchSurveys();
    }
  }, [currentUser]);

  return (
  <div className='p-3 md:mx-auto'>
    <div className='flex-wrap flex gap-4 justify-center'>
      <div className='flex flex-col p-3 dark:bg-slate-800 gap-4 md:w-72 w-full rounded-md shadow-md'>
        <div className='flex justify-between'>
          <div>
            <h3 className='text-gray-500 text-md uppercase'>Total Users</h3>
            <p>{totalUsers}</p>
          </div>
          <HiOutlineUserGroup className='bg-teal-600 text-white rounded-full text-5xl p-3 shadow-lg'/>
          </div>
          <div className='flex gap-2 text-sm'>
            <span className='text-green-500 flex items-center'>
              <HiArrowNarrowUp />
              {lastMonthUsers}
            </span>
            <div className='text-gray-500'>Last Month Users</div>

        </div>
      </div>
      <div className='flex flex-col p-3 dark:bg-slate-800 gap-4 md:w-72 w-full rounded-md shadow-md'>
        <div className='flex justify-between'>
          <div>
            <h3 className='text-gray-500 text-md uppercase'>Total Surveys</h3>
            <p>{totalSurveys}</p>
            
          </div>
          <FcSurvey className='bg-indigo-600 text-white rounded-full text-5xl p-3 shadow-lg'/>


          </div>
          <div className='flex gap-2 text-sm'>
            <span className='text-green-500 flex items-center'>
              <HiArrowNarrowUp />
              {lastMonthUsers}
            </span>
            <div className='text-gray-500'>Last Month Users</div>

        </div>
      </div>
      </div>
      <div className='flex flex-wrap gap-4 py-3 mx-auto justify-center'>
        <div className='flex flex-col w-full md:w-auto shadow-md p-2 rounded-md dark:bg-gray-800'>
          <div className='flex justify-between p-3 text-sm font-semibold'>
            <h1 className='text-center p-2'>Recent Users</h1>
            <Button outline gradientDuoTone='purpleToPink'>
              <Link to={"/dashboard?tab=users"}>
              See All
              </Link>
              </Button>
          </div>
          <Table hoverable>
            <Table.Head>
              <Table.HeadCell> Username</Table.HeadCell>
              <Table.HeadCell>Email</Table.HeadCell>
            </Table.Head>
            {users && users.map((user) => (
              <Table.Body key={user._id} className='divide-y'>
                <Table.Row className='bg-white dark:border-gray-700 dark:bg-gray-800'>
                  <Table.Cell>{user.surveyUsername}</Table.Cell>
                  <Table.Cell>{user.email}</Table.Cell>
                </Table.Row>
              </Table.Body>
            ))}

          </Table>
        </div>
        <div className='flex flex-col w-full md:w-auto shadow-md p-2 rounded-md dark:bg-gray-800'>
          <div className='flex justify-between p-3 text-sm font-semibold'>
            <h1 className='text-center p-2'>Recent Surveys</h1>
            <Button outline gradientDuoTone='purpleToPink'>
              <Link to={"/dashboard?tab=surveys"}>
              See All
              </Link>
              </Button>
          </div>
          <Table hoverable>
            <Table.Head>
              <Table.HeadCell>Username</Table.HeadCell>
              <Table.HeadCell>Email</Table.HeadCell>
            </Table.Head>
            {surveys && surveys.map((survey) => (
              <Table.Body key={survey._id} className='divide-y'>
                <Table.Row className='bg-white dark:border-gray-700 dark:bg-gray-800'>
                  <Table.Cell>{survey.surveyUsername}</Table.Cell>
                  <Table.Cell>{survey.email}</Table.Cell>
                </Table.Row>
              </Table.Body>
            ))}

          </Table>
        </div>
      </div>
    </div>
  )
}
