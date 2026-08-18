// import React, { useMemo } from 'react'
// import type { CountdownRendererFn } from 'react-countdown'
// import Countdown from 'react-countdown'

// const Promo = () => {
//   // compute next target: if now before 12:00 -> today 12:00
//   // if between 12:00 and 14:00 -> today 14:00 (countdown to end)
//   // otherwise -> tomorrow 12:00
//   // const target = useMemo(() => {
//   //   const now = new Date()
//   //   const start = new Date(now)
//   //   start.setHours(12, 0, 0, 0)

//   //   const end = new Date(now)
//   //   end.setHours(14, 0, 0, 0)

//   //   if (now < start) return start
//   //   if (now >= start && now < end) return end

//   //   const tomorrow = new Date(now)
//   //   tomorrow.setDate(now.getDate() + 1)
//   //   tomorrow.setHours(12, 0, 0, 0)
//   //   return tomorrow
//   // }, [])

//   const renderer: CountdownRendererFn = ({
//     days,
//     hours,
//     minutes,
//     seconds,
//     completed,
//   }) => {
//     const pad = (n: number) => String(n).padStart(2, '0')

//     if (completed) {
//       return (
//         <div className="flex gap-3">
//           {['Days', 'Hours', 'Minutes', 'Seconds'].map((label) => (
//             <div
//               key={label}
//               className="flex flex-col items-center px-3 py-2 bg-app rounded"
//             >
//               <div className="text-2xl font-bold">00</div>
//               <div className="text-xs text-muted mt-1 uppercase">{label}</div>
//             </div>
//           ))}
//         </div>
//       )
//     }

//     return (
//       <div className="flex gap-3">
//         <div className="flex flex-col items-center px-3 py-2 bg-app rounded">
//           <div className="text-2xl font-bold">{pad(days)}</div>
//           <div className="text-xs text-muted mt-1 uppercase">Days</div>
//         </div>

//         <div className="flex flex-col items-center px-3 py-2 bg-app rounded">
//           <div className="text-2xl font-bold">{pad(hours)}</div>
//           <div className="text-xs text-muted mt-1 uppercase">Hours</div>
//         </div>

//         <div className="flex flex-col items-center px-3 py-2 bg-app rounded">
//           <div className="text-2xl font-bold">{pad(minutes)}</div>
//           <div className="text-xs text-muted mt-1 uppercase">Minutes</div>
//         </div>

//         <div className="flex flex-col items-center px-3 py-2 bg-app rounded">
//           <div className="text-2xl font-bold">{pad(seconds)}</div>
//           <div className="text-xs text-muted mt-1 uppercase">Seconds</div>
//         </div>
//       </div>
//     )
//   }

//   return (
//     <div className=" w-full h-[40dvh] bg-app">
//       <div className="max-w-7xl mx-auto w-full p-10 space-y-6">
//         <div className="flex items-center justify-between text-sm uppercase">
//           <div className=" max-w-lg">
//             <h1 className="text-2xl font-bold">Lunch sales</h1>
//             <p className="text-muted text-xs ">
//               Get 20% off on all items during our lunch sales! Use code{' '}
//               <strong>LUNCH20</strong> at checkout. Offer valid from 12 PM to 2
//               PM daily. Don't miss out on this delicious deal!
//             </p>
//           </div>

//           <div className="mt-6 flex items-center gap-4">
//             <div className="text-sm text-muted">Time remaining:</div>
//             {/* <Countdown date={new Date()} renderer={renderer} /> */}
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default Promo
