import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import useAuth from "../hooks/UseAuth";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";

const AddEmployee = () => {
    const { user } = useAuth();
    const [selectedEmployees, setSelectedEmployees] = useState([]);

    // ১. HR-profile member limit
    const { data: hrData = {} } = useQuery({
        queryKey: ['hr-profile', user?.email],
        queryFn: async () => {
            const res = await axios.get(`http://localhost:5001/users/${user?.email}`);
            return res.data;
        }
    });

    // current team members count
    const { data: teamCount = 0, refetch: refetchCount } = useQuery({
        queryKey: ['team-count', user?.email],
        queryFn: async () => {
            const res = await axios.get(`http://localhost:5001/team-count/${user?.email}`);
            return res.data.count;
        }
    });


    const { data: availableEmployees = [], refetch: refetchAvailable } = useQuery({
        queryKey: ['unaffiliated-employees'],
        queryFn: async () => {
            const res = await axios.get('http://localhost:5001/unaffiliated-employees');
            return res.data;
        }
    });

    const handleSelect = (id) => {
        if (selectedEmployees.includes(id)) {
            setSelectedEmployees(selectedEmployees.filter(empId => empId !== id));
        } else {
           
            if (teamCount + selectedEmployees.length >= hrData?.memberLimit) {
                return Swal.fire({
                    icon: 'warning',
                    title: 'Limit Exceeded!',
                    text: `Your current package limit is ${hrData?.memberLimit}. Please upgrade to add more.`,
                    showCancelButton: true,
                    confirmButtonText: 'Upgrade Now',
                    confirmButtonColor: '#2563eb'
                }).then((result) => {
                    if (result.isConfirmed) {
                        
                        window.location.href = "/upgrade-package";
                    }
                });
            }
            setSelectedEmployees([...selectedEmployees, id]);
        }
    };

    const handleBulkAdd = async () => {
        if (selectedEmployees.length === 0) return;

        const info = {
            hrEmail: user?.email,
            companyName: hrData?.companyName || "Your Company",
            companyLogo: hrData?.companyLogo || user?.photoURL,
            employeeIds: selectedEmployees
        };

        try {
            const res = await axios.patch('http://localhost:5001/add-to-team-bulk', info);
            if (res.data.modifiedCount > 0) {
                Swal.fire("Success!", `${res.data.modifiedCount} members added to your team.`, "success");
                setSelectedEmployees([]);
                refetchAvailable();
                refetchCount();
            }
        } catch (error) {
            Swal.fire("Error", "Action failed", "error");
        }
    };

    return (
        <div className="p-8 pt-24 min-h-screen bg-gray-50 flex flex-col items-center">
            <div className="max-w-6xl w-full bg-white p-8 rounded-3xl shadow-sm border">
                
               
                <div className="flex flex-col md:flex-row justify-between items-center bg-blue-50 border border-blue-100 p-6 rounded-2xl mb-10">
                    <div>
                        <h2 className="text-xl font-bold text-blue-900">Add Team Members</h2>
                        <p className="text-blue-700">Current Team Size: <span className="font-black">{teamCount} / {hrData?.memberLimit || 0}</span></p>
                    </div>
                    <Link to="/upgrade-package" className="btn btn-primary bg-blue-600 border-none text-white mt-4 md:mt-0">
                        Upgrade Package
                    </Link>
                </div>

                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-2xl font-black text-gray-800">Available Employees</h3>
                    <button 
                        onClick={handleBulkAdd}
                        disabled={selectedEmployees.length === 0}
                        className="btn btn-success text-white px-8 shadow-lg disabled:bg-gray-300"
                    >
                        Add Selected ({selectedEmployees.length})
                    </button>
                </div>

                <div className="overflow-x-auto rounded-2xl border">
                    <table className="table w-full">
                        <thead className="bg-gray-100 text-gray-700">
                            <tr>
                                <th className="p-4">Select</th>
                                <th>Image</th>
                                <th>Name</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {availableEmployees.map((emp) => (
                                <tr key={emp._id} className="hover:bg-blue-50 transition-colors">
                                    <td className="p-4">
                                        <input 
                                            type="checkbox" 
                                            className="checkbox checkbox-primary"
                                            checked={selectedEmployees.includes(emp._id)}
                                            onChange={() => handleSelect(emp._id)}
                                        />
                                    </td>
                                    <td>
                                        <div className="avatar">
                                            <div className="w-12 h-12 rounded-full border">
                                                <img src={emp.image || "https://i.ibb.co/mJR7z1C/avatar.png"} alt="Member" />
                                            </div>
                                        </div>
                                    </td>
                                    <td className="font-bold text-gray-700">{emp.name}</td>
                                    <td>
                                        <button 
                                            onClick={() => handleSelect(emp._id)}
                                            className={`btn btn-xs ${selectedEmployees.includes(emp._id) ? 'btn-error text-white' : 'btn-outline btn-primary'}`}
                                        >
                                            {selectedEmployees.includes(emp._id) ? 'Deselect' : 'Select'}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {availableEmployees.length === 0 && (
                        <p className="text-center p-10 text-gray-400">No unaffiliated employees found.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AddEmployee;