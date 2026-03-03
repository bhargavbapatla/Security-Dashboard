import { type FC } from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'

const Schedule: FC = () => {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Schedule</h1>
      <Card>
        <CardHeader>
          <CardTitle>Upcoming Scans</CardTitle>
          <CardDescription>Placeholder content for schedule</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border p-4">No scheduled scans</div>
        </CardContent>
      </Card>
    </div>
  )
}

export default Schedule
