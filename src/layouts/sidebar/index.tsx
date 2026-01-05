"use client";

import { Tooltip } from "@radix-ui/themes";
import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { LeftSide, MenuItem, RightSide } from "./sidebar.constant";


function Sidebar() {
  const [isOpenR, setIsOpenR] = useState<boolean>(false);
  const [menuRSide, setMenuRSide] = useState<MenuItem | undefined>();

  const pathname = usePathname(); // get current url

  useEffect(() => {
    const menuAcitve = LeftSide.find((l) => l.pathActive.includes(pathname));
    if (menuAcitve) {
      const menuRSide = RightSide.find((r) => r.type === "menu" && r.menuId === menuAcitve?.id);
      setIsOpenR(!!menuRSide);
      setMenuRSide(menuRSide);
    }
  }, [pathname]);

  const renderRightSidebar = () => {
    return (
      <div
        className={clsx(
          "flex flex-col border-r border-r-[var(--border-light-theme-border-2)] p-4 gap-2 transition-all duration-200",
          isOpenR ? "w-[270px]" : "w-0 !p-0 overflow-hidden border-none"
        )}
      >
        {!!menuRSide &&
          menuRSide?.children?.map((c) => (
            <Link
              href={c.path!}
              key={c.path}
              className={clsx(
                "flex items-center h-10 rounded cursor-pointer hover:bg-[var(--border-light-theme-border-2)] gap-2 px-4",
                pathname === c.path ? "bg-[var(--primary-primary-background)]" : null
              )}
            >
              {c.svgImg && c.svgImgActive && (
                <Image alt="" width={24} height={24} src={c.path === pathname ? c.svgImgActive : c.svgImg} />
              )}
              <span
                className={clsx("text-sm font-medium", pathname === c.path ? "text-[var(--primary-primary)]" : null)}
              >
                {c.name}
              </span>
            </Link>
          ))}
      </div>
    );
  };

  return (
    <div className="flex">
      <div className="left_side w-[69px] py-4 flex flex-col items-center gap-2 border-r border-r-[var(--border-light-theme-border-2)]">
        <div className="flex flex-1 min-h-0 flex-col gap-2">
          {LeftSide.map((ls) => (
            <Tooltip key={ls.id} content={ls.title}>
                <Link
                  href={ls.path}
                  className={clsx(
                    "w-[52px] h-12 flex items-center justify-center cursor-pointer rounded hover:bg-[var(--border-light-theme-border-2)]",
                    ls.pathActive.includes(pathname) ? "bg-[var(--primary-primary-background)]" : null
                  )}
                >
                  <Image
                    width={24}
                    height={24}
                    src={ls.pathActive.includes(pathname) ? ls.svgImgActive : ls.svgImg}
                    alt=""
                  />
                </Link>
            </Tooltip>
          ))}
        </div>
        <div
          className="w-12 h-12 flex items-center justify-center rounded cursor-pointer hover:bg-[var(--border-light-theme-border-2)]"
          onClick={() => {
            if (menuRSide) {
              setIsOpenR((pre) => !pre);
            }
          }}
        >
          <Image width={24} height={24} src={isOpenR ? "sidebar/collapse-active.svg" : "sidebar/collapse.svg"} alt="" />
        </div>
      </div>
      {renderRightSidebar()}
    </div>
  );
}

export default Sidebar;
