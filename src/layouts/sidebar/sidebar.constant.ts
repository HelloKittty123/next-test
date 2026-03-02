export const LeftSide = [
  {
    id: 1,
    title: "Trang chủ",
    path: "/ad",
    pathActive: ["/ad"],
    svgImg: "/sidebar/home.svg",
    svgImgActive: "/sidebar/home-active.svg",
  },
  // {
  //   id: 2,
  //   title: "Cấu hình dữ liệu câu hỏi",
  //   path: "/ad/upload-question",
  //   pathActive: ["/ad/upload-question"],
  //   svgImg: "/sidebar/profile.svg",
  //   svgImgActive: "/sidebar/profile-active.svg",
  // },
  {
    id: 3,
    title: "Cấu hình bộ đề",
    path: "/ad/exam-config",
    pathActive: ["/ad/exam-config", "/ad/exam-config/upload-question", "/ad/exam-config/add"],
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

export const RightSide: MenuItem[] = [];
