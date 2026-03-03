import { type FC } from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'

const SettingsPage: FC = () => {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Settings</h1>
      <Card>
        <CardHeader>
          <CardTitle>Profile Settings</CardTitle>
          <CardDescription>Placeholder content for settings</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border p-4">Settings form coming soon</div>
        </CardContent>
      </Card>
    </div>
  )
}

export default SettingsPage
