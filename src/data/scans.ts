export type ScanStatus = 'completed' | 'scheduled' | 'failed' | 'in-progress'

export type Scan = {
  name: string
  type: 'Greybox' | 'Blackbox' | 'Whitebox'
  status: ScanStatus
  progress: number
  vulns: { critical: number; high: number; medium: number; low: number }
  lastScan: string
}

export const initialScans: Scan[] = [
  // Completed scans
  { name: 'Production Web Servers', type: 'Greybox', status: 'completed', progress: 100, vulns: { critical: 5, high: 12, medium: 23, low: 18 }, lastScan: '2h ago' },
  { name: 'Customer API Gateway', type: 'Whitebox', status: 'completed', progress: 100, vulns: { critical: 0, high: 3, medium: 9, low: 14 }, lastScan: '6h ago' },
  { name: 'Admin Dashboard', type: 'Greybox', status: 'completed', progress: 100, vulns: { critical: 2, high: 7, medium: 11, low: 6 }, lastScan: '1d ago' },
  { name: 'Mobile Backend API', type: 'Whitebox', status: 'completed', progress: 100, vulns: { critical: 0, high: 1, medium: 4, low: 22 }, lastScan: '1d ago' },
  { name: 'Payment Processing Service', type: 'Blackbox', status: 'completed', progress: 100, vulns: { critical: 1, high: 5, medium: 8, low: 3 }, lastScan: '2d ago' },
  { name: 'Internal HR Portal', type: 'Greybox', status: 'completed', progress: 100, vulns: { critical: 0, high: 2, medium: 6, low: 19 }, lastScan: '3d ago' },
  { name: 'Data Warehouse Endpoints', type: 'Whitebox', status: 'completed', progress: 100, vulns: { critical: 3, high: 8, medium: 15, low: 9 }, lastScan: '4d ago' },
  { name: 'Legacy ERP System', type: 'Greybox', status: 'completed', progress: 100, vulns: { critical: 9, high: 21, medium: 34, low: 42 }, lastScan: '5d ago' },

  // In-progress scans
  { name: 'Cloud Infrastructure (AWS)', type: 'Whitebox', status: 'in-progress', progress: 67, vulns: { critical: 1, high: 4, medium: 7, low: 5 }, lastScan: '7d ago' },
  { name: 'Staging Environment', type: 'Greybox', status: 'in-progress', progress: 34, vulns: { critical: 0, high: 0, medium: 2, low: 4 }, lastScan: '10d ago' },

  // Scheduled scans
  { name: 'IoT Device Fleet', type: 'Blackbox', status: 'scheduled', progress: 0, vulns: { critical: 0, high: 0, medium: 0, low: 0 }, lastScan: '12d ago' },
  { name: 'VPN & Remote Access', type: 'Greybox', status: 'scheduled', progress: 0, vulns: { critical: 0, high: 0, medium: 0, low: 0 }, lastScan: '14d ago' },
  { name: 'Email & Collaboration Suite', type: 'Blackbox', status: 'scheduled', progress: 0, vulns: { critical: 0, high: 0, medium: 0, low: 0 }, lastScan: 'Never' },

  // Failed scans
  { name: 'Network Perimeter Devices', type: 'Blackbox', status: 'failed', progress: 23, vulns: { critical: 0, high: 0, medium: 0, low: 0 }, lastScan: '8d ago' },
  { name: 'Third-party Integrations', type: 'Blackbox', status: 'failed', progress: 51, vulns: { critical: 0, high: 0, medium: 0, low: 0 }, lastScan: '6d ago' },
]