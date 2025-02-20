'use client';

import { useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSession, signIn, signOut } from "next-auth/react";
import Image from "next/image";

export function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const routeURL = process.env.NEXT_PUBLIC_ROUTE_URL;
  const user = session ? session.user : null;

  useEffect(() => {
    if (status === 'loading') return;

    // 未認証かつトップページ以外にアクセスした場合はトップページにリダイレクト
    if (!session && pathname !== '/') {
      router.push('/');
    }

  }, [session, status, pathname, router]);

  return (
    <header className="sticty flex justify-between items-center py-2">
      <div>
        {user ? (
          <Link
            href="/profile"
            className="flex gap-1 items-center px-4 py-3 rounded-full bg-gray-800"
          >
            <div className="avatar">
              <div className="w-8 rounded-full">
                <Image
                  src={user.image ?? "/icon.jpg"}
                  alt="猫は最高に可愛い"
                  width={32}
                  height={32}
                />
              </div>
            </div>
            <div className="text-white text-lg">{user.name}</div>
          </Link>
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
      <div className="w-4/5">
        <ul className="flex justify-end items-center gap-4">
          {session ? (
            <>
              <li>
                <Link href="/receipts">
                  <button className="nes-btn">領収書</button>
                </Link>
              </li>
              {/* コメントアウトしておく。
              仕訳は領収書から作成するように決めた(2025/02/18)が、
              領収書IDを仕訳に紐づける方法が今のところクエリパラメータを持って仕訳ページに行くことしかないので、
              直接/journalsに来れてしまうのが都合が悪いのでコメントアウト。
              仕訳の履歴は決算から確認できるようにする。 */}
              {/* <li>
                <Link href="/journals">
                  <button className="nes-btn is-primary">仕 訳</button>
                </Link>
              </li> */}
              <li>
                <Link href="/financial-results">
                  <button className="nes-btn is-success">決 算</button>
                </Link>
              </li>
              <li>
                <button className="nes-btn is-error" onClick={() => signOut()}>
                  ログアウト
                </button>
              </li>
            </>
          ) : (
            <button
              className="nes-btn is-primary font-semibold"
              onClick={() => signIn("discord", { callbackUrl: routeURL })}
            >
              Login
            </button>
          )}
        </ul>
      </div>
    </header>
  );
}
