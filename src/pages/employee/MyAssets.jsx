import { useState, useEffect, useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import useAuth from "../../hooks/UseAuth";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { ThemeContext } from "../../hooks/ThemeContext";
import {
  Search,
  Loader2,
  Building2,
  Filter,
  Printer,
  Undo2,
  Package,
  Calendar,
  CheckCircle2,
  Clock,
} from "lucide-react";
import Swal from "sweetalert2";

const MyAssets = () => {
  const { user } = useAuth();
  const { isDark } = useContext(ThemeContext);
  const axiosSecure = useAxiosSecure();
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [filterType, setFilterType] = useState("All");
  const [selectedCompanyEmail, setSelectedCompanyEmail] = useState("");

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearch(searchTerm), 500);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Intl.DateTimeFormat("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(new Date(dateString));
  };

  const { data: myCompanies = [] } = useQuery({
    queryKey: ["my-approved-companies", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(
        `/my-approved-companies/${user?.email}`,
      );
      return res.data;
    },
  });

  useEffect(() => {
    if (myCompanies.length > 0 && !selectedCompanyEmail) {
      setSelectedCompanyEmail(myCompanies[0].hrEmail);
    }
  }, [myCompanies, selectedCompanyEmail]);

  const {
    data: myAssets = [],
    isFetching,
    refetch,
  } = useQuery({
    queryKey: [
      "my-assets",
      user?.email,
      debouncedSearch,
      filterType,
      selectedCompanyEmail,
    ],
    enabled: !!selectedCompanyEmail,
    queryFn: async () => {
      const res = await axiosSecure.get(`/my-requests/${user?.email}`, {
        params: {
          search: debouncedSearch,
          type: filterType === "All" ? "" : filterType,
          hrEmail: selectedCompanyEmail,
        },
      });
      return res.data;
    },
  });

  const handleReturn = async (id, assetId) => {
    const result = await Swal.fire({
      title: "Confirm Return?",
      text: "Return this asset to inventory?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#1B1A55",
      cancelButtonColor: "#535C91",
      confirmButtonText: "Yes, Return",
      background: isDark ? "#070F2B" : "#fff",
      color: isDark ? "#9290C3" : "#070F2B",
    });
    if (result.isConfirmed) {
      try {
        await axiosSecure.patch(`/return-asset/${id}`, { assetId });
        Swal.fire({
          title: "Returned",
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
        });
        refetch();
      } catch (error) {
        Swal.fire("Error", "Failed to return.", "error");
      }
    }
  };

  return (
    <div className="p-4 md:p-8 pt-24 min-h-screen bg-white dark:bg-[#070F2B] transition-colors duration-300">
      <style>{`@media print { .no-print { display: none !important; } }`}</style>

      <div className="max-w-6xl mx-auto">
        {/* Header - Balanced Scale */}
        <div className="no-print mb-10 flex flex-col md:flex-row justify-between items-center text-center md:text-left gap-6">
          <div>
            <h2 className="text-4xl md:text-5xl font-black text-[#070F2B] dark:text-white tracking-tighter italic leading-none">
              My <span className="text-[#535C91]">Assets</span>
            </h2>
            <p className="text-[#535C91] dark:text-[#9290C3]/60 text-[10px] font-black tracking-[0.3em] mt-3 italic uppercase">
              Personal Inventory Management
            </p>
          </div>
          <button
            onClick={() => window.print()}
            className="flex items-center gap-3 bg-[#1B1A55] text-white px-8 py-3 rounded-xl font-black text-[10px] tracking-widest transition-all shadow-lg hover:bg-[#535C91] active:scale-95 uppercase"
          >
            <Printer size={16} /> Print Report
          </button>
        </div>

        {/* Filters Area - Matches Marketplace Style */}
        <div className="no-print grid grid-cols-1 md:grid-cols-12 gap-3 bg-gray-50/50 dark:bg-[#1B1A55]/10 p-2 rounded-2xl border border-gray-100 dark:border-[#535C91]/20 mb-8">
          <div className="md:col-span-6 relative">
            <Search
              className="absolute left-5 top-1/2 -translate-y-1/2 text-[#535C91]"
              size={18}
            />
            <input
              type="text"
              placeholder="Search by name..."
              className="w-full pl-12 pr-6 py-3 bg-gray-200/50 dark:bg-[#070F2B] border-none rounded-xl focus:ring-2 focus:ring-[#9290C3] outline-none text-[13px] font-semibold dark:text-white transition-all shadow-inner"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="md:col-span-3 relative">
            <Building2
              className="absolute left-4 top-1/2 -translate-y-1/2 text-[#535C91]"
              size={16}
            />
            <select
              value={selectedCompanyEmail}
              onChange={(e) => setSelectedCompanyEmail(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-200/50 dark:bg-[#070F2B] border-none rounded-xl text-[10px] font-black tracking-widest text-[#535C91] appearance-none cursor-pointer uppercase outline-none"
            >
              {myCompanies.map((c, i) => (
                <option key={i} value={c.hrEmail}>
                  {c.companyName}
                </option>
              ))}
            </select>
          </div>
          <div className="md:col-span-3 relative">
            <Filter
              className="absolute left-4 top-1/2 -translate-y-1/2 text-[#535C91]"
              size={16}
            />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-200/50 dark:bg-[#070F2B] border-none rounded-xl text-[10px] font-black tracking-widest text-[#535C91] appearance-none cursor-pointer uppercase outline-none"
            >
              <option value="All">All Types</option>
              <option value="Returnable">Returnable</option>
              <option value="Non-returnable">Non-returnable</option>
            </select>
          </div>
        </div>

        {/* Table Container - Compact Enterprise Look */}
        <div className="bg-white dark:bg-[#1B1A55]/10 rounded-[2.5rem] border border-gray-100 dark:border-[#535C91]/20 overflow-hidden shadow-sm relative">
          {isFetching && (
            <div className="absolute inset-0 bg-white/40 dark:bg-[#070F2B]/40 backdrop-blur-[1px] z-20 flex items-center justify-center">
              <Loader2 className="animate-spin text-[#535C91]" size={32} />
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-gray-100 dark:border-[#535C91]/20 bg-gray-50/50 dark:bg-transparent">
                  <th className="py-5 pl-8 text-left text-[10px] font-black text-[#535C91] uppercase tracking-[0.2em]">
                    Asset Info
                  </th>
                  <th className="py-5 text-left text-[10px] font-black text-[#535C91] uppercase tracking-[0.2em]">
                    Category
                  </th>
                  <th className="py-5 text-left text-[10px] font-black text-[#535C91] uppercase tracking-[0.2em]">
                    Timeline
                  </th>
                  <th className="py-5 text-center text-[10px] font-black text-[#535C91] uppercase tracking-[0.2em]">
                    Status
                  </th>
                  <th className="py-5 pr-8 text-right text-[10px] font-black text-[#535C91] uppercase tracking-[0.2em] no-print">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-[#535C91]/10">
                {myAssets.length > 0 ? (
                  myAssets.map((asset) => (
                    <tr
                      key={asset._id}
                      className="hover:bg-gray-50/80 dark:hover:bg-[#1B1A55]/20 transition-all group"
                    >
                      <td className="py-4 pl-8">
                        <div className="flex items-center gap-4">
                          <div className="w-11 h-11 rounded-xl bg-gray-100 dark:bg-[#070F2B] overflow-hidden border border-gray-200 dark:border-[#535C91]/30 shrink-0 no-print">
                            <img
                              src={
                                asset.productImage ||
                                "https://i.ibb.co/0Qkb09Y/user.png"
                              }
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                              alt=""
                            />
                          </div>
                          <div className="flex flex-col">
                            <span className="font-black text-[#070F2B] dark:text-white text-[13px] tracking-tight italic uppercase">
                              {asset.productName}
                            </span>
                            <span className="text-[9px] font-bold text-[#535C91] opacity-60 flex items-center gap-1">
                              <Package size={10} /> ID:{" "}
                              {asset.assetId?.slice(-6).toUpperCase()}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="py-4">
                        <span
                          className={`px-2.5 py-1 rounded-lg text-[8px] font-black tracking-widest uppercase ${
                            asset.productType === "Returnable"
                              ? "bg-[#1B1A55] text-white"
                              : "bg-gray-100 dark:bg-[#535C91]/30 text-[#535C91] dark:text-[#9290C3]"
                          }`}
                        >
                          {asset.productType}
                        </span>
                      </td>
                      <td className="py-4">
                        <div className="flex flex-col">
                          <span className="text-[10px] font-black text-[#070F2B] dark:text-white flex items-center gap-1.5 italic">
                            <Calendar size={12} className="text-[#535C91]" />{" "}
                            {formatDate(asset.requestDate)}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 text-center">
                        <div
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-tighter shadow-sm ${
                            asset.status === "Approved"
                              ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20"
                              : "bg-amber-50 text-amber-600 dark:bg-amber-900/20"
                          }`}
                        >
                          {asset.status === "Approved" ? (
                            <CheckCircle2 size={10} />
                          ) : (
                            <Clock size={10} />
                          )}
                          {asset.status}
                        </div>
                      </td>
                      <td className="py-4 pr-8 text-right no-print">
                        {asset.productType === "Returnable" &&
                        asset.status === "Approved" ? (
                          <button
                            onClick={() =>
                              handleReturn(asset._id, asset.assetId)
                            }
                            className="inline-flex items-center gap-2 bg-[#1B1A55] text-white px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-[#535C91] active:scale-95 transition-all shadow-md"
                          >
                            <Undo2 size={12} /> Return
                          </button>
                        ) : (
                          <span className="text-[9px] font-black text-[#535C91] opacity-30 uppercase tracking-[0.2em] italic">
                            Non-Returnable
                          </span>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="py-20 text-center">
                      <div className="flex flex-col items-center opacity-20">
                        <Package size={48} className="text-[#535C91] mb-2" />
                        <p className="font-black text-[10px] uppercase tracking-[0.5em]">
                          No Assets Found
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyAssets;
