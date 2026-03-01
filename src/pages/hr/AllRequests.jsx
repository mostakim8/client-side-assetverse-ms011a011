import { useState, useEffect, useContext } from "react";
import { useQuery,useQueryClient } from "@tanstack/react-query";
import useAuth from "../../hooks/UseAuth";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { ThemeContext } from "../../hooks/ThemeContext";
import Swal from "sweetalert2";
import { Check, X, Loader2, User, Box, Image as ImageIcon } from "lucide-react";

const AllRequests = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const { isDark } = useContext(ThemeContext);
  const queryClient = useQueryClient(); 
  const [filter, setFilter] = useState("all");
  const [expanded, setExpanded] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const {
    data: requests = [],
    refetch,
    isLoading,
  } = useQuery({
    queryKey: ["all-requests", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(
        `/all-requests/${user?.email.toLowerCase()}`,
      );
      return res.data;
    },
  });

  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    const date = new Date(dateStr);
    return isNaN(date.getTime()) ? "N/A" : date.toLocaleDateString();
  };

  const handleStatusUpdate = async (id, assetId, newStatus) => {
    try {
      const res = await axiosSecure.patch(`/requests/${id}`, {
        status: newStatus,
        assetId: assetId,
      });

      if (res.data.modifiedCount > 0) {
        queryClient.invalidateQueries(["hr-stats", user?.email]);
        Swal.fire({
          title: `Request ${newStatus}!`,
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
          background: isDark ? "#070F2B" : "#fff",
          color: isDark ? "#9290C3" : "#070F2B",
        });
        refetch();
      }
    } catch (err) {
      Swal.fire({
        title: "Error",
        text: "Failed to update status",
        icon: "error",
      });
    }
  };

  const filteredRequests = (
    filter === "all"
      ? requests
      : requests.filter(
          (r) => (r.status || r.requestStatus)?.toLowerCase() === filter,
        )
  ).sort((a, b) => new Date(b.requestDate) - new Date(a.requestDate));

  const totalPages = Math.ceil(filteredRequests.length / itemsPerPage);
  const paginatedRequests = filteredRequests.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  if (isLoading)
    return (
      <div className="flex justify-center items-center min-h-screen bg-white dark:bg-[#070F2B]">
        <Loader2 className="animate-spin text-[#535C91] w-12 h-12" />
      </div>
    );

  return (
    <div className="p-4 md:p-12 pt-28 min-h-screen bg-white dark:bg-[#070F2B] transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        <div className="mb-10">
          <h2 className="text-3xl md:text-5xl font-black text-[#070F2B] dark:text-white tracking-tighter uppercase italic">
            Asset <span className="text-[#535C91]">Requests</span>
          </h2>
        </div>

        {/* Filter Buttons */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2 no-scrollbar">
          {["all", "pending", "approved", "rejected"].map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-5 py-2 rounded-full text-[9px] font-black uppercase tracking-widest border shrink-0 cursor-pointer transition-all ${
                filter === s
                  ? "bg-[#1B1A55] text-white border-[#535C91]"
                  : "bg-transparent text-[#535C91] border-gray-200 dark:border-[#535C91]/30"
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        <div className="w-full overflow-x-auto no-scrollbar rounded-[2rem]">
          <div className="min-w-[1000px]">
            {/* Header */}
            <div className="grid grid-cols-12 px-8 py-5 bg-gray-50 dark:bg-[#1B1A55]/40 text-[10px] font-black text-[#535C91] tracking-[0.2em] mb-4 border border-gray-100 dark:border-[#535C91]/20 uppercase rounded-2xl">
              <div className="col-span-3">Employee</div>
              <div className="col-span-3">Asset Information</div>
              <div className="col-span-2 text-center">Request Date</div>
              <div className="col-span-2 text-center">Status</div>
              <div className="col-span-2 text-right">Actions</div>
            </div>

            {/* Table Body */}
            <div className="space-y-4">
              {paginatedRequests.map((req) => {
                const currentStatus = (
                  req.status ||
                  req.requestStatus ||
                  "pending"
                ).toLowerCase();

                return (
                  <div key={req._id}>
                    <div
                      onClick={() =>
                        setExpanded(expanded === req._id ? null : req._id)
                      }
                      className="grid grid-cols-12 gap-4 p-4 bg-white dark:bg-[#1B1A55]/10 rounded-[2rem] border border-gray-100 dark:border-[#535C91]/20 hover:border-[#9290C3]/40 transition-all cursor-pointer items-center group shadow-sm"
                    >
                      {/* Employee Info */}
                      <div className="col-span-3 flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-[#070F2B] text-[#1B1A55] dark:text-[#9290C3] flex items-center justify-center border border-gray-200 dark:border-[#535C91]/30">
                          <User size={18} />
                        </div>
                        <div className="truncate">
                          <p className="font-black text-[#070F2B] dark:text-white text-xs uppercase italic truncate">
                            {req.requesterName || req.userName || "Unknown"}
                          </p>
                          <p className="text-[9px] font-bold text-[#535C91] opacity-60 truncate italic">
                            {req.requesterEmail || req.userEmail}
                          </p>
                        </div>
                      </div>

                      {/* Asset Info With Image */}
                      <div className="col-span-3 flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg overflow-hidden border border-gray-100 dark:border-[#535C91]/20 bg-gray-50">
                          {req.assetImage ? (
                            <img
                              src={req.assetImage}
                              alt="asset"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-300">
                              <ImageIcon size={16} />
                            </div>
                          )}
                        </div>
                        <div className="truncate">
                          <p className="font-black text-[#070F2B] dark:text-[#9290C3] text-xs uppercase italic truncate">
                            {req.assetName || req.productName || "N/A"}
                          </p>
                          <p className="text-[8px] font-bold text-[#535C91] uppercase opacity-50">
                            {req.assetType || "Generic"}
                          </p>
                        </div>
                      </div>

                      {/* Date */}
                      <div className="col-span-2 text-center text-[#535C91] dark:text-[#9290C3]/60 text-[10px] font-black italic">
                        {formatDate(req.requestDate)}
                      </div>

                      {/* Status Badge */}
                      <div className="col-span-2 text-center">
                        <span
                          className={`px-4 py-1.5 rounded-lg text-[8px] font-black tracking-widest uppercase italic border ${
                            currentStatus === "approved"
                              ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                              : currentStatus === "rejected"
                                ? "bg-rose-500/10 text-rose-500 border-rose-500/20"
                                : "bg-amber-500/10 text-amber-500 border-amber-500/20"
                          }`}
                        >
                          {currentStatus}
                        </span>
                      </div>

                      {/* Action Buttons */}
                      <div className="col-span-2 flex gap-2 justify-end">
                        {currentStatus === "pending" ? (
                          <>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleStatusUpdate(
                                  req._id,
                                  req.assetId,
                                  "approved",
                                );
                              }}
                              className="w-9 h-9 flex items-center justify-center bg-[#1B1A55] text-white rounded-lg hover:bg-[#535C91] transition-all cursor-pointer"
                            >
                              <Check size={16} />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleStatusUpdate(
                                  req._id,
                                  req.assetId,
                                  "rejected",
                                );
                              }}
                              className="w-9 h-9 flex items-center justify-center bg-rose-500/10 text-rose-500 border border-rose-100 rounded-lg hover:bg-rose-500 hover:text-white transition-all cursor-pointer"
                            >
                              <X size={16} />
                            </button>
                          </>
                        ) : (
                          <span className="text-[9px] text-[#535C91] font-black uppercase italic opacity-40 tracking-widest">
                            {currentStatus === "approved" ? "Signed" : "Closed"}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Expanded Detail Note */}
                    {expanded === req._id && (
                      <div className="mt-2 px-10 py-5 bg-gray-50 dark:bg-[#1B1A55]/30 rounded-[1.5rem] border border-gray-100 dark:border-[#535C91]/20 mx-6">
                        <p className="text-[9px] font-black text-[#535C91] uppercase tracking-widest mb-1 opacity-60">
                          Note/Reason:
                        </p>
                        <p className="text-xs italic text-[#070F2B] dark:text-white/80">
                          "{req.note || "System generated request."}"
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-10">
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`w-9 h-9 rounded-lg font-black text-[10px] transition-all cursor-pointer ${
                  currentPage === i + 1
                    ? "bg-[#1B1A55] text-white"
                    : "bg-gray-100 dark:bg-[#1B1A55]/20 text-[#535C91]"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AllRequests;
