import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'

const JobDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [job, setJob] = useState(null)
  const [isApplying, setIsApplying] = useState(false)
  const [applicationData, setApplicationData] = useState({
    coverLetter: '',
    resume: null,
    expectedSalary: '',
    availability: '',
    additionalInfo: ''
  })

  // Fetch job from server
  useEffect(() => {
    console.log(id);
    
    const fetchJob = async () => {
      try {
        const res = await fetch("http://localhost:3000/user/getJobDetails", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          credentials: "include",
          body: JSON.stringify({ jobID : id })
        });
        const data = await res.json()

        // merge server data with hardcoded fields
        setJob({
          ...data,
          fullDescription: `We are seeking a talented Senior Frontend Developer to join our growing team at TechCorp. In this role, you will be responsible for developing and maintaining our web applications using modern frontend technologies.

## Key Responsibilities:
- Develop and maintain responsive web applications using React and TypeScript
- Collaborate with designers and backend developers to implement user interfaces
- Write clean, maintainable, and well-tested code
- Optimize applications for maximum speed and scalability
- Participate in code reviews and technical discussions
- Mentor junior developers and contribute to team knowledge sharing

## Requirements:
- 3-5 years of experience in frontend development
- Strong proficiency in React, TypeScript, and modern JavaScript
- Experience with state management libraries (Redux, Zustand, etc.)
- Knowledge of CSS frameworks like Tailwind CSS or styled-components
- Experience with testing frameworks (Jest, React Testing Library)
- Understanding of RESTful APIs and GraphQL
- Familiarity with version control systems (Git)
- Strong problem-solving and communication skills`,
          benefits: [
            'Competitive salary and equity package',
            'Comprehensive health, dental, and vision insurance',
            'Flexible work arrangements and remote work options',
            'Professional development budget',
            '401(k) with company matching',
            'Unlimited PTO policy',
            'Modern office space with great amenities'
          ],
          requirements: [
            '3-5 years of frontend development experience',
            'Strong proficiency in React and TypeScript',
            'Experience with modern CSS frameworks',
            'Knowledge of testing frameworks',
            'Understanding of RESTful APIs',
            'Strong problem-solving skills'
          ]
        })
      } catch (error) {
        console.error('Error fetching job:', error)
      }
    }
    fetchJob()
  }, [id])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setApplicationData({
      ...applicationData,
      [name]: value
    })
  }

  const handleFileChange = (e) => {
    setApplicationData({
      ...applicationData,
      resume: e.target.files[0]
    })
  }

  const handleSubmitApplication = (e) => {
    e.preventDefault()
    console.log('Application data:', applicationData)
    setIsApplying(false)
  }

  if (!job) {
    return <div className="text-center py-20">Loading job details...</div>
  }

  if (isApplying) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="mb-6">
            <button
              onClick={() => setIsApplying(false)}
              className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
            >
              <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Job Details
            </button>
            <h2 className="text-2xl font-bold text-gray-900">Apply for {job.title}</h2>
            <p className="text-gray-600">at {job.company}</p>
          </div>

          <form onSubmit={handleSubmitApplication} className="space-y-6">
            {/* Cover Letter */}
            <div>
              <label htmlFor="coverLetter" className="block text-sm font-medium text-gray-700 mb-2">
                Cover Letter *
              </label>
              <textarea
                id="coverLetter"
                name="coverLetter"
                rows={6}
                required
                value={applicationData.coverLetter}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Tell us why you're interested in this position and what makes you a great fit..."
              />
            </div>

            {/* Resume Upload */}
            <div>
              <label htmlFor="resume" className="block text-sm font-medium text-gray-700 mb-2">
                Resume/CV *
              </label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-xl hover:border-gray-400 transition-colors">
                <div className="space-y-1 text-center">
                  <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                    <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <div className="flex text-sm text-gray-600">
                    <label htmlFor="resume" className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                      <span>Upload a file</span>
                      <input
                        id="resume"
                        name="resume"
                        type="file"
                        accept=".pdf,.doc,.docx"
                        required
                        onChange={handleFileChange}
                        className="sr-only"
                      />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500">PDF, DOC, DOCX up to 10MB</p>
                  {applicationData.resume && (
                    <p className="text-sm text-green-600 font-medium">
                      Selected: {applicationData.resume.name}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Expected Salary */}
            <div>
              <label htmlFor="expectedSalary" className="block text-sm font-medium text-gray-700 mb-2">
                Expected Salary
              </label>
              <input
                type="text"
                id="expectedSalary"
                name="expectedSalary"
                value={applicationData.expectedSalary}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., $120,000 - $150,000"
              />
            </div>

            {/* Availability */}
            <div>
              <label htmlFor="availability" className="block text-sm font-medium text-gray-700 mb-2">
                When can you start?
              </label>
              <select
                id="availability"
                name="availability"
                value={applicationData.availability}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select availability</option>
                <option value="immediately">Immediately</option>
                <option value="2-weeks">2 weeks notice</option>
                <option value="1-month">1 month notice</option>
                <option value="2-months">2 months notice</option>
                <option value="flexible">Flexible</option>
              </select>
            </div>

            {/* Additional Information */}
            <div>
              <label htmlFor="additionalInfo" className="block text-sm font-medium text-gray-700 mb-2">
                Additional Information
              </label>
              <textarea
                id="additionalInfo"
                name="additionalInfo"
                rows={4}
                value={applicationData.additionalInfo}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Any additional information you'd like to share..."
              />
            </div>

            {/* Submit Button */}
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => setIsApplying(false)}
                className="px-6 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105"
              >
                Submit Application
              </button>
            </div>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back Button */}
      <button
        onClick={() => navigate('/jobs')}
        className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
      >
        <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to Jobs
      </button>

      {/* Job Header */}
      <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className="h-16 w-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center">
              <span className="text-white font-bold text-2xl">
                {job.company.charAt(0)}
              </span>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{job.title}</h1>
              <p className="text-xl text-gray-600 font-medium">{job.company}</p>
              <p className="text-gray-500">{job.location}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-green-600">{job.salary}</p>
            <p className="text-gray-500">Posted {job.postedDate}</p>
          </div>
        </div>

        {/* Job Tags */}
        <div className="flex flex-wrap gap-2 mb-6">
          <span className="px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
            {job.type}
          </span>
          <span className="px-4 py-2 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
            {job.experience}
          </span>
          {job.skills.slice(0, 3).map((skill, index) => (
            <span key={index} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
              {skill}
            </span>
          ))}
        </div>

        {/* Apply Button */}
        <button
          onClick={() => navigate('/apply', { state: { job } })}
          className="w-full md:w-auto px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 font-medium text-lg"
        >
          Apply for this position
        </button>
      </div>

      {/* Job Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Description */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Job Description</h2>
            <div className="prose prose-gray max-w-none">
              {job.fullDescription.split('\n').map((paragraph, index) => (
                <p key={index} className="text-gray-700 mb-4">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>

          {/* Requirements */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Requirements</h2>
            <ul className="space-y-2">
              {job.requirements.map((requirement, index) => (
                <li key={index} className="flex items-start">
                  <svg className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">{requirement}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Benefits */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Benefits & Perks</h3>
            <ul className="space-y-2">
              {job.benefits.map((benefit, index) => (
                <li key={index} className="flex items-start">
                  <svg className="h-5 w-5 text-blue-500 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700 text-sm">{benefit}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Info */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">About {job.company}</h3>
            <p className="text-gray-700 text-sm mb-4">
              TechCorp is a leading technology company focused on building innovative solutions that make a difference in people's lives.
            </p>
            <div className="space-y-2 text-sm text-gray-600">
              <p><span className="font-medium">Industry:</span> Technology</p>
              <p><span className="font-medium">Company Size:</span> 500+ employees</p>
              <p><span className="font-medium">Founded:</span> 2015</p>
              <p><span className="font-medium">Location:</span> San Francisco, CA</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default JobDetails
