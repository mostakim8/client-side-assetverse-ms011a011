import { useState, useEffect, useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import useAuth from "../../hooks/UseAuth";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { ThemeContext } from "../../hooks/ThemeContext";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";
import {
  UserPlus,
  Crown,
  Users,
  AlertCircle,
  Search,
  Loader2,
  UserCheck,
  CheckCircle,
  ArrowRight,
} from "lucide-react";

const AddEmployee = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const { isDark } = useContext(ThemeContext);
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [displaySearch, setDisplaySearch] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => setSearch(displaySearch), 500);
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
    if (remainingSlots <= 0)
      return Swal.fire({
        icon: "error",
        title: "LIMIT REACHED!",
        background: isDark ? "#070F2B" : "#fff",
        color: isDark ? "#9290C3" : "#070F2B",
      });
    try {
      const res = await axiosSecure.patch(
        `/users/approve-request/${emp.email}`,
        { hrEmail: user?.email },
      );
      if (res.data.modifiedCount > 0) {
        Swal.fire({
          icon: "success",
          title: "ADDED!",
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
      Swal.fire({ icon: "error", title: "FAILED" });
    }
  };

  const handleSelect = (id) => {
    if (selectedEmployees.includes(id)) {
      setSelectedEmployees(selectedEmployees.filter((empId) => empId !== id));
    } else {
      if (selectedEmployees.length >= remainingSlots)
        return Swal.fire({ icon: "warning", title: "LIMIT REACHED!" });
      setSelectedEmployees([...selectedEmployees, id]);
    }
  };

  const handleBulkAdd = async () => {
    if (selectedEmployees.length === 0) return;
    try {
      const res = await axiosSecure.patch("/add-to-team", {
        hrEmail: user?.email,
        companyName: hrData?.companyName,
        companyLogo: hrData?.companyLogo,
        employeeIds: selectedEmployees,
      });
      if (res.data.modifiedCount > 0) {
        Swal.fire({
          icon: "success",
          title: "TEAM UPDATED!",
          background: isDark ? "#1B1A55" : "#fff",
        });
        setSelectedEmployees([]);
        refetchAvailable();
        refetchCount();
        refetchPending();
      }
    } catch (error) {
      Swal.fire({ icon: "error", title: "ERROR" });
    }
  };

  if (isLoading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="animate-spin text-[#535C91]" />
      </div>
    );

  return (
    <div className="p-4 md:p-12 pt-28 min-h-screen bg-white dark:bg-[#070F2B] transition-colors duration-300">
      <div className="max-w-6xl mx-auto">
        {/* Stats Card */}
        <div className="bg-white dark:bg-[#1B1A55]/10 rounded-[2rem] p-6 border border-gray-100 dark:border-[#535C91]/30 mb-8">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 bg-[#1B1A55] rounded-2xl flex items-center justify-center text-[#9290C3]">
                <Users size={28} />
              </div>
              <div>
                <h2 className="text-2xl font-black text-[#070F2B] dark:text-white uppercase italic tracking-tighter">
                  Add <span className="text-[#535C91]">Members</span>
                </h2>
                <div className="mt-2 flex items-center gap-3">
                  <div className="w-32 h-2 bg-gray-100 dark:bg-[#070F2B] rounded-full overflow-hidden border border-gray-50 dark:border-[#535C91]/20">
                    <div
                      className={`h-full ${teamCount >= employeeLimit ? "bg-rose-500" : "bg-[#535C91]"}`}
                      style={{ width: `${(teamCount / employeeLimit) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-[9px] font-black text-[#1B1A55] dark:text-[#9290C3] uppercase italic">
                    {teamCount}/{employeeLimit} Slots
                  </span>
                </div>
              </div>
            </div>
            <Link
              to="/upgrade-package"
              className="flex items-center gap-2 bg-[#1B1A55] text-white px-5 py-3 rounded-xl font-black text-[9px] uppercase italic tracking-widest border border-[#535C91]/40"
            >
              <Crown size={14} /> Upgrade Plan
            </Link>
          </div>
        </div>

        {/* Join Requests */}
        {pendingRequests.length > 0 && (
          <div className="mb-8 bg-gray-50 dark:bg-[#1B1A55]/5 p-6 rounded-[2rem] border border-[#535C91]/10">
            <h3 className="text-[9px] font-black tracking-[0.3em] uppercase italic text-[#535C91] mb-6">
              Pending Join Requests ({pendingRequests.length})
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 cursor-pointer">
              {pendingRequests.map((req) => (
                <div
                  key={req._id}
                  className="p-3 bg-white dark:bg-[#070F2B] rounded-2xl border border-gray-100 dark:border-[#535C91]/20 flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={req.photo || "https://i.ibb.co/mJR7z1C/avatar.png"}
                      className="w-10 h-10 rounded-lg object-cover"
                    />
                    <div className="min-w-0">
                      <p className="font-black text-[#070F2B] dark:text-white text-[10px] uppercase italic truncate">
                        {req.name || req.employeeName}
                      </p>
                      <p className="text-[8px] text-[#535C91] font-black truncate opacity-60 lowercase">
                        {req.email}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleApprove(req)}
                    className="p-2 bg-[#1B1A55] text-white rounded-lg hover:bg-[#535C91] transition-all"
                  >
                    <CheckCircle size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Bulk Area */}
        <div className="bg-white dark:bg-transparent rounded-[2rem] border border-gray-100 dark:border-[#535C91]/10 overflow-hidden shadow-sm">
          <div className="p-5 bg-gray-50/50 dark:bg-[#1B1A55]/20 flex flex-col md:flex-row justify-between items-center gap-4 border-b border-gray-100 dark:border-[#535C91]/10">
            <div className="relative w-full md:w-80">
              <Search
                className="absolute top-1/2 -translate-y-1/2 left-4 text-[#535C91]"
                size={16}
              />
              <input
                type="text"
                value={displaySearch}
                className="w-full pl-12 pr-4 h-12 bg-white dark:bg-[#070F2B] border border-gray-100 dark:border-[#535C91]/20 text-white rounded-xl outline-none font-black text-[9px] uppercase italic tracking-widest transition-all"
                onChange={(e) => setDisplaySearch(e.target.value)}
              />
            </div>
            <button
              onClick={handleBulkAdd}
              disabled={selectedEmployees.length === 0}
              className="h-12 px-6 bg-[#1B1A55] text-white rounded-xl font-black text-[9px] uppercase italic tracking-widest disabled:opacity-30 flex items-center gap-2 cursor-pointer"
            >
              Add Member ({selectedEmployees.length}) <ArrowRight size={14} />
            </button>
          </div>

          <div className="overflow-x-auto no-scrollbar">
            <div className="min-w-[800px]">
              <table
                className={`w-full text-left ${isFetching ? "opacity-40" : ""}`}
              >
                <thead>
                  <tr className="bg-gray-50/50 dark:bg-[#070F2B] text-[#535C91] text-[8px] font-black tracking-[0.3em] uppercase italic border-b border-gray-100 dark:border-[#535C91]/10">
                    <th className="py-5 pl-10 w-24">Select</th>
                    <th className="py-5">Member</th>
                    <th className="py-5 pr-10 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 dark:divide-[#535C91]/5">
                  {availableEmployees.map((emp) => (
                    <tr
                      key={emp._id}
                      className="group hover:bg-gray-50 dark:hover:bg-[#1B1A55]/10 transition-all"
                    >
                      <td className="py-5 pl-10">
                        <div
                          onClick={() => handleSelect(emp._id)}
                          className={`w-6 h-6 rounded-lg border flex items-center justify-center cursor-pointer ${selectedEmployees.includes(emp._id) ? "bg-[#535C91] border-[#535C91]" : "border-[#535C91]/30"}`}
                        >
                          {selectedEmployees.includes(emp._id) && (
                            <CheckCircle size={12} className="text-white" />
                          )}
                        </div>
                      </td>
                      <td className="py-5">
                        <div className="flex items-center gap-4">
                          <img
                            src={
                              emp.photo || "https://i.ibb.co/mJR7z1C/avatar.png"
                            }
                            className="w-10 h-10 rounded-xl object-cover"
                          />
                          <div>
                            <p className="font-black text-[#070F2B] dark:text-white text-[10px] uppercase italic tracking-widest">
                              {emp.name}
                            </p>
                            <p className="text-[8px] font-black text-[#535C91] uppercase italic opacity-60">
                              {emp.email}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-5 pr-10 text-right">
                        <button
                          onClick={() => handleSelect(emp._id)}
                          className={`px-4 py-2 rounded-lg text-[8px] font-black uppercase italic tracking-widest border ${selectedEmployees.includes(emp._id) ? "bg-rose-500 text-white border-rose-500" : "bg-transparent text-[#535C91] border-[#535C91]/20 cursor-pointer"}`}
                        >
                          {selectedEmployees.includes(emp._id)
                            ? "Deselect"
                            : "Select Candidate"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center text-[#535C91] dark:text-[#9290C3]/40 text-[8px] font-black tracking-[0.3em] uppercase italic flex items-center justify-center gap-2">
          <AlertCircle size={12} /> Status: {remainingSlots} protocol slots
          available
        </div>
      </div>
    </div>
  );
};

export default AddEmployee;
