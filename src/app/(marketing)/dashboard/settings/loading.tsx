import { Skeleton } from '@/components/ui/skeleton'

export default async function Page() {
  return (
    <div className="space-y-8">
      <div className="max-w-3xl">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          个人信息
        </h1>
        <p className="mt-2 text-muted-foreground">更新您的个人信息</p>
      </div>
      <div className="border rounded p-8">
        <div className="space-y-8">
          <Skeleton className="h-5 w-2/5" />
          <Skeleton className="h-5 w-2/5" />
          <Skeleton className="h-5 w-2/5" />
          <Skeleton className="h-5 w-2/5" />
          <Skeleton className="h-10 w-24" />
        </div>
      </div>
    </div>
  )
}
