import { type FC, useState, useRef, useCallback, useEffect } from 'react'
import { useOutletContext, useLocation } from 'react-router-dom'
import { type DashboardContextType } from '@/layouts/DashboardLayout'
import { Button } from '@/components/ui/button'
import { ChevronDown, X, RotateCcw, FileOutput, Play } from 'lucide-react'

type Severity = 'Critical' | 'High' | 'Medium' | 'Low'

interface Finding {
  id: number
  severity: Severity
  title: string
  path: string
  description: string
  time: string
}

interface LogEntry {
  time: string
  text: React.ReactNode
}

export interface SessionData {
  stepLogs: Record<string, Array<() => React.ReactNode>>
  testingFindings: Finding[]
  validatingFindings: Finding[]
  allFindings: Finding[]
}

const STEPS = ['Spidering', 'Mapping', 'Testing', 'Validating', 'Reporting']

// ── Random log pools per step ─────────────────────────────────────────────
const LOG_POOLS: Record<string, Array<() => React.ReactNode>> = {
  Spidering: [
    () => <>Initializing scan engine. Target: <span className="text-primary">{randomTarget()}</span></>,
    () => `Resolving DNS... ${randomIP()} found. Host is reachable.`,
    () => `Launching spider on root path /. Crawling all discovered links...`,
    () => <>Discovered {randomInt(8, 22)} endpoints: <span className="text-yellow-500">{randomPaths()}</span></>,
    () => `Checking robots.txt and sitemap.xml for additional surface area...`,
    () => `Identified ${randomInt(2, 6)} subdomains via DNS enumeration.`,
    () => `Spider complete. ${randomInt(10, 30)} unique paths indexed. Passing to Mapping phase.`,
    () => `Detected ${randomInt(1, 4)} login forms. Flagging for credential testing.`,
  ],
  Mapping: [
    () => `Building attack surface map from spidered endpoints...`,
    () => <>Detected tech stack: <span className="text-primary">{randomStack()}</span></>,
    () => `Identified ${randomInt(2, 5)} authentication endpoints. Flagging for credential testing.`,
    () => `Found open /api/v${randomInt(1, 3)} namespace with ${randomInt(5, 15)} undocumented routes.`,
    () => `Mapping HTTP methods: GET, POST, PUT, DELETE across ${randomInt(8, 20)} endpoints.`,
    () => `Detected ${randomInt(1, 3)} third-party integrations (OAuth, Stripe, Twilio).`,
    () => `Attack surface map complete. ${randomInt(15, 35)} nodes, ${randomInt(5, 12)} high-interest targets.`,
    () => `Identified ${randomInt(1, 4)} admin panels at non-standard paths.`,
  ],
  Testing: [
    () => `Beginning active vulnerability testing on all flagged endpoints...`,
    () => <>Testing <span className="text-yellow-500">{randomApiPath()}</span> for injection flaws. Payload: <span className="font-mono text-xs bg-muted px-1 rounded">{randomPayload()}</span></>,
    () => <><span className="text-rose-400">⚠ {randomVulnType()} confirmed</span> on {randomApiPath()} — {randomVulnDetail()}.</>,
    () => `Testing CORS policy — ${randomBool() ? 'overly permissive wildcard origin detected.' : 'policy appears correctly configured.'}`,
    () => <>Fuzzing <span className="text-yellow-500">{randomApiPath()}</span> with {randomInt(100, 999)} malformed inputs...</>,
    () => `Checking for exposed debug endpoints... ${randomBool() ? <span className="text-rose-400">Found /debug/console — unauthenticated access possible.</span> : 'None found.'}`,
    () => `Testing session token entropy — ${randomBool() ? 'weak predictable tokens detected.' : 'tokens appear cryptographically strong.'}`,
    () => `Checking ${randomApiPath()} for IDOR — ${randomBool() ? <span className="text-rose-400">object reference manipulation succeeded.</span> : 'access correctly restricted.'}`,
  ],
  Validating: [
    () => `Entering validation phase. Re-running exploits to confirm reproducibility...`,
    () => <><span className="text-primary">✓ Confirmed:</span> {randomVulnType()} on {randomApiPath()} — reproduced {randomInt(2, 5)}/{randomInt(3, 5)} attempts.</>,
    () => <><span className="text-primary">✓ Confirmed:</span> IDOR on {randomApiPath()} — {randomInt(3, 8)} different user IDs accessed successfully.</>,
    () => `Verifying CVSS scores for all findings. Adjusting severity based on exploitability...`,
    () => <><span className={randomBool() ? 'text-primary' : 'text-muted-foreground'}>{randomBool() ? '✓ Confirmed' : '✗ False positive'}:</span> {randomVulnType()} on {randomApiPath()}.</>,
    () => `Cross-referencing findings against CVE database...`,
    () => `All findings validated. Severity scores assigned. Proceeding to report generation.`,
    () => `${randomInt(1, 3)} potential false positives dismissed after manual validation.`,
  ],
  Reporting: [
    () => `Generating executive summary and technical findings report...`,
    () => `Compiling CVSS scores for ${randomInt(2, 6)} confirmed vulnerabilities...`,
    () => `Attaching reproduction steps, payloads, and evidence screenshots to each finding.`,
    () => `Report formatted to enterprise PDF template. ${randomInt(8, 20)} pages generated.`,
    () => `Adding remediation recommendations for each vulnerability class...`,
    () => `Generating risk heat map and attack path diagrams...`,
    () => <><span className="text-primary font-semibold">Scan complete.</span> {randomInt(2, 6)} vulnerabilities confirmed. Report ready for export.</>,
    () => `Archiving raw scan artifacts and evidence bundle...`,
  ],
}

