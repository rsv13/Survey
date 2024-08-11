import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

export default function DashboardComp() {

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
        const res = await fetch('/api/user/getUsers?limit=5');
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
        const res = await fetch('/api/post/getSurveys?limit=5');
        const data = await res.json();
        if (res.ok) {
          setSurveys(data.surveys);
          setTotalSurveys(data.totalSuveys);
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

    
    <div>DashboardComp</div>
  )
}
