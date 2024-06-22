import React , {useState,useEffect} from 'react'
import createAxiosInstance from '../../utlis/axiosinstance'
import axios from 'axios'


function UserList() {

    const axiosInstance = createAxiosInstance('admin')
    const [user , setUser] = useState([])
    
    
    const fetchUsers = async () => {
      try {
          const res = await axiosInstance.get('/cadmin/admin/user-list');
          setUser(res.data);
          console.log(res.data)
      } catch (error) {
          console.log('error', error);
      }
  };

    useEffect(() => {
       
        fetchUsers();
    }, []);

    const HandleBlockUser = async (e, userId, index) => {
        e.preventDefault();
        try {
            
            const res = await axiosInstance.put(`/cadmin/admin/user-block-unblock/${userId}/`);
            console.log(res);
            const updatedUser = { ...user[index], is_active: !user[index].is_active };
            console.log(updatedUser);
            const updatedUserList = [...user];
            console.log(updatedUserList);
            updatedUserList[index] = updatedUser;
            setUser(updatedUserList);
        } catch (error) {
            console.error('Error blocking/unblocking user:', error);
        }
    };

  return (
    <div className="p-[5px]">
    <div class="flex flex-col">
  
    <div class="p-1.5 min-w-full inline-block align-middle">
      <div class="border rounded-lg divide-y divide-gray-200 dark:border-neutral-700 bg-[#2d2e3e] dark:divide-neutral-700">
        <div class="py-3 px-4">
          {/* <div class="relative max-w-xs">
            <label class="sr-only">Search</label>
            <input type="text" name="hs-table-with-pagination-search" id="hs-table-with-pagination-search" class="py-2 px-3 ps-9 block w-full border-gray-200 shadow-sm rounded-lg text-sm focus:z-10 focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600" placeholder="Search for items"/>
            <div class="absolute inset-y-0 start-0 flex items-center pointer-events-none ps-3">
              <svg class="size-4 text-gray-400 dark:text-neutral-500" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.3-4.3"></path>
              </svg>
            </div>
          </div> */}
        </div>
        <div class="overflow-hidden">
          <table class="min-w-full divide-y divide-gray-200 dark:divide-neutral-700">
            <thead class="bg-gray-50 dark:bg-neutral-700">
              <tr>
                
                <th scope="col" class="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase dark:text-neutral-500">First Name</th>
                <th scope="col" class="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase dark:text-neutral-500">Last Name</th>
                <th scope="col" class="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase dark:text-neutral-500">email</th>
                <th scope="col" class="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase dark:text-neutral-500">phone</th>
                <th scope="col" class="px-6 py-3 text-end text-xs font-medium text-gray-500 uppercase dark:text-neutral-500">Action</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200 dark:divide-neutral-700">
            {user.map((user, index) => (
                <tr key={user.id}>
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-neutral-200">{user.first_name}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-neutral-200">{user.last_name}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-neutral-200">{user.email}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-neutral-200">{user.phone}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-end text-sm font-medium">
                    <button 
                        type="button" 
                        className={`inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent hover:text-blue-800 disabled:opacity-50 disabled:pointer-events-none dark:hover:text-red-400 ${user.is_active ? 'text-blue-600 dark:text-blue-500' : 'text-red-600 dark:text-red-400 dark:hover:text-green-400'}`} 
                        onClick={(e) => HandleBlockUser(e, user.id, index)}
                        >
                        {user.is_active ? 'Block' : 'Unblock'}
                        </button>
                    </td>
                </tr>
            ))}
             
            </tbody>
          </table>
        </div>
        <div class="py-1 px-4">
          <nav class="flex items-center space-x-1">
            <button type="button" class="p-2.5 min-w-[40px] inline-flex justify-center items-center gap-x-2 text-sm rounded-full text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none dark:text-white dark:hover:bg-white/10">
              <span aria-hidden="true">«</span>
              <span class="sr-only">Previous</span>
            </button>
            <button type="button" class="min-w-[40px] flex justify-center items-center text-gray-800 hover:bg-gray-100 py-2.5 text-sm rounded-full disabled:opacity-50 disabled:pointer-events-none dark:text-white dark:hover:bg-white/10" aria-current="page">1</button>
            <button type="button" class="min-w-[40px] flex justify-center items-center text-gray-800 hover:bg-gray-100 py-2.5 text-sm rounded-full disabled:opacity-50 disabled:pointer-events-none dark:text-white dark:hover:bg-white/10">2</button>
            <button type="button" class="min-w-[40px] flex justify-center items-center text-gray-800 hover:bg-gray-100 py-2.5 text-sm rounded-full disabled:opacity-50 disabled:pointer-events-none dark:text-white dark:hover:bg-white/10">3</button>
            <button type="button" class="p-2.5 min-w-[40px] inline-flex justify-center items-center gap-x-2 text-sm rounded-full text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none dark:text-white dark:hover:bg-white/10">
              <span class="sr-only">Next</span>
              <span aria-hidden="true">»</span>
            </button>
          </nav>
        </div>
      </div>
    </div>
  </div>
</div>

  )
}

export default UserList