// ── Finding pools ──────────────────────────────────────────────────────────
const FINDING_POOL: Array<Omit<Finding, 'id' | 'time'>> = [
  { severity: 'Critical', title: 'SQL Injection in Authentication Endpoint', path: '/api/users/profile', description: 'Time-based blind SQL injection confirmed. Allows full database read access.' },
  { severity: 'Critical', title: 'Remote Code Execution via File Upload', path: '/api/upload/avatar', description: 'Unrestricted file upload allows server-side script execution.' },
  { severity: 'Critical', title: 'Hardcoded AWS Credentials in JS Bundle', path: '/static/app.bundle.js', description: 'Live AWS access keys found in client-side JavaScript. Full S3 bucket exposure.' },
  { severity: 'High', title: 'Unauthorized Access to User Metadata', path: '/api/auth/login', description: 'IDOR via X-UserId header allows low-privilege user to access any account.' },
  { severity: 'High', title: 'JWT Algorithm Confusion Attack', path: '/api/token/refresh', description: 'Server accepts HS256 tokens signed with the public RSA key, allowing forgery.' },
  { severity: 'High', title: 'Admin Panel Exposed Without Auth', path: '/admin/console', description: 'Admin dashboard accessible without authentication from external network.' },
  { severity: 'High', title: 'Reflected XSS in Search Parameter', path: '/search?q=', description: 'User-controlled input reflected unsanitized. Script execution in victim browser.' },
  { severity: 'Medium', title: 'Broken Authentication Rate Limiting', path: '/api/search', description: 'No effective rate limiting on login attempts. Brute-force attacks possible.' },
  { severity: 'Medium', title: 'CORS Misconfiguration', path: '/api/v1/user', description: 'Overly permissive CORS policy allows cross-origin data reads from arbitrary domains.' },
  { severity: 'Medium', title: 'Sensitive Data in URL Parameters', path: '/redirect?token=', description: 'Auth tokens passed in URL query strings, logged in server access logs.' },
  { severity: 'Medium', title: 'Clickjacking via Missing X-Frame-Options', path: '/', description: 'Application can be embedded in an iframe, enabling UI redress attacks.' },
  { severity: 'Low', title: 'Server Version Disclosure', path: '/api/health', description: 'Server response headers reveal exact software versions aiding targeted attacks.' },
  { severity: 'Low', title: 'Missing HSTS Header', path: '/', description: 'Strict-Transport-Security header absent, allowing downgrade to HTTP.' },
  { severity: 'Low', title: 'Cookie Missing Secure Flag', path: '/login', description: 'Session cookie transmitted over HTTP. Can be intercepted on non-TLS connections.' },
  { severity: 'Low', title: 'Verbose Error Messages', path: '/api/debug', description: 'Stack traces and internal paths exposed in error responses.' },
]

