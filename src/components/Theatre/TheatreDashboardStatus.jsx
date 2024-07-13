import React, { useEffect, useState } from 'react'
import createAxiosInstance from '../../utlis/axiosinstance';
function TheatreDashboardStatus() {

  const axiosInstance = createAxiosInstance('theatre')
  const [dashboard, setDashboard] = useState({
    todays_revenue: 0,
    monthly_revenue: 0,
    yearly_revenue: 0,
    expired_shows: 0,
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const res = await axiosInstance.get('/theatre/theatre-dashboard')
        setDashboard(res.data);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };

    fetchDashboardData();
  }, []);


  return (
    <div class="max-w-[85rem] px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto">
      <div class="grid sm:grid-cols-2 lg:grid-cols-2 gap-4 sm:gap-6">
        <div class="flex flex-col bg-white border shadow-sm rounded-xl dark:bg-neutral-800 dark:border-neutral-700">
          <div class="p-4 md:p-5">
            <div class="flex items-center gap-x-2">
              <p class="text-xs uppercase tracking-wide text-gray-500 dark:text-neutral-500">
                Todays Revenue
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
                <span className="text-green-400">$</span>
                {dashboard.todays_revenue}
              </h3>
            </div>
          </div>
        </div>

        <div class="flex flex-col bg-white border shadow-sm rounded-xl dark:bg-neutral-800 dark:border-neutral-700">
          <div class="p-4 md:p-5">
            <div class="flex items-center gap-x-2">
              <p class="text-xs uppercase tracking-wide text-gray-500 dark:text-neutral-500">
                Monthly Revenue
              </p>
            </div>

            <div class="mt-1 flex items-center gap-x-2">
              <h3 class="text-xl sm:text-2xl font-medium text-gray-800 dark:text-neutral-200">
                <span className="text-green-400">$</span>
                {dashboard.monthly_revenue}
              </h3>
            </div>
          </div>
        </div>

        <div class="flex flex-col bg-white border shadow-sm rounded-xl dark:bg-neutral-800 dark:border-neutral-700">
          <div class="p-4 md:p-5">
            <div class="flex items-center gap-x-2">
              <p class="text-xs uppercase tracking-wide text-gray-500 dark:text-neutral-500">
                Yearly Revenue
              </p>
            </div>

            <div class="mt-1 flex items-center gap-x-2">
              <h3 class="text-xl sm:text-2xl font-medium text-gray-800 dark:text-neutral-200">
                <span className="text-green-400">$</span>
                {dashboard.yearly_revenue}
              </h3>
            </div>
          </div>
        </div>

        <div class="flex flex-col bg-white border shadow-sm rounded-xl dark:bg-neutral-800 dark:border-neutral-700">
          <div class="p-4 md:p-5">
            <div class="flex items-center gap-x-2">
              <p class="text-xs uppercase tracking-wide text-gray-500 dark:text-neutral-500">
                Expired Shows
              </p>
            </div>

            <div class="mt-1 flex items-center gap-x-2">
              <h3 class="text-xl sm:text-2xl font-medium text-gray-800 dark:text-neutral-200">
                {dashboard.expired_shows}
              </h3>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TheatreDashboardStatus