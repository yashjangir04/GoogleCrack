import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const JobDetailsModal = ({ job, isOpen, onClose , user}) => {
  const navigate = useNavigate() ;
  const [userData, setUserData] = useState(null) ;
  const [jobData , setJobData] = useState(null) ;

  useEffect(() => {
    setUserData(user);
    setJobData(job) ;
  
  }, [])

  if (!isOpen || !job) return null

  const handleApply = () => {
    navigate('/apply', { state: { job } })
  }

  const handleSaveJob = async () => {
    console.log(job);
    
    try {
      const res = await fetch("http://localhost:3000/user/saveJob", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify({ job : job , userDets : user })
      });

      if (!res.ok) {
        throw new Error("Failed to save job");
      }

      const data = await res.json();
      console.log("✅ Job saved:", data);
    } catch (err) {
      console.error("❌ Error saving job:", err.message);
    }
  }

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="h-16 w-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-2xl">
                    {job.company.charAt(0)}
                  </span>
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-gray-900">{job.title}</h2>
                  <p className="text-xl text-gray-600">{job.company}</p>
                  <p className="text-gray-500">{job.location}</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Main Content - Two Column Layout */}
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Side - Job Details */}
              <div className="space-y-6">
                {/* Job Description */}
                <div>
                  <p className="text-gray-700 leading-relaxed text-lg">
                    {job.description}
                  </p>
                </div>

                {/* Requirements */}
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Requirements</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-start">
                      <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      {job.experience} of relevant experience
                    </li>
                    <li className="flex items-start">
                      <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Strong problem-solving skills
                    </li>
                    <li className="flex items-start">
                      <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Excellent communication skills
                    </li>
                    <li className="flex items-start">
                      <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Ability to work in a team environment
                    </li>
                  </ul>
                </div>

                {/* Skills */}
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Required Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {job.skills.map((skill, index) => (
                      <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Side - Job Info and Apply Form */}
              <div className="space-y-6">
                {/* Job Information Card */}
                <div className="bg-gray-50 rounded-xl p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Job Information</h3>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-600">Job Type</p>
                      <p className="font-medium text-gray-900">{job.type}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Experience Level</p>
                      <p className="font-medium text-gray-900">{job.experience}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Location</p>
                      <p className="font-medium text-gray-900">{job.location}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Salary</p>
                      <p className="font-medium text-green-600 text-lg">${job.salary}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Posted</p>
                      <p className="font-medium text-gray-900">{job.postedDate}</p>
                    </div>
                  </div>
                </div>

                {/* Apply Now Button */}
                <button
                  onClick={handleApply}
                  className="w-full bg-blue-600 text-white py-3 px-6 rounded-xl hover:bg-blue-700 transition-colors font-medium text-lg"
                >
                  Apply Now
                </button>

                {/* Save Job Button */}
                <button 
                  onClick={handleSaveJob}
                  className="w-full border-2 border-gray-300 text-gray-700 py-3 px-6 rounded-xl hover:bg-gray-50 transition-colors font-medium"
                >
                  Save Job
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

    </>
  )
}

export default JobDetailsModal