// ── Helper functions ───────────────────────────────────────────────────────
function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}
function randomBool() { return Math.random() > 0.5 }
function randomTarget() {
  const targets = ['helpdesk.democorp.com', 'app.targetcorp.io', 'api.vulnlab.net', 'portal.testsite.org']
  return targets[randomInt(0, targets.length - 1)]
}
function randomIP() {
  return `${randomInt(10, 220)}.${randomInt(0, 255)}.${randomInt(0, 255)}.${randomInt(1, 254)}`
}
function randomPaths() {
  const all = ['/login', '/dashboard', '/api/v1/*', '/admin', '/password/reset', '/profile', '/settings', '/upload']
  return shuffle(all).slice(0, randomInt(3, 6)).join(', ')
}
function randomStack() {
  const stacks = [
    'Apache 2.4.65, PHP 8.1, MySQL 8.0',
    'Nginx 1.25, Node.js 20, PostgreSQL 15',
    'Apache Tomcat 10, Java 17, Oracle DB',
    'IIS 10, ASP.NET 6, MSSQL 2022',
  ]
  return stacks[randomInt(0, stacks.length - 1)]
}
function randomApiPath() {
  const paths = ['/api/users/profile', '/api/auth/login', '/api/search', '/api/upload', '/api/admin/config', '/api/v2/orders', '/api/token/refresh']
  return paths[randomInt(0, paths.length - 1)]
}
function randomPayload() {
  const payloads = ["1' OR '1'='1", '"><script>alert(1)</script>', '../../../etc/passwd', 'SLEEP(5)--', '{{7*7}}', '; ls -la']
  return payloads[randomInt(0, payloads.length - 1)]
}
function randomVulnType() {
  const types = ['SQL Injection', 'XSS', 'IDOR', 'SSRF', 'Path Traversal', 'Auth Bypass', 'RCE']
  return types[randomInt(0, types.length - 1)]
}
function randomVulnDetail() {
  const details = ['database response delay detected', 'script executes in victim context', 'unauthorized data access confirmed', 'server-side request forgery validated', 'file system traversal successful']
  return details[randomInt(0, details.length - 1)]
}
function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5)
}
function pickLogs(step: string, count = 5): Array<() => React.ReactNode> {
  return shuffle(LOG_POOLS[step]).slice(0, count)
}
function pickFindings(): Finding[] {
  // Pick 2-5 random findings, ensuring variety in severity
  const shuffled = shuffle(FINDING_POOL)
  const count = randomInt(2, 5)
  return shuffled.slice(0, count).map((f, i) => ({ ...f, id: i + 1, time: '' }))
}

// ── Randomize on each mount ────────────────────────────────────────────────
function generateSessionData(): SessionData {
  const stepLogs: Record<string, Array<() => React.ReactNode>> = {}
  STEPS.forEach(step => { stepLogs[step] = pickLogs(step, 5) })
  const findings = pickFindings()
  // Assign findings to steps: first half in Testing, rest in Validating
  const mid = Math.ceil(findings.length / 2)
  const testingFindings = findings.slice(0, mid)
  const validatingFindings = findings.slice(mid)
  return { stepLogs, testingFindings, validatingFindings, allFindings: findings }
}

const severityBadgeStyles: Record<Severity, string> = {
  Critical: 'bg-rose-500 text-white',
  High: 'bg-orange-500 text-white',
  Medium: 'bg-yellow-500 text-white',
  Low: 'bg-green-500 text-white',
}
const severityTextColors: Record<Severity, string> = {
  Critical: 'text-rose-400',
  High: 'text-orange-400',
  Medium: 'text-yellow-400',
  Low: 'text-green-400',
}

