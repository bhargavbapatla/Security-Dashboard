import { type FC } from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'

const Notifications: FC = () => {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Notifications</h1>
      <Card>
        <CardHeader>
          <CardTitle>Alerts</CardTitle>
          <CardDescription>Placeholder content for notifications</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border p-4">No notifications</div>
        </CardContent>
      </Card>
    </div>
  )
}

export default Notifications
