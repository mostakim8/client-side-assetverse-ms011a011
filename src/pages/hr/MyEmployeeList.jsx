import { useQuery } from "@tanstack/react-query";
import useAuth from "../../hooks/UseAuth";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { ThemeContext } from "../../hooks/ThemeContext";
import Swal from "sweetalert2";
import {
  UserMinus,
  Search,
  Loader2,
  CheckCircle,
  Calendar,
  PackagePlus,
  ArrowRight,
  Users,
} from "lucide-react";
import { useState, useEffect, useContext, memo, useCallback } from "react";


const SearchField = memo(({ onSearch }) => {
  const [localText, setLocalText] = useState("");

  useEffect(() => {
    const handler = setTimeout(() => {
      onSearch(localText);
    }, 500);
    return () => clearTimeout(handler);
  }, [localText, onSearch]);

  return (
    <div className="relative w-full lg:w-96">
      <Search
        className="absolute top-1/2 -translate-y-1/2 left-6 text-[#535C91]"
        size={18}
      />
      <input
        type="text"
        className="w-full pl-16 pr-6 h-16 bg-gray-50 dark:bg-[#1B1A55]/10 border border-gray-100 dark:border-[#535C91]/20 text-[#070F2B] dark:text-white rounded-2xl outline-none focus:ring-1 focus:ring-[#9290C3] text-[11px] font-black uppercase italic tracking-widest transition-all"
        value={localText}
        onChange={(e) => setLocalText(e.target.value)}
      />
    </div>
  );
});

