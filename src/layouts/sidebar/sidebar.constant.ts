export const LeftSide = [
  {
    id: 1,
    title: "Home",
    path: "account-profile",
    pathActive: ["/account-profile"],
    svgImg: "/sidebar/home.svg",
    svgImgActive: "/sidebar/home-active.svg",
  },
  {
    id: 2,
    title: "User profile",
    path: "profile-identity",
    pathActive: ["manage-signature", "password-security", "profile-identity", "manage-history"],
    svgImg: "/sidebar/profile.svg",
    svgImgActive: "/sidebar/profile-active.svg",
  },
  {
    id: 3,
    title: "Manage org",
    path: "org",
    pathActive: ["/org", "/manage-position", "manage-account", "group-config"],
    // authority: ['ROLE_ADMIN', 'ROLE_ORG_ADMIN'],
    svgImg: "/sidebar/org.svg",
    svgImgActive: "/sidebar/org-active.svg",
  },
  {
    id: 4,
    title: "Setting",
    path: "password-config",
    pathActive: ["password-config", "login-config", "ip-config"],
    // authority: ['ROLE_ADMIN', 'ROLE_ORG_ADMIN'],
    svgImg: "/sidebar/setting.svg",
    svgImgActive: "/sidebar/setting-active.svg",
  },
];

export interface MenuItem {
  type: "link" | "section" | "menu";
  menuId?: number;
  name?: string;
  path?: string;
  children?: MenuItem[];
  svgImg?: string;
  svgImgActive?: string;
}

export const RightSide: MenuItem[] = [
  {
    type: "menu",
    menuId: 3,
    children: [
      {
        type: "link",
        name: "Sơ đồ tổ chức",
        path: "/org",
        svgImg: 'sidebar/org-chart.svg',
        svgImgActive: 'sidebar/org-chart-active.svg'
      },
      {
        type: "link",
        name: "Quản lý chức vụ",
        path: "/manage-position",
        svgImg: 'sidebar/manage-position.svg',
        svgImgActive: 'sidebar/manage-position-active.svg'
      },
    ],
  },
];
