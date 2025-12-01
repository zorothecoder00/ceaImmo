import { redirect } from 'next/navigation';

type MaintenancePageProps = {
  searchParams: { [key: string]: string | string[] | undefined };
};

export default async function MaintenancePage({ searchParams }: MaintenancePageProps) {
  const enableParam = await searchParams;
  const enable = enableParam?.enable === 'true';

  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");

  await fetch(`${baseUrl}/api/admin/maintenance`, {
    method: 'POST',
    body: JSON.stringify({ maintenance: enable }),
    headers: { 'Content-Type': 'application/json' },
    cache: 'no-store',
  });

  redirect('/dashboard/admin');
}
