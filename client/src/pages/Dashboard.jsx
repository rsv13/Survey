import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import DashGroups from '../components/DashGroup';
import DashGroupUsers from '../components/DashGroupUsers';
import DashProfile from '../components/DashProfile';
import DashSidebar from '../components/DashSidebar';
import DashSurvey from '../components/DashSurvey';
import DashUsers from '../components/DashUsers';
import DashboardComp from '../components/DashboardComp';


export default function Dashboard() {

  const location = useLocation();
  const [tab, setTab] = useState('');
  
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get('tab')
    if (tabFromUrl) {
      setTab(tabFromUrl)
    } 
},  [location.search])

  return (
    <div className='min-h-screen flex flex-col md:flex-row'>
      <div className='md:w-56'>
        {/* sidebar */}
        <DashSidebar />
        </div>
          {/* profile */}
          { tab === 'profile' && <DashProfile />}
          {/* surveys */}
          { tab === 'surveys' && <DashSurvey />}
          {/* Dashboard */}
          { tab === 'dash' && <DashboardComp />}
          {/* Users */}
          { tab === 'users' && <DashUsers />}
          {/* Groups */}
          { tab === 'groups' && <DashGroups />}
          {/* Group Users */}
          {tab === 'groupsUsers' && <DashGroupUsers />} 
      </div>

  )
}
