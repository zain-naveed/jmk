import { routeConstant } from "shared/routes/routeConstant";

const navigationItems: { label: string; route?: string; url?: any }[] = [
  {
    label: "Shop",
    // route: routeConstant.home.path,
    url: "https://store.johnniemaeking.com/",
  },
  {
    label: "Blog",
    url: "https://store.johnniemaeking.com/blogs/news",
  },
  { label: "About Us", route: routeConstant.aboutus.path },
  {
    label: "Contact Us",
    route: routeConstant.contactus.path,
  },
];

export { navigationItems };
