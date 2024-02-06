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
    name: "User Profiles:",
    Icon: Icons.One,
    desc: "Writers can create personalized profiles showcasing their work and contributions to the platform.",
  },
  {
    name: "Writing Submissions:",
    Icon: Icons.Three,
    desc: "Writers or writing enthusiasts can submit their stories inspired by the artwork featured on the platform.",
  },
  {
    name: "Multiple Genres:",
    Icon: Icons.Five,
    desc: "Writers can engage with the platform’s featured art by submitting short-form stories, poetry, or general commentary.",
  },
  {
    name: "Read, Like, Share, and Comment:",
    Icon: Icons.Seven,
    desc: "Visitors can engage with submitted stories by reading, liking, sharing, and leaving comments.",
  },
  {
    name: `"Buy Me a Coffee" Support:`,
    Icon: Icons.Nine,
    desc: "An optional feature allowing readers to support their favorite writers with voluntary monetary contributions.",
  },
];

const steps2: {
  name: string;
  Icon: any;
  desc: string;
}[] = [
  {
    name: "Artwork Showcase:",
    Icon: Icons.Two,
    desc: "A selection of curated artists will have a profile showcasing a collection of artwork, serving as visual writing prompts to inspire contributing writers.",
  },
  {
    name: "Writing Prompts:",
    Icon: Icons.Four,
    desc: "Curated writing prompts based on artwork will be available for writers to engage on the platform.",
  },
  {
    name: "Platform Writing Page:",
    Icon: Icons.Six,
    desc: "Writers can write, compose, and submit their stories while on the platform with integrated writing tools.",
  },
  {
    name: "Writing Contest & Challenges:",
    Icon: Icons.Eigth,
    desc: "The platform will feature regular writing contests and writing challenges with opportunities to win various prizes.",
  },
  {
    name: "Social Media Integration:",
    Icon: Icons.Ten,
    desc: "Users can share their favorite stories and artwork on social media platforms to reach a broader audience.",
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

export { users, steps, steps2, testimonials, writingTips };
