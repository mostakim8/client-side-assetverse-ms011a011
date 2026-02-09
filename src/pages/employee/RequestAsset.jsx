import { useQuery } from "@tanstack/react-query";
import { useState, useEffect, useContext } from "react";
import useAuth from "../../hooks/UseAuth"; 
import { ThemeContext } from "../../hooks/ThemeContext"; 
import useAxiosSecure from "../../hooks/useAxiosSecure"; 
import Swal from "sweetalert2";
import { 
    Search, Loader2, PackagePlus, Building2, 
    UserPlus, LayoutGrid, Filter, ArrowUpRight, 
    ChevronLeft, ChevronRight 
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

    useEffect(() => {
        setCurrentPage(1);
    }, [filterType]);


    const { data: userData = {}, isLoading: userLoading } = useQuery({
        queryKey: ['user-info', user?.email],
        enabled: !!user?.email,
        queryFn: async () => {
            const res = await axiosSecure.get(`/users/${user?.email.toLowerCase()}`);
            return res.data;
        }
    });

    // assets fetching with search, filter, and pagination
    const { data: assetsData = { result: [], totalCount: 0 }, isLoading: assetsLoading, refetch } = useQuery({
        queryKey: ['all-assets', debouncedSearch, filterType, currentPage],
        queryFn: async () => {
            const res = await axiosSecure.get(`/all-assets`, {
                params: { 
                    search: debouncedSearch, 
                    type: filterType,
                    page: currentPage,
                    limit: itemsPerPage
                }
            });
            return res.data;
        }
    });

    const allAssets = assetsData.result || [];
    const totalPages = Math.ceil((assetsData.totalCount || 0) / itemsPerPage);

    // fetching all companies for join tab
    const { data: companies = [], isLoading: companiesLoading } = useQuery({
        queryKey: ['all-hr-companies'],
        queryFn: async () => {
            const res = await axiosSecure.get("/hr-companies");
            return res.data;
        }
    });

    // function to handle both asset request and join request based on context
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
            type: isOtherCompany ? "JoinRequest" : "AssetRequest"
        };

        try {
            const res = await axiosSecure.post("/requests", requestData);
            if (res.data.insertedId) {
                Swal.fire({ 
                    title: isOtherCompany ? "Join Request Sent!" : "Asset Requested!", 
                    text: "Waiting for HR approval.",
                    icon: "success", 
                    background: isDark ? '#0f172a' : '#fff',
                    color: isDark ? '#fff' : '#000',
                    confirmButtonColor: '#2563eb'
                });
                document.getElementById('request_modal').close();
                e.target.reset();
                refetch(); 
            }
        } catch (error) {
            Swal.fire({ title: "Error", text: "Process failed. Try again.", icon: "error" });
        }
    };

    const handleDirectJoin = async (hr) => {
        const joinData = {
            hrEmail: hr.email,
            userEmail: user?.email.toLowerCase(),
            userName: user?.displayName,
            status: "Pending",
            requestDate: new Date().toISOString().split('T')[0]
        };

        try {
            const res = await axiosSecure.post("/join-requests", joinData);
            if (res.data.insertedId) {
                Swal.fire({ title: "Request Sent!", icon: "success", background: isDark ? '#0f172a' : '#fff' });
            }
        } catch (error) {
             Swal.fire({ title: "Note", text: "Request already pending.", icon: "info" });
        }
    };

    if (userLoading) return (
        <div className="flex flex-col justify-center items-center min-h-screen bg-slate-50 dark:bg-slate-950">
            <Loader2 className="animate-spin text-blue-600 w-16 h-16 mb-4" />
            <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Syncing Core Data...</p>
        </div>
    );

    return (
        <div className="p-4 md:p-10 pt-28 min-h-screen bg-[#f8fafc] dark:bg-slate-950 transition-all duration-500">
            <div className="max-w-7xl mx-auto">
                
                {/* Header */}
                <div className="mb-12 text-center">
                    <h2 className="text-5xl md:text-6xl font-black text-slate-900 dark:text-white uppercase tracking-tighter mb-4">
                        Market<span className="text-blue-600 italic">Place</span>
                    </h2>
                    <p className="text-slate-500 dark:text-slate-400 max-w-xl mx-auto font-medium">
                        Request assets from your company or explore and join new corporate teams.
                    </p>
                </div>

                {/* Tab Navigation */}
                <div className="flex justify-center mb-16">
                    <div className="inline-flex bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl p-1.5 rounded-4xl border border-white dark:border-slate-800 shadow-2xl">
                        <button 
                            onClick={() => setActiveTab('inventory')}
                            className={`px-10 py-4 rounded-[1.7rem] text-xs font-black uppercase tracking-widest transition-all flex items-center gap-3 ${activeTab === 'inventory' ? 'bg-blue-600 text-white shadow-xl shadow-blue-500/30' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'}`}
                        >
                            <LayoutGrid size={18} /> Inventory
                        </button>
                        <button 
                            onClick={() => setActiveTab('join')}
                            className={`px-10 py-4 rounded-[1.7rem] text-xs font-black uppercase tracking-widest transition-all flex items-center gap-3 ${activeTab === 'join' ? 'bg-blue-600 text-white shadow-xl shadow-blue-500/30' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'}`}
                        >
                            <Building2 size={18} /> Companies
                        </button>
                    </div>
                </div>

                {/* Inventory Tab */}
                {activeTab === 'inventory' && (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                        <div className="flex flex-col lg:flex-row gap-4 mb-10">
                            <div className="relative flex-grow group">
                                <Search className="absolute top-1/2 -translate-y-1/2 left-6 text-slate-300 group-focus-within:text-blue-500 transition-colors" size={20} />
                                <input 
                                    type="text" 
                                    placeholder="Search by asset name..." 
                                    className="w-full pl-16 pr-6 h-16 bg-white dark:bg-slate-900 border-none rounded-3xl shadow-sm focus:ring-2 focus:ring-blue-500 outline-none font-bold text-slate-700 dark:text-slate-200" 
                                    value={searchTerm} 
                                    onChange={(e) => setSearchTerm(e.target.value)} 
                                />
                            </div>
                            <div className="relative">
                                <Filter className="absolute top-1/2 -translate-y-1/2 left-6 text-slate-400" size={18} />
                                <select 
                                    className="h-16 pl-14 pr-10 bg-white dark:bg-slate-900 border-none rounded-3xl font-black uppercase text-[10px] tracking-widest text-slate-500 outline-none appearance-none cursor-pointer shadow-sm focus:ring-2 focus:ring-blue-500" 
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
                             <div className="flex justify-center py-20"><Loader2 className="animate-spin text-blue-600" size={48} /></div>
                        ) : (
                            <>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                                {allAssets.map(asset => {
                                    const isMyCompany = userData?.hrEmail === asset.hrEmail;
                                    return (
                                        <div key={asset._id} className="group bg-white dark:bg-slate-900 rounded-[2.5rem] p-3 border border-slate-100 dark:border-slate-800 hover:border-blue-500/50 transition-all duration-500 hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] dark:hover:shadow-none relative overflow-hidden h-full flex flex-col">
                                            <div className="relative h-56 rounded-[2.2rem] overflow-hidden mb-6">
                                                <img src={asset.productImage} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={asset.productName} />
                                                <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-6">
                                                    <span className="text-white text-[10px] font-black uppercase tracking-[0.2em]">Available: {asset.availableQuantity || asset.productQuantity}</span>
                                                </div>
                                                <div className="absolute top-4 left-4 flex gap-2">
                                                    <span className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-xl text-[8px] font-black uppercase tracking-widest">
                                                        {asset.productType}
                                                    </span>
                                                    {isMyCompany && (
                                                        <span className="bg-blue-600 text-white px-3 py-1.5 rounded-xl text-[8px] font-black uppercase tracking-widest shadow-lg shadow-blue-500/40">
                                                            My Team
                                                        </span>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="px-4 pb-4 flex flex-col flex-grow">
                                                <h4 className="font-black text-slate-900 dark:text-white uppercase truncate text-lg italic tracking-tighter mb-1">{asset.productName}</h4>
                                                <div className="flex items-center gap-2 mb-6 text-slate-400 dark:text-slate-500">
                                                    <Building2 size={12} />
                                                    <p className="text-[9px] font-bold uppercase tracking-widest">{asset.companyName || 'Corporate Entity'}</p>
                                                </div>
                                                
                                                <button 
                                                    disabled={asset.availableQuantity === 0}
                                                    onClick={() => { setSelectedAsset(asset); document.getElementById('request_modal').showModal(); }}
                                                    className={`w-full py-4 rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] transition-all flex items-center justify-center gap-2 ${isMyCompany ? 'bg-slate-900 dark:bg-blue-600 text-white hover:bg-blue-600' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-blue-600 hover:text-white'} disabled:opacity-50 disabled:cursor-not-allowed`}
                                                >
                                                    {asset.availableQuantity === 0 ? 'Out of Stock' : (isMyCompany ? <PackagePlus size={16}/> : <ArrowUpRight size={16}/>)}
                                                    {asset.availableQuantity > 0 && (isMyCompany ? 'Request Now' : 'Join to Claim')}
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Pagination */}
                            {totalPages > 1 && (
                                <div className="flex justify-center items-center gap-3 mt-16 pb-10">
                                    <button 
                                        disabled={currentPage === 1}
                                        onClick={() => setCurrentPage(p => p - 1)}
                                        className="p-4 bg-white dark:bg-slate-900 rounded-2xl shadow-sm hover:bg-blue-600 hover:text-white transition-all disabled:opacity-20"
                                    >
                                        <ChevronLeft size={18} />
                                    </button>
                                    <button 
                                        disabled={currentPage === totalPages}
                                        onClick={() => setCurrentPage(p => p + 1)}
                                        className="p-4 bg-white dark:bg-slate-900 rounded-2xl shadow-sm hover:bg-blue-600 hover:text-white transition-all disabled:opacity-20"
                                    >
                                        <ChevronRight size={18} />
                                    </button>
                                </div>
                            )}
                            </>
                        )}
                    </div>
                )}

                {activeTab === 'join' && (
                    <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
                        <div className="grid gap-6">
                            {companiesLoading ? (
                                 <div className="flex justify-center py-20"><Loader2 className="animate-spin text-blue-600" size={48} /></div>
                            ) : (
                                companies.map(hr => (
                                    <div key={hr._id} className="bg-white dark:bg-slate-900 p-6 md:p-10 rounded-[3rem] border border-slate-100 dark:border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6 hover:shadow-2xl transition-all group">
                                        <div className="flex items-center gap-8">
                                            <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-3xl flex items-center justify-center overflow-hidden">
                                                {hr.companyLogo ? <img src={hr.companyLogo} className="w-full h-full object-cover" /> : <Building2 size={32} />}
                                            </div>
                                            <div>
                                                <h4 className="text-2xl font-black uppercase italic text-slate-800 dark:text-white">{hr.companyName}</h4>
                                                <p className="text-[10px] font-bold uppercase text-slate-400">HR: {hr.name}</p>
                                            </div>
                                        </div>
                                        <button 
                                            onClick={() => handleDirectJoin(hr)}
                                            disabled={userData?.hrEmail === hr.email}
                                            className="px-10 py-5 bg-slate-900 dark:bg-blue-600 text-white rounded-[1.8rem] font-black text-[11px] uppercase transition-all disabled:opacity-20"
                                        >
                                            <UserPlus size={18} /> Join Team
                                        </button>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Modal */}
            <dialog id="request_modal" className="modal backdrop-blur-md">
                <div className="modal-box rounded-[3rem] p-0 bg-white dark:bg-slate-900 max-w-lg overflow-hidden border-none shadow-2xl">
                    <div className="bg-slate-900 dark:bg-blue-700 p-12 text-white relative">
                        <h3 className="text-4xl font-black uppercase italic tracking-tighter relative z-10">
                            {userData?.hrEmail === selectedAsset?.hrEmail ? 'Confirm Request' : 'Join Team First'}
                        </h3>
                        <p className="text-[10px] font-black uppercase text-blue-300 mt-3 tracking-widest relative z-10">
                            Item: {selectedAsset?.productName}
                        </p>
                    </div>
                    
                    <form onSubmit={handleRequestAction} className="p-10 space-y-8 bg-white dark:bg-slate-900">
                        <div className="space-y-4">
                            <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-2">Note / Purpose</label>
                            <textarea 
                                name="note" 
                                className="w-full h-40 bg-slate-50 dark:bg-slate-800 rounded-4xl p-8 outline-none font-bold text-slate-700 dark:text-white border-2 border-transparent focus:border-blue-500 transition-all resize-none" 
                                required 
                                placeholder="Why do you need this?"
                            ></textarea>
                        </div>
                        
                        <div className="flex flex-col sm:flex-row gap-4">
                            <button type="submit" className="flex-grow py-5 bg-blue-600 text-white rounded-3xl font-black uppercase text-xs tracking-[0.2em] shadow-2xl shadow-blue-500/40 hover:scale-105 active:scale-95 transition-all">Submit Request</button>
                            <button 
                                type="button" 
                                onClick={() => document.getElementById('request_modal').close()} 
                                className="px-8 py-5 bg-slate-100 dark:bg-slate-800 text-slate-400 rounded-3xl font-black uppercase text-xs transition-all"
                            >
                                Close
                            </button>
                        </div>
                    </form>
                </div>
            </dialog>
        </div>
    );
};

export default RequestAsset;