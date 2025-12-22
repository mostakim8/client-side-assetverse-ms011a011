import axios from "axios";
import useAuth from "../hooks/UseAuth";
import Swal from "sweetalert2";

const UpgradePackage = () => {
    const { user } = useAuth();

    const packages = [
        { id: 1, name: "Starter", members: 5, price: 5 },
        { id: 2, name: "Growth", members: 10, price: 8 },
        { id: 3, name: "Enterprise", members: 20, price: 15 },
    ];

    const handleUpgrade = async (members, price) => {
        Swal.fire({
            title: `Upgrade to ${members} more members?`,
            text: `You will be charged $${price}`,
            icon: "info",
            showCancelButton: true,
            confirmButtonText: "Pay Now"
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const res = await axios.patch(`${import.meta.env.VITE_API_URL}/users/upgrade-package/${user?.email}`, {
                        newLimit: members
                    });
                    if (res.data.modifiedCount > 0) {
                        Swal.fire("Success!", `Package upgraded. You can now add ${members} more members.`, "success");
                    }
                } catch (error) {
                    Swal.fire("Error", "Payment failed!", "error");
                }
            }
        });
    };

    return (
        <div className="p-8 pt-24 min-h-screen bg-gray-50 flex flex-col items-center">
            <h2 className="text-4xl font-black text-gray-800 mb-4">Upgrade Your Package</h2>
            <p className="text-gray-500 mb-12">Increase your team member limit to manage more employees.</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl w-full">
                {packages.map((pkg) => (
                    <div key={pkg.id} className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center hover:shadow-xl transition-all">
                        <h3 className="text-2xl font-bold text-blue-600 mb-2">{pkg.name}</h3>
                        <div className="flex items-baseline mb-6">
                            <span className="text-5xl font-black">${pkg.price}</span>
                            <span className="text-gray-400 ml-1">/one-time</span>
                        </div>
                        <ul className="space-y-4 mb-8 text-center text-gray-600">
                            <li className="font-bold">Add {pkg.members} More Members</li>
                            <li>Full Asset Tracking</li>
                            <li>Team Analytics</li>
                        </ul>
                        <button 
                            onClick={() => handleUpgrade(pkg.members, pkg.price)}
                            className="btn btn-primary w-full bg-blue-600 border-none text-white hover:bg-blue-700"
                        >
                            Buy Package
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default UpgradePackage;