import { useQuery } from "@tanstack/react-query";
import useAuth from "../../hooks/UseAuth";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { ThemeContext } from "../../hooks/ThemeContext";
import Swal from "sweetalert2";
import {
  UserMinus,
  Search,
  Loader2,
  UserPlus,
  CheckCircle,
  Calendar,
  Briefcase,
  Users,
  PackagePlus,
} from "lucide-react";
import { useState, useEffect, useContext } from "react";

const MyEmployeeList = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const { isDark } = useContext(ThemeContext);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearch(search), 500);
    return () => clearTimeout(handler);
  }, [search]);

  const { data: myAssets = [] } = useQuery({
    queryKey: ["my-assets-list", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(`/assets/${user?.email.toLowerCase()}`);
      return res.data.result || [];
    },
  });

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

  const {
    data: employees = [],
    refetch: refetchMembers,
    isLoading,
  } = useQuery({
    queryKey: ["my-employees", user?.email, debouncedSearch],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(
        `/my-employees/${user?.email.toLowerCase()}?search=${debouncedSearch}`,
      );
      return res.data;
    },
  });

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
          title: "Asset Assigned!",
          text: `${asset.productName} assigned to ${selectedEmployee.name}`,
          background: isDark ? "#070F2B" : "#fff",
          color: isDark ? "#9290C3" : "#070F2B",
          confirmButtonColor: "#1B1A55",
        });
        document.getElementById("assign_modal").close();
        refetchMembers();
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Failed to Assign",
        background: isDark ? "#070F2B" : "#fff",
        color: isDark ? "#9290C3" : "#070F2B",
      });
    }
  };

  const handleApprove = async (emp) => {
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
          title: "Employee Added!",
          showConfirmButton: false,
          timer: 1500,
          background: isDark ? "#070F2B" : "#fff",
          color: isDark ? "#9290C3" : "#070F2B",
        });
        refetchPending();
        refetchMembers();
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Action Failed",
        text: error.response?.data?.message || "Error occurred",
        background: isDark ? "#070F2B" : "#fff",
        color: isDark ? "#9290C3" : "#070F2B",
      });
    }
  };

  const handleRemove = (id) => {
    Swal.fire({
      title: `Remove from Team?`,
      text: "This employee will lose access to all company assets.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#1B1A55",
      cancelButtonColor: "#535C91",
      confirmButtonText: "Yes, Remove Member",
      background: isDark ? "#070F2B" : "#fff",
      color: isDark ? "#9290C3" : "#070F2B",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await axiosSecure.patch(`/employees/remove/${id}`);
          if (res.data.modifiedCount > 0) {
            Swal.fire({
              title: "Removed!",
              text: "Member has been removed.",
              icon: "success",
              background: isDark ? "#070F2B" : "#fff",
              color: isDark ? "#9290C3" : "#070F2B",
            });
            refetchMembers();
          }
        } catch (error) {
          Swal.fire({
            title: "Error",
            text: "Action failed.",
            icon: "error",
            background: isDark ? "#070F2B" : "#fff",
            color: isDark ? "#9290C3" : "#070F2B",
          });
        }
      }
    });
  };

  return (
    <div className="p-4 md:p-10 pt-28 min-h-screen bg-white dark:bg-[#070F2B] transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-10 gap-6">
          <div>
            <h2 className="text-4xl font-black text-[#070F2B] dark:text-white   tracking-tighter italic">
              Manage Team <span className="text-[#535C91]">Members</span>
            </h2>
            <p className="text-[#535C91] dark:text-[#9290C3]/60 text-sm font-medium mt-1">
              Manage and monitor active team members.
            </p>
          </div>
          <div className="relative w-full lg:w-96">
            <Search
              className="absolute top-1/2 -translate-y-1/2 left-5 text-[#535C91]"
              size={20}
            />
            <input
              type="text"
              className="w-full pl-14 pr-6 h-16 bg-gray-50 dark:bg-[#1B1A55]/20 border border-gray-100 dark:border-[#535C91]/30 text-[#070F2B] dark:text-white rounded-2xl shadow-sm focus:ring-2 focus:ring-[#9290C3] outline-none transition-all "
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Pending Requests */}
        {pendingRequests.length > 0 && (
          <div className=" bg-gray-50 dark:bg-[#1B1A55]/10 p-5 rounded-[2.5rem] border border-[#535C91]/20">
            <div className="flex items-center gap-2 mb-6 text-[#535C91]">
              <UserPlus size={20} />
              <h3 className="text-[10px] font-black   tracking-widest">
                Join Requests ({pendingRequests.length})
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {pendingRequests.map((req) => (
                <div
                  key={req._id}
                  className="bg-white dark:bg-[#070F2B] p-2 rounded-3xl border border-gray-100 dark:border-[#535C91]/30 shadow-sm flex items-center justify-between group hover:border-[#9290C3]/50 transition-all"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={req.photo || "https://i.ibb.co/mJR7z1C/avatar.png"}
                      className="w-12 h-12 rounded-2xl object-cover ring-2 ring-transparent group-hover:ring-[#535C91] transition-all"
                      alt=""
                    />
                    <div className="min-w-0">
                      <p className="font-black text-[#070F2B] dark:text-white text-xs truncate  ">
                        {req.name || req.employeeName}
                      </p>
                      <p className="text-[9px] text-[#535C91] font-bold truncate">
                        {req.email}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleApprove(req)}
                    className="p-3 bg-[#1B1A55] hover:bg-[#535C91] text-white rounded-xl shadow-lg transition-all active:scale-95 border border-[#535C91]/30"
                  >
                    <CheckCircle size={15} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Main Table */}
        <div className="bg-white dark:bg-[#1B1A55]/10 rounded-[2.5rem] shadow-sm border border-gray-100 dark:border-[#535C91]/20 overflow-hidden">
          <div className="overflow-x-auto">
            {isLoading ? (
              <div className="flex justify-center items-center py-32">
                <Loader2 className="animate-spin text-[#535C91] w-12 h-12" />
              </div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50/50 dark:bg-[#1B1A55]/40 text-[#535C91] dark:text-[#9290C3]/40 text-[10px]   font-black tracking-widest border-b border-gray-100 dark:border-[#535C91]/20">
                    <th className="py-7 pl-10">Member Info</th>
                    <th className="py-7">Email Address</th>
                    <th className="py-7">Join Date</th>
                    <th className="py-7 text-center">Assign</th>
                    <th className="py-7 pr-10 text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {employees.map((emp) => (
                    <tr
                      key={emp._id}
                      className="group hover:bg-gray-50 dark:hover:bg-[#1B1A55]/20 transition-all border-b border-gray-50 dark:border-[#535C91]/10 last:border-0"
                    >
                      <td className="py-6 pl-10">
                        <div className="flex items-center gap-4">
                          <img
                            src={
                              emp.photo || "https://i.ibb.co/mJR7z1C/avatar.png"
                            }
                            className="w-12 h-12 rounded-2xl object-cover shadow-sm group-hover:scale-105 transition-transform"
                            alt=""
                          />
                          <div>
                            <p className="font-black text-[#070F2B] dark:text-white   text-sm tracking-tight">
                              {emp.name}
                            </p>
                            <span className="text-[9px] font-black   bg-[#1B1A55] text-white px-2 py-0.5 rounded-md">
                              Active
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="py-6">
                        <p className="text-[#535C91] dark:text-[#9290C3]/60 font-bold text-xs">
                          {emp.email}
                        </p>
                      </td>
                      <td className="py-6">
                        <div className="flex items-center gap-2 text-[#535C91] dark:text-[#9290C3]/40">
                          <Calendar size={14} />
                          <span className="text-xs font-black   tracking-tighter">
                            {emp.joinedDate || "N/A"}
                          </span>
                        </div>
                      </td>

                      <td className="py-6 text-center">
                        <button
                          onClick={() => {
                            setSelectedEmployee(emp);
                            document.getElementById("assign_modal").showModal();
                          }}
                          className="p-3 bg-gray-50 dark:bg-[#070F2B] text-[#1B1A55] dark:text-[#9290C3] rounded-xl hover:bg-[#1B1A55] hover:text-white transition-all shadow-sm border border-[#535C91]/20"
                          title="Assign Asset Directly"
                        >
                          <PackagePlus size={18} />
                        </button>
                      </td>
                      <td className="py-6 pr-10 text-right">
                        <button
                          onClick={() => handleRemove(emp._id)}
                          className="inline-flex items-center gap-2 text-[#535C91] hover:text-rose-500 font-black   text-[10px] tracking-widest transition-all p-2 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-xl"
                        >
                          <UserMinus size={18} />
                          <span className="hidden sm:inline">Remove</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {!isLoading && employees.length === 0 && (
              <div className="text-center py-32">
                <Users
                  size={48}
                  className="mx-auto text-gray-200 dark:text-[#535C91]/30 mb-4"
                />
                <p className="text-[#535C91] dark:text-[#9290C3]/30 font-black   text-xs tracking-widest">
                  No team members found
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ASSIGN ASSET MODAL */}
      <dialog id="assign_modal" className="modal backdrop-blur-sm">
        <div className="modal-box rounded-[2.5rem] bg-white dark:bg-[#070F2B] p-10 border border-gray-100 dark:border-[#535C91]/30 shadow-2xl">
          <h3 className="text-2xl font-black text-[#070F2B] dark:text-white   italic tracking-tighter mb-2">
            Assign <span className="text-[#535C91]">Asset</span>
          </h3>
          <p className="text-[10px] font-black text-[#535C91]   tracking-[0.2em] mb-8">
            Directly assign to:{" "}
            <span className="text-[#9290C3]">{selectedEmployee?.name}</span>
          </p>

          <form onSubmit={handleAssignSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black   text-[#535C91] dark:text-[#9290C3]/50 ml-2">
                Select Asset from Inventory
              </label>
              <select
                name="asset"
                className="w-full h-14 bg-gray-50 dark:bg-[#1B1A55]/30 border border-transparent dark:border-[#535C91]/20 dark:text-white rounded-2xl px-6 outline-none font-bold text-sm transition-all focus:ring-2 focus:ring-[#9290C3]"
                required
              >
                <option value="" disabled selected>
                  Choose an asset...
                </option>
                {myAssets
                  .filter((a) => a.productQuantity > 0)
                  .map((asset) => (
                    <option
                      className="dark:bg-[#070F2B]"
                      key={asset._id}
                      value={asset._id}
                    >
                      {asset.productName} ({asset.productQuantity} left)
                    </option>
                  ))}
              </select>
            </div>
            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                className="flex-grow h-14 bg-[#1B1A55] text-white rounded-2xl font-black   text-xs tracking-widest shadow-xl hover:bg-[#535C91] transition-all active:scale-95 border border-[#535C91]/30"
              >
                Assign Now
              </button>
              <button
                type="button"
                onClick={() => document.getElementById("assign_modal").close()}
                className="px-8 h-14 bg-gray-100 dark:bg-[#1B1A55]/20 text-[#535C91] rounded-2xl font-black   text-xs tracking-widest"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
        <form method="dialog" className="modal-backdrop bg-[#070F2B]/60">
          <button>close</button>
        </form>
      </dialog>
    </div>
  );
};

export default MyEmployeeList;
