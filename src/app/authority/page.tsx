import { redirect } from 'next/navigation';

export default function AuthorityRootRedirect() {
  redirect('/authority/dashboard');
}
