import React from 'react'
import { Link } from 'react-router-dom'

function Theatre() {
  return (
    
<>
<div class="h-screen flex justify-center align-middle max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8">
  
  <div class="grid md:grid-cols-2 gap-4 md:gap-8 xl:gap-20 md:items-center">
    <div>
      <h1 class="block text-3xl font-bold text-gray-800 sm:text-4xl lg:text-6xl lg:leading-tight dark:text-white">Start your journey with <span class="text-indigo-500">Flickz</span></h1>
      <p class="mt-3 text-lg text-gray-800 dark:text-neutral-400">Discover new opportunities, enhance your services, and reach a wider audience.</p>

      
      <div class="mt-7 grid gap-3 w-full sm:inline-flex">
        <Link to='/theatre/register' class="py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50 disabled:pointer-events-none" >
          Get started
          <svg class="flex-shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>
        </Link>
        <Link to='/theatre/login' class="py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-800" >
        Login
        </Link>
      </div>
      

     
      
      
    </div>
    

    <div class="relative ms-4">
      <img class="w-full rounded-md  border-[8px] border-indigo-500 " src="https://images.unsplash.com/photo-1665686377065-08ba896d16fd?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=700&h=800&q=80" alt="Image Description"/>
      
    </div>  
    
  </div>
  
</div>
<div className="">
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320"><path fill="#6366f1" fill-opacity="1" d="M0,32L120,74.7C240,117,480,203,720,208C960,213,1200,139,1320,101.3L1440,64L1440,320L1320,320C1200,320,960,320,720,320C480,320,240,320,120,320L0,320Z"></path></svg>
</div>
</>
   
  )
}

export default Theatre