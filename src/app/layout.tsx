import type { Metadata } from 'next';
import { Toaster } from '@/components/ui/sonner';
import './globals.css';
import { ThemeProvider } from '@/provider/theme-provider';

export const metadata: Metadata = {
	title: '清涟',
	description: '清涟，让知识不再是孤岛。',
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
					{children}
				</ThemeProvider>
				<Toaster position='top-right' />
			</body>
		</html>
	);
}
