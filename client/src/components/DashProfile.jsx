import { Alert, Button, Modal } from 'flowbite-react';
import React, { useState } from 'react';
import { HiOutlineExclamationCircle } from 'react-icons/hi';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { deleteUserFailure, deleteUserStart, deleteUserSuccess, signoutSuccess } from '../redux/user/userSlice';

export default function DashProfile() {
    const { currentUser, error, loading } = useSelector(state => state.user);
    const [showModal, setShowModal] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleDeleteUser = async () => {
        setShowModal(false);
        try {
            dispatch(deleteUserStart());
            const res = await fetch(`/api/user/delete/${currentUser._id}`, {
                method: 'DELETE',
            });
            const data = await res.json();
            if (!res.ok) {
                dispatch(deleteUserFailure(data.message));
            } else {
                dispatch(deleteUserSuccess(data));
                navigate('/signin');
            }
        } catch (error) {
            dispatch(deleteUserFailure(error.message));
        }
    };

    const handleSignout = async () => {
        try {
            const res = await fetch('api/user/signout', {
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
    }

    return (
        <div className='max-w-lg mx-auto p-3 w-full'>
            <h1 className='my-7 text-center font-semibold text-3xl'>Profile</h1>
            <div className="text-center mb-6">
                <div className="w-32 h-32 self-center shadow-md overflow-hidden rounded-full">
                    <img src={currentUser.profilePicture} alt='user' className='rounded-full w-full h-full object-cover border-8 border-[lightgray]' />
                </div>
            </div>
            <div className='flex flex-col gap-4'>
                <div className='text-lg font-semibold'>Username</div>
                <div className='text-gray-700 dark:text-gray-300'>{currentUser.username}</div>

                <div className='text-lg font-semibold'>Email</div>
                <div className='text-gray-700 dark:text-gray-300'>{currentUser.email}</div>

                {/* Password is not displayed for security reasons */}
                {/* <div className='text-lg font-semibold'>Password</div> */}
                {/* <div className='text-gray-700 dark:text-gray-300'>********</div> */}

                {
                    currentUser && (
                        <Link to='/survey'>
                            <Button type='button' gradientDuoTone='purpleToBlue' className='w-full mt-4'>
                                Take the survey
                            </Button>
                        </Link>
                    )
                }
            </div>
            { 
                (currentUser.role === 'Admin' || currentUser.role === 'Group Admin') && (
                    <Link to='/create-group'>
                    <Button type = 'button' gradientDuoTone='purpleToPink' className='w-full mt-4'>
                        Create a Group
                        </Button>
                    </Link>
                )   
            }
            <div className='text-red-500 flex justify-between mt-5'>
                <span onClick={() => setShowModal(true)} className='cursor-pointer'>Delete Account</span>
                <span onClick={handleSignout} className='cursor-pointer'>Sign Out</span>
            </div>
            {error && (
                <Alert color='failure' className='mt-5'>
                    {error}
                </Alert>
            )}
            <Modal show={showModal} onClose={() => setShowModal(false)} popup size='md'>
                <Modal.Header />
                <Modal.Body>
                    <div className='text-center'>
                        <HiOutlineExclamationCircle className='h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto' />
                        <h3 className='mb-5 text-lg text-gray-500 dark:text-gray-400'>Are you sure you want to delete your account?</h3>
                        <div className='flex justify-center gap-4'>
                            <Button color='failure' onClick={handleDeleteUser}>
                                Yes, I'm sure
                            </Button>
                            <Button color='gray' onClick={() => setShowModal(false)}>
                                No
                            </Button>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
        </div>
    )
}
