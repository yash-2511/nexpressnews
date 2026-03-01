import { redirect } from 'next/navigation';

export default function GeneralPage() {
  // Redirect general category to breaking since they are merged
  redirect('/breaking');
}
