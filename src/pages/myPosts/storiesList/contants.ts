import { Images } from "assets";

const horizontalTabs = ["Stories", "Personal Contributions"];
const horizontalTabsEnums = {
  stories: "Stories",
  personal: "Personal Contributions",
};
const posts: {
  title: string;
  isPublish: boolean;
  cover: any;
  date: string;
}[] = [
  {
    title: "5 Ways Women Sabotage Their Own Success",
    isPublish: true,
    cover: Images.PostContent,
    date: "2020/10/12",
  },
  {
    title: "5 Ways Women Sabotage Their Own Success",
    isPublish: true,
    cover: Images.Art,
    date: "2020/10/12",
  },
  {
    title: "5 Ways Women Sabotage Their Own Success",
    isPublish: true,
    cover: Images.PostContent,
    date: "2020/10/12",
  },
  {
    title: "5 Ways Women Sabotage Their Own Success",
    isPublish: false,
    cover: null,
    date: "2020/10/12",
  },
  {
    title: "5 Ways Women Sabotage Their Own Success",
    isPublish: false,
    cover: Images.Art,
    date: "2020/10/12",
  },
];
export { posts, horizontalTabs, horizontalTabsEnums };
