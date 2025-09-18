import { useState, useEffect } from "react";

const JobCard = ({ user, job, onApply }) => {
  const [isSaved, setIsSaved] = useState(false);
  const [savedJobs, setSavedJobs] = useState([]);

  useEffect(() => {
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

        const isJobSaved = data.savedjobslist.some(
          (savedJob) => savedJob._id === job._id
        );
        setIsSaved(isJobSaved);
      } catch (err) {
        console.error("❌ Error getting saved jobs :", err.message);
      }
    };
    getSavedJobs();
  }, [job._id, user]);

  const handleSave = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      const res = await fetch("http://localhost:3000/user/saveJob", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ job, userDets: user }),
      });

      if (!res.ok) throw new Error("Failed to save job");

      const data = await res.json();

      setIsSaved(true);
    } catch (err) {
      console.error("❌ Error saving job:", err.message);
    }
  };

  const getExperienceColor = (experience) => {
    switch (experience) {
      case "1-3 years":
        return "bg-green-100 text-green-800";
      case "3-5 years":
        return "bg-pink-100 text-pink-800";
      case "2-4 years":
        return "bg-orange-100 text-orange-800";
      case "5-8 years":
        return "bg-cyan-100 text-cyan-800";
      case "10+ years":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const   getJobTypeColor = (type) => {
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

  const handleApply = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onApply(job);
  };

  return (
    <div className="block group">
      <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 overflow-hidden">
        {/* Company Header */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-4">
              <div className="h-12 w-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">
                  {job.company.charAt(0)}
                </span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                  {job.title}
                </h3>
                <p className="text-gray-600 font-medium">{job.company}</p>
                <p className="text-gray-500 text-sm">{job.location}</p>
              </div>
            </div>
            <button
              onClick={handleSave}
              className={`p-2 rounded-full transition-colors ${
                isSaved
                  ? "text-red-500 bg-red-50 hover:bg-red-100"
                  : "text-gray-400 hover:text-red-500 hover:bg-red-50"
              }`}
            >
              <svg
                className="h-5 w-5"
                fill={isSaved ? "currentColor" : "none"}
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
            </button>
          </div>
        </div>

        {/* Job Details */}
        <div className="p-6">
          <p className="text-gray-700 mb-4 line-clamp-2">{job.description}</p>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-4">
            <span
              className={`px-3 py-1 rounded-full text-xs font-medium ${getJobTypeColor(
                job.type
              )}`}
            >
              {job.type}
            </span>
            <span
              className={`px-3 py-1 rounded-full text-xs font-medium ${getExperienceColor(
                job.experience
              )}`}
            >
              {job.experience}
            </span>
            {job.skills.slice(0, 2).map((skill, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium"
              >
                {skill}
              </span>
            ))}
            {job.skills.length > 2 && (
              <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                +{job.skills.length - 2} more
              </span>
            )}
          </div>

          {/* Salary and Posted Date */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <span className="text-lg font-bold text-green-600">
                ${job.salary}
              </span>
              <span className="text-gray-500 text-sm">{job.postedDate}</span>
            </div>
            <button
              onClick={handleApply}
              className="flex items-center text-blue-600 text-sm font-medium hover:text-blue-700 transition-colors"
            >
              Show Details
              <svg
                className="ml-1 h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobCard;
