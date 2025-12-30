"use client";

import * as DropdownMenu from "@radix-ui/react-dropdown-menu";

import { useAuth } from "@hooks";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { TextCustom } from "@components";

function Navbar() {
  const NEXT_PUBLIC_APP_TITLE = process.env.NEXT_PUBLIC_APP_TITLE;

  const { account, logout } = useAuth();
  const router = useRouter();
  const pathName = usePathname();

  return (
    <div
      className="h-14 w-full px-8 flex items-center justify-between"
      style={{ background: "radial-gradient(201.12% 142.23% at 100.13% -1.02%, #d01dff 0%, #5e00aa 100%)" }}
    >
      <div className="flex items-center cursor-pointer gap-2" onClick={() => router.push("/")}>
        <TextCustom text={NEXT_PUBLIC_APP_TITLE} style={{ fontSize: "18px", color: "white", fontWeight: 500 }} />
      </div>
      <div className="flex items-center">
        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <Image
              className="rounded-full object-cover cursor-pointer"
              width={32}
              height={32}
              src="/icon/avatar-default.svg"
              alt=""
            />
          </DropdownMenu.Trigger>
          <DropdownMenu.Content className="w-[276px]" align="end">
            <DropdownMenu.Label>
              <div className="h-[123px] bg-[var(--primary-primary-background)]"></div>
              <div className="relative flex flex-col items-center gap-[5px] pb-3">
                <div className="w-[104px] h-[104px] bg-white rounded-full flex items-center justify-center absolute top-[-52px] left-2/4 -translate-x-2/4">
                  <Image
                    className="rounded-full object-cover cursor-pointer"
                    width={92}
                    height={92}
                    src="/icon/avatar-default.svg"
                    alt=""
                  />
                </div>

                <div
                  className="text-xl font-semibold text-center text-[var(--typography-light-theme-title)]"
                  style={{
                    display: "-webkit-box",
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    WebkitLineClamp: 2,
                  }}
                >
                  {`${account?.name} `}
                </div>
                <div
                  className="text-sm font-normal text-[var(--typography-light-theme-subtitle)]"
                  style={{
                    display: "-webkit-box",
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    WebkitLineClamp: 2,
                  }}
                >
                  {account?.email}
                </div>
              </div>
            </DropdownMenu.Label>
            <DropdownMenu.Group>
              <DropdownMenu.Item>
                <div
                  className="px-5 py-[11px] cursor-pointer hover:bg-[var(--border-light-theme-border-2)] w-full flex items-center justify-between border-t border-t-[var(--border-light-theme-border-2)]"
                  onClick={logout}
                >
                  <span className="font-sm leading-7 text-[var(--typography-light-theme-body)]"> Đăng xuất</span>
                  <Image width={24} height={24} src="/button/logout.svg" alt="" />
                </div>
              </DropdownMenu.Item>
            </DropdownMenu.Group>
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      </div>
    </div>
  );
}

export default Navbar;
