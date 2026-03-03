import { type FC, useDeferredValue, useMemo, useState } from 'react'
import { Card, CardHeader, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Slider } from '@/components/ui/slider'
import { Button } from '@/components/ui/button'
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table'
import { Chip } from '@/components/ui/chip'
import { StatusChip } from '@/components/ui/status-chip'
import { Filter, Columns3, Plus, AlertTriangle, Search, RefreshCw, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { type Scan, initialScans } from '@/data/scans'

const metaItems = [
  { label: 'Org', value: 'Project X' },
  { label: 'Owner', value: 'Nammagiri' },
  { label: 'Total Scans', value: '100' },
  { label: 'Scheduled', value: '1000' },
  { label: 'Rescans', value: '100' },
  { label: 'Failed Scans', value: '100' },
]

const severityStats = [
  {
    label: 'Critical Severity',
    count: 86,
    change: '+2%',
    direction: 'up',
    changeLabel: 'increase than yesterday',
    icon: (
      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-100">
        <svg
          className="h-5 w-5 text-rose-500"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="10" />
          <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
        </svg>
      </span>
    ),
    changeColor: 'text-rose-500',
  },
  {
    label: 'High Severity',
    count: 16,
    change: '+0.9%',
    direction: 'up',
    changeLabel: 'increase than yesterday',
    icon: (
      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-100">
        <AlertTriangle className="h-5 w-5 text-orange-500" />
      </span>
    ),
    changeColor: 'text-rose-500',
  },
  {
    label: 'Medium Severity',
    count: 26,
    change: '+0.9%',
    direction: 'down',
    changeLabel: 'decrease than yesterday',
    icon: (
      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-yellow-100">
        <AlertTriangle className="h-5 w-5 text-yellow-500" />
      </span>
    ),
    changeColor: 'text-emerald-500',
  },
  {
    label: 'Low Severity',
    count: 16,
    change: '+0.9%',
    direction: 'up',
    changeLabel: 'increase than yesterday',
    icon: (
      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100">
        <Search className="h-5 w-5 text-blue-500" />
      </span>
    ),
    changeColor: 'text-rose-500',
  },
]

const Dashboard: FC = () => {
  const [scans, setScans] = useState<Scan[]>(() => initialScans)
  const [query, setQuery] = useState('')
  const deferredQuery = useDeferredValue(query)
  const filtered = useMemo(
    () =>
      scans.filter((s) =>
        s.name.toLowerCase().includes(deferredQuery.toLowerCase().trim())
      ),
    [scans, deferredQuery]
  )
  const totalScans = filtered.length
  const pageSize = 15
  const [page, setPage] = useState(1)
  const [open, setOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    name: '',
    type: 'Greybox',
    status: '',
    progress: 0,
    critical: 0,
    high: 0,
    medium: 0,
    low: 0,
  })
  const [touched, setTouched] = useState({ name: false, status: false })
  const maxPage = Math.ceil(totalScans / pageSize)
  const startIndex = (page - 1) * pageSize
  const endIndex = Math.min(startIndex + pageSize, totalScans)
  const rows = filtered.slice(startIndex, endIndex)
  const isValid = form.name.trim() !== '' && ['scheduled', 'completed', 'failed'].includes(form.status)
  const handleInput = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setForm((f) => ({
      ...f,
      [name]:
        name === 'progress' || name === 'critical' || name === 'high' || name === 'medium' || name === 'low'
          ? Number(value)
          : value,
    }))
  }
  const handleSave = async () => {
    setSaving(true)
    await new Promise((r) => setTimeout(r, 800))
    const newScan: Scan = {
      name: form.name,
      type: form.type as Scan['type'],
      status: form.status as Scan['status'],
      progress: form.progress,
      vulns: { critical: form.critical, high: form.high, medium: form.medium, low: form.low },
      lastScan: 'just now',
    }
    setScans((s) => [newScan, ...s])
    setSaving(false)
    setOpen(false)
    setForm({ name: '', type: 'Greybox', status: 'scheduled', progress: 0, critical: 0, high: 0, medium: 0, low: 0 })
  }

  return (
    <div className="space-y-4">

      {/* ── Metadata bar ── */}
      <div className="flex flex-wrap items-center gap-x-0 rounded-xl border border-border bg-white px-4 py-3 dark:bg-[#1A1A1A]">
        {metaItems.map((item, i) => (
          <div key={item.label} className="flex items-center">
            <span className="text-sm text-muted-foreground">
              {item.label}:{' '}
              <span className="font-bold text-foreground">{item.value}</span>
            </span>
            {i < metaItems.length - 1 && (
              <span className="mx-4 select-none text-muted-foreground/30">|</span>
            )}
          </div>
        ))}
        <div className="ml-auto flex items-center gap-1.5 text-sm text-[#0CC8A8]">
          <RefreshCw className="h-4 w-4" />
          <span>10 mins ago</span>
        </div>
      </div>

      {/* ── Severity Stats — single row with vertical dividers ── */}
      <div className="flex items-stretch rounded-xl border border-border bg-white dark:bg-[#1A1A1A]">
        {severityStats.map((stat, i) => (
          <div
            key={stat.label}
            className={`flex flex-1 flex-col gap-2 px-8 py-5 ${
              i < severityStats.length - 1 ? 'border-r border-border' : ''
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">{stat.label}</span>
              {stat.icon}
            </div>
            <span className="text-4xl font-bold text-foreground">{stat.count}</span>
            <div className={`flex items-center gap-1 text-xs font-medium ${stat.changeColor}`}>
              <span>{stat.direction === 'up' ? '↑' : '↓'}</span>
              <span>{stat.change} {stat.changeLabel}</span>
            </div>
          </div>
        ))}
      </div>

      {/* ── Main Table Card ── */}
      <Card className="bg-white dark:bg-[#1A1A1A]">
        <CardHeader />
        <CardContent>

          {/* Search / Filter / New Scan toolbar */}
          <div className="mb-4 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-1 items-center gap-2">
              <Input
                placeholder="Search scans by name or type..."
                className="flex-1"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <Button variant="outline" className="gap-2">
                <Filter className="h-4 w-4" />
                Filter
              </Button>
              <Button variant="outline" className="gap-2">
                <Columns3 className="h-4 w-4" />
                Column
              </Button>
            </div>
            <Button className="gap-2" onClick={() => setOpen(true)}>
              <Plus className="h-4 w-4" />
              New scan
            </Button>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>New Scan</DialogTitle>
                <DialogDescription>Enter details for the new scan</DialogDescription>
              </DialogHeader>
              <div className="grid gap-3">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <span className="text-xs text-muted-foreground">Scan name</span>
                    <Input
                      name="name"
                      value={form.name}
                      onChange={handleInput}
                      onBlur={() => setTouched((t) => ({ ...t, name: true }))}
                      placeholder="Web App Servers"
                    />
                    {touched.name && form.name.trim() === '' && (
                      <span className="text-xs text-red-500">Scan name is required</span>
                    )}
                  </div>
                  <div className="space-y-1">
                    <span className="text-xs text-muted-foreground">Type</span>
                    <select name="type" value={form.type} onChange={handleInput} className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm">
                      <option>Greybox</option>
                      <option>Blackbox</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <span className="text-xs text-muted-foreground">Status</span>
                    <select
                      name="status"
                      value={form.status}
                      onChange={handleInput}
                      onBlur={() => setTouched((t) => ({ ...t, status: true }))}
                      className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                    >
                      <option value="">Select status</option>
                      <option value="scheduled">Scheduled</option>
                      <option value="completed">Completed</option>
                      <option value="failed">Failed</option>
                    </select>
                    {touched.status && form.status === '' && (
                      <span className="text-xs text-red-500">Status is required</span>
                    )}
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">Progress</span>
                      <span className="text-xs text-muted-foreground">{form.progress}%</span>
                    </div>
                    <Slider name="progress" min={0} max={100} value={form.progress} onChange={handleInput} />
                  </div>
                </div>
                <div className="space-y-1">
                  <span className="text-xs text-muted-foreground">Vulnerabilities</span>
                  <div className="grid grid-cols-4 gap-2">
                    <Input type="number" name="critical" value={form.critical} onChange={handleInput} placeholder="Critical" />
                    <Input type="number" name="high" value={form.high} onChange={handleInput} placeholder="High" />
                    <Input type="number" name="medium" value={form.medium} onChange={handleInput} placeholder="Medium" />
                    <Input type="number" name="low" value={form.low} onChange={handleInput} placeholder="Low" />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                <Button onClick={handleSave} disabled={saving || !isValid} className="gap-2">
                  {saving && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
                  Save
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Responsive horizontal scroll wrapper — no inner vertical scrollbar */}
          <div className="w-full overflow-x-auto">
            <Table containerClassName="min-w-[800px]">
              <TableHeader className="sticky top-0 z-10 bg-white dark:bg-[#1A1A1A]">
                <TableRow>
                  <TableHead className="min-w-[160px]">Scan Name</TableHead>
                  <TableHead className="min-w-[100px]">Type</TableHead>
                  <TableHead className="min-w-[120px]">Status</TableHead>
                  <TableHead className="min-w-[200px]">Progress</TableHead>
                  <TableHead className="min-w-[160px]">Vulnerability</TableHead>
                  <TableHead className="min-w-[100px] text-right">Last Scan</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((row, i) => (
                  <TableRow key={startIndex + i}>
                    <TableCell className="font-medium">{row.name}</TableCell>
                    <TableCell>{row.type}</TableCell>
                    <TableCell>
                      <StatusChip status={row.status} />
                    </TableCell>
                    <TableCell>
                    <div className="flex items-center gap-2">
                        <div className="h-2 w-32 overflow-hidden rounded-full bg-gray-200 dark:bg-muted">
                          <div className="h-2 bg-primary" style={{ width: `${row.progress}%` }} />
                        </div>
                        <span className="text-xs text-muted-foreground">{row.progress}%</span>
                      </div>
                    </TableCell>
                    <TableCell className="space-x-1">
                      <Chip variant="red">{row.vulns.critical}</Chip>
                      <Chip variant="yellow">{row.vulns.high}</Chip>
                      <Chip variant="orange">{row.vulns.medium}</Chip>
                      <Chip variant="green">{row.vulns.low}</Chip>
                    </TableCell>
                    <TableCell className="text-right text-sm text-muted-foreground">{row.lastScan}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Pagination footer */}
          <div className="mt-2 flex items-center justify-between rounded-b-md border border-t-0 px-4 py-3 text-sm text-muted-foreground">
            <span>
              Showing {endIndex} of {totalScans} Scans
            </span>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                disabled={page === 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="h-8 w-8"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                disabled={page === maxPage}
                onClick={() => setPage((p) => Math.min(maxPage, p + 1))}
                className="h-8 w-8"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>

        </CardContent>
      </Card>
    </div>
  )
}

export default Dashboard
