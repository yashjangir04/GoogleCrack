import { useEffect, useState } from "react";

const MyApplications = ({ user }) => {
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    const getApp = async () => {
      const res = await fetch("http://localhost:3000/user/getApplications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(user),
      });

      const data = await res.json() ;
      setApplications(data.apps)
    };
    getApp() ;

  }, [user]);

  return (
    <div>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          My Applications
        </h1>

        {applications.length === 0 ? (
          <div className="p-8 text-center text-gray-500 bg-white rounded-2xl shadow">
            You have not applied to any jobs yet.
          </div>
        ) : (
          <div className="space-y-4">
            {applications.map((app) => (
              <div
                key={app.id}
                className="bg-white shadow rounded-2xl p-6 flex items-center justify-between"
              >
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 text-left">
                    {app.jobTitle}
                  </h3>
                  <p className="text-sm text-gray-500 text-left">
                    Date: {app.date}
                  </p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    app.status === "Accepted"
                      ? "bg-green-100 text-green-800"
                      : app.status === "Rejected"
                      ? "bg-red-100 text-red-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {app.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyApplications;
