export type ScanStatus = 'completed' | 'scheduled' | 'failed'

export type Scan = {
  name: string
  type: 'Greybox' | 'Blackbox'
  status: ScanStatus
  progress: number
  vulns: { critical: number; high: number; medium: number; low: number }
  lastScan: string
}

export const initialScans: Scan[] = [
  { name: 'Web App Servers', type: 'Greybox', status: 'completed', progress: 100, vulns: { critical: 5, high: 12, medium: 23, low: 18 }, lastScan: '4d ago' },
  { name: 'Web App Servers', type: 'Greybox', status: 'completed', progress: 100, vulns: { critical: 5, high: 12, medium: 23, low: 18 }, lastScan: '4d ago' },
  { name: 'Web App Servers', type: 'Greybox', status: 'completed', progress: 100, vulns: { critical: 5, high: 12, medium: 23, low: 18 }, lastScan: '4d ago' },
  { name: 'Web App Servers', type: 'Greybox', status: 'completed', progress: 100, vulns: { critical: 5, high: 12, medium: 23, low: 18 }, lastScan: '4d ago' },
  { name: 'Web App Servers', type: 'Greybox', status: 'scheduled', progress: 100, vulns: { critical: 5, high: 12, medium: 23, low: 18 }, lastScan: '4d ago' },
  { name: 'Web App Servers', type: 'Greybox', status: 'scheduled', progress: 100, vulns: { critical: 5, high: 12, medium: 23, low: 18 }, lastScan: '4d ago' },
  { name: 'IoT Devices', type: 'Blackbox', status: 'failed', progress: 10, vulns: { critical: 2, high: 4, medium: 8, low: 1 }, lastScan: '3d ago' },
  { name: 'Temp Data', type: 'Blackbox', status: 'failed', progress: 10, vulns: { critical: 2, high: 4, medium: 8, low: 1 }, lastScan: '3d ago' },
  { name: 'Web App Servers', type: 'Greybox', status: 'completed', progress: 100, vulns: { critical: 5, high: 12, medium: 23, low: 18 }, lastScan: '4d ago' },
  { name: 'Web App Servers', type: 'Greybox', status: 'completed', progress: 100, vulns: { critical: 5, high: 12, medium: 23, low: 18 }, lastScan: '4d ago' },
  { name: 'Web App Servers', type: 'Greybox', status: 'completed', progress: 100, vulns: { critical: 5, high: 12, medium: 23, low: 18 }, lastScan: '4d ago' },
  { name: 'Web App Servers', type: 'Greybox', status: 'completed', progress: 100, vulns: { critical: 5, high: 12, medium: 23, low: 18 }, lastScan: '4d ago' },
  { name: 'Web App Servers', type: 'Greybox', status: 'completed', progress: 100, vulns: { critical: 5, high: 12, medium: 23, low: 18 }, lastScan: '4d ago' },
  { name: 'Web App Servers', type: 'Greybox', status: 'completed', progress: 100, vulns: { critical: 5, high: 12, medium: 23, low: 18 }, lastScan: '4d ago' },
  { name: 'Web App Servers', type: 'Greybox', status: 'completed', progress: 100, vulns: { critical: 5, high: 12, medium: 23, low: 18 }, lastScan: '4d ago' },
]
