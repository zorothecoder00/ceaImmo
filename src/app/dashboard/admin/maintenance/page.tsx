import { redirect } from 'next/navigation';
  
export default async function MaintenancePage({ searchParams }: { searchParams: { enable?: string } }) {
  const enable = searchParams.enable === 'true';
    await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/admin/maintenance`, {
    method: 'POST',
    body: JSON.stringify({ maintenance: enable }),
    headers: { 'Content-Type': 'application/json' },
  });

  redirect('/dashboard/admin');   
}
  