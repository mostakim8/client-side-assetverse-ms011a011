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
} from "lucide-react";
import Swal from "sweetalert2";

const AssetList = () => {
  const { user, loading: authLoading } = useAuth();
  const axiosSecure = useAxiosSecure();
  const { isDark } = useContext(ThemeContext);

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
          title: "Success!",
          text: "Asset updated successfully",
          icon: "success",
          showConfirmButton: false,
          timer: 1500,
          background: isDark ? "#070F2B" : "#fff",
          color: isDark ? "#9290C3" : "#070F2B",
          confirmButtonColor: "#1B1A55",
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
      title: "Are you sure?",
      text: "This item will be removed from your inventory!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#1B1A55",
      cancelButtonColor: "#535C91",
      confirmButtonText: "Yes, Delete",
      background: isDark ? "#070F2B" : "#fff",
      color: isDark ? "#9290C3" : "#070F2B",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const res = await axiosSecure.delete(`/assets/${id}`);
        if (res.data.deletedCount > 0) {
          Swal.fire({
            title: "Deleted!",
            text: "Asset removed.",
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
      <div className="min-h-screen flex flex-col justify-center items-center gap-4 bg-white dark:bg-[#070F2B]">
        <Loader2 className="animate-spin text-[#535C91]" size={40} />
        <p className="font-black   text-xs tracking-widest text-[#535C91] dark:text-[#9290C3]">
          Loading...
        </p>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-12 pt-28 min-h-screen bg-white dark:bg-[#070F2B] transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-10 flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8">
          <div>
            <h2 className="text-4xl font-black text-[#070F2B] dark:text-white tracking-tighter   italic">
              Asset <span className="text-[#535C91]">Management</span>
            </h2>
            <p className="text-[#535C91] dark:text-[#9290C3]/60 text-[10px] font-black   tracking-[0.2em] mt-2 italic">
              Asset Management System List
            </p>
          </div>

          {/* Search & Filter Bar */}
          <div className="w-full lg:flex-1 max-w-4xl grid grid-cols-1 md:grid-cols-4 gap-4 bg-gray-50 dark:bg-[#1B1A55]/10 p-3 rounded-4xl shadow-sm border border-gray-100 dark:border-[#535C91]/20">
            <div className="relative md:col-span-2">
              <Search
                className="absolute top-1/2 -translate-y-1/2 left-5 text-gray-300 dark:text-[#535C91]"
                size={18}
              />
              <input
                type="text"
                className="w-full pl-12 pr-4 h-14 bg-white dark:bg-[#070F2B] rounded-2xl outline-none font-bold text-sm text-[#070F2B] dark:text-white border-none focus:ring-2 focus:ring-[#9290C3] transition-all "
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="relative">
              <Filter
                className="absolute top-1/2 -translate-y-1/2 left-4 text-gray-300 dark:text-[#535C91]"
                size={16}
              />
              <select
                className="w-full pl-10 pr-4 h-14 bg-white dark:bg-[#070F2B] rounded-2xl outline-none font-black text-[10px]   tracking-widest text-[#535C91] appearance-none cursor-pointer"
                value={filter}
                onChange={(e) => {
                  setFilter(e.target.value);
                  setCurrentPage(1);
                }}
              >
                <option value="">All Types</option>
                <option value="Returnable">Returnable</option>
                <option value="Non-returnable">Non-returnable</option>
              </select>
            </div>
            <div className="relative">
              <SortAsc
                className="absolute top-1/2 -translate-y-1/2 left-4 text-gray-300 dark:text-[#535C91]"
                size={16}
              />
              <select
                className="w-full pl-10 pr-4 h-14 bg-white dark:bg-[#070F2B] rounded-2xl outline-none font-black text-[10px]   tracking-widest text-[#535C91] appearance-none cursor-pointer"
                value={sort}
                onChange={(e) => {
                  setSort(e.target.value);
                  setCurrentPage(1);
                }}
              >
                <option value="">Sort By</option>
                <option value="quantity">Quantity (High)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Table Section */}
        <div className="bg-white dark:bg-[#1B1A55]/10 rounded-[2.5rem] shadow-sm border border-gray-100 dark:border-[#535C91]/20 overflow-hidden mb-8 transition-colors relative">
          {isFetching && (
            <div className="absolute inset-0 bg-white/40 dark:bg-[#070F2B]/40 backdrop-blur-[1px] z-10 flex items-center justify-center">
              <Loader2 className="animate-spin text-[#535C91]" size={32} />
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="table w-full border-collapse">
              <thead>
                <tr className="border-b border-gray-100 dark:border-[#535C91]/20 text-[11px] font-black   text-[#535C91] dark:text-[#9290C3]/40 tracking-widest">
                  <th className="py-8 pl-12 text-left">Image</th>
                  <th className="text-left">Product Name</th>
                  <th className="text-center">Type</th>
                  <th className="text-center">Quantity</th>
                  <th className="text-center">Added Date</th>
                  <th className="text-right pr-12">Action</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-50 dark:divide-[#535C91]/10">
                {assets.length > 0 ? (
                  assets.map((asset) => (
                    <tr
                      key={asset._id}
                      className="hover:bg-gray-50 dark:hover:bg-[#1B1A55]/30 transition-all group"
                    >
                      <td className="py-6 pl-12">
                        <div className="w-14 h-14 rounded-2xl bg-gray-100 dark:bg-[#070F2B] overflow-hidden border border-gray-200 dark:border-[#535C91]/30 shadow-sm shrink-0">
                          <img
                            src={asset.productImage}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            alt={asset.productName}
                          />
                        </div>
                      </td>
                      <td className="text-left">
                        <span className="font-black text-[#070F2B] dark:text-white   text-sm tracking-tight italic">
                          {asset.productName}
                        </span>
                      </td>
                      <td className="text-center">
                        <span
                          className={`px-4 py-1.5 rounded-xl text-[10px] font-black   tracking-wider ${asset.productType === "Returnable" ? "bg-[#1B1A55] text-white" : "bg-[#535C91] text-white"}`}
                        >
                          {asset.productType}
                        </span>
                      </td>
                      <td className="text-center">
                        <div className="flex flex-col items-center">
                          <span
                            className={`font-black text-xl leading-none ${asset.productQuantity < 10 ? "text-rose-500" : "text-[#070F2B] dark:text-[#9290C3]"}`}
                          >
                            {asset.productQuantity}
                          </span>
                          <span className="text-[9px] font-black   text-gray-300 dark:text-[#535C91] mt-1">
                            Units
                          </span>
                        </div>
                      </td>
                      <td className="text-center">
                        <div className="flex items-center justify-center gap-2 text-[#535C91] dark:text-[#9290C3]/60">
                          <Calendar
                            size={16}
                            className="text-gray-300 dark:text-[#535C91]"
                          />
                          <span className="text-xs font-black">
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
                            className="btn btn-square bg-gray-100 dark:bg-[#1B1A55] border-none text-[#1B1A55] dark:text-[#9290C3] rounded-2xl transition-all duration-300 hover:bg-[#1B1A55] hover:text-white"
                          >
                            <Edit3 size={20} />
                          </button>
                          <button
                            onClick={() => handleDelete(asset._id)}
                            className="btn btn-square bg-rose-50 dark:bg-rose-900/30 border-none text-rose-500 dark:text-rose-400 rounded-2xl transition-all duration-300 hover:bg-rose-500 hover:text-white"
                          >
                            <Trash2 size={20} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="py-20 text-center">
                      <Package
                        size={48}
                        className="mx-auto text-gray-200 dark:text-[#535C91] mb-4"
                      />
                      <p className="font-black   text-gray-400 dark:text-[#535C91] tracking-widest text-xs">
                        No Assets Found
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination Controls */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 mt-10 pb-12 px-4">
          <div className="flex items-center gap-4 bg-gray-50 dark:bg-[#1B1A55]/20 px-6 py-3 rounded-2xl border border-gray-100 dark:border-[#535C91]/20">
            <span className="text-[10px] font-black   text-[#535C91] dark:text-[#9290C3]/40">
              Rows per page:
            </span>
            <select
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(parseInt(e.target.value));
                setCurrentPage(1);
              }}
              className="bg-transparent font-black text-xs outline-none dark:text-white cursor-pointer"
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
              className="w-10 h-10 flex items-center justify-center bg-gray-50 dark:bg-[#1B1A55]/20 border border-gray-100 dark:border-[#535C91]/20 rounded-xl text-[#535C91] hover:bg-[#1B1A55] hover:text-white disabled:opacity-20 transition-all"
            >
              <ChevronLeft size={18} />
            </button>

            <div className="flex gap-2">
              {pages.map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-10 h-10 rounded-xl font-black text-[11px] transition-all ${currentPage === page ? "bg-[#1B1A55] text-white shadow-lg" : "bg-gray-50 dark:bg-[#1B1A55]/20 text-[#535C91] border border-gray-100 dark:border-[#535C91]/20 hover:text-[#1B1A55]"}`}
                >
                  {page}
                </button>
              ))}
            </div>

            <button
              disabled={currentPage === totalPages || totalPages === 0}
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              className="w-10 h-10 flex items-center justify-center bg-gray-50 dark:bg-[#1B1A55]/20 border border-gray-100 dark:border-[#535C91]/20 rounded-xl text-[#535C91] hover:bg-[#1B1A55] hover:text-white disabled:opacity-20 transition-all"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>

      <dialog
        id="edit_modal"
        className="modal backdrop-blur-sm bg-white dark:bg-[#070F2B]"
      >
        <div className="modal-box bg-white dark:bg-[#070F2B] text-[#070F2B] dark:text-[#9290C3] rounded-[2.5rem] p-10 max-w-xl border border-[#535C91]/20 shadow-2xl">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-black text-2xl   tracking-tighter italic">
              Edit <span className="text-[#535C91]">Asset</span>
            </h3>
            <form method="dialog">
              <button className="btn btn-sm btn-circle btn-ghost">
                <X size={20} />
              </button>
            </form>
          </div>
          <form onSubmit={handleUpdate} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black   text-[#535C91] dark:text-[#9290C3]/40 ml-2">
                Product Name
              </label>
              <input
                name="productName"
                defaultValue={selectedAsset?.productName}
                className="w-full px-6 py-4 bg-gray-50 dark:bg-[#1B1A55]/20 dark:text-white border-none rounded-2xl font-bold focus:ring-2 focus:ring-[#9290C3] outline-none transition-all"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black   text-[#535C91] dark:text-[#9290C3]/40 ml-2">
                  Asset Type
                </label>
                <select
                  name="productType"
                  defaultValue={selectedAsset?.productType}
                  className="w-full px-6 py-4 bg-gray-50 dark:bg-[#1B1A55]/20 dark:text-white border-none rounded-2xl font-bold outline-none"
                  required
                >
                  <option value="Returnable">Returnable</option>
                  <option value="Non-returnable">Non-returnable</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black   text-[#535C91] dark:text-[#9290C3]/40 ml-2">
                  Quantity
                </label>
                <input
                  name="productQuantity"
                  type="number"
                  defaultValue={selectedAsset?.productQuantity}
                  className="w-full px-6 py-4 bg-gray-50 dark:bg-[#1B1A55]/20 dark:text-white border-none rounded-2xl font-bold outline-none"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black   text-[#535C91] dark:text-[#9290C3]/40 ml-2">
                Image URL
              </label>
              <input
                name="productImage"
                defaultValue={selectedAsset?.productImage}
                className="w-full px-6 py-4 bg-gray-50 dark:bg-[#1B1A55]/20 dark:text-white border-none rounded-2xl font-bold outline-none"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full py-5 bg-[#1B1A55] text-white rounded-2xl font-black   tracking-widest hover:bg-[#535C91] transition-all shadow-lg active:scale-95"
            >
              Update Asset
            </button>
          </form>
        </div>
      </dialog>
    </div>
  );
};

export default AssetList;
