import React from 'react'
import { Skeleton } from '@/components/ui/skeleton'

function SkeletonCard() {
  return (
    <div className="flex flex-col items-start col-span-12 space-y-3 sm:col-span-6 xl:col-span-4">
      <Skeleton className="w-[711px] h-[500]" />
      <h2 className="text-lg font-bold sm:text-xl md:text-2xl">
        <Skeleton className="w-2/5 h-3" />
      </h2>
      <div className="text-sm">
        <Skeleton className="w-4/5 h-3" />
      </div>
      <div className="pt-2 text-xs font-medium">
        <Skeleton className="w-2/5 h-3" />
      </div>
    </div>
  )
}

export default async function Page() {
  return (
    <section className="w-full px-5 py-6 mx-auto space-y-5 sm:py-8 md:py-12 sm:space-y-8 md:space-y-16 max-w-7xl">
      <div className="grid grid-cols-12 pb-10 sm:px-5 gap-x-8 gap-y-16">
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </div>
    </section>
  )
}