const SeverityBadge: FC<{ severity: Severity }> = ({ severity }) => (
  <span className={`rounded px-2 py-0.5 text-xs font-semibold ${severityBadgeStyles[severity]}`}>{severity}</span>
)

const CheckIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20,6 9,17 4,12" />
  </svg>
)

const StepIcon: FC<{ label: string; done: boolean }> = ({ label, done }) => {
  const cls = `h-5 w-5 ${done ? 'text-primary' : 'text-muted-foreground'}`
  if (label === 'Spidering') return (
    <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
      <circle cx="11" cy="11" r="7" /><circle cx="11" cy="11" r="3" />
      <line x1="11" y1="4" x2="11" y2="2" /><line x1="18" y1="11" x2="20" y2="11" />
      <line x1="11" y1="18" x2="11" y2="20" /><line x1="4" y1="11" x2="2" y2="11" />
    </svg>
  )
  if (label === 'Mapping') return (
    <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
      <rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
  )
  if (label === 'Testing') return (
    <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
      <path d="M9 3h6l1 9H8L9 3z" /><path d="M8 12l-2 7a1 1 0 001 1h10a1 1 0 001-1l-2-7" />
      <line x1="9" y1="7" x2="15" y2="7" />
    </svg>
  )
  if (label === 'Validating') return (
    <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
      <rect x="3" y="3" width="18" height="18" rx="2" /><polyline points="9,12 11,14 15,10" />
    </svg>
  )
  return (
    <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
      <polyline points="14,2 14,8 20,8" />
      <line x1="8" y1="13" x2="16" y2="13" /><line x1="8" y1="17" x2="12" y2="17" />
    </svg>
  )
}

const scanMeta = [
  { label: 'Scan Type', value: 'Grey Box' },
  { label: 'Targets', value: 'google.com' },
  { label: 'Started At', value: 'Nov 22, 09:00AM' },
  { label: 'Credentials', value: '2 Active' },
  { label: 'Files', value: 'Control.pdf' },
  { label: 'Checklists', value: '40/350', highlight: true },
]

