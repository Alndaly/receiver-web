import { LoginForm } from '@/components/login-form';

export default function LoginPage() {
	return (
		<div
			className='flex h-screen w-full items-center justify-center px-4'
			style={{
				backgroundImage:
					'linear-gradient(45deg, #ff9a9e 0%, #fad0c4 99%, #fad0c4 100%)',
			}}>
			<LoginForm />
		</div>
	);
}
