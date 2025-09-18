import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const Dashboard = ({ user }) => {
  const [userData, setUserData] = useState(null);
  const [stats, setStats] = useState({
    applicationsSubmitted: 0,
    interviewsScheduled: 0,
    jobsSaved: 0,
    profileViews: 0,
  });
  const [recentApplications, setRecentApplications] = useState([]);
  const [savedJobs, setSavedJobs] = useState([]);

  useEffect(() => {
    // Load applications
    const applications = [];
    const getApp = async () => {
      const res = await fetch("http://localhost:3000/user/getApplications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(user),
      });

      const data = await res.json();
      setRecentApplications(data.apps);
      console.log(data.apps);
    };
    let savedJobsData = [];

    const getSavedJobs = async () => {
      try {
        const res = await fetch("http://localhost:3000/user/savedjobs", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ userDets: user }),
        });

        if (!res.ok) {
          throw new Error("Failed to get saved job");
        }

        const data = await res.json();
        setSavedJobs(data.savedjobslist);
        console.log(savedJobs);
      } catch (err) {
        console.error("❌ Error getting saved jobs :", err.message);
      }
    };
    getApp();
    getSavedJobs();
  }, [user]);
  
  useEffect(() => {
    setStats({
      applicationsSubmitted: recentApplications.length,
      interviewsScheduled: recentApplications.filter(
        (app) => app.status === "Interview Scheduled"
      ).length,
      jobsSaved: savedJobs.length,
      profileViews: Math.floor(Math.random() * 50) + 10,
    });
  }, [recentApplications, savedJobs]);
  
  const getStatusColor = (status) => {
    switch (status) {
      case "Under Review":
        return "bg-yellow-100 text-yellow-800";
      case "Interview Scheduled":
        return "bg-blue-100 text-blue-800";
      case "Rejected":
        return "bg-red-100 text-red-800";
      case "Accepted":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Welcome Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome back, {userData ? userData.firstName : "User"}!
        </h1>
        <p className="text-gray-600">
          Here's what's happening with your job search
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-xl">
              <svg
                className="h-6 w-6 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Applications</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats.applicationsSubmitted}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-xl">
              <svg
                className="h-6 w-6 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Interviews</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats.interviewsScheduled}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-xl">
              <svg
                className="h-6 w-6 text-purple-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Saved Jobs</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats.jobsSaved}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center">
            <div className="p-3 bg-orange-100 rounded-xl">
              <svg
                className="h-6 w-6 text-orange-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Profile Views</p>
              <p className="text-2xl font-bold text-gray-900">
                2
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Applications */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">
              Recent Applications
            </h2>
            <Link
              to="/applications"
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              View all
            </Link>
          </div>
          <div className="space-y-4">
            {recentApplications.length > 0 ? (
              recentApplications.map((application) => (
                <div
                  key={application.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-xl"
                >
                  <div>
                    <h3 className="font-medium text-gray-900">
                      {application.jobTitle || application.title}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {application.company}
                    </p>
                    <p className="text-xs text-gray-500 text-left">
                      Applied {application.date.slice(0, 10)}
                    </p>
                  </div>
                  <div className="text-right">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                        application.status || "Under Review"
                      )}`}
                    >
                      {application.status || "Under Review"}
                    </span>
                    <p className="text-xs text-gray-500 mt-1 mr-3">
                      {application.type || "Full-time"}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <div className="mx-auto h-12 w-12 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <svg
                    className="h-6 w-6 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No applications yet
                </h3>
                <p className="text-gray-500 mb-4">
                  Start applying to jobs to see your progress here.
                </p>
                <Link
                  to="/jobs"
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
                >
                  Browse Jobs
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Saved Jobs */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Your Saved Jobs</h2>
            <Link
              to="/saved"
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              View all
            </Link>
          </div>
          <div className="space-y-4">
            {savedJobs.length > 0 ? (
              savedJobs.slice(0, 3).map((job) => (
                <Link key={job.id} to={`/jobs/${job._id}`} className="block">
                  <div className="p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium text-gray-900">{job.title}</h3>
                      <span className="text-sm font-medium text-purple-600">
                        Saved
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{job.company}</p>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>{job.location}</span>
                      <span>${job.salary}</span>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <div className="text-center py-8">
                <div className="mx-auto h-12 w-12 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <svg
                    className="h-6 w-6 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No saved jobs yet
                </h3>
                <p className="text-gray-500 mb-4">
                  Save jobs you're interested in to see them here.
                </p>
                <Link
                  to="/jobs"
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
                >
                  Browse Jobs
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8 bg-white rounded-2xl shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            to="/jobs"
            className="flex items-center p-4 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors"
          >
            <div className="p-3 bg-blue-100 rounded-xl mr-4">
              <svg
                className="h-6 w-6 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">Search Jobs</h3>
              <p className="text-sm text-gray-600">
                Find your next opportunity
              </p>
            </div>
          </Link>

          <Link
            to="/profile"
            className="flex items-center p-4 bg-green-50 rounded-xl hover:bg-green-100 transition-colors"
          >
            <div className="p-3 bg-green-100 rounded-xl mr-4">
              <svg
                className="h-6 w-6 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">Update Profile</h3>
              <p className="text-sm text-gray-600">Keep your profile fresh</p>
            </div>
          </Link>

          <Link
            to="/applications"
            className="flex items-center p-4 bg-purple-50 rounded-xl hover:bg-purple-100 transition-colors"
          >
            <div className="p-3 bg-purple-100 rounded-xl mr-4">
              <svg
                className="h-6 w-6 text-purple-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">Track Applications</h3>
              <p className="text-sm text-gray-600">Monitor your progress</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
