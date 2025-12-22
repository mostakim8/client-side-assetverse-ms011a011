import { useQuery } from "@tanstack/react-query";
import useAuth from "../hooks/UseAuth";
import useAxiosSecure from "../hooks/useAxiosSecure";

const MyTeam = () => {
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();

    const { data: team = [], isLoading } = useQuery({
        queryKey: ['my-team', user?.email],
        enabled: !!user?.email,
        queryFn: async () => {
            const res = await axiosSecure.get(`/my-team/${user?.email}`);
            return res.data;
        }
    });

    if (isLoading) return (
        <div className="flex justify-center items-center min-h-screen">
            <span className="loading loading-bars loading-lg text-blue-600"></span>
        </div>
    );

    return (
        <div className="p-8 pt-24 min-h-screen bg-gray-50">
            <div className="max-w-6xl mx-auto">
                <div className="mb-10">
                    <h2 className="text-3xl font-black text-gray-800 border-l-8 border-blue-600 pl-4 uppercase tracking-tighter">My Team Members</h2>
                    <p className="text-gray-500 mt-2">All employees working under your company.</p>
                </div>

                {team.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {team.map((member) => (
                            <div key={member._id} className="bg-white p-8 rounded-4xl shadow-sm border border-gray-100 flex flex-col items-center text-center hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
                                <div className="avatar mb-6">
                                    <div className="w-28 h-28 rounded-full ring-4 ring-blue-50 ring-offset-base-100 ring-offset-2 overflow-hidden">
                                        <img 
                                            src={member.photo || member.image || "https://i.ibb.co/mJR7z1C/avatar.png"} 
                                            alt={member.name} 
                                            className="group-hover:scale-110 transition-transform duration-500"
                                        />
                                    </div>
                                </div>
                                <h3 className="text-xl font-black text-gray-800 uppercase tracking-tighter">{member.name}</h3>
                                
                                <div className={`mt-2 px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                                    member.role === 'hr' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'
                                }`}>
                                    {member.role}
                                </div>

                                <div className="mt-6 pt-6 border-t border-gray-50 w-full flex flex-col gap-1">
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Email Address</p>
                                    <p className="text-gray-700 font-medium break-all">{member.email}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="max-w-2xl mx-auto bg-white p-12 rounded-[40px] shadow-sm border-2 border-dashed border-gray-200 text-center">
                        <div className="w-20 h-20 bg-yellow-100 rounded-3xl flex items-center justify-center text-3xl mx-auto mb-6">⚠️</div>
                        <h3 className="text-2xl font-black text-gray-800 mb-4 uppercase tracking-tighter">You haven't joined any team yet!</h3>
                        <p className="text-gray-500 font-medium leading-relaxed">
                            Your profile is currently unaffiliated. Please wait for your HR Manager to add you to the company team to see your colleagues.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyTeam;