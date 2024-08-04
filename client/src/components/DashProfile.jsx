import { Alert, Button, Modal, TextInput } from 'flowbite-react';
import React, { useState } from 'react';
import { HiOutlineExclamationCircle } from 'react-icons/hi';
import { useDispatch, useSelector } from 'react-redux';
import { deleteUserFailure, deleteUserStart, deleteUserSuccess, signoutSuccess, updateFailure, updateStart, updateSuccess } from '../redux/user/userSlice';

export default function DashProfile() {

    const { currentUser } = useSelector(state => state.user );
    const { error } = useSelector(state => state.user);
    const [formData, setFormData] = useState({});
    const [updateUserSuccess, setUpdateUserSuccess] = useState(null);
    const [updateUserError, setUpdateUserError] = useState(null);
    const [ showModal, setShowModal] = useState(false);
    const dispatch = useDispatch();

    const handleChange = (e) => {
      setFormData({ ...formData, [e.target.id] : e.target.value });
    }

    const handleSubmit = async (e) => {
      e.preventDefault();
      setUpdateUserError(null);
      setUpdateUserSuccess(null);
      if (Object.keys(formData).length === 0) {
        setUpdateUserError('No changes detected');
        return;
      }
      try {
        dispatch(updateStart());
        const res = await fetch(`/api/user/update/${currentUser._id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });
        const data = await res.json();
        if (!res.ok) {
          dispatch(updateFailure(data.message));
          setUpdateUserError(data.message);
        } else {
          dispatch(updateSuccess(data));
          setUpdateUserSuccess('Profile updated successfully');
        }
      } catch (error){
        dispatch(updateFailure(error.message));
        setUpdateUserError(error.message); //
      }
    } 

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
        const data = await res.json()
        if (!res.ok) {
          console.log(data.message);
        } else {
          dispatch(signoutSuccess());
          navigate('/signin');
        }
      } catch (error) {
        console.log(error.message)
      }
    }

  return (
    <div className='max-w-lg mx-auto p-3 w-full'>
        <h1 className='my-7 text-center font-semibold text-3xl'> Profile </h1>
            <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
                <div className="w-32 h-32 self-center cursor-pointer shadow-md overflow-hidden rounded-full">
                <img src={currentUser.profilePicture} alt='user' className='rounded-full w-full h-full object-cover border-8 border-[lightgray]' />
                </div>
                <TextInput type='text' id='username' placeholder='username' defaultValue={currentUser.username} onChange={handleChange}/>
                <TextInput type='email' id='email' placeholder='email' defaultValue={currentUser.email} onChange={handleChange}/>
                <TextInput type='password' id='password' placeholder='********' onChange={handleChange}/>
                <Button type='submit' gradientDuoTone='purpleToBlue' outline onClick={handleSubmit}>
                  Update
                  </Button>
            </form>
            <div className='text-red-500 flex justify-between mt-5'>
              <span onClick={() => setShowModal(true)} className='cursor-pointer'>Delete Account</span>
              <span onClick={handleSignout} className='cursor-pointer'>Sign Out</span>
            </div>
            {updateUserSuccess && (
               <Alert color='success' className='mt-5'>
                {updateUserSuccess}
              </Alert>
            )}
              {updateUserError && (
                <Alert color='failure' className='mt-5'>
                  {updateUserError}
                </Alert>
              )}{error && (
                <Alert color='failure' className='mt-5'>
                  {error}
                </Alert>
              )}
              <Modal show={showModal} onClose={() => setShowModal(false)} popup size='md'>
                <Modal.Header />
                  <Modal.Body>
                    <div className='text-center'>
                        <HiOutlineExclamationCircle className='h-14 w-14 text-gray-400 dark:dark-text-200 mb-4 mx-auto' />
                        <h3 classname='mb-5 text-lg text-gray-500 dark:text-gray-400'>Are you sure you want to delete your account?</h3> 
                        <div className='flex justify-center gap-4'>
                          <Button color='failure' onClick={handleDeleteUser}>
                            Yes, I'm sure
                          </Button>
                          <Button color='gray' onClick={() => setShowModal(false)} > 
                            No 
                          </Button>
                        </div>

                    </div>

                  </Modal.Body>
              </Modal>
    </div>
  )
}