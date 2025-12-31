import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import useAuth from "../hooks/UseAuth";
import useAxiosSecure from "../hooks/useAxiosSecure";
import Swal from "sweetalert2";
import { Check, X, Loader2, Calendar } from "lucide-react";
import { motion } from "framer-motion"; // motion ইমপোর্ট নিশ্চিত করুন যদি ব্যবহার করেন

const AllRequests = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  const [filter, setFilter] = useState("all");
  const [expanded, setExpanded] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const { data: requests = [], refetch, isLoading } = useQuery({
    queryKey: ["all-requests", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(
        `/all-requests/${user?.email.toLowerCase()}`
      );
      return res.data;
    },
  });

  // date formatting function
  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    const date = new Date(dateStr);
    return isNaN(date.getTime()) ? "N/A" : date.toLocaleDateString();
  };

  const handleStatusUpdate = async (id, assetId, requesterEmail, newStatus) => {
    try {
        let res;
        if (newStatus === "Rejected") {
            res = await axiosSecure.patch(`/requests/reject/${id}`);
        } else {
            res = await axiosSecure.patch(`/requests/${id}`, {
                status: newStatus,
                assetId,
                userEmail: requesterEmail,
                hrEmail: user?.email,
            });
        }

        if (res.data.modifiedCount > 0) {
            Swal.fire({
                title: `Request ${newStatus}!`,
                icon: "success",
                timer: 1500,
                showConfirmButton: false,
            });
            refetch(); 
        }
    } catch (err) {
        Swal.fire("Error", "Action failed. Check API route.", "error");
    }
};

  const confirmApprove = (req) => {
    Swal.fire({
      title: "Approve Request?",
      text: "This will assign the asset and reduce stock.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#16a34a",
      confirmButtonText: "Yes, approve",
    }).then((result) => {
      if (result.isConfirmed) {
        handleStatusUpdate(req._id, req.assetId, req.userEmail, "Approved");
      }
    });
  };

  // --- Sorting Logic: Newest dates first (Desc Order) ---
  const filteredRequests = (filter === "all" ? requests : requests.filter((r) => r.status?.toLowerCase() === filter))
    .sort((a, b) => {
      const dateA = new Date(a.requestDate || a.createdAt);
      const dateB = new Date(b.requestDate || b.createdAt);
      return dateB - dateA; // বোরো থেকে ছোট (নতুন থেকে পুরাতন)
    });

  const totalPages = Math.ceil(filteredRequests.length / itemsPerPage);
  const paginatedRequests = filteredRequests.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [filter]);

  if (isLoading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="animate-spin text-blue-600 w-10 h-10" />
      </div>
    );

  return (
    <div className="p-4 md:p-10 pt-28 min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-black mb-6">
          Asset <span className="text-blue-600">Requests</span>
        </h2>

        {/* Filter Pills */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {["all", "pending", "approved", "rejected"].map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-5 py-2 rounded-full text-[10px] font-black uppercase whitespace-nowrap transition-all ${
                filter === s
                  ? "bg-blue-600 text-white"
                  : "bg-white border text-gray-500 hover:border-blue-300"
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        {/* Table Header */}
        <div className="hidden md:grid grid-cols-12 px-6 py-3 rounded-xl bg-gray-100 text-xs font-black uppercase text-gray-500">
          <div className="col-span-3">Employee</div>
          <div className="col-span-3">Asset Name</div>
          <div className="col-span-2">Request Date</div>
          <div className="col-span-2">Status</div>
          <div className="col-span-2 text-center">Actions</div>
        </div>

        {/* Rows */}
        <div className="space-y-3 mt-3">
          {paginatedRequests.map((req) => (
            <div key={req._id}>
              <div
                onClick={() => setExpanded(expanded === req._id ? null : req._id)}
                className="grid grid-cols-1 md:grid-cols-12 gap-4 p-6 bg-white rounded-2xl shadow-sm border hover:shadow-md transition-shadow cursor-pointer items-center"
              >
                {/* Employee */}
                <div className="md:col-span-3 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-black shrink-0">
                    {req.userName?.charAt(0) || "U"}
                  </div>
                  <div className="truncate">
                    <p className="font-bold text-gray-900 truncate">{req.userName}</p>
                    <p className="text-xs text-gray-400 truncate">{req.userEmail}</p>
                  </div>
                </div>

                {/* Asset */}
                <div className="md:col-span-3 font-bold text-gray-700">
                  {req.productName}
                </div>

                {/* Date */}
                <div className="md:col-span-2 text-gray-600 text-sm flex items-center gap-2">
                  <Calendar size={14} className="md:hidden" />
                  {formatDate(req.requestDate || req.createdAt)}
                </div>

                {/* Status */}
                <div className="md:col-span-2">
                  <span
                    className={`px-4 py-2 rounded-full text-[10px] font-black uppercase inline-block ${
                      req.status?.toLowerCase() === "approved"
                        ? "bg-green-100 text-green-600"
                        : req.status?.toLowerCase() === "rejected"
                        ? "bg-rose-100 text-rose-600"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {req.status}
                  </span>
                </div>

                {/* Actions */}
                <div className="md:col-span-2 flex gap-2 justify-center">
                  {req.status?.toLowerCase() === "pending" ? (
                    <>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          confirmApprove(req);
                        }}
                        className="p-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors"
                        title="Approve"
                      >
                        <Check size={16} />
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleStatusUpdate(req._id, req.assetId, req.userEmail, "Rejected");
                        }}
                        className="p-2 bg-rose-100 text-rose-600 rounded-xl hover:bg-rose-200 transition-colors"
                        title="Reject"
                      >
                        <X size={16} />
                      </button>
                    </>
                  ) : (
                    <span className="text-xs text-gray-300 font-bold uppercase tracking-widest">Processed</span>
                  )}
                </div>
              </div>

              {/* Expanded Note */}
              {expanded === req._id && (
                <div 
                  className="mt-2 px-6 py-4 bg-blue-50/50 rounded-xl border border-blue-100 text-sm text-gray-700 mx-2"
                >
                  <p className="font-bold text-blue-600 uppercase text-[10px] mb-1">Employee Note:</p>
                  <p className="italic">{req.note || "No additional notes provided."}</p>
                </div>
              )}
            </div>
          ))}

          {paginatedRequests.length === 0 && (
            <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed">
              <p className="text-gray-400 font-bold">No requests found in this category.</p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-8">
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`w-9 h-9 rounded-full font-bold transition-all ${
                  currentPage === i + 1
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-200"
                    : "bg-white border text-gray-500 hover:bg-gray-50"
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