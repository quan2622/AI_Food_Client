import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="space-y-4">
      <p className="text-cyan-400 p-4 border-2 border-amber-400">
        Hello this is project food_ai
      </p>

      <Button variant={"destructive"}>Kill button</Button>
    </main>
  );
}
