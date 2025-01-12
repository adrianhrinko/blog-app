import { auth } from '@/lib/firebase';
import SignInForm from '@/components/SignInForm';
export default function Enter({}) {
  const user = null;
  const username = null;

  // 1. user signed out <SignInForm />
  // 2. user signed in, but missing username <UsernameForm />
  // 3. user signed in, has username <SignOutButton />
  return (
    <main className="flex min-h-svh items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        {user ? 
          !username ? <UsernameForm /> : <SignOutButton /> 
          : 
          <SignInForm />
        }
      </div>
    </main>
  );
}


// Sign out button
function SignOutButton() {
  return <button onClick={() => auth.signOut()}>Sign Out</button>;
}

function UsernameForm() {
  return null;
}