import { useQuery } from "@tanstack/react-query";
import { useState, useEffect, useContext } from "react";
import useAuth from "../../hooks/UseAuth";
import { ThemeContext } from "../../hooks/ThemeContext";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import Swal from "sweetalert2";
import {
  Search,
  Loader2,
  PackagePlus,
  Building2,
  UserPlus,
  LayoutGrid,
  Filter,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  Users,
} from "lucide-react";

const RequestAsset = () => {
  const { user } = useAuth();
  const { isDark } = useContext(ThemeContext);
  const axiosSecure = useAxiosSecure();
  const [activeTab, setActiveTab] = useState("inventory");
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [filterType, setFilterType] = useState("");
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setCurrentPage(1);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  const { data: userData = {}, isLoading: userLoading } = useQuery({
    queryKey: ["user-info", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(`/users/${user?.email.toLowerCase()}`);
      return res.data;
    },
  });

  const {
    data: assetsData = { result: [], totalCount: 0 },
    isLoading: assetsLoading,
    refetch,
  } = useQuery({
    queryKey: ["all-assets", debouncedSearch, filterType, currentPage],
    queryFn: async () => {
      const res = await axiosSecure.get(`/all-assets`, {
        params: {
          search: debouncedSearch,
          type: filterType,
          page: currentPage,
          limit: itemsPerPage,
        },
      });
      return res.data;
    },
  });

  const allAssets = assetsData.result || [];
  const totalPages = Math.ceil((assetsData.totalCount || 0) / itemsPerPage);

  const { data: companies = [], isLoading: companiesLoading } = useQuery({
    queryKey: ["all-hr-companies"],
    queryFn: async () => {
      const res = await axiosSecure.get("/hr-companies");
      return res.data;
    },
  });

  const handleRequestAction = async (e) => {
    e.preventDefault();
    const note = e.target.note.value;
    const isOtherCompany = userData?.hrEmail !== selectedAsset.hrEmail;

    const requestData = {
      assetId: selectedAsset._id,
      assetName: selectedAsset.productName,
      assetType: selectedAsset.productType,
      assetImage: selectedAsset.productImage,
      requesterEmail: user?.email.toLowerCase(),
      requesterName: user?.displayName,
      hrEmail: selectedAsset.hrEmail,
      hrName: selectedAsset.hrName || selectedAsset.companyName,
      requestDate: new Date(),
      requestStatus: "pending",
      note: note,
      type: isOtherCompany ? "JoinRequest" : "AssetRequest",
    };

    try {
      const res = await axiosSecure.post("/requests", requestData);
      if (res.data.insertedId) {
        Swal.fire({
          title: "Success",
          text: "Request submitted.",
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
          background: isDark ? "#070F2B" : "#fff",
          color: isDark ? "#9290C3" : "#000",
        });
        document.getElementById("request_modal").close();
        refetch();
      }
    } catch (error) {
      Swal.fire("Error", "Process failed.", "error");
    }
  };

  const handleDirectJoin = async (hr) => {
    try {
      const res = await axiosSecure.post("/join-requests", {
        hrEmail: hr.email,
        userEmail: user?.email.toLowerCase(),
        userName: user?.displayName,
        status: "Pending",
        requestDate: new Date().toISOString().split("T")[0],
      });
      if (res.data.insertedId) {
        Swal.fire({
          title: "Sent!",
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
        });
      }
    } catch (error) {
      Swal.fire("Note", "Already pending.", "info");
    }
  };

  if (userLoading)
    return (
      <div className="flex justify-center items-center min-h-screen bg-white dark:bg-[#070F2B]">
        <Loader2 className="animate-spin text-[#535C91] w-10 h-10" />
      </div>
    );

  return (
    <div className="p-4 md:p-8 pt-24 min-h-screen bg-white dark:bg-[#070F2B] transition-colors duration-300">
      <div className="max-w-6xl mx-auto">
        {/* Header - Balanced Scale */}
        <div className="mb-10 text-center">
          <h2 className="text-4xl md:text-5xl font-black text-[#070F2B] dark:text-white tracking-tighter italic leading-none">
            Market<span className="text-[#535C91]">Place</span>
          </h2>
          <p className="text-[#535C91] dark:text-[#9290C3]/60 text-[10px] font-black tracking-[0.3em] mt-3 italic uppercase">
            Asset Inventory & Corporate Discovery
          </p>
        </div>

        {/* Tab Navigation - Compact Padding */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex bg-gray-50 dark:bg-[#1B1A55]/20 p-1.5 rounded-2xl border border-gray-100 dark:border-[#535C91]/20 shadow-sm">
            {[
              { id: "inventory", label: "Inventory", icon: LayoutGrid },
              { id: "join", label: "Companies", icon: Building2 },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-8 py-2.5 rounded-xl text-[10px] font-black tracking-widest transition-all flex items-center gap-2 uppercase cursor-pointer ${
                  activeTab === tab.id
                    ? "bg-[#1B1A55] text-white shadow-md"
                    : "text-[#535C91] hover:bg-gray-100 dark:hover:bg-white/5"
                }`}
              >
                <tab.icon size={14} /> {tab.label}
              </button>
            ))}
          </div>
        </div>

        {activeTab === "inventory" && (
          <div className="space-y-8">
            {/* Search & Filter - Balanced Height */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 bg-gray-50/50 dark:bg-[#1B1A55]/10 p-2 rounded-2xl border border-gray-100 dark:border-[#535C91]/20">
              <div className="md:col-span-8 relative">
                <Search
                  className="absolute left-5 top-1/2 -translate-y-1/2 text-[#535C91]"
                  size={18}
                />
                <input
                  type="text"
                  className="w-full pl-12 pr-6 py-3 bg-gray-200/50 dark:bg-[#070F2B] border-none rounded-xl focus:ring-2 focus:ring-[#9290C3] outline-none text-[13px] font-semibold dark:text-white transition-all shadow-inner"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="md:col-span-4 relative">
                <Filter
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-[#535C91]"
                  size={16}
                />
                <select
                  className="w-full pl-10 pr-4 py-3 bg-gray-200/50 dark:bg-[#070F2B] border-none rounded-xl text-[10px] font-black tracking-widest text-[#535C91] appearance-none cursor-pointer uppercase outline-none"
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                >
                  <option value="">All Categories</option>
                  <option value="Returnable">Returnable</option>
                  <option value="Non-returnable">Non-returnable</option>
                </select>
              </div>
            </div>

            {assetsLoading ? (
              <div className="flex justify-center py-20">
                <Loader2 className="animate-spin text-[#535C91]" size={40} />
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
                {allAssets.map((asset) => {
                  const isMyCompany = userData?.hrEmail === asset.hrEmail;
                  return (
                    <div
                      key={asset._id}
                      className="bg-white dark:bg-[#1B1A55]/10 rounded-[2rem] p-3.5 border border-gray-100 dark:border-[#535C91]/20 hover:border-[#9290C3]/40 transition-all group flex flex-col h-full shadow-sm hover:shadow-xl"
                    >
                      <div className="relative h-44 rounded-2xl overflow-hidden mb-4 shadow-sm">
                        <img
                          src={asset.productImage}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          alt=""
                        />
                        <div className="absolute top-2 left-2 flex flex-col gap-1.5">
                          <span className="bg-[#1B1A55]/80 backdrop-blur-md text-white text-[8px] font-black px-2.5 py-1 rounded-lg uppercase">
                            Qty: {asset.availableQuantity}
                          </span>
                        </div>
                        {isMyCompany && (
                          <div className="absolute top-2 right-2 bg-emerald-500 text-white p-1.5 rounded-lg shadow-lg border border-white/10">
                            <Users size={12} />
                          </div>
                        )}
                      </div>

                      <div className="px-1 flex flex-col flex-grow">
                        <h4 className="font-black text-[#070F2B] dark:text-white text-[13px] italic tracking-tight truncate uppercase mb-1">
                          {asset.productName}
                        </h4>
                        <p className="text-[9px] font-bold text-[#535C91] mb-4 flex items-center gap-1.5 italic truncate opacity-70 uppercase">
                          <Building2 size={11} /> {asset.companyName}
                        </p>

                        <button
                          disabled={asset.availableQuantity === 0}
                          onClick={() => {
                            setSelectedAsset(asset);
                            document
                              .getElementById("request_modal")
                              .showModal();
                          }}
                          className={`mt-auto w-full py-2.5 rounded-xl font-black text-[9px] tracking-widest transition-all flex items-center justify-center gap-2 uppercase shadow-sm active:scale-95 cursor-pointer ${
                            isMyCompany
                              ? "bg-[#1B1A55] text-white hover:bg-[#535C91]"
                              : "bg-gray-100 dark:bg-[#070F2B] text-[#535C91] hover:bg-gray-200"
                          } disabled:opacity-30`}
                        >
                          {asset.availableQuantity === 0 ? (
                            "Empty"
                          ) : isMyCompany ? (
                            <PackagePlus size={14} />
                          ) : (
                            <ArrowUpRight size={14} />
                          )}
                          {asset.availableQuantity > 0 &&
                            (isMyCompany ? "Request" : "Join First")}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Pagination - Standard */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-10 pb-6">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => p - 1)}
                  className="p-2.5 bg-gray-100 dark:bg-[#1B1A55] rounded-lg text-[#535C91] disabled:opacity-20 hover:bg-[#535C91] hover:text-white transition-colors"
                >
                  <ChevronLeft size={16} />
                </button>
                <span className="text-[10px] font-black text-[#535C91] mx-4 uppercase tracking-[0.2em]">
                  Page {currentPage} / {totalPages}
                </span>
                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((p) => p + 1)}
                  className="p-2.5 bg-gray-100 dark:bg-[#1B1A55] rounded-lg text-[#535C91] disabled:opacity-20 hover:bg-[#535C91] hover:text-white transition-colors"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            )}
          </div>
        )}

        {activeTab === "join" && (
          <div className="max-w-3xl mx-auto space-y-3">
            {companiesLoading ? (
              <div className="flex justify-center py-20">
                <Loader2 className="animate-spin text-[#535C91]" size={40} />
              </div>
            ) : (
              companies.map((hr) => (
                <div
                  key={hr._id}
                  className="bg-white dark:bg-[#1B1A55]/10 p-4 rounded-2xl border border-gray-100 dark:border-[#535C91]/20 flex items-center justify-between gap-4 hover:shadow-md transition-all group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gray-50 dark:bg-[#070F2B] rounded-xl flex items-center justify-center overflow-hidden border border-[#535C91]/10 shrink-0">
                      {hr.companyLogo ? (
                        <img
                          src={hr.companyLogo}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Building2 size={20} className="text-[#535C91]" />
                      )}
                    </div>
                    <div>
                      <h4 className="text-[14px] font-black italic text-[#070F2B] dark:text-white tracking-tight uppercase leading-none mb-1">
                        {hr.companyName}
                      </h4>
                      <p className="text-[9px] font-bold text-[#535C91] dark:text-[#9290C3]/60 tracking-widest uppercase italic opacity-70">
                        Manager: {hr.name}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDirectJoin(hr)}
                    disabled={userData?.hrEmail === hr.email}
                    className="px-6 py-2 bg-[#1B1A55] text-white rounded-xl font-black text-[9px] tracking-widest uppercase hover:bg-[#535C91] disabled:opacity-20 shadow-sm transition-all active:scale-95"
                  >
                    <UserPlus size={14} className="inline mr-1" /> Join Team
                  </button>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Modal - Standard Enterprise Look */}
      <dialog
        id="request_modal"
        className="modal backdrop-blur-sm bg-white dark:bg-[#070F2B] "
      >
        <div className="modal-box rounded-[2.5rem] p-0 bg-white dark:bg-[#070F2B] max-w-md border border-gray-100 dark:border-[#535C91]/30 shadow-2xl">
          <div className="bg-[#1B1A55] p-8 text-white">
            <h3 className="text-2xl font-black italic tracking-tighter uppercase leading-none">
              {userData?.hrEmail === selectedAsset?.hrEmail
                ? "Confirm Request"
                : "Join Request"}
            </h3>
            <p className="text-[9px] font-black text-[#9290C3] mt-2 tracking-widest uppercase italic">
              Item: {selectedAsset?.productName}
            </p>
          </div>
          <form onSubmit={handleRequestAction} className="p-6 space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-[#535C91] uppercase tracking-widest ml-1">
                Reason / Note
              </label>
              <textarea
                name="note"
                className="w-full h-32 bg-gray-100 dark:bg-[#1B1A55]/20 rounded-xl p-4 outline-none font-semibold text-[12px] text-[#070F2B] dark:text-white border-none focus:ring-1 focus:ring-[#9290C3] transition-all resize-none shadow-inner"
                required
              ></textarea>
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                className="flex-grow py-3 bg-[#1B1A55] text-white rounded-xl font-black text-[10px] tracking-widest uppercase shadow-lg hover:bg-[#535C91] active:scale-95 transition-all cursor-pointer"
              >
                Submit
              </button>
              <button
                type="button"
                onClick={() => document.getElementById("request_modal").close()}
                className="px-6 py-3 bg-gray-100 dark:bg-[#1B1A55] text-[#535C91] rounded-xl font-black text-[10px] tracking-widest uppercase active:scale-95 transition-all cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </dialog>
    </div>
  );
};

export default RequestAsset;
