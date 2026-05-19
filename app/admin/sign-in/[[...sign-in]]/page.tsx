import { SignIn } from '@clerk/nextjs';

export const metadata = { title: 'Sign in · DI & UX CMS', robots: { index: false } };

export default function SignInPage() {
  return (
    <div className="admin-root min-h-screen flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="text-[11px] font-mono uppercase tracking-[0.15em] text-fg2">// CMS</div>
          <div className="font-display text-[28px] font-semibold text-fg0 mt-1">DI &amp; UX</div>
        </div>
        <div className="flex justify-center">
          <SignIn
            path="/admin/sign-in"
            signUpUrl="/admin/sign-in"
            fallbackRedirectUrl="/admin"
            appearance={{
              variables: {
                colorPrimary: '#7CFFB2',
                colorBackground: '#111111',
                colorText: '#f5f5f5',
                colorTextSecondary: '#a8a8a8',
                colorTextOnPrimaryBackground: '#0a0a0a',
                colorInputBackground: '#1a1a1a',
                colorInputText: '#f5f5f5',
                colorNeutral: '#ffffff',
                colorDanger: '#ff5c5c',
                colorSuccess: '#7CFFB2',
                borderRadius: '8px',
                fontFamily: 'Inter, system-ui, sans-serif',
              },
              elements: {
                rootBox: 'w-full',
                card: 'bg-transparent border border-line shadow-none',
                headerTitle: 'text-fg0',
                headerSubtitle: 'text-fg2',
                socialButtonsBlockButton:
                  'border border-line bg-bg1 text-fg0 hover:bg-bg2 transition-colors',
                socialButtonsBlockButtonText: 'text-fg0 font-medium',
                dividerLine: 'bg-line',
                dividerText: 'text-fg2',
                formFieldLabel: 'text-fg1',
                formFieldInput: 'bg-bg1 border-line text-fg0',
                footerActionText: 'text-fg2',
                footerActionLink: 'text-accent hover:text-accent/80',
                identityPreviewText: 'text-fg0',
                identityPreviewEditButton: 'text-accent',
              },
            }}
          />
        </div>
      </div>
    </div>
  );
}
