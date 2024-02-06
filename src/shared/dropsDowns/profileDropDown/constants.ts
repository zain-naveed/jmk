import { Icons } from "assets";
import { routeConstant } from "shared/routes/routeConstant";

const profileDropDownOptions: {
  title: string;
  Icon: any;
  route: string;
}[] = [
  {
    title: "My Profile",
    Icon: Icons.User,
    route: "",
  },
  {
    title: "My Posts",
    Icon: Icons.File,
    route: routeConstant.myposts.path,
  },
  {
    title: "Saved Stories",
    Icon: Icons.Save,
    route: routeConstant.saveStories.path,
  },
  {
    title: "Log out",
    Icon: Icons.Logout,
    route: routeConstant.home.path,
  },
];

export { profileDropDownOptions };
