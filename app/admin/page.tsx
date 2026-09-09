import type { Metadata } from 'next';
import { AdminCms } from '@/components/admin-cms';

export const metadata: Metadata = {
  title: 'Content Manager',
  robots: { index: false, follow: false },
};

export const dynamic = 'force-dynamic';

export default function AdminPage() {
  return <AdminCms />;
}
