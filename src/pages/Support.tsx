import { type FC } from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'

const Support: FC = () => {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Support</h1>
      <Card>
        <CardHeader>
          <CardTitle>Help & Support</CardTitle>
          <CardDescription>Placeholder content for support</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border p-4">Contact support@aps.io</div>
        </CardContent>
      </Card>
    </div>
  )
}

export default Support
