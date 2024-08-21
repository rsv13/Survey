import { Sidebar } from 'flowbite-react';
import React, { useEffect, useState } from 'react';
import { FcSurvey } from "react-icons/fc";
import { HiChartPie, HiOutlineUserGroup, HiUser, HiUsers } from 'react-icons/hi';
import { RiShutDownLine } from "react-icons/ri";
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { signoutSuccess } from '../redux/user/userSlice';

export default function DashSidebar() {
  const { currentUser } = useSelector((state) => state.user);
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [tab, setTab] = useState('');

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get('tab');
    if (tabFromUrl) {
      setTab(tabFromUrl);
    }
  }, [location.search]);

  const handleSignout = async () => {
    try {
      const res = await fetch('/api/user/signout', {
        method: 'POST',
      });
      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);
      } else {
        dispatch(signoutSuccess());
        navigate('/signin');
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <Sidebar className='w-full md:w-56'>
      <Sidebar.Items>
        <Sidebar.ItemGroup>
          {currentUser.role === 'Admin' && (
            <Link to='/dashboard?tab=dash'>
              <Sidebar.Item
                active={tab === 'dash' || !tab}
                icon={HiChartPie}
                as='div'
              >
                Dashboard
              </Sidebar.Item>
            </Link>
          )}
          <Link to='/dashboard?tab=profile'>
            <Sidebar.Item
              active={tab === 'profile'}
              icon={HiUser}
              label={currentUser.role === 'Admin' ? 'Admin' : currentUser.role === 'Group Admin' ? 'Group Admin' : 'User'}
              labelColor='dark'
              as='div'
            >
              Profile
            </Sidebar.Item>
          </Link>
          <Link to='/dashboard?tab=surveys'>
            <Sidebar.Item
              active={tab === 'surveys'}
              icon={FcSurvey}
              labelColor='dark'
              as='div'
            >
              Surveys
            </Sidebar.Item>
          </Link>

          {/* Conditionally render the Groups tab */}
          {(currentUser.role === 'Admin' || currentUser.role === 'Group Admin') && (
            <Link to='/dashboard?tab=groups'>
              <Sidebar.Item
                active={tab === 'groups'}
                icon={HiUsers}
                as='div'
              >
                Groups
              </Sidebar.Item>
            </Link>
          )}

          {currentUser.role === 'Group Admin' && (
            <Link to='/dashboard?tab=groupsUsers'>
              <Sidebar.Item
                active={tab === 'groupsUsers'}
                icon={HiUsers}
                as='div'
              >
                Users in Group
              </Sidebar.Item>
            </Link>
          )}

          {(currentUser.role === 'Admin' ) && (
            <Link to='/dashboard?tab=users'>
              <Sidebar.Item
                active={tab === 'users'}
                icon={HiOutlineUserGroup}
                as='div'
              >
                Users
              </Sidebar.Item>
            </Link>
          )}
          <Sidebar.Item icon={RiShutDownLine} className='cursor-pointer' onClick={handleSignout}>
            Sign Out
          </Sidebar.Item>
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  );
}
