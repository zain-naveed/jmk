const publicWriterTabs = ["Stories", "My Personal Stories"];
const privateWriterTabs = [
  "My Stories",
  "Personal Contributions",
  "My Payments",
  "Notifications",
];
const publicArtistTabs = ["Arts", "Stories"];
const privateArtistTabs = [
  "My Arts",
  "My Stories",
  "Personal Contributions",
  "Notifications",
];

const publicWriterTabEnums = {
  stories: "Stories",
  personalStories: "My Personal Stories",
};
const publicArtistTabEnums = {
  arts: "Arts",
  stories: "Stories",
};
const privateWriterTabEnums = {
  stories: "My Stories",
  personalStories: "Personal Contributions",
  payments: "My Payments",
  notifications: "Notifications",
};
const privateArtistTabEnums = {
  stories: "My Stories",
  personalStories: "Personal Contributions",
  arts: "My Arts",
  payments: "My Payments",
  notifications: "Notifications",
};
const typesEnum = {
  writer: "Writer",
  artist: "Artist",
};
export {
  publicWriterTabs,
  privateWriterTabs,
  publicArtistTabs,
  privateArtistTabs,
  publicWriterTabEnums,
  publicArtistTabEnums,
  privateWriterTabEnums,
  privateArtistTabEnums,
  typesEnum,
};
