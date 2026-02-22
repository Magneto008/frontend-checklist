import React, { useState, useEffect } from "react";
import { Eye, Trash2, Plus, Check, ChevronRight } from "lucide-react";

const API_BASE_URL =
  "https://release-checklist-backend.onrender.com/api/releases";

type Release = {
  id: string;
  name: string;
  due_date: string;
  additional_info: null;
  steps: {
    qa_done: boolean;
    code_freeze: boolean;
    tests_passed: boolean;
    prod_deployed: boolean;
    staging_deployed: boolean;
    monitoring_enabled: boolean;
    release_notes_sent: boolean;
  };
  created_at: string;
  updated_at: string;
  status: string;
};

const DEFAULT_STEPS: Release = [
  {
    id: "pr_merged",
    label: "All relevant GitHub pull requests have been merged",
    completed: false,
  },
  {
    id: "changelog",
    label: "CHANGELOG.md files have been updated",
    completed: false,
  },
  { id: "tests", label: "All tests are passing", completed: false },
  { id: "gh_release", label: "Releases in Github created", completed: false },
  { id: "demo_deploy", label: "Deployed in demo", completed: false },
  { id: "demo_test", label: "Tested thoroughly in demo", completed: false },
  { id: "prod_deploy", label: "Deployed in production", completed: false },
];

