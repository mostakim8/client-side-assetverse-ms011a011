import { useState, useEffect } from "react"; 
import { useQuery } from "@tanstack/react-query";
import useAuth from "../../hooks/UseAuth";
import useAxiosSecure from "../../hooks/useAxiosSecure"; 
import { Search, Loader2, PackageSearch, Building2, Filter, Printer } from "lucide-react";
import Swal from "sweetalert2";

const MyAssets = () => {
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure(); 
    const [searchTerm, setSearchTerm] = useState(""); 
    const [debouncedSearch, setDebouncedSearch] = useState(""); 
    const [filterType, setFilterType] = useState("All");
    const [selectedCompanyEmail, setSelectedCompanyEmail] = useState("");

    // Search Debounce Logic
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearch(searchTerm);
        }, 500); 
        return () => clearTimeout(handler);
    }, [searchTerm]);

    // Date Formatting Function (DD.MMM.YYYY)
    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        return new Intl.DateTimeFormat('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        }).format(new Date(dateString));
    };

    // Fetch Companies
    const { data: myCompanies = [] } = useQuery({
        queryKey: ['my-approved-companies', user?.email],
        queryFn: async () => {
            const res = await axiosSecure.get(`/my-approved-companies/${user?.email}`);
            return res.data;
        }
    });

    useEffect(() => {
        if (myCompanies.length > 0 && !selectedCompanyEmail) {
            setSelectedCompanyEmail(myCompanies[0].hrEmail); 
        }
    }, [myCompanies, selectedCompanyEmail]);

    const activeCompany = myCompanies.find(c => c.hrEmail === selectedCompanyEmail);

    // Fetch Assets with isFetching for smooth loader
    const { data: myAssets = [], isFetching, refetch } = useQuery({
        queryKey: ['my-assets', user?.email, debouncedSearch, filterType, selectedCompanyEmail],
        enabled: !!selectedCompanyEmail, 
        queryFn: async () => {
            const res = await axiosSecure.get(`/my-requests/${user?.email}`, {
                params: { 
                    search: debouncedSearch, 
                    type: filterType === "All" ? "" : filterType, 
                    hrEmail: selectedCompanyEmail 
                }
            });
            return res.data;
        }
    });

    const handlePrint = () => window.print();

    const handleReturn = async (id, assetId) => {
        const result = await Swal.fire({
            title: "Confirm Return?",
            text: "Return this asset to inventory?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#000",
            confirmButtonText: "Yes, Return"
        });
        if (result.isConfirmed) {
            try {
                await axiosSecure.patch(`/return-asset/${id}`, { assetId });
                Swal.fire("Returned", "Asset returned successfully.", "success");
                refetch();
            } catch (error) {
                Swal.fire("Error", "Failed to return.", "error");
            }
        }
    };

    return (
        <div className="p-4 md:p-8 pt-24 min-h-screen bg-slate-50 dark:bg-slate-950">
            <style>
                {`
                    @media print {
                        nav, footer, .no-print, header, aside, button { display: none !important; }
                        @page { size: A4; margin: 10mm; }
                        body { background: white !important; color: black !important; padding: 0 !important; }
                        .print-only { display: block !important; }
                        table { width: 100% !important; border-collapse: collapse !important; border: 1px solid #000 !important; }
                        th, td { border: 1px solid #000 !important; padding: 8px !important; font-size: 10pt !important; }
                    }
                    .print-only { display: none; }
                `}
            </style>

            <div className="max-w-6xl mx-auto">
                {/* Header Section */}
                <div className="no-print flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">My Assets</h1>
                        <p className="text-slate-500 font-bold text-xs uppercase tracking-widest italic">My Full Assets List</p>
                    </div>
                    <button onClick={handlePrint} className="flex items-center gap-2 bg-slate-900 text-white px-8 py-3 rounded-xl font-black text-xs uppercase shadow-xl hover:bg-black transition-all">
                        <Printer size={16} /> Print Assets
                    </button>
                </div>

                {/* OFFICIAL PRINT HEADER */}
                <div className="print-only mb-10 border-b-4 border-black pb-6">
                    <div className="flex justify-between items-center mb-8">
                        <div className="flex items-center gap-4">
                            {activeCompany?.companyLogo && <img src={activeCompany.companyLogo} className="h-20 w-20 object-contain border" alt="Logo" />}
                            <div>
                                <h1 className="text-4xl font-black uppercase tracking-tighter">{activeCompany?.companyName}</h1>
                                <p className="text-sm font-bold tracking-widest text-slate-600">OFFICIAL ASSET LIST REPORT</p>
                            </div>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 border p-5 bg-slate-50">
                        <div><p className="text-[10px] uppercase font-black text-slate-400">Employee Name</p><p className="font-bold text-lg">{user?.displayName || "N/A"}</p></div>
                        <div><p className="text-[10px] uppercase font-black text-slate-400">Email</p><p className="font-bold text-lg">{user?.email}</p></div>
                        <div><p className="text-[10px] uppercase font-black text-slate-400">Role</p><p className="font-bold text-lg">{user?.role || "Employee"}</p></div>
                        <div><p className="text-[10px] uppercase font-black text-slate-400">Total Items</p><p className="font-bold text-sm">{myAssets.length} Items Listed</p></div>
                    </div>
                </div>

                {/* SEARCH & FILTER */}
                <div className="no-print grid grid-cols-1 md:grid-cols-12 gap-4 mb-8">
                    <div className="md:col-span-6 relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={20} />
                        <input 
                            type="text" 
                            placeholder="Search assets by name..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl font-semibold shadow-sm focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all"
                        />
                    </div>

                    <div className="md:col-span-3 relative">
                        <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <select 
                            value={selectedCompanyEmail} 
                            onChange={(e) => setSelectedCompanyEmail(e.target.value)} 
                            className="w-full pl-12 pr-4 py-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl font-bold text-sm shadow-sm appearance-none outline-none focus:border-blue-500"
                        >
                            {myCompanies.map((c, i) => <option key={i} value={c.hrEmail}>{c.companyName}</option>)}
                        </select>
                    </div>

                    <div className="md:col-span-3 relative">
                        <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <select 
                            value={filterType} 
                            onChange={(e) => setFilterType(e.target.value)} 
                            className="w-full pl-12 pr-4 py-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl font-bold text-sm shadow-sm appearance-none outline-none focus:border-blue-500"
                        >
                            <option value="All">All Categories</option>
                            <option value="Returnable">Returnable</option>
                            <option value="Non-returnable">Non-returnable</option>
                        </select>
                    </div>
                </div>

                {/* TABLE SECTION */}
                <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl overflow-hidden border border-slate-200 dark:border-slate-800 relative">
                    {isFetching && (
                        <div className="absolute inset-0 bg-white/60 dark:bg-slate-950/60 backdrop-blur-[1px] z-10 flex flex-col items-center justify-center gap-2">
                            <Loader2 className="animate-spin text-blue-600" size={40} />
                            <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">Searching...</span>
                        </div>
                    )}

                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
                                <th className="py-5 px-8 uppercase text-[10px] font-black tracking-widest text-slate-400">Asset Information</th>
                                <th className="py-5 px-6 uppercase text-[10px] font-black tracking-widest text-slate-400">Type</th>
                                <th className="py-5 px-6 uppercase text-[10px] font-black tracking-widest text-slate-400">Date</th>
                                <th className="py-5 px-6 uppercase text-[10px] font-black tracking-widest text-slate-400 text-center">Status</th>
                                <th className="py-5 px-8 uppercase text-[10px] font-black tracking-widest text-slate-400 text-right no-print">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {myAssets.map((asset) => (
                                <tr key={asset._id} className="hover:bg-blue-50/30 dark:hover:bg-blue-900/10 transition-colors">
                                    <td className="py-5 px-8">
                                        <div className="flex items-center gap-4">
                                            <img 
                                                src={asset.productImage || asset.image || "https://via.placeholder.com/40"} 
                                                className="h-10 w-10 rounded-lg object-cover no-print border border-slate-200 shadow-sm bg-slate-100" 
                                                alt="" 
                                                onError={(e) => { e.target.src = "https://via.placeholder.com/40"; }}
                                            />
                                            <span className="font-bold text-slate-900 dark:text-white uppercase text-sm tracking-tight">{asset.productName}</span>
                                        </div>
                                    </td>
                                    <td className="py-5 px-6 text-xs font-bold text-slate-500 uppercase">{asset.productType}</td>
                                    <td className="py-5 px-6 text-xs font-bold text-slate-500 uppercase">
                                        {formatDate(asset.requestDate || asset.assignedDate || asset.addedDate)}
                                    </td>
                                    <td className="py-5 px-6 text-center">
                                        <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase ${asset.status === 'Approved' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'}`}>
                                            {asset.status}
                                        </span>
                                    </td>
                                    <td className="py-5 px-8 text-right no-print">
                                        {asset.productType === "Returnable" && asset.status === "Approved" ? (
                                            <button onClick={() => handleReturn(asset._id, asset.assetId)} className="text-blue-600 hover:text-blue-800 font-black text-[10px] uppercase transition-colors">Return</button>
                                        ) : <span className="text-slate-300 text-[10px] font-bold italic">No Action</span>}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {!isFetching && myAssets.length === 0 && (
                        <div className="py-20 text-center">
                            <PackageSearch size={48} className="mx-auto text-slate-200 mb-3" />
                            <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">No matching assets found</p>
                        </div>
                    )}
                </div>

                {/* OFFICIAL PRINT FOOTER */}
                <div className="print-only mt-20">
                    <div className="text-center border-t-2 border-dotted border-slate-300 pt-6">
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
                            Printed On: {new Date().toLocaleDateString()} | Time: {new Date().toLocaleTimeString()}
                        </p>
                        <p className="text-[8px] font-bold text-slate-300 uppercase mt-2 italic">Official Document - AssetVerse Inventory</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MyAssets;