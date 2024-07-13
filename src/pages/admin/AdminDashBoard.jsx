import React,{useState,useEffect} from 'react'
import AdminNav from './AdminNav'
import createAxiosInstance from '../../utlis/axiosinstance';
function AdminDashBoard() {
    const axiosInstance = createAxiosInstance("admin");
    const [dashboard, setDashboard] = useState({
      total_users: 0,
      total_theatres: 0,
      total_movies: 0,
      blocked_users: 0,
    });

    useEffect(() => {
      const fetchDashboardData = async () => {
        try {
          const res = await axiosInstance.get("/cadmin/admin/admin-dashboard");
          setDashboard(res.data);
        } catch (error) {
          console.error("Error fetching dashboard data:", error);
        }
      };

      fetchDashboardData();
    }, []);
  return (
    <>
      <AdminNav />
      <div className="h-screen bg-[#1B1C31]">
        <div class="max-w-[85rem] px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto">
          <div class="grid sm:grid-cols-2 lg:grid-cols-2 gap-4 sm:gap-6">
            <div class="flex flex-col bg-white border shadow-sm rounded-xl dark:bg-neutral-800 dark:border-neutral-700">
              <div class="p-4 md:p-5">
                <div class="flex items-center gap-x-2">
                  <p class="text-xs uppercase tracking-wide text-gray-500 dark:text-neutral-500">
                    Total Users
                  </p>
                  <div class="hs-tooltip">
                    <div class="hs-tooltip-toggle">
                      <span
                        class="hs-tooltip-content hs-tooltip-shown:opacity-100 hs-tooltip-shown:visible opacity-0 transition-opacity inline-block absolute invisible z-10 py-1 px-2 bg-gray-900 text-xs font-medium text-white rounded shadow-sm dark:bg-neutral-700"
                        role="tooltip"
                      >
                        The number of daily users
                      </span>
                    </div>
                  </div>
                </div>

                <div class="mt-1 flex items-center gap-x-2">
                  <h3 class="text-xl sm:text-2xl font-medium text-gray-800 dark:text-neutral-200">
                   
                    {dashboard.total_users}
                  </h3>
                </div>
              </div>
            </div>

            <div class="flex flex-col bg-white border shadow-sm rounded-xl dark:bg-neutral-800 dark:border-neutral-700">
              <div class="p-4 md:p-5">
                <div class="flex items-center gap-x-2">
                  <p class="text-xs uppercase tracking-wide text-gray-500 dark:text-neutral-500">
                    Total Theatres
                  </p>
                </div>

                <div class="mt-1 flex items-center gap-x-2">
                  <h3 class="text-xl sm:text-2xl font-medium text-gray-800 dark:text-neutral-200">
                    
                    {dashboard.total_theatres}
                  </h3>
                </div>
              </div>
            </div>

            <div class="flex flex-col bg-white border shadow-sm rounded-xl dark:bg-neutral-800 dark:border-neutral-700">
              <div class="p-4 md:p-5">
                <div class="flex items-center gap-x-2">
                  <p class="text-xs uppercase tracking-wide text-gray-500 dark:text-neutral-500">
                    Movies
                  </p>
                </div>

                <div class="mt-1 flex items-center gap-x-2">
                  <h3 class="text-xl sm:text-2xl font-medium text-gray-800 dark:text-neutral-200">
                
                   {dashboard.total_movies}
                  </h3>
                </div>
              </div>
            </div>

            <div class="flex flex-col bg-white border shadow-sm rounded-xl dark:bg-neutral-800 dark:border-neutral-700">
              <div class="p-4 md:p-5">
                <div class="flex items-center gap-x-2">
                  <p class="text-xs uppercase tracking-wide text-gray-500 dark:text-neutral-500">
                    Blocked Users
                  </p>
                </div>

                <div class="mt-1 flex items-center gap-x-2">
                  <h3 class="text-xl sm:text-2xl font-medium text-gray-800 dark:text-neutral-200">
                    {dashboard.blocked_users}
                  </h3>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default AdminDashBoard