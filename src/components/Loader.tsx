import { type FC } from 'react'
import { Spinner } from '@/components/ui/spinner'

const Loader: FC = () => {
  return (
    <div className="flex min-h-[200px] items-center justify-center">
      <Spinner size="lg" />
    </div>
  )
}

export default Loader
