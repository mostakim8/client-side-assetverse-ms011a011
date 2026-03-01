import { useState, useEffect, useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import useAuth from "../../hooks/UseAuth";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { ThemeContext } from "../../hooks/ThemeContext";
import {
  Search,
  Edit3,
  Trash2,
  X,
  Package,
  Loader2,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Filter,
  SortAsc,
  Boxes,
} from "lucide-react";
import Swal from "sweetalert2";

const AssetList = () => {
  const { user, loading: authLoading } = useAuth();
  const axiosSecure = useAxiosSecure();
  const { isDark } = useContext(ThemeContext);
  const interFont = { fontFamily: "'Inter', sans-serif" };

  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [filter, setFilter] = useState("");
  const [sort, setSort] = useState("");
  const [selectedAsset, setSelectedAsset] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  const {
    data: { result: assets = [], totalCount = 0 } = {},
    refetch,
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: [
      "assets",
      user?.email,
      debouncedSearch,
      filter,
      sort,
      currentPage,
      itemsPerPage,
    ],
    enabled: !!user?.email && !authLoading,
    queryFn: async () => {
      const res = await axiosSecure.get(
        `/assets/${user?.email.toLowerCase()}`,
        {
          params: {
            search: debouncedSearch,
            filter: filter,
            sort: sort,
            page: currentPage,
            limit: itemsPerPage,
          },
        },
      );
      return res.data;
    },
  });

  const totalPages = Math.ceil(totalCount / itemsPerPage);
  const pages = [...Array(totalPages).keys()].map((num) => num + 1);

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!selectedAsset?._id) return;
    const form = e.target;
    const updatedInfo = {
      productName: form.productName.value,
      productType: form.productType.value,
      productQuantity: parseInt(form.productQuantity.value),
      productImage: form.productImage.value,
    };

    try {
      const res = await axiosSecure.put(
        `/assets/${selectedAsset._id}`,
        updatedInfo,
      );
      if (res.data.modifiedCount > 0) {
        Swal.fire({
          title: "UPDATED",
          icon: "success",
          background: isDark ? "#070F2B" : "#fff",
          color: isDark ? "#9290C3" : "#070F2B",
          confirmButtonColor: "#1B1A55",
          customClass: {
            title: "font-black uppercase italic tracking-widest text-lg",
            confirmButton:
              "font-black uppercase italic tracking-[0.2em] text-[10px] py-4 px-8 rounded-xl",
          },
        });
        refetch();
        document.getElementById("edit_modal").close();
        setSelectedAsset(null);
      }
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: "Update failed",
        icon: "error",
        background: isDark ? "#070F2B" : "#fff",
        color: isDark ? "#9290C3" : "#070F2B",
      });
    }
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: "ARE YOU SURE?",
      text: "This asset record will be permanently deleted from the registry.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#1B1A55",
      cancelButtonColor: "#535C91",
      confirmButtonText: "YES, CONFIRM DELETE",
      background: isDark ? "#070F2B" : "#fff",
      color: isDark ? "#9290C3" : "#070F2B",
      customClass: {
        title: "font-black uppercase italic tracking-widest text-lg",
      },
    }).then(async (result) => {
      if (result.isConfirmed) {
        const res = await axiosSecure.delete(`/assets/${id}`);
        if (res.data.deletedCount > 0) {
          Swal.fire({
            title: "PURGED",
            text: "Asset record removed.",
            icon: "success",
            background: isDark ? "#070F2B" : "#fff",
            color: isDark ? "#9290C3" : "#070F2B",
          });
          refetch();
        }
      }
    });
  };

  if (authLoading || (isLoading && !isFetching)) {
    return (
      <div
        style={interFont}
        className="min-h-screen flex flex-col justify-center items-center bg-white dark:bg-[#070F2B]"
      >
        <div className="w-16 h-16 border-4 border-[#535C91]/20 border-t-[#9290C3] rounded-full animate-spin"></div>
        <p className="mt-4 font-black text-[#535C91] tracking-[0.4em] text-[9px] uppercase italic">
          Accessing Registry...
        </p>
      </div>
    );
  }

  return (
    <div
      style={interFont}
      className="p-4 md:p-12 pt-28 min-h-screen bg-white dark:bg-[#070F2B] transition-colors duration-500"
    >
      <div className="max-w-7xl mx-auto">
        {/* Registry Header */}
        <div className="mb-12 flex flex-col lg:flex-row justify-between items-start lg:items-end gap-10">
          <div>
            <span className="text-[10px] font-black text-[#535C91] tracking-[0.5em] uppercase italic opacity-60">
              Inventory
            </span>
            <h2 className="text-4xl md:text-5xl font-black text-[#070F2B] dark:text-white tracking-tighter uppercase italic">
              Asset <span className="text-[#9290C3]">Registry</span>
            </h2>
            <p className="text-[#535C91] dark:text-[#9290C3]/50 font-black text-[10px] tracking-[0.2em] uppercase italic mt-1">
              Asset Management System List
            </p>
          </div>

          {/* Search & Filter Terminal */}
          <div className="w-full lg:flex-1 max-w-4xl grid grid-cols-1 md:grid-cols-4 gap-3 bg-gray-50 dark:bg-[#1B1A55]/10 p-3 rounded-[2rem] border border-gray-100 dark:border-[#535C91]/10">
            <div className="relative md:col-span-2">
              <Search
                className="absolute top-1/2 -translate-y-1/2 left-5 text-[#535C91]"
                size={16}
              />
              <input
                type="text"
                className="w-full pl-12 pr-4 h-14 bg-white dark:bg-[#070F2B] rounded-xl outline-none font-black text-[11px] tracking-widest uppercase italic dark:text-white border-none focus:ring-1 focus:ring-[#9290C3] transition-all "
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="relative">
              <Filter
                className="absolute top-1/2 -translate-y-1/2 left-4 text-[#535C91]"
                size={14}
              />
              <select
                className="w-full pl-10 pr-4 h-14 bg-white dark:bg-[#070F2B] rounded-xl outline-none font-black text-[10px] tracking-[0.2em] uppercase italic text-[#535C91] appearance-none cursor-pointer"
                value={filter}
                onChange={(e) => {
                  setFilter(e.target.value);
                  setCurrentPage(1);
                }}
              >
                <option value="">TYPE: ALL</option>
                <option value="Returnable">RETURNABLE</option>
                <option value="Non-returnable">NON-RETURNABLE</option>
              </select>
            </div>
            <div className="relative">
              <SortAsc
                className="absolute top-1/2 -translate-y-1/2 left-4 text-[#535C91]"
                size={14}
              />
              <select
                className="w-full pl-10 pr-4 h-14 bg-white dark:bg-[#070F2B] rounded-xl outline-none font-black text-[10px] tracking-[0.2em] uppercase italic text-[#535C91] appearance-none cursor-pointer"
                value={sort}
                onChange={(e) => {
                  setSort(e.target.value);
                  setCurrentPage(1);
                }}
              >
                <option value="">SORT: DEFAULT</option>
                <option value="quantity">QTY: HIGH-LOW</option>
              </select>
            </div>
          </div>
        </div>

        {/* Data Table */}
        <div className="bg-white dark:bg-[#1B1A55]/10 rounded-[2.5rem] border border-gray-100 dark:border-[#535C91]/10 overflow-hidden mb-10 transition-colors relative shadow-2xl shadow-black/5">
          {isFetching && (
            <div className="absolute inset-0 bg-white/40 dark:bg-[#070F2B]/40 backdrop-blur-[2px] z-10 flex items-center justify-center">
              <Loader2 className="animate-spin text-[#9290C3]" size={32} />
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-gray-100 dark:border-[#535C91]/10">
                  <th className="py-8 pl-12 text-left text-[9px] font-black uppercase tracking-[0.4em] text-[#535C91] italic opacity-60">
                    Image
                  </th>
                  <th className="text-left text-[9px] font-black uppercase tracking-[0.4em] text-[#535C91] italic opacity-60">
                    Asset Name
                  </th>
                  <th className="text-center text-[9px] font-black uppercase tracking-[0.4em] text-[#535C91] italic opacity-60">
                    Asset Type
                  </th>
                  <th className="text-center text-[9px] font-black uppercase tracking-[0.4em] text-[#535C91] italic opacity-60">
                    Quantity
                  </th>
                  <th className="text-center text-[9px] font-black uppercase tracking-[0.4em] text-[#535C91] italic opacity-60">
                    Lunched Date
                  </th>
                  <th className="text-right pr-12 text-[9px] font-black uppercase tracking-[0.4em] text-[#535C91] italic opacity-60">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100 dark:divide-[#535C91]/5">
                {assets.length > 0 ? (
                  assets.map((asset) => (
                    <tr
                      key={asset._id}
                      className="hover:bg-gray-50/50 dark:hover:bg-white/5 transition-all group"
                    >
                      <td className="py-6 pl-12">
                        <div className="w-14 h-14 rounded-xl bg-gray-100 dark:bg-[#070F2B] overflow-hidden border border-gray-200 dark:border-[#535C91]/30 group-hover:border-[#9290C3] transition-all">
                          <img
                            src={asset.productImage}
                            className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700"
                            alt={asset.productName}
                          />
                        </div>
                      </td>
                      <td className="text-left">
                        <span className="font-black text-[#070F2B] dark:text-white text-[11px] uppercase tracking-widest italic">
                          {asset.productName}
                        </span>
                      </td>
                      <td className="text-center">
                        <span
                          className={`px-4 py-1.5 rounded-lg text-[8px] font-black uppercase italic tracking-widest border ${asset.productType === "Returnable" ? "border-[#1B1A55] text-[#1B1A55] dark:border-white dark:text-white" : "border-[#9290C3] text-[#9290C3]"}`}
                        >
                          {asset.productType}
                        </span>
                      </td>
                      <td className="text-center">
                        <div className="flex flex-col items-center">
                          <span
                            className={`font-black text-lg italic ${asset.productQuantity < 10 ? "text-rose-500" : "text-[#070F2B] dark:text-white"}`}
                          >
                            {asset.productQuantity.toString().padStart(2, "0")}
                          </span>
                          <span className="text-[8px] font-black uppercase text-[#535C91] tracking-tighter italic">
                            Units
                          </span>
                        </div>
                      </td>
                      <td className="text-center">
                        <div className="flex items-center justify-center gap-2 text-[#535C91] dark:text-[#9290C3]/60">
                          <Calendar size={12} className="opacity-40" />
                          <span className="text-[10px] font-black italic">
                            {asset.addedDate || "N/A"}
                          </span>
                        </div>
                      </td>
                      <td className="text-right pr-12">
                        <div className="flex justify-end gap-3">
                          <button
                            onClick={() => {
                              setSelectedAsset(asset);
                              document.getElementById("edit_modal").showModal();
                            }}
                            className="w-10 h-10 flex items-center justify-center bg-[#1B1A55] dark:bg-white text-white dark:text-[#070F2B] rounded-xl transition-all hover:bg-[#535C91] dark:hover:bg-[#9290C3] active:scale-90 cursor-pointer"
                          >
                            <Edit3 size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(asset._id)}
                            className="w-10 h-10 flex items-center justify-center border border-rose-500/30 text-rose-500 rounded-xl transition-all hover:bg-rose-500 hover:text-white active:scale-90 cursor-pointer"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="py-24 text-center">
                      <Boxes
                        size={48}
                        className="mx-auto text-gray-200 dark:text-[#535C91] mb-6 opacity-20"
                      />
                      <p className="font-black text-[#535C91] uppercase tracking-[0.5em] text-[10px] italic">
                        No Records Found in Database
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Control Center (Pagination) */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-16 px-4">
          <div className="flex items-center gap-4 bg-gray-50 dark:bg-[#1B1A55]/20 px-6 py-3 rounded-xl border border-gray-100 dark:border-[#535C91]/10">
            <span className="text-[9px] font-black text-[#535C91] uppercase tracking-[0.3em] italic">
              Density:
            </span>
            <select
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(parseInt(e.target.value));
                setCurrentPage(1);
              }}
              className="bg-transparent font-black text-[10px] outline-none dark:text-white cursor-pointer uppercase italic"
            >
              <option value="5">05</option>
              <option value="10">10</option>
              <option value="20">20</option>
            </select>
          </div>

          <div className="flex items-center gap-3">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              className="w-10 h-10 flex items-center justify-center bg-[#1B1A55] text-white rounded-lg disabled:opacity-20 transition-all hover:bg-[#535C91] cursor-pointer"
            >
              <ChevronLeft size={16} />
            </button>

            <div className="flex gap-2">
              {pages.map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-10 h-10 rounded-lg font-black text-[10px] italic transition-all ${currentPage === page ? "bg-[#9290C3] text-[#070F2B] shadow-xl" : "bg-gray-50 dark:bg-[#1B1A55]/20 text-[#535C91] hover:text-[#1B1A55]"}`}
                >
                  {page.toString().padStart(2, "0")}
                </button>
              ))}
            </div>

            <button
              disabled={currentPage === totalPages || totalPages === 0}
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              className="w-10 h-10 flex items-center justify-center bg-[#1B1A55] text-white rounded-lg disabled:opacity-20 transition-all hover:bg-[#535C91] cursor-pointer"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Edit Terminal Modal */}
      <dialog id="edit_modal" className="modal backdrop-blur-md bg-white dark:bg-[#070F2B]">
        <div className="modal-box bg-white dark:bg-[#070F2B] text-[#070F2B] dark:text-[#9290C3] rounded-[2.5rem] p-12 max-w-xl border border-[#535C91]/20 shadow-2xl">
          <div className="flex justify-between items-center mb-10">
            <div>
              <h3 className="font-black text-2xl uppercase italic tracking-tighter">
                Edit <span className="text-[#9290C3]">Asset</span>
              </h3>
              <p className="text-[9px] font-black uppercase tracking-widest text-[#535C91] mt-1 italic">
                Registry Modification Terminal
              </p>
            </div>
            <form method="dialog">
              <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-white/5 transition-all cursor-pointer">
                <X size={20} />
              </button>
            </form>
          </div>
          <form onSubmit={handleUpdate} className="space-y-8">
            <div className="space-y-2">
              <label className="text-[9px] font-black text-[#535C91] uppercase tracking-[0.3em] ml-2 italic">
                Product Name
              </label>
              <input
                name="productName"
                defaultValue={selectedAsset?.productName}
                className="w-full px-6 py-4 bg-gray-50 dark:bg-[#1B1A55]/20 dark:text-white border-none rounded-xl font-black text-[11px] uppercase tracking-widest italic focus:ring-1 focus:ring-[#9290C3] outline-none transition-all "
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[9px] font-black text-[#535C91] uppercase tracking-[0.3em] ml-2 italic">
                  Type
                </label>
                <select
                  name="productType"
                  defaultValue={selectedAsset?.productType}
                  className="w-full px-6 py-4 bg-gray-50 dark:bg-[#1B1A55]/20 dark:text-white border-none rounded-xl font-black text-[10px] uppercase italic outline-none cursor-pointer"
                  required
                >
                  <option value="Returnable">RETURNABLE</option>
                  <option value="Non-returnable">NON-RETURNABLE</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[9px] font-black text-[#535C91] uppercase tracking-[0.3em] ml-2 italic">
                  Quantity
                </label>
                <input
                  name="productQuantity"
                  type="number"
                  defaultValue={selectedAsset?.productQuantity}
                  className="w-full px-6 py-4 bg-gray-50 dark:bg-[#1B1A55]/20 dark:text-white border-none rounded-xl font-black text-[11px] italic outline-none"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[9px] font-black text-[#535C91] uppercase tracking-[0.3em] ml-2 italic">
                Image
              </label>
              <input
                name="productImage"
                defaultValue={selectedAsset?.productImage}
                className="w-full px-6 py-4 bg-gray-50 dark:bg-[#1B1A55]/20 dark:text-white border-none rounded-xl font-black text-[10px] italic outline-none"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full py-5 bg-[#1B1A55] dark:bg-white text-white dark:text-[#070F2B] rounded-xl font-black tracking-[0.4em] text-[10px] uppercase italic transition-all hover:bg-[#535C91] shadow-xl active:scale-95 cursor-pointer"
            >
              Save Changes
            </button>
          </form>
        </div>
      </dialog>
    </div>
  );
};

export default AssetList;
