import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import useAuth from "../hooks/UseAuth";
import useAxiosSecure from "../hooks/useAxiosSecure"; 
import { Search, Printer, Loader2, Calendar, Building2, Package } from "lucide-react";

const MyAssets = () => {
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure(); 
    
    const [searchTerm, setSearchTerm] = useState(""); 
    const [debouncedSearch, setDebouncedSearch] = useState(""); 
    const [filterType, setFilterType] = useState("");

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearch(searchTerm);
        }, 500);
        return () => clearTimeout(handler);
    }, [searchTerm]);

    const { data: profileData } = useQuery({
        queryKey: ['user-profile', user?.email],
        enabled: !!user?.email,
        queryFn: async () => {
            const res = await axiosSecure.get(`/users/${user?.email}`);
            return res.data;
        }
    });

    const { data: myAssets = [], isLoading } = useQuery({
        queryKey: ['my-assets', user?.email, debouncedSearch, filterType],
        enabled: !!user?.email,
        queryFn: async () => {
            const res = await axiosSecure.get(`/my-requests/${user?.email}?search=${debouncedSearch}&type=${filterType}`);
            return res.data;
        }
    });

    if (isLoading) return (
        <div className="flex justify-center items-center min-h-screen bg-white">
            <Loader2 className="animate-spin text-blue-600 w-12 h-12" />
        </div>
    );

    return (
        <div className="p-4 md:p-8 pt-24 min-h-screen bg-[#F8FAFC]">
            <style dangerouslySetInnerHTML={{ __html: `
                @media print {
                    nav, footer, .no-print, .navbar, .drawer-side, .btn, .search-section { 
                        display: none !important; 
                    }
                    body { background: white !important; padding: 0 !important; margin: 0 !important; }
                    .max-w-7xl { max-width: 100% !important; width: 100% !important; }
                    .table-container { border: none !important; box-shadow: none !important; }
                    th { background-color: #f3f4f6 !important; color: black !important; }
                }
            `}} />

            <div className="max-w-7xl mx-auto">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 no-print gap-4">
                    <div>
                        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                            My <span className="text-blue-600 italic">Assets</span>
                        </h2>
                        <p className="text-slate-500 text-sm mt-1 font-medium">Manage and track your requested company assets</p>
                    </div>
                    <button 
                        onClick={() => window.print()} 
                        className="group flex items-center gap-2 bg-slate-900 hover:bg-blue-600 text-white px-6 py-3 rounded-2xl font-bold transition-all duration-300 shadow-lg shadow-slate-200"
                    >
                        <Printer size={18} className="group-hover:scale-110 transition-transform" /> 
                        Print Assets List
                    </button>
                </div>

                {/* PRINT HEADER  */}
                <div className="hidden print:block mb-10 border-b-2 border-slate-200 pb-8">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-5">
                            <div className="p-3 bg-slate-100 rounded-2xl">
                                <img src={profileData?.companyLogo} className="h-14 w-14 object-contain" alt="Logo" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">{profileData?.companyName}</h1>
                                <p className="text-xs font-bold text-blue-600 tracking-[0.2em] uppercase">Official Inventory Report</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-sm font-bold text-slate-800">{user?.displayName}</p>
                            <p className="text-xs text-slate-500 font-medium">{user?.email}</p>
                            <div className="flex items-center gap-2 justify-end mt-2 text-[10px] font-black uppercase text-slate-400">
                                <Building2 size={12} /> {profileData?.role} • Joined: {profileData?.joiningDate || "N/A"}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filters Section */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-8 no-print search-section">
                    <div className="md:col-span-8 relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                        <input 
                            type="text" 
                            placeholder="Search by asset name..." 
                            className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-50 focus:border-blue-500 outline-none transition-all font-medium text-slate-700"
                            onChange={(e) => setSearchTerm(e.target.value)} 
                        />
                    </div>
                    <div className="md:col-span-4">
                        <select 
                            className="w-full px-4 py-4 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-50 focus:border-blue-500 outline-none transition-all font-bold text-slate-600 appearance-none"
                            onChange={(e) => setFilterType(e.target.value)}
                        >
                            <option value="">Filter by Type</option>
                            <option value="Returnable">Returnable</option>
                            <option value="Non-returnable">Non-returnable</option>
                        </select>
                    </div>
                </div>

                {/* Modern Table Card */}
                <div className="bg-white rounded-[2.5rem] border border-slate-200 overflow-hidden shadow-xl shadow-slate-100/50 table-container">
                    <div className="overflow-x-auto">
                        <table className="table w-full border-collapse">
                            <thead>
                                <tr className="bg-slate-50/80 border-b border-slate-100">
                                    <th className="py-6 pl-8 text-left text-[11px] font-black uppercase tracking-widest text-slate-400 no-print">Asset</th>
                                    <th className="py-6 text-left text-[11px] font-black uppercase tracking-widest text-slate-400 print:pl-4">Product Details</th>
                                    <th className="text-center text-[11px] font-black uppercase tracking-widest text-slate-400">Owner Company</th>
                                    <th className="text-center text-[11px] font-black uppercase tracking-widest text-slate-400">Type</th>
                                    <th className="text-center text-[11px] font-black uppercase tracking-widest text-slate-400">Request Date</th>
                                    <th className="text-center text-[11px] font-black uppercase tracking-widest text-slate-400">Action Date</th>
                                    <th className="text-center text-[11px] font-black uppercase tracking-widest text-slate-400">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {myAssets.map((asset) => {
                                    const currentStatus = (asset.status || asset.requestStatus || "").toLowerCase();
                                    return (
                                        <tr key={asset._id} className="hover:bg-blue-50/30 transition-colors group">
                                            <td className="py-5 pl-8 no-print">
                                                <div className="h-12 w-12 rounded-2xl bg-slate-100 p-1 group-hover:rotate-3 transition-transform">
                                                    <img src={asset.productImage || asset.productLogo} className="h-full w-full rounded-xl object-cover" alt="" />
                                                </div>
                                            </td>
                                            <td className="py-5 print:pl-4">
                                                <p className="font-bold text-slate-800 text-sm uppercase tracking-tight">{asset.productName}</p>
                                                <div className="flex items-center gap-1 text-[10px] text-slate-400 font-bold uppercase mt-0.5">
                                                    <Package size={10} /> ID: {asset.assetId?.slice(-6)}
                                                </div>
                                            </td>
                                            <td className="text-center">
                                                <span className="text-[11px] font-extrabold text-blue-600 bg-blue-50 px-3 py-1 rounded-full uppercase">
                                                    {profileData?.companyName}
                                                </span>
                                            </td>
                                            <td className="text-center">
                                                <span className="text-[10px] font-bold text-slate-500 uppercase bg-slate-100 px-2 py-1 rounded-md italic">
                                                    {asset.productType}
                                                </span>
                                            </td>
                                            <td className="text-center">
                                                <div className="flex flex-col items-center">
                                                    <span className="text-xs font-bold text-slate-700">{new Date(asset.requestDate).toLocaleDateString()}</span>
                                                    <span className="text-[9px] text-slate-400 font-black uppercase tracking-tighter mt-0.5">Submitted</span>
                                                </div>
                                            </td>
                                            <td className="text-center">
                                                {asset.approvalDate ? (
                                                    <div className="flex flex-col items-center">
                                                        <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-md mb-1 ${
                                                            currentStatus === 'rejected' ? 'bg-rose-50 text-rose-600' : 'bg-blue-50 text-blue-600'
                                                        }`}>
                                                            {currentStatus} on
                                                        </span>
                                                        <span className="text-xs font-bold text-slate-700">
                                                            {new Date(asset.approvalDate).toLocaleDateString()}
                                                        </span>
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center justify-center gap-1 text-slate-300 italic text-xs">
                                                       <Calendar size={12} /> Pending
                                                    </div>
                                                )}
                                            </td>
                                            <td className="text-center pr-4">
                                                <span className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-sm ${
                                                    currentStatus === 'approved' ? 'bg-emerald-500 text-white shadow-emerald-100' : 
                                                    currentStatus === 'rejected' ? 'bg-rose-500 text-white shadow-rose-100' : 
                                                    'bg-amber-400 text-white shadow-amber-100'
                                                }`}>
                                                    {currentStatus}
                                                </span>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                        {myAssets.length === 0 && (
                            <div className="py-20 text-center">
                                <PackageSearch size={48} className="mx-auto text-slate-200 mb-4" />
                                <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">No assets found</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* PRINT FOOTER */}
                <div className="hidden print:flex justify-between items-end mt-20 border-t-2 border-slate-100 pt-6">
                    <div>
                        <p className="text-[10px] font-black uppercase text-slate-300 tracking-[0.3em]">Generated by {profileData?.companyName} System</p>
                    </div>
                    <div className="text-right">
                        <p className="text-xs font-black text-slate-800 uppercase italic">
                            Report Date: {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                        </p>
                        <p className="text-[9px] font-bold text-slate-400 uppercase mt-1">Verified Digital Record</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MyAssets;