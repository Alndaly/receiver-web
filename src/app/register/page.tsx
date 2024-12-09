import { RegisterForm } from '@/components/register-form';

export default function RegisterPage() {
	return (
		<div
			className='flex h-screen w-full items-center justify-center px-4'
			style={{
				backgroundImage: 'linear-gradient(to top, #fddb92 0%, #d1fdff 100%)',
			}}>
			<RegisterForm />
		</div>
	);
}
