import { type FC } from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

const Scans: FC = () => {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Scans</h1>
      <Card>
        <CardHeader>
          <CardTitle>Active Scans</CardTitle>
          <CardDescription>Placeholder content for scans listing</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between rounded-md border p-4">
            <div className="text-sm">No scans yet</div>
            <Button size="sm">Start Scan</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default Scans
