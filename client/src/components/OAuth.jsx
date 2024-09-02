import { GoogleAuthProvider, getAuth, signInWithPopup } from 'firebase/auth';
import { Button } from 'flowbite-react';
import React from 'react';
import { AiFillGoogleCircle } from 'react-icons/ai';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { app } from '../firebase';
import { signInSuccess } from '../redux/user/userSlice';

export default function OAuth() {

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

    const navigate = useNavigate();
    const auth = getAuth(app);
    const dispatch = useDispatch();

    const handleGoogleClick = async () => {
        const provider = new GoogleAuthProvider();
        provider.setCustomParameters({ prompt: 'select_account' })
        try {
            const resultsFromGoogle = await signInWithPopup(auth, provider);
            const res = await fetch(`${API_URL}/api/auth/google`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    name: resultsFromGoogle.user.displayName,
                    email: resultsFromGoogle.user.email,
                    googlePhotoUrl: resultsFromGoogle.user.photoURL,
                }),
            })
             const data = await res.json()
             if(res.ok) {
                dispatch(signInSuccess(data));
                navigate('/dashboard?tab=profile');
                 
             }
        } catch (error) {
            console.log(error);
        }
    }

  return (
    <Button type='button' className='inline-block w-full max-w-md mx-auto mt-4' outline gradientDuoTone='cyanToBlue'  onClick={handleGoogleClick}>
      <AiFillGoogleCircle className='mr-2 w-6 h-6 ' />
      Continue with Google
    </Button>
  )
}
