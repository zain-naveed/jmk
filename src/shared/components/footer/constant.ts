import { routeConstant } from "shared/routes/routeConstant";

const navigationItems: { label: string; route: string }[] = [
  { label: "About Us", route: routeConstant.aboutus.path },
  {
    label: "Contact Us",
    route: routeConstant.contactus.path,
  },
  {
    label: "FAQ",
    route: routeConstant.faq.path,
  },
];

export { navigationItems };