const MyEmployeeList = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const { isDark } = useContext(ThemeContext);

  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  const handleSearch = useCallback((text) => {
    setDebouncedSearch(text);
  }, []);

  // Assets Query
  const { data: myAssets = [] } = useQuery({
    queryKey: ["my-assets-list", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(`/assets/${user?.email.toLowerCase()}`);
      return res.data.result || [];
    },
  });

  // Pending Requests Query
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

  // Main Employees Query
  const {
    data: employees = [],
    refetch: refetchMembers,
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: ["my-employees", user?.email, debouncedSearch],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(
        `/my-employees/${user?.email.toLowerCase()}?search=${debouncedSearch}`,
      );
      return res.data;
    },
    placeholderData: (prev) => prev,
  });

  // Action Handlers (Approve, Remove, Assign)
  const handleApprove = async (emp) => {
    try {
      const res = await axiosSecure.patch(
        `/users/approve-request/${emp.email}`,
        { hrEmail: user?.email },
      );
      if (res.data.modifiedCount > 0) {
        Swal.fire({
          icon: "success",
          title: "ACCESS GRANTED",
          timer: 1500,
          showConfirmButton: false,
        });
        refetchPending();
        refetchMembers();
      }
    } catch (error) {
      Swal.fire({ icon: "error", title: "Action Failed" });
    }
  };

  const handleRemove = (id) => {
    Swal.fire({
      title: `REMOVE ACCESS?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#1B1A55",
      confirmButtonText: "YES, REMOVE",
      background: isDark ? "#070F2B" : "#fff",
      color: isDark ? "#9290C3" : "#070F2B",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await axiosSecure.patch(`/employees/remove/${id}`);
          if (res.data.modifiedCount > 0) {
            Swal.fire({ title: "REMOVED", icon: "success" });
            refetchMembers();
          }
        } catch (error) {
          Swal.fire({ icon: "error", title: "Error" });
        }
      }
    });
  };

  const handleAssignSubmit = async (e) => {
    e.preventDefault();
    const assetId = e.target.asset.value;
    const asset = myAssets.find((a) => a._id === assetId);
    const assignData = {
      assetId: asset._id,
      productName: asset.productName,
      productType: asset.productType,
      userEmail: selectedEmployee.email,
      userName: selectedEmployee.name,
      hrEmail: user?.email.toLowerCase(),
    };
    try {
      const res = await axiosSecure.post("/assign-asset", assignData);
      if (res.data.insertedId) {
        Swal.fire({
          icon: "success",
          title: "ASSET DEPLOYED",
          background: isDark ? "#070F2B" : "#fff",
          color: isDark ? "#9290C3" : "#070F2B",
        });
        document.getElementById("assign_modal").close();
        refetchMembers();
      }
    } catch (error) {
      Swal.fire({ icon: "error", title: "DEPLOYMENT FAILED" });
    }
  };

  if (isLoading)
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-white dark:bg-[#070F2B]">
        <Loader2 className="animate-spin text-[#535C91] w-12 h-12" />
        <p className="mt-4 font-black text-[#535C91] tracking-[0.4em] text-[10px] uppercase italic">
          Loading Team...
        </p>
      </div>
    );

  return (
    <div className="p-4 md:p-12 pt-28 min-h-screen bg-white dark:bg-[#070F2B] transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-12 gap-8">
          <div>
            <h2 className="text-4xl md:text-5xl font-black text-[#070F2B] dark:text-white tracking-tighter uppercase italic">
              Team <span className="text-[#535C91]">Registry</span>
            </h2>
            <p className="text-[10px] font-black text-[#535C91] tracking-[0.3em] uppercase italic mt-2">
              Active Personal Management
            </p>
          </div>
          <SearchField onSearch={handleSearch} />
        </div>

        {/* Pending Join Requests */}
        {pendingRequests.length > 0 && (
          <div className="mb-12 bg-gray-50 dark:bg-[#1B1A55]/10 p-4 rounded-[2.5rem] border border-[#535C91]/10">
            <h3 className="text-[9px] font-black tracking-[0.4em] uppercase italic text-[#535C91] mb-3 ml-2">
              Join Request ({pendingRequests.length})
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 cursor-pointer">
              {pendingRequests.map((req) => (
                <div
                  key={req._id}
                  className="bg-white dark:bg-[#070F2B] p-2 pr-4 rounded-[1.5rem] border border-gray-100 dark:border-[#535C91]/20 shadow-sm flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={req.photo || "https://i.ibb.co/mJR7z1C/avatar.png"}
                      className="w-10 h-10 rounded-xl object-cover grayscale group-hover:grayscale-0 transition-all"
                      alt=""
                    />
                    <div className="min-w-0">
                      <p className="font-black text-[#070F2B] dark:text-white text-[10px] uppercase italic truncate">
                        {req.name || req.employeeName}
                      </p>
                      <p className="text-[9px] text-[#535C91] font-black tracking-tighter truncate opacity-60 italic">
                        {req.email}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleApprove(req)}
                    className="w-8 h-8 bg-[#1B1A55] text-white rounded-lg flex items-center justify-center hover:bg-emerald-600 transition-all active:scale-90 shadow-lg"
                  >
                    <CheckCircle size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Main Employee Table */}
        <div className="w-full overflow-x-auto no-scrollbar rounded-[2.5rem] border border-gray-100 dark:border-[#535C91]/10 shadow-sm bg-white dark:bg-transparent">
          <div className="min-w-[900px]">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50/50 dark:bg-[#1B1A55]/40 text-[#535C91] text-[9px] font-black tracking-[0.4em] uppercase italic border-b border-gray-100 dark:border-[#535C91]/10">
                  <th className="py-8 pl-12">Name</th>
                  <th className="py-8">Email</th>
                  <th className="py-8">Registry Date</th>
                  <th className="py-8 text-center">Deploy Asset</th>
                  <th className="py-8 pr-12 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-[#535C91]/5">
                
                {employees.length === 0 && !isLoading ? (
                  <tr>
                    <td colSpan="5" className="py-24 text-center">
                      <div className="flex flex-col items-center gap-4 opacity-40">
                        <Users size={48} className="text-[#535C91]" />
                        <p className="text-[12px] font-black uppercase italic tracking-[0.5em] text-[#535C91]">
                          No Member Found
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  employees.map((emp) => (
                    <tr
                      key={emp._id}
                      className="group hover:bg-gray-50 dark:hover:bg-[#1B1A55]/10 transition-all"
                    >
                      <td className="py-8 pl-12">
                        <div className="flex items-center gap-4">
                          <img
                            src={
                              emp.photo || "https://i.ibb.co/mJR7z1C/avatar.png"
                            }
                            className="w-10 h-10 rounded-xl object-cover shadow-md group-hover:scale-110 transition-transform"
                            alt=""
                          />
                          <div>
                            <p className="font-black text-[#070F2B] dark:text-white text-[11px] uppercase italic tracking-widest">
                              {emp.name}
                            </p>
                            <span className="text-[8px] font-black text-emerald-500 uppercase italic">
                               Active
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="py-8">
                        <p className="text-[#535C91] dark:text-[#9290C3]/60 font-black text-[10px] italic">
                          {emp.email}
                        </p>
                      </td>
                      <td className="py-8">
                        <div className="flex items-center gap-2 text-[#535C91] dark:text-[#9290C3]/40">
                          <Calendar size={14} className="opacity-40" />
                          <span className="text-[10px] font-black uppercase italic">
                            {emp.joinedDate || "N/A"}
                          </span>
                        </div>
                      </td>
                      <td className="py-8 text-center">
                        <button
                          onClick={() => {
                            setSelectedEmployee(emp);
                            document.getElementById("assign_modal").showModal();
                          }}
                          className="w-11 h-11 mx-auto bg-gray-50 dark:bg-[#070F2B] text-[#1B1A55] dark:text-[#9290C3] rounded-xl hover:bg-[#1B1A55] hover:text-white transition-all shadow-sm border border-gray-200 dark:border-[#535C91]/20 flex items-center justify-center active:scale-90 cursor-pointer"
                        >
                          <PackagePlus size={18} />
                        </button>
                      </td>
                      <td className="py-8 pr-12 text-right">
                        <button
                          onClick={() => handleRemove(emp._id)}
                          className="p-3 text-[#535C91] hover:text-rose-500 transition-all active:scale-90 cursor-pointer"
                        >
                          <UserMinus size={20} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Deploy Asset Modal */}
      <dialog id="assign_modal" className="modal backdrop-blur-md">
        <div className="modal-box rounded-[2.5rem] bg-white dark:bg-[#070F2B] p-10 border border-gray-100 dark:border-[#535C91]/30 shadow-2xl relative">
          <div className="mb-8">
            <h3 className="text-2xl font-black text-[#070F2B] dark:text-white italic tracking-tighter uppercase leading-none">
              Deploy <span className="text-[#535C91]">Asset</span>
            </h3>
            <p className="text-[9px] font-black text-[#535C91] tracking-[0.3em] uppercase italic mt-2">
              Target: {selectedEmployee?.name}
            </p>
          </div>
          <form onSubmit={handleAssignSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[8px] font-black text-[#535C91] uppercase tracking-[0.4em] ml-1 italic">
                Inventory Selection
              </label>
              <select
                name="asset"
                className="w-full h-14 bg-gray-50 dark:bg-[#1B1A55]/30 border border-gray-100 dark:border-[#535C91]/20 dark:text-white rounded-xl px-6 outline-none font-black text-[10px] uppercase italic focus:ring-1 focus:ring-[#9290C3]"
                required
              >
                <option value="" disabled selected>
                  SELECT ASSET...
                </option>
                {myAssets
                  .filter((a) => a.productQuantity > 0)
                  .map((asset) => (
                    <option
                      className="bg-white dark:bg-[#070F2B] py-3"
                      key={asset._id}
                      value={asset._id}
                    >
                      {asset.productName.toUpperCase()} — (
                      {asset.productQuantity} UNITS)
                    </option>
                  ))}
              </select>
            </div>
            <button
              type="submit"
              className="w-full h-14 bg-[#1B1A55] text-white rounded-xl font-black text-[10px] tracking-[0.4em] uppercase italic shadow-lg hover:bg-[#535C91] transition-all flex items-center justify-center gap-3"
            >
              Confirm Deployment <ArrowRight size={14} />
            </button>
          </form>
        </div>
        <form method="dialog" className="modal-backdrop bg-[#070F2B]/80">
          <button>close</button>
        </form>
      </dialog>
    </div>
  );
};

export default MyEmployeeList;