function getTimestamp() {
  const now = new Date()
  return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`
}

const Scans: FC = () => {
  const location = useLocation()
  const scanId = location.state?.scanId

  // Generate random session data on mount or when scanId changes
  const [sessionData, setSessionData] = useState<SessionData>(() => generateSessionData())

  const [progress, setProgress] = useState(0)
  const [currentStepIdx, setCurrentStepIdx] = useState(0)
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set())
  const [logs, setLogs] = useState<LogEntry[]>([])
  const [findings, setFindings] = useState<Finding[]>([])
  const [activeTab, setActiveTab] = useState<'activity' | 'verification'>('activity')
  const [done, setDone] = useState(false)
  const [isConsoleMinimized, setIsConsoleMinimized] = useState(false)
  const [isPaused, setIsPaused] = useState(false)

  const logRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const dragging = useRef(false)
  const [leftPct, setLeftPct] = useState(60)

  const { setIsScanInProgress, setNewScanResult } = useOutletContext<DashboardContextType>()

  const elapsedRef = useRef(0)
  const stepIdxRef = useRef(0)
  const logIdxRef = useRef(0)

  // Reset full state when a new scanId is provided
  // eslint-disable-next-line
  useEffect(() => {
    /* eslint-disable */
    if (scanId) {
      setSessionData(generateSessionData())
      setProgress(0)
      setCurrentStepIdx(0)
      setCompletedSteps(new Set())
      setLogs([])
      setFindings([])
      setDone(false)
      setIsPaused(false)

      elapsedRef.current = 0
      stepIdxRef.current = 0
      logIdxRef.current = 0
    }
    /* eslint-enable */
  }, [scanId])


  useEffect(() => {
    setIsScanInProgress(!done)
    return () => setIsScanInProgress(false)
  }, [done, setIsScanInProgress])

  useEffect(() => {
    if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight
  }, [logs])

  useEffect(() => {
    if (isPaused || done) return

    const STEP_DURATION = 2000
    const LOG_INTERVAL = STEP_DURATION / 5
    const { stepLogs, testingFindings, validatingFindings, allFindings } = sessionData

    const tick = setInterval(() => {
      elapsedRef.current += 100
      const elapsed = elapsedRef.current
      setProgress(Math.min(100, Math.round((elapsed / 10000) * 100)))

      const newStepIdx = Math.min(4, Math.floor(elapsed / STEP_DURATION))
      if (newStepIdx !== stepIdxRef.current) {
        setCompletedSteps((prev) => new Set([...prev, stepIdxRef.current]))
        stepIdxRef.current = newStepIdx
        setCurrentStepIdx(newStepIdx)
        logIdxRef.current = 0
      }

      const stepName = STEPS[stepIdxRef.current]
      const stepElapsed = elapsed - stepIdxRef.current * STEP_DURATION
      const expectedLogIdx = Math.floor(stepElapsed / LOG_INTERVAL)

      if (expectedLogIdx > logIdxRef.current && logIdxRef.current < stepLogs[stepName].length) {
        const textFn = stepLogs[stepName][logIdxRef.current]
        setLogs((prev) => [...prev, { time: getTimestamp(), text: textFn() }])

        // Inject findings based on step
        if (stepName === 'Testing') {
          const f = testingFindings[logIdxRef.current - 1]
          if (f) setFindings((prev) => prev.find(x => x.id === f.id) ? prev : [...prev, { ...f, time: getTimestamp() }])
        }
        if (stepName === 'Validating') {
          const f = validatingFindings[logIdxRef.current - 1]
          if (f) setFindings((prev) => prev.find(x => x.id === f.id) ? prev : [...prev, { ...f, time: getTimestamp() }])
        }

        logIdxRef.current++
      }

      if (elapsed >= 10000) {
        setProgress(100)
        setCompletedSteps(new Set([0, 1, 2, 3, 4]))
        setDone(true)
        clearInterval(tick)

        // Pass completed scan to dashboard
        setNewScanResult({
          name: 'Manual Scan',
          type: 'Greybox',
          status: 'completed',
          progress: 100,
          vulns: {
            critical: allFindings.filter((f: Finding) => f.severity === 'Critical').length,
            high: allFindings.filter((f: Finding) => f.severity === 'High').length,
            medium: allFindings.filter((f: Finding) => f.severity === 'Medium').length,
            low: allFindings.filter((f: Finding) => f.severity === 'Low').length,
          },
          lastScan: 'just now'
        })
      }
    }, 100)

    return () => clearInterval(tick)
  }, [isPaused, done, setNewScanResult, sessionData])

  const onMouseDown = useCallback(() => { dragging.current = true }, [])
  const onMouseMove = useCallback((e: React.MouseEvent) => {
    if (!dragging.current || !containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const pct = ((e.clientX - rect.left) / rect.width) * 100
    setLeftPct(Math.min(75, Math.max(30, pct)))
  }, [])
  const onMouseUp = useCallback(() => { dragging.current = false }, [])

  const currentStepName = STEPS[currentStepIdx]

  return (
    <div className="flex flex-col pb-10">

      {/* ── Breadcrumb + actions ── */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <span>Scan</span><span>/</span>
          <span>Private Assets</span><span>/</span>
          <span className="font-medium text-primary">New Scan</span>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="gap-2 text-sm">
            <FileOutput className="h-4 w-4" />Export Report
          </Button>
          <Button
            variant={isPaused ? 'default' : 'destructive'}
            className="gap-2 text-sm"
            onClick={() => setIsPaused(!isPaused)}
            disabled={done}
          >
            {isPaused ? <Play className="h-4 w-4" /> : <X className="h-4 w-4" />}
            {isPaused ? 'Resume Scan' : 'Stop Scan'}
          </Button>
        </div>
      </div>

      {/* ── Progress card ── */}
      <div className="mb-4 rounded-xl border border-border bg-white px-6 py-5 dark:bg-card">
        <div className="flex items-center gap-6">
          <div className="shrink-0">
            <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-[#0f1923] dark:bg-[#111820]">
              <svg className="absolute inset-0 h-full w-full -rotate-90" viewBox="0 0 96 96">
                <circle cx="48" cy="48" r="42" fill="none" stroke="currentColor" strokeWidth="5" className="text-muted/20" />
                <circle cx="48" cy="48" r="42" fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="round"
                  className="text-primary transition-all duration-300"
                  strokeDasharray={`${2 * Math.PI * 42}`}
                  strokeDashoffset={`${2 * Math.PI * 42 * (1 - progress / 100)}`}
                />
              </svg>
              <div className="relative z-10 flex flex-col items-center">
                <span className="text-xl font-bold text-primary">{progress}%</span>
                <span className="text-[10px] text-muted-foreground">
                  {done ? 'Complete' : isPaused ? 'Paused' : 'In Progress'}
                </span>
              </div>
            </div>
          </div>

          <div className="h-20 w-px bg-border" />

          <div className="flex flex-1 flex-col gap-4">
            <div className="flex items-center">
              {STEPS.map((step, i) => {
                const isActive = i === currentStepIdx && !done
                const isDone = completedSteps.has(i) || done
                return (
                  <div key={step} className="flex flex-1 items-center">
                    <div className="flex flex-col items-center gap-1.5">
                      <div className={`relative flex h-11 w-11 items-center justify-center rounded-full border-2 transition-all duration-500 ${isActive ? 'border-primary bg-primary shadow-[0_0_16px_rgba(12,200,168,0.4)]'
                        : isDone ? 'border-primary bg-primary/15'
                          : 'border-border bg-card'
                        }`}>
                        {isActive && <span className="absolute inset-0 rounded-full animate-ping border-2 border-primary opacity-30" />}
                        {isActive
                          ? <RotateCcw className="h-4 w-4 animate-spin text-white" />
                          : <StepIcon label={step} done={isDone} />
                        }
                      </div>
                      <span className={`text-xs font-medium transition-colors duration-300 ${isDone || isActive ? 'text-primary' : 'text-muted-foreground'}`}>
                        {step}
                      </span>
                    </div>
                    {i < STEPS.length - 1 && (
                      <div className="relative mb-6 h-px flex-1 bg-border overflow-hidden">
                        <div className="absolute inset-y-0 left-0 bg-primary transition-all duration-700"
                          style={{ width: completedSteps.has(i) || done ? '100%' : '0%' }} />
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
            <div className="flex flex-wrap items-center gap-x-8 gap-y-2 border-t border-border pt-3">
              {scanMeta.map((m) => (
                <div key={m.label} className="flex flex-col gap-0.5">
                  <span className="text-xs text-muted-foreground">{m.label}</span>
                  <span className={`text-sm font-bold ${m.highlight ? 'text-primary' : 'text-foreground'}`}>{m.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Live Scan Console ── */}
      <div className="rounded-xl border border-border bg-card">
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 animate-pulse rounded-full bg-primary" />
            <span className="text-sm font-semibold text-foreground">Live Scan Console</span>
            <span className="flex items-center gap-1 rounded-full border border-border bg-muted px-2.5 py-0.5 text-xs text-muted-foreground">
              {done ? (
                <>
                  <CheckIcon className="h-3 w-3 text-primary" />
                  <span className="text-primary font-medium">Completed</span>
                </>
              ) : isPaused ? (
                <><span className="h-2 w-2 rounded-full bg-orange-500" /> Paused</>
              ) : (
                <><RotateCcw className="h-3 w-3 animate-spin" /> {currentStepName}...</>
              )}
            </span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <button className="hover:text-foreground" onClick={() => setIsConsoleMinimized(prev => !prev)}>
              <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isConsoleMinimized ? '-rotate-180' : ''}`} />
            </button>
            <button className="hover:text-foreground"><X className="h-4 w-4" /></button>
          </div>
        </div>

        <div className={`grid transition-all duration-300 ease-in-out ${isConsoleMinimized ? 'grid-rows-[0fr]' : 'grid-rows-[1fr]'}`}>
          <div className="overflow-hidden">
            <div ref={containerRef} className="relative flex select-none" onMouseMove={onMouseMove} onMouseUp={onMouseUp} onMouseLeave={onMouseUp}>

              {/* Left: Activity Log */}
              <div className="flex flex-col overflow-hidden" style={{ width: `${leftPct}%` }}>
                <div className="flex border-b border-border">
                  {(['activity', 'verification'] as const).map((tab) => (
                    <button key={tab} onClick={() => setActiveTab(tab)}
                      className={`px-4 py-2.5 text-sm font-medium transition-colors ${activeTab === tab ? 'border-b-2 border-primary text-primary' : 'text-muted-foreground hover:text-foreground'}`}>
                      {tab === 'activity' ? 'Activity Log' : 'Verification Loops'}
                    </button>
                  ))}
                </div>
                <div ref={logRef} className="h-[360px] overflow-y-auto p-4 font-mono text-xs leading-relaxed scrollbar-hide">
                  {logs.map((entry, i) => (
                    <p key={i} className="mb-2.5">
                      <span className="text-muted-foreground">[{entry.time}]</span>{' '}
                      <span className="text-foreground">{entry.text}</span>
                    </p>
                  ))}
                  {!done && <span className="inline-block h-3 w-1.5 animate-pulse bg-primary" />}
                </div>
              </div>

              {/* Draggable divider */}
              <div onMouseDown={onMouseDown} className="group relative flex w-1.5 shrink-0 cursor-col-resize items-center justify-center bg-border transition-colors hover:bg-primary/50">
                <div className="flex flex-col gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                  {[0, 1, 2].map((i) => <div key={i} className="h-1 w-1 rounded-full bg-primary" />)}
                </div>
              </div>

              {/* Right: Finding Log */}
              <div className="flex flex-1 flex-col overflow-hidden">
                <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
                  <span className="text-sm font-medium text-foreground">Finding Log</span>
                  {findings.length > 0 && (
                    <span className="rounded-full bg-rose-500/10 px-2 py-0.5 text-xs font-semibold text-rose-500">
                      {findings.length} found
                    </span>
                  )}
                </div>
                <div className="flex h-[360px] flex-col gap-3 overflow-y-auto p-4 scrollbar-hide">
                  {findings.length === 0
                    ? <div className="flex h-full items-center justify-center text-xs text-muted-foreground">No findings yet...</div>
                    : findings.map((f) => (
                      <div key={f.id} className="rounded-lg border border-border bg-background p-3">
                        <div className="mb-1 flex items-center justify-between">
                          <SeverityBadge severity={f.severity} />
                          <span className="text-xs text-muted-foreground">{f.time}</span>
                        </div>
                        <p className="mt-2 text-xs font-semibold text-foreground">{f.title}</p>
                        <p className={`text-xs ${severityTextColors[f.severity]}`}>{f.path}</p>
                        <p className="mt-1 text-xs text-muted-foreground leading-relaxed">{f.description}</p>
                      </div>
                    ))
                  }
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Fixed footer — counts driven by actual findings ── */}
      <div className="fixed bottom-0 left-60 right-0 z-20 flex items-center justify-between border-t border-border bg-card px-6 py-2 text-xs text-muted-foreground">
        <div className="flex items-center gap-6">
          {[{ label: 'Sub-Agents', value: 0 }, { label: 'Parallel Executions', value: 2 }, { label: 'Operations', value: 1 }].map(({ label, value }) => (
            <span key={label} className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground" />
              {label}: <span className="font-semibold text-foreground ml-1">{value}</span>
            </span>
          ))}
        </div>
        <div className="flex items-center gap-5">
          {(['Critical', 'High', 'Medium', 'Low'] as Severity[]).map((s) => (
            <span key={s} className={`flex items-center gap-1 font-medium ${severityTextColors[s]}`}>
              {s}: <span className="font-semibold ml-0.5">{findings.filter((f: Finding) => f.severity === s).length}</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Scans