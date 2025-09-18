import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const Apply = ({user}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const job = location.state?.job;

  const [userData, setUserData] = useState(null);
  const [formData, setFormData] = useState({
    resumeURL: 'https://flowbite.com/docs/forms/file-input/', // Use URL instead of file
    coverLetter: 'abcd'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Load user data from localStorage
    setUserData(user);

    // Redirect if no job selected
    if (!job) navigate('/jobs');
  }, [job, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    console.log(job);
    
    e.preventDefault();

    if (!formData.resumeURL) {
      alert('Please provide your resume URL before applying.');
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch('http://localhost:3000/user/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          userDets: userData,
          jobId: job._id,
          resumeURL: formData.resumeURL,
          coverLetter: formData.coverLetter
        })
      });

      if (!res.ok) throw new Error('Failed to submit application');

      const data = await res.json();
      alert('Application submitted successfully!');
      navigate('/dashboard');
    } catch (error) {
      console.error('Error submitting application:', error);
      alert('Error submitting application. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!job) return null; // already redirected

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-600 hover:text-gray-800 transition-colors mb-4"
          >
            <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Job Details
          </button>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center space-x-4 mb-4">
              <div className="h-16 w-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-2xl">{job.company.charAt(0)}</span>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{job.title}</h1>
                <p className="text-xl text-gray-600">{job.company}</p>
                <p className="text-gray-500">{job.location}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Apply Form */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Apply for this Position</h2>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* User Info */}
            {userData && (
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-blue-900 mb-4">Your Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-blue-800">Name:</span>
                    <p className="text-blue-700">{userData.firstName} {userData.lastName}</p>
                  </div>
                  <div>
                    <span className="font-medium text-blue-800">Email:</span>
                    <p className="text-blue-700">{userData.email}</p>
                  </div>
                  <div>
                    <span className="font-medium text-blue-800">Phone:</span>
                    <p className="text-blue-700">{userData.phone}</p>
                  </div>
                  <div>
                    <span className="font-medium text-blue-800">Experience:</span>
                    <p className="text-blue-700">{userData.experience} years</p>
                  </div>
                </div>
                <p className="text-xs text-blue-600 mt-4">
                  ✓ Your information will be automatically used for this application
                </p>
              </div>
            )}

            {/* Resume URL */}
            <div>
              <label htmlFor="resumeURL" className="block text-lg font-medium text-gray-700 mb-4">
                Resume URL *
              </label>
              <input
                type="url"
                id="resumeURL"
                name="resumeURL"
                placeholder="Enter your resume URL (e.g., Google Drive link)"
                value={formData.resumeURL}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Cover Letter */}
            <div>
              <label htmlFor="coverLetter" className="block text-lg font-medium text-gray-700 mb-4">
                Cover Letter (Optional)
              </label>
              <textarea
                id="coverLetter"
                name="coverLetter"
                value={formData.coverLetter}
                onChange={handleInputChange}
                rows={6}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Tell us why you're interested in this position and what makes you a great fit..."
              />
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-4 pt-8 border-t border-gray-200">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="px-8 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-8 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium flex items-center"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Submitting...
                  </>
                ) : (
                  'Submit Application'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Apply;
