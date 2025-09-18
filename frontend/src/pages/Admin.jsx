import { useEffect, useMemo, useState } from "react";

const Admin = ({ user }) => {
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [applicants, setApplicants] = useState([]);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const res = await fetch("http://localhost:3000/apps/getApplications", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        if (!res.ok) throw new Error("Failed to fetch applications");

        const data = await res.json();
        console.log(data);

        const mapped = data.applications.map((app) => ({
          id: app.id,
          name: `${app.applicant}`.trim() || "Unknown",
          email: app.email || "", // ✅ include email for notifications
          post: app.jobTitle || "N/A",
          resume: app.resume || "#",
          status: app.status || "Under Review",
        }));
        console.log(mapped);

        setApplicants(mapped);
      } catch (err) {
        console.error("Error fetching applications", err);
      }
    };
    fetchApplications();
  }, []);

  const updateStatus = async (id, status, email) => {
    console.log(email);
    
    try {
      const current = applicants.find((a) => a.id === id);
      if (!current || current.status === "Accepted" || current.status === "Rejected") {
        return;
      }

      // Update status in backend
      const res = await fetch("http://localhost:3000/apps/updateStatus", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ applicationId: id, status }),
      });

      if (!res.ok) throw new Error("Failed to update status");

      // If accepted → send separate request with email
      if (status === "Accepted" && email) {
        try {
          await fetch("http://localhost:3000/api/sendEmail", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email }),
          });
        } catch (mailErr) {
          console.error("Error sending interview email:", mailErr);
        }
      }

      // Update local state
      setApplicants((prev) =>
        prev.map((a) => (a.id === id ? { ...a, status } : a))
      );
    } catch (err) {
      console.error("Error updating status", err);
    }
  };

  const filtered = useMemo(() => {
    const s = search.trim().toLowerCase();
    const list = s
      ? applicants.filter(
          (a) =>
            a.name.toLowerCase().includes(s) || a.post.toLowerCase().includes(s)
        )
      : applicants;
    const sorted = [...list].sort((a, b) => {
      if (sortBy === "name") return a.name.localeCompare(b.name);
      if (sortBy === "post") return a.post.localeCompare(b.post);
      if (sortBy === "status") return a.status.localeCompare(b.status);
      return 0;
    });
    return sorted;
  }, [applicants, search, sortBy]);

  // Stats
  const stats = useMemo(
    () => ({
      total: applicants.length,
      accepted: applicants.filter((a) => a.status === "Accepted").length,
      rejected: applicants.filter((a) => a.status === "Rejected").length,
      review: applicants.filter((a) => a.status === "Under Review").length,
    }),
    [applicants]
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Admin - Applications Review
        </h1>
        <p className="text-gray-600">
          All applied jobs with applicant details and decisions
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <StatCard label="Total" value={stats.total} color="text-gray-900" />
        <StatCard
          label="Under Review"
          value={stats.review}
          color="text-yellow-600"
        />
        <StatCard
          label="Accepted"
          value={stats.accepted}
          color="text-green-700"
        />
        <StatCard
          label="Rejected"
          value={stats.rejected}
          color="text-red-700"
        />
      </div>

      {/* Search + Sort */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or post..."
            className="w-full md:w-1/2 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <div className="flex items-center space-x-3">
            <label className="text-sm text-gray-700">Sort by</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="name">Name</option>
              <option value="post">Post</option>
              <option value="status">Status</option>
            </select>
          </div>
        </div>
      </div>

      {/* Applications Table */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <Th>Name</Th>
                <Th>Job Post</Th>
                <Th>Resume</Th>
                <Th>Status</Th>
                <Th right>Actions</Th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filtered.map((app) => (
                <tr key={app.id} className="hover:bg-gray-50">
                  <Td>{app.name}</Td>
                  <Td>{app.post}</Td>
                  <Td>
                    <a
                      href={app.resume}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline text-sm"
                    >
                      View Resume
                    </a>
                  </Td>
                  <Td>
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                        app.status === "Accepted"
                          ? "bg-green-100 text-green-800"
                          : app.status === "Rejected"
                          ? "bg-red-100 text-red-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {app.status}
                    </span>
                  </Td>
                  <Td right>
                    <div className="inline-flex items-center space-x-2">
                      <Button
                        onClick={() =>
                          updateStatus(app.id, "Accepted", app.email)
                        }
                        disabled={
                          app.status === "Accepted" || app.status === "Rejected"
                        }
                        color="green"
                      >
                        Approve
                      </Button>
                      <Button
                        onClick={() => updateStatus(app.id, "Rejected")}
                        disabled={
                          app.status === "Accepted" || app.status === "Rejected"
                        }
                        color="red"
                      >
                        Reject
                      </Button>
                    </div>
                  </Td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="p-8 text-center text-gray-500">No applicants found.</div>
        )}
      </div>
    </div>
  );
};

// Small helper components for readability
const StatCard = ({ label, value, color }) => (
  <div className="bg-white rounded-2xl shadow-lg p-6">
    <p className="text-sm text-gray-600">{label}</p>
    <p className={`text-2xl font-bold ${color}`}>{value}</p>
  </div>
);

const Th = ({ children, right }) => (
  <th
    className={`px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider ${
      right ? "text-right" : "text-left"
    }`}
  >
    {children}
  </th>
);

const Td = ({ children, right }) => (
  <td
    className={`px-6 py-4 whitespace-nowrap text-sm text-gray-700 ${
      right ? "text-right" : ""
    }`}
  >
    {children}
  </td>
);

const Button = ({ children, onClick, disabled, color }) => {
  const base = "px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50";
  const colors = {
    green: "bg-green-600 text-white hover:bg-green-700",
    red: "bg-red-600 text-white hover:bg-red-700",
    gray: "bg-gray-100 text-gray-800 hover:bg-gray-200",
  };
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${colors[color]}`}
    >
      {children}
    </button>
  );
};

export default Admin;
