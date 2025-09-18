import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import JobCard from "../components/JobCard";
import JobDetailsModal from "../components/JobDetailsModal";

const Jobs = ({user}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedExperience, setSelectedExperience] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [selectedJob, setSelectedJob] = useState(null);
  const [isJobDetailsModalOpen, setIsJobDetailsModalOpen] = useState(false);

  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = async () => {
    setIsLoading(true);
    try {
      const userData = localStorage.getItem("token");
      if (!userData) {
        setIsLoading(false);
        return;
      }

      fetch("http://localhost:3000/api/jobs", {
        method: "GET",
        credentials: "include", 
      })
      .then((res) => res.json())
      .then((data) => {
        setJobs(data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching jobs:", err);
        setIsLoading(false);
      });

    } catch (error) {
      console.error("Error loading jobs:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.skills.some((skill) =>
        skill.toLowerCase().includes(searchTerm.toLowerCase())
      );
    const matchesLocation =
      !selectedLocation ||
      job.location.toLowerCase().includes(selectedLocation.toLowerCase());
    const matchesExperience =
      !selectedExperience || job.experience === selectedExperience;
    const matchesType = !selectedType || job.type === selectedType;

    return matchesSearch && matchesLocation && matchesExperience && matchesType;
  });

  const handleJobClick = (job) => {
    setSelectedJob(job);
    setIsJobDetailsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsJobDetailsModalOpen(false);
    setSelectedJob(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl mb-4">
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
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Find Your Dream Job
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Discover opportunities that match your skills and aspirations. Start
          your career journey today.
        </p>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Search */}
          <div className="lg:col-span-2">
            <label
              htmlFor="search"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Search Jobs
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  className="h-5 w-5 text-gray-400"
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
              <input
                type="text"
                id="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Job title, company, or skills..."
              />
            </div>
          </div>

          {/* Location Filter */}
          <div>
            <label
              htmlFor="location"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Location
            </label>
            <select
              id="location"
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="block w-full px-3 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Locations</option>
              <option value="mountain view">Mountain View, CA</option>
              <option value="san francisco">San Francisco, CA</option>
              <option value="new york">New York, NY</option>
              <option value="remote">Remote</option>
              <option value="austin">Austin, TX</option>
              <option value="seattle">Seattle, WA</option>
              <option value="chicago">Chicago, IL</option>
            </select>
          </div>

          {/* Experience Filter */}
          <div>
            <label
              htmlFor="experience"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Experience
            </label>
            <select
              id="experience"
              value={selectedExperience}
              onChange={(e) => setSelectedExperience(e.target.value)}
              className="block w-full px-3 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Levels</option>
              <option value="0-2 years">0-2 years</option>
              <option value="1-3 years">1-3 years</option>
              <option value="2-4 years">2-4 years</option>
              <option value="3-5 years">3-5 years</option>
              <option value="4-6 years">4-6 years</option>
              <option value="5-8 years">5-8 years</option>
              <option value="10+ years">10+ years</option>
            </select>
          </div>
        </div>

        {/* Job Type Filter */}
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Job Type
          </label>
          <div className="flex flex-wrap gap-2">
            {["All", "Full-time", "Part-time", "Contract", "Remote"].map(
              (type) => (
                <button
                  key={type}
                  onClick={() => setSelectedType(type === "All" ? "" : type)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedType === type || (type === "All" && !selectedType)
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {type}
                </button>
              )
            )}
          </div>
        </div>
      </div>

      {/* Results Count */}
      {filteredJobs.length > 0 && (
        <div className="mb-6">
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <p className="text-blue-800">
              <span className="font-semibold">{filteredJobs.length}</span> job
              {filteredJobs.length !== 1 ? "s" : ""} found
              {searchTerm && ` for "${searchTerm}"`}
            </p>
          </div>
        </div>
      )}

      {/* Loading State */}
      {isLoading ? (
        <div className="text-center py-12">
          <div className="mx-auto h-24 w-24 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full flex items-center justify-center mb-6">
            <svg
              className="animate-spin h-12 w-12 text-blue-500"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Loading Jobs...
          </h3>
          <p className="text-gray-600">
            Please wait while we fetch the latest job opportunities.
          </p>
        </div>
      ) : filteredJobs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredJobs.map((job) => (
            <JobCard user={user} key={job.id} job={job} onApply={handleJobClick} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="mx-auto h-24 w-24 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full flex items-center justify-center mb-6">
            <svg
              className="h-12 w-12 text-blue-500"
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
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            No jobs available
          </h3>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            We're working on adding more job opportunities. Check back soon or
            try adjusting your search criteria.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => {
                setSearchTerm("");
                setSelectedLocation("");
                setSelectedExperience("");
                setSelectedType("");
              }}
              className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
            >
              Clear Filters
            </button>
            <Link
              to="/profile"
              className="px-6 py-3 border-2 border-blue-600 text-blue-600 rounded-xl hover:bg-blue-50 transition-colors"
            >
              Complete Profile
            </Link>
          </div>
        </div>
      )}

      {/* Job Details Modal */}
      {selectedJob && (
        <JobDetailsModal
          job={selectedJob}
          isOpen={isJobDetailsModalOpen}
          onClose={handleCloseModal}
          user={user}
        />
      )}
    </div>
  );
};

export default Jobs;
