import { Section2 } from "./_components/sec2";
import Asteroids from './Asteroids';

export default function Home() {
  return (
    <main className="w-full min-h-[100dvh]">
       <Section2 />
       <Asteroids />
    </main>
  );
}
