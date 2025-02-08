'use client';

import { useSession, signIn, signOut } from "next-auth/react";
import Image from "next/image";

type User = {
  name: string;
  image: string;
  email: string;
}

export function Header() {
  const { data: session } = useSession();
  const routeURL = process.env.NEXT_PUBLIC_ROUTE_URL;
  const user: User|null = session ? session.user : null;

  return (
    <header className="sticty flex justify-between py-2 h-10">
      <div>
        {user ? (
          <div className="flex gap-1 items-center">
            <div className="avatar">
              <div className="w-8 rounded-full">
                <Image
                  src={user.image}
                  alt="猫は最高に可愛い"
                  width={32}
                  height={32}
                />
              </div>
            </div>
            <div>{user.name}</div>
          </div>
        ) : (
          <div className="flex gap-1 items-center">
            <div className="avatar">
              <div className="w-8 rounded-full">
                <Image
                  src="/icon.jpg"
                  alt="猫は最高に可愛い"
                  width={32}
                  height={32}
                />
              </div>
            </div>
            <div>たのしい会計</div>
          </div>
        )}
      </div>
      <div>
        {session ? (
          <button className="btn btn-sm btn-primary" onClick={() => signOut()}>
            ログアウト
          </button>
        ) : (
          <button
            className="btn btn-sm btn-primary"
            onClick={() => signIn("discord", { callbackUrl: routeURL })}
          >
            DiscordでLogin
          </button>
        )}
      </div>
    </header>
  );
}
