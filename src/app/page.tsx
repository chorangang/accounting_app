import { getServerSession } from "next-auth/next";

export default async function Home() {
  return (
    <div className="flex justify-center items-center max-w-5xl mx-auto min-h-screen">
      <span>たのしい会計</span>
    </div>
  );
}
