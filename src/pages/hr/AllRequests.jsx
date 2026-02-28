import { useState, useEffect, useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import useAuth from "../../hooks/UseAuth";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { ThemeContext } from "../../hooks/ThemeContext";
import Swal from "sweetalert2";
import { Check, X, Loader2, Calendar } from "lucide-react";

const AllRequests = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const { isDark } = useContext(ThemeContext);

  const [filter, setFilter] = useState("all");
  const [expanded, setExpanded] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

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

  const handleStatusUpdate = async (id, assetId, requesterEmail, newStatus) => {
    try {
      const res = await axiosSecure.patch(`/requests/${id}`, {
        status: newStatus,
        assetId: assetId,
      });

      if (res.data.modifiedCount > 0) {
        Swal.fire({
          title: `Request ${newStatus}!`,
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
          background: isDark ? "#070F2B" : "#fff",
          color: isDark ? "#9290C3" : "#070F2B",
          confirmButtonColor: "#1B1A55",
        });
        refetch();
      }
    } catch (err) {
      Swal.fire({
        title: "Error",
        text: "Action failed.",
        icon: "error",
        background: isDark ? "#070F2B" : "#fff",
        color: isDark ? "#9290C3" : "#070F2B",
      });
    }
  };

  const confirmApprove = (req) => {
    Swal.fire({
      title: "Approve Request?",
      text: "This will assign the asset and reduce stock.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#1B1A55",
      cancelButtonColor: "#535C91",
      confirmButtonText: "Yes, approve",
      background: isDark ? "#070F2B" : "#fff",
      color: isDark ? "#9290C3" : "#070F2B",
    }).then((result) => {
      if (result.isConfirmed) {
        handleStatusUpdate(req._id, req.assetId, req.userEmail, "Approved");
      }
    });
  };

  const filteredRequests = (
    filter === "all"
      ? requests
      : requests.filter((r) => r.status?.toLowerCase() === filter)
  ).sort((a, b) => {
    const dateA = new Date(a.requestDate || a.createdAt);
    const dateB = new Date(b.requestDate || b.createdAt);
    return dateB - dateA;
  });

  const totalPages = Math.ceil(filteredRequests.length / itemsPerPage);
  const paginatedRequests = filteredRequests.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [filter]);

  if (isLoading)
    return (
      <div className="flex justify-center items-center min-h-screen bg-white dark:bg-[#070F2B]">
        <Loader2 className="animate-spin text-[#535C91] w-10 h-10" />
      </div>
    );

  return (
    <div className="p-4 md:p-10 pt-28 min-h-screen bg-white dark:bg-[#070F2B] transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-black mb-6 text-[#070F2B] dark:text-white   tracking-tighter italic">
          Asset <span className="text-[#535C91]">Requests</span>
        </h2>

        {/* Filter Pills */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
          {["all", "pending", "approved", "rejected"].map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-5 py-2 rounded-full text-[10px] font-black   whitespace-nowrap transition-all border ${
                filter === s
                  ? "bg-[#1B1A55] text-white border-[#535C91] shadow-lg"
                  : "bg-gray-50 dark:bg-[#1B1A55]/20 border-gray-100 dark:border-[#535C91]/30 text-[#535C91] dark:text-[#9290C3]/60 hover:border-[#9290C3]"
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        {/* Table Header */}
        <div className="hidden md:grid grid-cols-12 px-8 py-4 rounded-2xl bg-gray-50 dark:bg-[#1B1A55]/40 text-[10px] font-black   text-[#535C91] dark:text-[#9290C3]/40 tracking-[0.2em] mb-4 border border-gray-100 dark:border-[#535C91]/20">
          <div className="col-span-3">Employee</div>
          <div className="col-span-3">Asset Name</div>
          <div className="col-span-2">Request Date</div>
          <div className="col-span-2">Status</div>
          <div className="col-span-2 text-center">Actions</div>
        </div>

        {/* Rows */}
        <div className="space-y-4">
          {paginatedRequests.map((req) => (
            <div key={req._id}>
              <div
                onClick={() =>
                  setExpanded(expanded === req._id ? null : req._id)
                }
                className="grid grid-cols-1 md:grid-cols-12 gap-4 p-6 bg-white dark:bg-[#1B1A55]/10 rounded-3xl shadow-sm border border-gray-100 dark:border-[#535C91]/20 hover:border-[#9290C3]/40 hover:shadow-xl transition-all cursor-pointer items-center group"
              >
                {/* Employee */}
                <div className="md:col-span-3 flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-gray-100 dark:bg-[#070F2B] text-[#1B1A55] dark:text-[#9290C3] flex items-center justify-center font-black shrink-0 border border-gray-200 dark:border-[#535C91]/30 group-hover:bg-[#1B1A55] group-hover:text-white transition-colors">
                    {req.userName?.charAt(0) || "U"}
                  </div>
                  <div className="truncate">
                    <p className="font-black text-[#070F2B] dark:text-white   text-sm tracking-tight">
                      {req.userName}
                    </p>
                    <p className="text-[10px] font-bold text-[#535C91] dark:text-[#9290C3]/60 truncate">
                      {req.userEmail}
                    </p>
                  </div>
                </div>

                {/* Asset */}
                <div className="md:col-span-3 font-black text-[#070F2B] dark:text-[#9290C3]   text-sm italic">
                  {req.productName}
                </div>

                {/* Date */}
                <div className="md:col-span-2 text-[#535C91] dark:text-[#9290C3]/60 text-xs font-bold flex items-center gap-2">
                  <Calendar size={14} className="opacity-40" />
                  {formatDate(req.requestDate || req.createdAt)}
                </div>

                {/* Status */}
                <div className="md:col-span-2">
                  <span
                    className={`px-4 py-1.5 rounded-xl text-[9px] font-black   tracking-wider inline-block ${
                      req.status?.toLowerCase() === "approved"
                        ? "bg-[#535C91] text-white"
                        : req.status?.toLowerCase() === "rejected"
                          ? "bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 border border-rose-100 dark:border-rose-900/30"
                          : "bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 border border-amber-100 dark:border-amber-900/30"
                    }`}
                  >
                    {req.status}
                  </span>
                </div>

                {/* Actions */}
                <div className="md:col-span-2 flex gap-3 justify-center">
                  {req.status?.toLowerCase() === "pending" ? (
                    <>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          confirmApprove(req);
                        }}
                        className="w-10 h-10 flex items-center justify-center bg-[#1B1A55] text-white rounded-xl hover:bg-[#535C91] transition-all shadow-lg active:scale-95"
                        title="Approve"
                      >
                        <Check size={18} />
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleStatusUpdate(
                            req._id,
                            req.assetId,
                            req.userEmail,
                            "Rejected",
                          );
                        }}
                        className="w-10 h-10 flex items-center justify-center bg-white dark:bg-[#070F2B] text-rose-500 border border-rose-100 dark:border-rose-900/30 rounded-xl hover:bg-rose-500 hover:text-white transition-all shadow-sm active:scale-95"
                        title="Reject"
                      >
                        <X size={18} />
                      </button>
                    </>
                  ) : (
                    <span className="text-[10px] text-[#535C91] dark:text-[#9290C3]/30 font-black   tracking-[0.2em]">
                      Processed
                    </span>
                  )}
                </div>
              </div>

              {/* Expanded Note */}
              {expanded === req._id && (
                <div className="mt-3 px-8 py-5 bg-gray-50 dark:bg-[#1B1A55]/30 rounded-[2rem] border border-gray-100 dark:border-[#535C91]/30 text-sm text-[#070F2B] dark:text-[#9290C3] mx-4 transition-all animate-in slide-in-from-top-2">
                  <p className="font-black text-[#535C91] dark:text-[#9290C3]   text-[10px] mb-2 tracking-widest italic">
                    Employee Note:
                  </p>
                  <p className="font-medium opacity-80 italic leading-relaxed">
                    "{req.note || "No additional notes provided."}"
                  </p>
                </div>
              )}
            </div>
          ))}

          {paginatedRequests.length === 0 && (
            <div className="text-center py-20 bg-gray-50 dark:bg-[#1B1A55]/10 rounded-[3rem] border-2 border-dashed border-gray-200 dark:border-[#535C91]/20">
              <p className="text-[#535C91] dark:text-[#9290C3]/40 font-black   tracking-widest text-xs">
                No requests found in this category.
              </p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-3 mt-12 pb-10">
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`w-10 h-10 rounded-xl font-black text-xs transition-all ${
                  currentPage === i + 1
                    ? "bg-[#1B1A55] text-white shadow-xl scale-110 border border-[#535C91]"
                    : "bg-white dark:bg-[#1B1A55]/20 border border-gray-100 dark:border-[#535C91]/30 text-[#535C91] dark:text-[#9290C3]/60 hover:bg-gray-50"
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
