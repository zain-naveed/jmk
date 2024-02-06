import { Images } from "assets";
import { routeConstant } from "shared/routes/routeConstant";

const infoCards: {
  title: string;
  Icon: any;
  desc: string;
  path?: string;
  url?: string;
}[] = [
  {
    title: "Who... or What in the World is JOHNNIE MAE KING",
    Icon: Images.LandingPageImage,
    desc: "Discover the enigmatic character of Johnnie Mae and how she invites you to become contributor of the world.",
    path: routeConstant.aboutus.path,
  },
  {
    title: "The JOHNNIE MAE KING Creative Writing & Storytelling Platform",
    Icon: Images.ComingPic,
    desc: "An online platform that explores the intersection of Art and Creative naratives. Learn more.",
    path: routeConstant.comingSoon.path,
  },
  {
    title: "Read The Latest From The World Of Johnnie Mae King",
    Icon: Images.BlogPosts,
    desc: "Stories, Poetry, Articles, and more!",
    path: routeConstant.storyGuide.path,
    url: "https://store.johnniemaeking.com/blogs/news",
  },
  {
    title: "Shop the JOHNNIE MAE KING Store",
    Icon: Images.ShopifyImage,
    desc: "Discover Prints, Posters, and more...",
  },
];

export { infoCards };
