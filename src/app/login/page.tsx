import { LoginForm } from '@/components/login-form';
import { Card } from '@/components/ui/card';
import QrLogin from '@/components/qr-login';
import { Separator } from '@/components/ui/separator';

export default function LoginPage() {
	return (
		<div
			className='flex h-screen w-full items-center justify-center px-4'
			style={{
				backgroundImage: 'linear-gradient(to top, #fddb92 0%, #d1fdff 100%)',
			}}>
			<Card className='mx-auto flex flex-row gap-2 h-[400px] p-5'>
				<LoginForm />
				<div className='py-5'>
					<Separator orientation='vertical' />
				</div>
				<QrLogin />
			</Card>
		</div>
	);
}
