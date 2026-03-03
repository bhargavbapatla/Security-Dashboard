import { type FC } from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'

const Dashboard: FC = () => {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Dashboard</h1>
      <Card>
        <CardHeader>
          <CardTitle>Overview</CardTitle>
          <CardDescription>Placeholder content for dashboard overview</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="rounded-md border p-4">Metric A</div>
            <div className="rounded-md border p-4">Metric B</div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default Dashboard
