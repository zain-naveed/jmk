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
    name: "",
    Icon: Icons.One,
    desc: `
    <label 
    style="font-family: HNRegular; font-size: 18px;
    color: black;
    text-align: left;
    line-height: 32px;" >Write an original Johnnie Mae King story using the backstory <a style="text-decoration:none; color: black;  font-weight: 900;    " href="/aboutus">[found here]</a> as a basis for your narrative.
    </label> `,
  },
  {
    name: "",
    Icon: Icons.Two,
    desc: `<label 
    style="font-family: HNRegular; font-size: 18px;
    color: black;
    text-align: left;
    line-height: 32px;">
    Keep your story between 300 words (min) and 500 words (max).</label>`,
  },
  {
    name: "",
    Icon: Icons.Three,
    desc: `<label 
    style="font-family: HNRegular; font-size: 18px;
    color: black;
    text-align: left;
    line-height: 32px;">Do not submit AI generated content. All stories selected as finalists will be scanned by multiple AI detector applications.</label>`,
  },
  {
    name: "",
    Icon: Icons.Four,
    desc: ` <label 
    style="font-family: HNRegular; font-size: 18px;
    color: black;
    text-align: left;
    line-height: 32px;">Subscribe to the site or follow <a target="_blank" href="http://instagram.com/wojmk" style="text-decoration:none; color: black;   font-weight: 900;    ">@wojmk</a> on Instagram. Only IG followers or email subscribers will be eligible for prize winnings.</label>`,
  },
  {
    name: "",
    Icon: Icons.Five,
    desc: `<label 
    style="font-family: HNRegular; font-size: 18px;
    color: black;
    text-align: left;
    line-height: 32px;">Submit your entry by [submission deadline] via our online submission form below.</label>`,
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
