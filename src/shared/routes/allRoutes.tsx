import Home from "pages/home";
import { routeConstant } from "./routeConstant";
import AboutUs from "pages/aboutus";
import Privacy from "pages/privacy";
import Terms from "pages/terms";
import Profile from "pages/profile";
import SaveStories from "pages/saveStories";
import MyPosts from "pages/myPosts";
import Art from "pages/art";
import Story from "pages/story";
import ContactUs from "pages/contactus";
import FAQ from "pages/faq";
import EditProfile from "pages/editProfile";
import Search from "pages/search";
import Writers from "pages/writers";
import Artists from "pages/artists";
import WritingTips from "pages/writingTips";
import StoryGuide from "pages/storyGuide";
import LandingPage from "pages/landing";
import ComingSoon from "pages/comingSoon";
import HomeGuideRules from "pages/homeGuideRules"

const commonRoute = [
  {
    path: routeConstant.comingSoon.path,
    title: routeConstant.comingSoon.title,
    Component: ComingSoon,
  },
  {
    path: routeConstant.storyGuide.path,
    title: routeConstant.storyGuide.title,
    Component: StoryGuide,
  },
  {
    path: routeConstant.landing.path,
    title: routeConstant.landing.title,
    Component: LandingPage,
  },
  {
    path: routeConstant.home.path,
    title: routeConstant.home.title,
    Component: Home,
  },
  {
    path: routeConstant.aboutus.path,
    title: routeConstant.aboutus.title,
    Component: AboutUs,
  },
  {
    path: routeConstant.contactus.path,
    title: routeConstant.contactus.title,
    Component: ContactUs,
  },
  {
    path: routeConstant.privacy.path,
    title: routeConstant.privacy.title,
    Component: Privacy,
  },
  {
    path: routeConstant.terms.path,
    title: routeConstant.terms.title,
    Component: Terms,
  },
  {
    path: routeConstant.guideRules.path,
    title: routeConstant.guideRules.title,
    Component: HomeGuideRules,
  },
  {
    path: routeConstant.profile.path,
    title: routeConstant.profile.title,
    Component: Profile,
  },
  {
    path: routeConstant.art.path,
    title: routeConstant.art.title,
    Component: Art,
  },
  {
    path: routeConstant.story.path,
    title: routeConstant.story.title,
    Component: Story,
  },
  {
    path: routeConstant.writingTips.path,
    title: routeConstant.writingTips.title,
    Component: WritingTips,
  },
  {
    path: routeConstant.faq.path,
    title: routeConstant.faq.title,
    Component: FAQ,
  },
  {
    path: routeConstant.search.path,
    title: routeConstant.search.title,
    Component: Search,
  },
  {
    path: routeConstant.writers.path,
    title: routeConstant.writers.title,
    Component: Writers,
  },
  {
    path: routeConstant.artists.path,
    title: routeConstant.artists.title,
    Component: Artists,
  },
];

const publicRoute = [...commonRoute];
const privateRoute = [
  ...commonRoute,

  {
    path: routeConstant.saveStories.path,
    title: routeConstant.saveStories.title,
    Component: SaveStories,
  },
  {
    path: routeConstant.myposts.path,
    title: routeConstant.myposts.title,
    Component: MyPosts,
  },
  {
    path: routeConstant.editProfile.path,
    title: routeConstant.editProfile.title,
    Component: EditProfile,
  },
];

export { publicRoute, privateRoute };
