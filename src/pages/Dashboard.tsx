import { type FC, useDeferredValue, useMemo, useState, useEffect, useRef } from 'react'
import { useNavigate, useOutletContext } from 'react-router-dom'
import { type DashboardContextType } from '@/layouts/DashboardLayout'
import { Card, CardHeader, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table'
import { Chip } from '@/components/ui/chip'
import { StatusChip } from '@/components/ui/status-chip'
import { Filter, Columns3, Plus, AlertTriangle, Search, RefreshCw, ChevronLeft, ChevronRight } from 'lucide-react'
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
  const navigate = useNavigate()
  const { newScanResult, setNewScanResult } = useOutletContext<DashboardContextType>()
  const [scans, setScans] = useState<Scan[]>(() => initialScans)
  const lastProcessedScan = useRef<Scan | null>(null)

  useEffect(() => {
    if (newScanResult && newScanResult !== lastProcessedScan.current) {
      lastProcessedScan.current = newScanResult

      setScans(prev => {
        let maxCount = 0;
        prev.forEach(s => {
          if (s.name.startsWith('Manual Scan')) {
            const numStr = s.name.replace('Manual Scan', '').trim();
            const num = numStr ? parseInt(numStr, 10) : 1;
            if (!isNaN(num) && num > maxCount) {
              maxCount = num;
            }
          }
        })
        const nextCount = maxCount + 1;
        const scanToAdd = { ...newScanResult, name: `Manual Scan ${nextCount}` }
        return [scanToAdd, ...prev]
      })

      // We clear the context state so it doesn't get added again on subsequent renders.
      // eslint-disable-next-line react-hooks/exhaustive-deps
      setNewScanResult(null)
    }
  }, [newScanResult, setNewScanResult, setScans])

  const [query, setQuery] = useState('')
  const deferredQuery = useDeferredValue(query)

  // Filter States
  const [showFilters, setShowFilters] = useState(false)
  const filterRef = useRef<HTMLDivElement>(null)
  const [filterType, setFilterType] = useState('All')
  const [filterStatus, setFilterStatus] = useState('All')
  const [filterProgress, setFilterProgress] = useState(0)

  // Close filter popover on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        setShowFilters(false)
      }
    }
    if (showFilters) document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [showFilters])

  const activeFilterCount = (filterType !== 'All' ? 1 : 0) + (filterStatus !== 'All' ? 1 : 0) + (filterProgress > 0 ? 1 : 0)

  const filtered = useMemo(
    () =>
      scans.filter((s) => {
        const matchesQuery = s.name.toLowerCase().includes(deferredQuery.toLowerCase().trim()) || s.type.toLowerCase().includes(deferredQuery.toLowerCase().trim())
        const matchesType = filterType === 'All' || s.type === filterType
        const matchesStatus = filterStatus === 'All' || s.status === filterStatus
        const matchesProgress = s.progress >= filterProgress
        return matchesQuery && matchesType && matchesStatus && matchesProgress
      }),
    [scans, deferredQuery, filterType, filterStatus, filterProgress]
  )
  const totalScans = filtered.length
  const pageSize = 15
  const [page, setPage] = useState(1)
  const maxPage = Math.ceil(totalScans / pageSize)
  const startIndex = (page - 1) * pageSize
  const endIndex = Math.min(startIndex + pageSize, totalScans)
  const rows = filtered.slice(startIndex, endIndex)

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
            className={`flex flex-1 flex-col gap-2 px-8 py-5 ${i < severityStats.length - 1 ? 'border-r border-border' : ''
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
              <div className="relative" ref={filterRef}>
                <Button variant="outline" className="gap-2" onClick={() => setShowFilters(!showFilters)}>
                  <Filter className="h-4 w-4" />
                  Filter
                  {activeFilterCount > 0 && (
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] text-white">
                      {activeFilterCount}
                    </span>
                  )}
                </Button>

                {showFilters && (
                  <div className="absolute left-0 top-full mt-2 w-72 rounded-xl border border-border bg-card p-4 shadow-xl z-50 animate-in fade-in zoom-in-95 duration-200">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-semibold text-sm">Filter Scans</h4>
                      {activeFilterCount > 0 && (
                        <button
                          className="text-xs text-muted-foreground hover:text-foreground underline"
                          onClick={() => { setFilterType('All'); setFilterStatus('All'); setFilterProgress(0); }}
                        >
                          Clear all
                        </button>
                      )}
                    </div>

                    <div className="space-y-4">
                      {/* Type Filter */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-medium text-foreground">Scan Type</label>
                        <select
                          className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                          value={filterType}
                          onChange={(e) => setFilterType(e.target.value)}
                        >
                          <option value="All">All Types</option>
                          <option value="Greybox">Greybox</option>
                          <option value="Blackbox">Blackbox</option>
                        </select>
                      </div>

                      {/* Status Filter */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-medium text-foreground">Status</label>
                        <select
                          className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                          value={filterStatus}
                          onChange={(e) => setFilterStatus(e.target.value)}
                        >
                          <option value="All">All Statuses</option>
                          <option value="completed">Completed</option>
                          <option value="scheduled">Scheduled</option>
                          <option value="failed">Failed</option>
                        </select>
                      </div>

                      {/* Progress Filter */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <label className="text-xs font-medium text-foreground">Min Progress</label>
                          <span className="text-xs text-muted-foreground">{filterProgress}%</span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          className="w-full accent-primary"
                          value={filterProgress}
                          onChange={(e) => setFilterProgress(parseInt(e.target.value, 10))}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <Button variant="outline" className="gap-2">
                <Columns3 className="h-4 w-4" />
                Column
              </Button>
            </div>
            <Button className="gap-2" onClick={() => navigate('/app/scans', { state: { autoStart: true, scanId: Date.now() } })}>
              <Plus className="h-4 w-4" />
              New scan
            </Button>
          </div>
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
