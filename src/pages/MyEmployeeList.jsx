import { useQuery } from "@tanstack/react-query";
import useAuth from "../hooks/UseAuth";
import useAxiosSecure from "../hooks/useAxiosSecure"; 
import Swal from "sweetalert2";

const MyEmployeeList = () => {
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure(); 

    const { data: employees = [], refetch, isLoading } = useQuery({
        queryKey: ['my-employees', user?.email],
        enabled: !!user?.email,
        queryFn: async () => {
            const res = await axiosSecure.get(`/my-employees/${user?.email}`);
            return res.data;
        }
    });

    const handleRemove = (id) => {
        Swal.fire({
            title: "Are you sure?",
            text: "Employee will be removed from your company and team!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Yes, Remove"
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const res = await axiosSecure.patch(`/employees/remove/${id}`);
                    if (res.data.modifiedCount > 0) {
                        Swal.fire("Removed!", "Employee removed successfully.", "success");
                        refetch();
                    }
                } catch (error) {
                    Swal.fire("Error", "Could not remove employee.", "error");
                }
            }
        });
    };

    return (
        <div className="p-4 md:p-8 pt-24 min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto bg-white p-8 rounded-4xl shadow-sm border border-gray-100">
                <div className="mb-8">
                    <h2 className="text-3xl font-black text-gray-800 border-l-8 border-blue-600 pl-4 uppercase tracking-tighter">My Team Members</h2>
                    <p className="text-gray-500 mt-1 font-medium">Manage and monitor your current employees.</p>
                </div>
                
                <div className="overflow-x-auto rounded-2xl border border-gray-50">
                    <table className="table w-full">
                        <thead className="bg-gray-50 text-gray-500 uppercase text-[11px] font-black tracking-widest h-16">
                            <tr>
                                <th className="pl-6">Candidate</th>
                                <th>Email</th>
                                <th>Join Date</th>
                                <th>Assets</th>
                                <th className="text-center">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {isLoading ? (
                                <tr>
                                    <td colSpan="5" className="text-center py-20">
                                        <span className="loading loading-spinner loading-md text-blue-600"></span>
                                    </td>
                                </tr>
                            ) : employees.map((emp) => (
                                <tr key={emp._id} className="hover:bg-blue-50/30 transition-all h-20">
                                    <td className="pl-6">
                                        <div className="flex items-center gap-4">
                                            <div className="avatar">
                                                <div className="w-12 h-12 rounded-xl border-2 border-white shadow-sm">
                                                    <img src={emp.photo || emp.image || "https://i.ibb.co/mJR7z1C/avatar.png"} alt="Employee" />
                                                </div>
                                            </div>
                                            <span className="font-black text-gray-800">{emp.name}</span>
                                        </div>
                                    </td>
                                    <td className="text-gray-500 font-bold text-sm uppercase">{emp.email}</td>
                                    <td className="text-gray-400 font-bold text-xs">{emp.joinedDate || "Recent"}</td>
                                    <td>
                                        <div className="badge bg-blue-50 text-blue-600 border-blue-100 font-black py-3 px-4 rounded-lg">
                                            {emp.assetsCount || 0} Items
                                        </div>
                                    </td>
                                    <td className="text-center">
                                        <button 
                                            onClick={() => handleRemove(emp._id)}
                                            className="btn btn-circle btn-ghost text-red-400 hover:bg-red-50 hover:text-red-600 transition-all"
                                            title="Remove from Team"
                                        >
                                            <FaUserSlash size={20} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {!isLoading && employees.length === 0 && (
                        <div className="text-center py-20">
                            <p className="text-gray-400 font-bold italic">No employees have been added to your team yet.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MyEmployeeList;