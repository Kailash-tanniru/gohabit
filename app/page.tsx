import LoginPage from './auth/login/page';
import { Suspense } from 'react';
export default function Home() {
 

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginPage />
    </Suspense>
  );
}
