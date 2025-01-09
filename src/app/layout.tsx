import type { Metadata } from 'next';
import { Toaster } from '@/components/ui/sonner';
import './globals.css';
import { ThemeProvider } from '@/provider/theme-provider';
import { UserStoreProvider } from '@/stores/user-store-provider';

export const metadata: Metadata = {
	title: 'Receiver',
	description: 'Receiver，让通知由自己掌控',
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html suppressHydrationWarning>
			<body>
				<ThemeProvider
					attribute='class'
					defaultTheme='system'
					enableSystem
					disableTransitionOnChange>
					<UserStoreProvider>{children}</UserStoreProvider>
				</ThemeProvider>
				<Toaster position='top-right' />
			</body>
		</html>
	);
}
