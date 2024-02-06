import { Icons, Images } from "assets";

const users: {
  name: string;
  avatar: any;
}[] = [
  {
    name: "Zaire Korsgaard",
    avatar: Images.User1,
  },
  {
    name: "Tiana Calzoni",
    avatar: Images.User2,
  },
  {
    name: "Skylar Curtis",
    avatar: Images.User3,
  },
  {
    name: "Livia Saris",
    avatar: Images.User4,
  },
];

const steps: {
  name: string;
  Icon: any;
  desc: string;
}[] = [
  {
    name: "Sign Up & Explore",
    Icon: Icons.One,
    desc: "Share any space from a shared living room to a second home and everything in-between.",
  },
  {
    name: "Upload Your Artworks",
    Icon: Icons.Two,
    desc: "You’re free to choose your own schedule, prices, and requirements for guests.",
  },
  {
    name: "Start Writing Stories",
    Icon: Icons.Three,
    desc: "Once your listing is live, qualified guests can reach out and you can message them.",
  },
  {
    name: "Contribute Stories on Artworks",
    Icon: Icons.Four,
    desc: "Once your listing is live, qualified guests can reach out and you can message them.",
  },
];

const testimonials: {
  name: string;
  avatar: any;
  quote: string;
}[] = [
  {
    name: "Ferdinand Stindl - Writer & Artist",
    avatar: Images.TestimonialUser,
    quote:
      "I've never been involved in any media project like JMK. In journalism, you struggle just to stay afloat. Something is changing in media and I'm fortunate to be part of it. ",
  },
  {
    name: "Ferdinand Stindl - Writer & Artist",
    avatar: Images.TestimonialUser,
    quote:
      "I've never been involved in any media project like JMK. In journalism, you struggle just to stay afloat. Something is changing in media and I'm fortunate to be part of it.",
  },
];

const writingTips: {
  name: string;
  desc: string;
}[] = [
  {
    name: "Find your target keywords",
    desc: "Select keywords aligned with your target market and use them to return search engine results. As you research keywords, don’t forget about user intent.",
  },
  {
    name: "Build better backlinks",
    desc: "Backlinks from other highly-ranked sites can help organically improve your standing in search results. Best bet? Create and submit relevant, market-focused content to industry news or knowledge sites.",
  },
  {
    name: "Optimize your on-page content",
    desc: "Great content relies on relevance. Any blog post, video, podcast, or digital resource you create should focus on your target market.",
  },
  {
    name: "Speed up your website",
    desc: "Website speed is a critical component of the user experience — on any device. Google began incorporating mobile page speed in 2018 as a factor in search rankings, making improved performance a factor in favorable results.",
  },
];

export { users, steps, testimonials, writingTips };