export default function ReleaseCheckApp() {
  const [releases, setReleases] = useState<Release[]>([]);
  const [currentView, setCurrentView] = useState<"list" | "detail">("list");
  const [activeRelease, setActiveRelease] = useState<Release | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // --- API Calls ---
  const fetchReleases = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(API_BASE_URL);
      if (response.ok) {
        const data = await response.json();
        setReleases(data);
      }
    } catch (error) {
      console.error("Failed to fetch releases:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (currentView === "list") {
      fetchReleases();
    }
  }, [currentView]);

  const saveRelease = async (release: Release) => {
    const isNew = !release._id;
    const url = isNew ? API_BASE_URL : `${API_BASE_URL}/${release._id}`;
    const method = isNew ? "POST" : "PUT";

    try {
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(release),
      });
      if (response.ok) {
        setCurrentView("list");
      }
    } catch (error) {
      console.error("Failed to save release:", error);
    }
  };

  const deleteRelease = async (id: string) => {
    if (!confirm("Are you sure you want to delete this release?")) return;
    try {
      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        if (currentView === "detail") {
          setCurrentView("list");
        } else {
          fetchReleases();
        }
      }
    } catch (error) {
      console.error("Failed to delete release:", error);
    }
  };

  // --- Helper Functions ---
  const getStatus = (steps: Step[] = []) => {
    if (!steps || steps.length === 0) return "Planned";
    const completedCount = steps.filter((s) => s.completed).length;
    if (completedCount === 0) return "Planned";
    if (completedCount === steps.length) return "Done";
    return "Ongoing";
  };

  const handleNewRelease = () => {
    setActiveRelease({
      name: "",
      dueDate: new Date().toISOString().split("T")[0], // YYYY-MM-DD
      remarks: "",
      steps: [...DEFAULT_STEPS],
    });
    setCurrentView("detail");
  };

  const handleViewRelease = (release: Release) => {
    // Ensure legacy data has steps mapped correctly
    const steps = release.steps?.length ? release.steps : [...DEFAULT_STEPS];
    setActiveRelease({ ...release, steps });
    setCurrentView("detail");
  };

  // --- Sub-components ---
  const Header = () => (
    <div className="text-center mb-10 mt-12">
      <h1 className="text-4xl font-bold text-gray-900 mb-2">ReleaseCheck</h1>
      <p className="text-gray-600">Your all-in-one release checklist tool</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F1F5F9] font-sans flex flex-col items-center pb-12">
      <Header />

      <main className="w-full max-w-4xl px-4">
        {currentView === "list" && (
          <div className="bg-white border border-gray-200 shadow-sm rounded-md overflow-hidden">
            <div className="flex justify-between items-center p-4 border-b border-gray-200 bg-slate-50">
              <span className="text-indigo-500 font-medium border-b-2 border-indigo-500 pb-1">
                All releases
              </span>
              <button
                onClick={handleNewRelease}
                className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded flex items-center gap-2 text-sm font-medium transition-colors"
              >
                New release <Plus size={16} />
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="p-4 font-semibold text-gray-800 border-r border-gray-200">
                      Release
                    </th>
                    <th className="p-4 font-semibold text-gray-800 border-r border-gray-200">
                      Date
                    </th>
                    <th className="p-4 font-semibold text-gray-800 border-r border-gray-200">
                      Status
                    </th>
                    <th className="p-4 font-semibold text-gray-800 w-24"></th>
                    <th className="p-4 font-semibold text-gray-800 w-24"></th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-gray-500">
                        Loading...
                      </td>
                    </tr>
                  ) : releases.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-gray-500">
                        No releases found. Create one!
                      </td>
                    </tr>
                  ) : (
                    releases.map((release, idx) => (
                      <tr
                        key={release._id || idx}
                        className="border-b border-gray-200 hover:bg-slate-50"
                      >
                        <td className="p-4 border-r border-gray-200 text-gray-700">
                          {release.name}
                        </td>
                        <td className="p-4 border-r border-gray-200 text-gray-700">
                          {release.dueDate}
                        </td>
                        <td className="p-4 border-r border-gray-200 text-gray-700">
                          {getStatus(release.steps)}
                        </td>
                        <td className="p-4 border-r border-gray-200 text-center">
                          <button
                            onClick={() => handleViewRelease(release)}
                            className="text-gray-600 hover:text-indigo-600 flex items-center justify-center w-full gap-2"
                          >
                            View <Eye size={18} />
                          </button>
                        </td>
                        <td className="p-4 text-center">
                          <button
                            onClick={() =>
                              release._id && deleteRelease(release._id)
                            }
                            className="text-gray-600 hover:text-red-600 flex items-center justify-center w-full gap-2"
                          >
                            Delete <Trash2 size={18} />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {currentView === "detail" && activeRelease && (
          <div className="bg-white border border-gray-200 shadow-sm rounded-md overflow-hidden">
            <div className="flex justify-between items-center p-4 border-b border-gray-200 bg-slate-50">
              <div className="flex items-center gap-2 text-indigo-500 font-medium">
                <button
                  onClick={() => setCurrentView("list")}
                  className="hover:underline"
                >
                  All releases
                </button>
                <ChevronRight size={16} className="text-gray-400" />
                <span className="text-indigo-300 font-normal">
                  {activeRelease.name || "New Release"}
                </span>
              </div>
              {activeRelease._id && (
                <button
                  onClick={() => deleteRelease(activeRelease._id!)}
                  className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded flex items-center gap-2 text-sm font-medium transition-colors"
                >
                  Delete <Trash2 size={16} />
                </button>
              )}
            </div>

            <div className="p-8">
              <div className="flex gap-6 mb-8">
                <div className="flex flex-col gap-1 w-64">
                  <label className="text-sm font-semibold text-gray-800">
                    Release
                  </label>
                  <input
                    type="text"
                    value={activeRelease.name}
                    onChange={(e) =>
                      setActiveRelease({
                        ...activeRelease,
                        name: e.target.value,
                      })
                    }
                    placeholder="Version 1.0.1"
                    className="border border-gray-300 rounded p-2 focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div className="flex flex-col gap-1 w-64">
                  <label className="text-sm font-semibold text-gray-800">
                    Date
                  </label>
                  <input
                    type="text" // Using text to match placeholder style in mockup, or use type="date"
                    value={activeRelease.dueDate}
                    onChange={(e) =>
                      setActiveRelease({
                        ...activeRelease,
                        dueDate: e.target.value,
                      })
                    }
                    placeholder="September 20, 2022"
                    className="border border-gray-300 rounded p-2 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="space-y-3 mb-10">
                {activeRelease.steps.map((step, index) => (
                  <label
                    key={step.id}
                    className="flex items-center gap-3 cursor-pointer group"
                  >
                    <input
                      type="checkbox"
                      checked={step.completed}
                      onChange={(e) => {
                        const newSteps = [...activeRelease.steps];
                        newSteps[index].completed = e.target.checked;
                        setActiveRelease({ ...activeRelease, steps: newSteps });
                      }}
                      className="w-4 h-4 text-indigo-500 border-gray-300 rounded focus:ring-indigo-500"
                    />
                    <span className="text-gray-700">{step.label}</span>
                  </label>
                ))}
              </div>

              <div className="flex flex-col gap-1 mb-8">
                <label className="text-sm font-semibold text-gray-800">
                  Additional remarks / tasks
                </label>
                <textarea
                  value={activeRelease.remarks || ""}
                  onChange={(e) =>
                    setActiveRelease({
                      ...activeRelease,
                      remarks: e.target.value,
                    })
                  }
                  placeholder="Please enter any other important notes for the release"
                  className="border border-gray-300 rounded p-3 h-32 resize-y focus:outline-none focus:border-indigo-500 text-gray-700"
                />
              </div>

              <div className="flex justify-end">
                <button
                  onClick={() => saveRelease(activeRelease)}
                  className="bg-indigo-500 hover:bg-indigo-600 text-white px-6 py-2 rounded flex items-center gap-2 font-medium transition-colors"
                >
                  Save <Check size={18} />
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
