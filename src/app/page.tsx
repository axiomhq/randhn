import { Frame } from '@/components/frame';
import { LoadingSpinner } from '@/components/loading-spinner';
import { NavBar } from '@/components/nav-bar';
import { Sidebar } from '@/components/sidebar';
import { Toolbar } from '@/components/toolbar';

export default function Home() {
  return (
    <>
      <NavBar />
      <main className="flex">
        <LoadingSpinner />
        <Toolbar />
        <Frame />
        <Sidebar />
      </main>
    </>
  );
}
