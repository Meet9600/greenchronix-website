import { Experience } from "./components/experience";

export default function Home() {
  return (
    <main className="relative min-h-[600vh] w-full bg-[#050505]">
      <div className="fixed inset-0 z-0">
        <Experience />
      </div>
    </main>
  );
}
