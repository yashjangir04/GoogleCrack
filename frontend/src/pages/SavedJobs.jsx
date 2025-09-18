import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const SavedJobs = ({ user }) => {
  const [savedJobs, setSavedJobs] = useState([]);

  useEffect(() => {
    const getSavedJobs = async () => {
      try {
        const res = await fetch("http://localhost:3000/user/savedjobs", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          credentials: "include",
          body: JSON.stringify({ userDets : user })
        });

        if (!res.ok) {
          throw new Error("Failed to get saved job");
        }

        const data = await res.json();
        setSavedJobs(data.savedjobslist);
        
      } catch (err) {
        console.error("❌ Error getting saved jobs :", err.message);
      }
    };
    getSavedJobs() ;
  }, []);

  const handleRemove = async (jobId) => {
    console.log(jobId);
    
    try {
      const res = await fetch("http://localhost:3000/user/removeJob", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // important if you're using cookies
        body: JSON.stringify({ jobId: jobId, userDets: user }),
      });

      if (!res.ok) {
        throw new Error("Failed to remove job");
      }

      const data = await res.json();
      setSavedJobs(data.savedones)
    } catch (err) {
      console.error("❌ Error removing job:", err.message);
    }
  };

  const getJobTypeColor = (type) => {
    switch (type) {
      case "Full-time":
        return "bg-blue-100 text-blue-800";
      case "Part-time":
        return "bg-purple-100 text-purple-800";
      case "Contract":
        return "bg-indigo-100 text-indigo-800";
      case "Remote":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl mb-4">
          <svg
            className="w-8 h-8 text-white"
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
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Saved Jobs</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Your bookmarked job opportunities. Keep track of positions you're
          interested in.
        </p>
      </div>

      {/* Stats */}
      {savedJobs.length > 0 && (
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Total Saved Jobs
              </h2>
              <p className="text-4xl font-bold text-purple-600 mt-2">
                {savedJobs.length}
              </p>
            </div>
            <div className="p-6 bg-gradient-to-r from-purple-100 to-pink-100 rounded-2xl">
              <svg
                className="h-10 w-10 text-purple-600"
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
          </div>
        </div>
      )}

      {/* Saved Jobs List */}
      <div className="space-y-6">
        {savedJobs.map((job) => (
          <div
            key={job.id}
            className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="h-12 w-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                    <span className="text-white font-bold text-lg">
                      {job.company.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">
                      {job.title}
                    </h3>
                    <p className="text-gray-600 font-medium text-left">{job.company}</p>
                    <p className="text-sm text-gray-500 text-left">{job.location}</p>
                  </div>
                </div>

                <p className="text-gray-700 mb-4 text-left">{job.description}</p>

                <div className="flex flex-wrap gap-2 mb-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${getJobTypeColor(
                      job.type
                    )}`}
                  >
                    {job.type}
                  </span>
                  <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">
                    {job.experience}
                  </span>
                  {job.skills.slice(0, 3).map((skill, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <span className="font-semibold text-green-600">
                      {job.salary}
                    </span>
                    <span>Saved {job.savedDate}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Link
                      to={`/jobs/${job._id}`}
                      className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors text-sm font-medium"
                    >
                      View Details
                    </Link>
                    <button
                      onClick={() => handleRemove(job._id)}
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors text-sm font-medium"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {savedJobs.length === 0 && (  
        <div className="text-center py-12">
          <div className="mx-auto h-24 w-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <svg
              className="h-12 w-12 text-gray-400"
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
            Start exploring jobs and save the ones you're interested in.
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
  );
};

export default SavedJobs;
