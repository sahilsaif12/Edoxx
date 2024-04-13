import React from 'react'

function Loader() {
  return (
    <div className="w-full top-0 left-0 opacity-70 bg-slate-900 absolute h-full flex items-end pb-10 justify-center">

<span className="loading loading-ball loading-md text-teal-400 "></span>
<span className="loading loading-ball loading-lg text-teal-200"></span>
<span className="loading loading-ball loading-md text-teal-400"></span>
{/* <span className="loading loading-dots loading-lg text-teal-300"></span> */}

    </div>
  )
}

export default Loader