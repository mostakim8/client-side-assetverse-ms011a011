import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import useAuth from "../../hooks/UseAuth";
import { Loader2, Building2, Search, Send } from "lucide-react";
import Swal from "sweetalert2";

const JoinCompany = () => {
    const axiosSecure = useAxiosSecure();
    const { user } = useAuth();

    // data fetching for all companies
    const { data: companies = [], isLoading, refetch } = useQuery({
        queryKey: ['companies'],
        queryFn: async () => {
            const res = await axiosSecure.get('/all-companies');
            return res.data;
        }
    });

    // function to handle join request
    const handleJoinRequest = async (company) => {

        const hr_email = company.hrEmail || company.email; 

    if (!hr_email) {
        return Swal.fire("Error", "This company has no HR email associated!", "error");
    }

        const joinInfo = {
            employeeName: user?.displayName,
            employeeEmail: user?.email,
            employeePhoto: user?.photoURL,
            hrEmail: hr_email,
            status: 'pending' 
        };

        try {
            const res = await axiosSecure.patch(`/users/join-request/${user?.email}`, joinInfo);
            if (res.data.modifiedCount > 0) {
                Swal.fire({
                    icon: 'success',
                    title: 'Request Sent!',
                    text: 'Wait for HR approval.',
                    showConfirmButton: false,
                    timer: 1500
                });
                refetch();
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: error.response?.data?.message || 'Something went wrong!',
            });
        }
    };

    if (isLoading) return (
        <div className="flex justify-center items-center min-h-screen">
            <Loader2 className="animate-spin text-blue-600 w-12 h-12" />
        </div>
    );

    return (
        <div className="p-10 pt-28 min-h-screen bg-[#fcfcfd]">
            <div className="max-w-5xl mx-auto">
                <div className="text-center mb-12">
                    <h2 className="text-4xl font-black uppercase tracking-tighter text-gray-900">
                        Find Your <span className="text-blue-600 italic">Company</span>
                    </h2>
                    <p className="text-gray-500 font-medium mt-2">Search and join a company to start managing your assets.</p>
                </div>

                {/* Search Bar Placeholder */}
                <div className="relative max-w-md mx-auto mb-10">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input 
                        type="text" 
                        placeholder="Search by company name..." 
                        className="w-full pl-12 pr-4 py-4 rounded-2xl border border-gray-100 shadow-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    />
                </div>

                {/* Company Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {companies.map((company) => (
                        <div key={company._id} className="bg-white p-8 rounded-[2.5rem] border border-gray-50 shadow-sm hover:shadow-xl transition-all group">
                            <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 mb-6 group-hover:scale-110 transition-transform">
                                <Building2 size={32} />
                            </div>
                            <h3 className="font-black text-xl text-gray-900 uppercase tracking-tight mb-1">{company.companyName}</h3>
                            <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-6">HR: {company.hrName}</p>
                            
                            <button 
                                onClick={() => handleJoinRequest(company)}
                                className="w-full py-4 bg-gray-900 hover:bg-blue-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2"
                            >
                                <Send size={14} /> Send Join Request
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default JoinCompany;