import { useState, useEffect, useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import useAuth from "../../hooks/UseAuth";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { ThemeContext } from "../../hooks/ThemeContext";
import Swal from "sweetalert2";
import { Link, useNavigate } from "react-router-dom";
import {
  UserPlus,
  Crown,
  Users,
  AlertCircle,
  Search,
  Loader2,
  CheckCircle2,
  UserCheck,
  CheckCircle,
} from "lucide-react";

const AddEmployee = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const { isDark } = useContext(ThemeContext);
  const navigate = useNavigate();
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [displaySearch, setDisplaySearch] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      setSearch(displaySearch);
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [displaySearch]);

  const { data: pendingRequests = [], refetch: refetchPending } = useQuery({
    queryKey: ["pending-requests", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(
        `/pending-requests/${user?.email.toLowerCase()}`,
      );
      return res.data;
    },
  });

  const { data: hrData = {} } = useQuery({
    queryKey: ["hr-profile", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(`/users/${user?.email}`);
      return res.data;
    },
  });

  const { data: teamCount = 0, refetch: refetchCount } = useQuery({
    queryKey: ["team-count", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(`/team-count/${user?.email}`);
      return res.data.count;
    },
  });

  const {
    data: availableEmployees = [],
    isLoading,
    isFetching,
    refetch: refetchAvailable,
  } = useQuery({
    queryKey: ["unaffiliated-employees", search],
    queryFn: async () => {
      const res = await axiosSecure.get(
        `/unaffiliated-employees?search=${search}`,
      );
      return res.data;
    },
  });

  const employeeLimit = hrData?.employeeLimit || 5;
  const remainingSlots = employeeLimit - teamCount;

  const handleApprove = async (emp) => {
    if (remainingSlots <= 0) {
      return Swal.fire({
        icon: "error",
        title: "Limit Reached!",
        text: "Please upgrade your package to add more members.",
        background: isDark ? "#070F2B" : "#fff",
        color: isDark ? "#9290C3" : "#070F2B",
      });
    }
    try {
      const res = await axiosSecure.patch(
        `/users/approve-request/${emp.email}`,
        {
          hrEmail: user?.email,
        },
      );
      if (res.data.modifiedCount > 0) {
        Swal.fire({
          icon: "success",
          title: "Member Added!",
          timer: 1500,
          showConfirmButton: false,
          background: isDark ? "#1B1A55" : "#fff",
          color: isDark ? "#9290C3" : "#1B1A55",
        });
        refetchPending();
        refetchCount();
        refetchAvailable();
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.message || "Failed to approve",
        background: isDark ? "#070F2B" : "#fff",
        color: isDark ? "#9290C3" : "#070F2B",
      });
    }
  };

  const handleSelect = (id) => {
    if (selectedEmployees.includes(id)) {
      setSelectedEmployees(selectedEmployees.filter((empId) => empId !== id));
    } else {
      if (selectedEmployees.length >= remainingSlots) {
        return Swal.fire({
          icon: "warning",
          title: "Limit Reached!",
          text: "Please upgrade your package.",
          confirmButtonColor: "#1B1A55",
          background: isDark ? "#070F2B" : "#fff",
          color: isDark ? "#9290C3" : "#070F2B",
        });
      }
      setSelectedEmployees([...selectedEmployees, id]);
    }
  };

  const handleBulkAdd = async () => {
    if (selectedEmployees.length === 0) return;

    const info = {
      hrEmail: user?.email,
      companyName: hrData?.companyName,
      companyLogo: hrData?.companyLogo,
      employeeIds: selectedEmployees,
    };

    try {
      const res = await axiosSecure.patch("/add-to-team", info);
      if (res.data.modifiedCount > 0) {
        Swal.fire({
          icon: "success",
          title: "Team Updated!",
          text: `${selectedEmployees.length} members added.`,
          timer: 2000,
          showConfirmButton: false,
          background: isDark ? "#1B1A55" : "#fff",
          color: isDark ? "#9290C3" : "#1B1A55",
        });
        setSelectedEmployees([]);
        refetchAvailable();
        refetchCount();
        refetchPending();
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.message || "Failed to add team members",
        background: isDark ? "#070F2B" : "#fff",
        color: isDark ? "#9290C3" : "#070F2B",
      });
    }
  };

  return (
    <div className="p-4 md:p-10 pt-28 min-h-screen bg-white dark:bg-[#070F2B] transition-colors duration-300">
      <div className="max-w-6xl mx-auto">
        {/* Stats Card */}
        <div className="relative overflow-hidden bg-white dark:bg-[#1B1A55]/10 rounded-[2.5rem] p-8 shadow-2xl border border-gray-100 dark:border-[#535C91]/30 mb-10">
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-[#535C91]/10 rounded-full opacity-50 blur-3xl"></div>
          <div className="relative flex flex-col lg:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 bg-[#1B1A55] rounded-3xl flex items-center justify-center text-[#9290C3] shadow-xl border border-[#535C91]/30">
                <Users size={36} />
              </div>
              <div>
                <h2 className="text-3xl font-black text-[#070F2B] dark:text-white tracking-tighter   italic">
                  ADD <span className="text-[#535C91]">MEMBERS</span>
                </h2>
                <div className="mt-3">
                  <div className="flex justify-between mb-1.5">
                    <span className="text-[10px] font-black text-[#535C91] dark:text-[#9290C3]/60   tracking-widest">
                      Team Capacity
                    </span>
                    <span className="text-[10px] font-black text-[#1B1A55] dark:text-[#9290C3]   tracking-widest">
                      {teamCount} / {employeeLimit} Slots
                    </span>
                  </div>
                  <div className="w-64 h-3 bg-gray-100 dark:bg-[#070F2B] rounded-full overflow-hidden border border-gray-50 dark:border-[#535C91]/20">
                    <div
                      className={`h-full rounded-full transition-all duration-1000 ${teamCount >= employeeLimit ? "bg-rose-500" : "bg-[#535C91]"}`}
                      style={{ width: `${(teamCount / employeeLimit) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
            <Link
              to="/upgrade-package"
              className="group flex items-center gap-3 bg-[#1B1A55] hover:bg-[#535C91] text-white px-6 py-4 rounded-2xl font-black transition-all border border-[#535C91]/40   text-[10px] tracking-widest shadow-lg active:scale-95"
            >
              <Crown size={18} className="text-[#9290C3]" /> Upgrade Plan
            </Link>
          </div>
        </div>

        {/* Join Requests Section */}
        {pendingRequests.length > 0 && (
          <div className=" bg-gray-50 dark:bg-[#1B1A55]/5 rounded-[2.5rem] p-5 border border-gray-100 dark:border-[#535C91]/20 shadow-sm">
            <div className="flex items-center gap-2 mb-8 text-[#535C91]">
              <div className="p-2 bg-[#1B1A55]/10 dark:bg-[#1B1A55] rounded-xl">
                <UserPlus size={20} className="text-[#9290C3]" />
              </div>
              <h3 className="text-xs font-black   tracking-widest text-[#070F2B] dark:text-[#9290C3]">
                Join Requests ({pendingRequests.length})
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pendingRequests.map((req) => (
                <div
                  key={req._id}
                  className="p-2 bg-white dark:bg-[#070F2B] rounded-3xl border border-gray-100 dark:border-[#535C91]/30 flex items-center justify-between group hover:border-[#9290C3]/50 transition-all shadow-sm"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={
                        req.photo ||
                        req.employeePhoto ||
                        "https://i.ibb.co/mJR7z1C/avatar.png"
                      }
                      className="w-12 h-12 rounded-2xl object-cover ring-2 ring-transparent group-hover:ring-[#535C91]"
                    />
                    <div className="min-w-0">
                      <p className="font-black text-[#070F2B] dark:text-white text-xs truncate   tracking-tight">
                        {req.name || req.employeeName}
                      </p>
                      <p className="text-[9px] text-[#535C91] font-bold truncate  ">
                        {req.email}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleApprove(req)}
                    className="p-3 bg-[#1B1A55] hover:bg-[#535C91] text-white rounded-xl shadow-lg transition-all active:scale-95"
                    title="Approve Member"
                  >
                    <CheckCircle size={18} className="text-[#9290C3]" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Main Action Area (Bulk Add) */}
        <div className="bg-white dark:bg-[#1B1A55]/10 mt-4 rounded-[2.5rem] shadow-sm border border-gray-100 dark:border-[#535C91]/20 overflow-hidden">
          <div className="p-6 md:p-8 bg-gray-50/50 dark:bg-[#1B1A55]/40 border-b border-gray-100 dark:border-[#535C91]/20 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="relative w-full md:w-96">
              <Search
                className="absolute top-1/2 -translate-y-1/2 left-5 text-[#535C91]"
                size={20}
              />
              <input
                type="text"
                placeholder="Search by name or email..."
                value={displaySearch}
                className="w-full pl-14 pr-12 h-16 bg-white dark:bg-[#070F2B] border border-gray-200 dark:border-[#535C91]/30 text-[#070F2B] dark:text-white rounded-2xl focus:ring-2 focus:ring-[#9290C3] outline-none font-bold transition-all placeholder:text-[#535C91]/40"
                onChange={(e) => setDisplaySearch(e.target.value)}
              />
            </div>
            <button
              onClick={handleBulkAdd}
              disabled={selectedEmployees.length === 0}
              className="w-full md:w-auto flex items-center justify-center gap-3 bg-[#1B1A55] dark:bg-[#1B1A55] hover:bg-[#535C91] disabled:bg-gray-200 dark:disabled:bg-[#070F2B] disabled:text-gray-400 text-white px-10 h-16 rounded-2xl font-black   tracking-widest text-[10px] transition-all shadow-xl active:scale-95 border border-[#535C91]/20"
            >
              <UserPlus size={18} className="text-[#9290C3]" /> Add Selected (
              {selectedEmployees.length})
            </button>
          </div>

          <div className="overflow-x-auto min-h-100">
            {isLoading && availableEmployees.length === 0 ? (
              <div className="flex flex-col justify-center items-center py-32 space-y-4">
                <Loader2 className="animate-spin text-[#535C91] w-12 h-12" />
              </div>
            ) : (
              <table
                className={`table w-full ${isFetching ? "opacity-40" : ""}`}
              >
                <thead>
                  <tr className="bg-gray-50/50 dark:bg-[#1B1A55]/20">
                    <th className="py-6 pl-10 text-[10px] font-black   tracking-widest text-[#535C91]">
                      Select
                    </th>
                    <th className="py-6 text-[10px] font-black   tracking-widest text-[#535C91]">
                      Candidate Info
                    </th>
                    <th className="py-6 pr-10 text-[10px] font-black   tracking-widest text-[#535C91] text-right">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 dark:divide-[#535C91]/10">
                  {availableEmployees.map((emp) => (
                    <tr
                      key={emp._id}
                      className="group hover:bg-gray-50 dark:hover:bg-[#1B1A55]/30 transition-all"
                    >
                      <td className="py-6 pl-10">
                        <input
                          type="checkbox"
                          className="w-6 h-6 rounded-lg border-2 border-[#535C91]/30 bg-transparent text-[#1B1A55] cursor-pointer focus:ring-[#9290C3]"
                          checked={selectedEmployees.includes(emp._id)}
                          onChange={() => handleSelect(emp._id)}
                        />
                      </td>
                      <td className="py-6 flex items-center gap-4">
                        <img
                          src={
                            emp.photo ||
                            emp.image ||
                            "https://i.ibb.co/mJR7z1C/avatar.png"
                          }
                          className="w-12 h-12 rounded-xl object-cover border border-gray-100 dark:border-[#535C91]/30 shadow-sm"
                        />
                        <div>
                          <p className="font-black text-[#070F2B] dark:text-white   text-sm tracking-tight">
                            {emp.name}
                          </p>
                          <p className="text-[10px] font-bold text-[#535C91] dark:text-[#9290C3]/60 lowercase italic">
                            {emp.email}
                          </p>
                        </div>
                      </td>
                      <td className="py-6 pr-10 text-right">
                        <button
                          onClick={() => handleSelect(emp._id)}
                          className={`px-6 py-2 rounded-xl text-[10px] font-black   tracking-widest transition-all ${selectedEmployees.includes(emp._id) ? "bg-rose-500 text-white shadow-lg" : "bg-white dark:bg-[#070F2B] text-[#1B1A55] dark:text-[#9290C3] border border-[#535C91]/40 hover:bg-[#1B1A55] hover:text-white"}`}
                        >
                          {selectedEmployees.includes(emp._id)
                            ? "Deselect"
                            : "Select"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            {!isLoading && availableEmployees.length === 0 && (
              <div className="text-center py-32">
                <UserCheck
                  size={32}
                  className="mx-auto text-gray-200 dark:text-[#535C91]/30"
                />
                <p className="text-[#535C91] dark:text-[#9290C3]/30 font-black   text-[10px] mt-2 tracking-widest">
                  No candidates found
                </p>
              </div>
            )}
          </div>
        </div>
        <div className="mt-8 text-center text-[#535C91] dark:text-[#9290C3]/40 text-[10px] font-black   tracking-[0.2em] flex items-center justify-center gap-2">
          <AlertCircle size={14} /> You have {remainingSlots} slots remaining.
        </div>
      </div>
    </div>
  );
};

export default AddEmployee;
