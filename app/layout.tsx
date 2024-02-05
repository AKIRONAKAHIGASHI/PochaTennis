import type { Metadata } from 'next'
import AppThemeProvider from '@/components/AppThemeProvider';

export const metadata: Metadata = {
  title: 'ぽちゃねこスケジュール表',
  description: 'ぽちゃねこのテニスの予定が記載されてます',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <link rel="icon" href="../favicon.ico" type="image/x-icon"></link>
      <body>
        <AppThemeProvider>
          {children}
        </AppThemeProvider>
      </body>
    </html>
  );
}
