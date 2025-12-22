import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import useAuth from "../hooks/UseAuth";
import { FaUserSlash } from "react-icons/fa";
import Swal from "sweetalert2";

const MyEmployeeList = () => {
    const { user } = useAuth();

    const { data: employees = [], refetch, isLoading } = useQuery({
        queryKey: ['my-employees', user?.email],
        queryFn: async () => {
            const res = await axios.get(`http://localhost:5001/my-employees/${user?.email}`);
            return res.data;
        }
    });

    const handleRemove = (id) => {
        Swal.fire({
            title: "Are you sure?",
            text: "Employee will be removed from your company!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, Remove"
        }).then(async (result) => {
            if (result.isConfirmed) {
                const res = await axios.patch(`http://localhost:5001/employees/remove/${id}`);
                if (res.data.modifiedCount > 0) {
                    Swal.fire("Removed!", "Employee removed successfully.", "success");
                    refetch();
                }
            }
        });
    };

    return (
        <div className="p-8 pt-24 min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto bg-white p-6 rounded-2xl shadow-sm border">
                <h2 className="text-3xl font-black mb-8 border-l-4 border-blue-600 pl-4">Team Members</h2>
                
                <div className="overflow-x-auto rounded-xl border border-gray-100">
                    <table className="table w-full">
                        <thead className="bg-blue-600 text-white">
                            <tr>
                                <th>Photo</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Join Date</th>
                                <th>Assets Count</th>
                                <th className="text-center">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading ? (
                                <tr><td colSpan="6" className="text-center py-10">Loading Employees...</td></tr>
                            ) : employees.map((emp) => (
                                <tr key={emp._id} className="hover:bg-blue-50 transition-colors">
                                    <td>
                                        <div className="avatar">
                                            <div className="mask mask-circle w-12 h-12 border-2 border-blue-100">
                                                <img src={emp.image || "https://i.ibb.co/mJR7z1C/avatar.png"} alt="Employee" />
                                            </div>
                                        </div>
                                    </td>
                                    <td className="font-bold text-gray-800">{emp.name}</td>
                                    <td className="text-gray-600 italic">{emp.email}</td>
                                    <td className="text-sm font-medium">{emp.joinedDate || "N/A"}</td>
                                    <td>
                                        <div className="badge badge-info gap-2 font-bold py-3 px-4">
                                            {emp.assetsCount} Assets
                                        </div>
                                    </td>
                                    <td className="text-center">
                                        <button 
                                            onClick={() => handleRemove(emp._id)}
                                            className="btn btn-ghost btn-sm text-red-500 hover:bg-red-50"
                                            title="Remove Employee"
                                        >
                                            <FaUserSlash size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {!isLoading && employees.length === 0 && (
                        <p className="text-center py-20 text-gray-400">No employees found in your team.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MyEmployeeList;