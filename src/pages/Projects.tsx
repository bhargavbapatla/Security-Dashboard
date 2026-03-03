import { type FC } from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'

const Projects: FC = () => {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Projects</h1>
      <Card>
        <CardHeader>
          <CardTitle>Your Projects</CardTitle>
          <CardDescription>Placeholder content for projects</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border p-4">No projects yet</div>
        </CardContent>
      </Card>
    </div>
  )
}

export default Projects
