import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { waLink } from '@/lib/utils';
import ThemeToggle from '@/components/ThemeToggle';

export default async function Navbar() {
  const { data: settings } = await supabase
    .from('site_settings')
    .select('whatsapp_number')
    .eq('id', 1)
    .single();

  const whatsappHref = settings?.whatsapp_number
    ? waLink(settings.whatsapp_number)
    : '#';

  return (
    <nav className="border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="text-xl font-bold text-brand-600">
          PhoneMarket
        </Link>
        <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
          {settings?.whatsapp_number && (
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-brand-600 hover:text-brand-700"
            >
              WhatsApp
            </a>
          )}
          <ThemeToggle />
          <Link
            href="/login"
            className="rounded-md bg-gray-100 px-3 py-1.5 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
          >
            Admin
          </Link>
        </div>
      </div>
    </nav>
  );
}
