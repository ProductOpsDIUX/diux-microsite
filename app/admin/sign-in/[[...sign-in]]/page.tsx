import { SignIn } from '@clerk/nextjs';

export const metadata = { title: 'Sign in · DI & UX CMS', robots: { index: false } };

export default function SignInPage() {
  return (
    <div className="admin-root min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        <div className="mb-6 text-center">
          <div className="text-[11px] font-mono uppercase tracking-[0.15em] text-fg2">// CMS</div>
          <div className="font-display text-[24px] font-semibold text-fg0 mt-1">DI &amp; UX</div>
        </div>
        <SignIn
          path="/admin/sign-in"
          routing="path"
          signUpUrl="/admin/sign-in"
          afterSignInUrl="/admin"
          appearance={{ variables: { colorPrimary: '#7CFFB2', colorBackground: '#0a0a0a' } }}
        />
      </div>
    </div>
  );
}
