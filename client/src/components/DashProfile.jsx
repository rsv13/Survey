import { Alert, Button, Modal } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { deleteUserFailure, deleteUserStart, deleteUserSuccess, signoutSuccess } from "../redux/user/userSlice";

export default function DashProfile() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentUser, error } = useSelector((state) => state.user);
  const [showModal, setShowModal] = useState(false);
  const [profileData, setProfileData] = useState(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const res = await fetch(`/api/user/details`, {
          headers: {
            Authorization: `Bearer ${currentUser?.token}` // Ensure token is included
          }
        });
        if (res.ok) {
          const data = await res.json();
          setProfileData(data);
        } else {
          const errorText = await res.text();
          console.log("Error fetching profile:", errorText);
        }
      } catch (error) {
        console.log("Error:", error.message);
      }
    };

    if (currentUser) {
      fetchUserProfile();
    }
  }, [currentUser]);

  const handleDeleteUser = async () => {
    setShowModal(false);
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${currentUser.token}` // Ensure token is included
        }
      });
      if (res.ok) {
        const data = await res.json();
        dispatch(deleteUserSuccess(data));
        navigate("/sign-in");
      } else {
        const errorText = await res.text();
        dispatch(deleteUserFailure(errorText));
      }
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };

  const handleSignout = async () => {
    try {
      const res = await fetch(`/api/user/signout`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${currentUser?.token}` // Ensure token is included
        }
      });
      if (res.ok) {
        dispatch(signoutSuccess());
        navigate("/");
      } else {
        const errorText = await res.text();
        console.log("Signout error:", errorText);
      }
    } catch (error) {
      console.log("Error:", error.message);
    }
  };

  // Determine display role
  const displayRole = profileData?.role === "normalUser" ? "Member" : profileData?.role || "Loading...";

  return (
    <div className="max-w-7xl mx-auto p-8 bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700 rounded-xl shadow-lg">
      <div className="flex flex-col md:flex-row md:items-start md:justify-between">
        <div className="flex flex-col items-center md:items-start md:w-1/3">
          <div className="w-36 h-36 shadow-2xl overflow-hidden rounded-full border-4 border-gradient-to-r from-blue-500 to-pink-500">
            <img
              src={currentUser?.profilePicture || "/default-profile.png"} // Default image if none exists
              alt="user"
              className="rounded-full w-full h-full object-cover"
            />
          </div>
          <div className="mt-6 text-center md:text-left">
            <h1 className="text-4xl font-extrabold text-gray-800 dark:text-gray-100 truncate">{currentUser?.username}</h1>
            <p className="text-lg text-gray-600 dark:text-gray-400">{currentUser?.email}</p>
          </div>
        </div>
        <div className="mt-8 md:mt-0 md:w-2/3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-gray-800 shadow-xl rounded-lg p-6 border-l-4 border-indigo-500">
              <div className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-2">Role</div>
              <div className="text-gray-700 dark:text-gray-300">{displayRole}</div>
            </div>
            <div className="bg-white dark:bg-gray-800 shadow-xl rounded-lg p-6 border-l-4 border-teal-500">
              <div className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-2">Group</div>
              <div className="text-gray-700 dark:text-gray-300">{profileData?.groupName || "Not in any group"}</div>
            </div>
            {profileData?.adminGroups && profileData.adminGroups.length > 0 && (
              <div className="bg-white dark:bg-gray-800 shadow-xl rounded-lg p-6 border-l-4 border-yellow-500 md:col-span-2">
                <div className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-2">You are currently managing the below group or groups:</div>
                <ul className="list-disc pl-5">
                  {profileData.adminGroups.map((group, index) => (
                    <li key={index} className="text-gray-700 dark:text-gray-300">
                      {group}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mt-8">
        {currentUser && (
          <Link to="/survey" className="w-full md:w-auto">
            <Button type="button" gradientDuoTone="purpleToBlue" className="w-full text-lg">
              Take the survey
            </Button>
          </Link>
        )}
        {(currentUser?.role === "Admin" || currentUser?.role === "Group Admin") && (
          <Link to="/create-group" className="w-full md:w-auto">
            <Button type="button" gradientDuoTone="purpleToPink" className="w-full text-lg">
              Create a Group
            </Button>
          </Link>
        )}
      </div>

      <div className="text-red-600 flex flex-col md:flex-row justify-between gap-4 mt-8">
        <span onClick={() => setShowModal(true)} className="cursor-pointer text-center md:text-left hover:underline">
          Delete Account
        </span>
        <span onClick={handleSignout} className="cursor-pointer text-center md:text-left hover:underline">
          Sign Out
        </span>
      </div>

      {error && (
        <Alert color="failure" className="mt-6">
          {error}
        </Alert>
      )}

      <Modal show={showModal} onClose={() => setShowModal(false)} popup size="md">
        <Modal.Header className="bg-red-500 text-white" />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="h-16 w-16 text-red-500 mb-4 mx-auto" />
            <h3 className="mb-5 text-lg font-semibold text-gray-700 dark:text-gray-300">Are you sure you want to delete your account?</h3>
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={handleDeleteUser} className="w-full">
                Yes, I'm sure
              </Button>
              <Button color="gray" onClick={() => setShowModal(false)} className="w-full">
                No
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}
