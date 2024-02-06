const BaseURL = "https://api.johnniemaeking.com/api/";
const SocketURL = "https://johnniemaeking.com:5511";
// const BaseURL = "https://devcp.codingpixels.us/new/jmk/api/";
// const SocketURL = "http://178.128.29.7:5511";

//Social Auth URLs
const GoogleAPI =
  "844443769909-eb3s9ppsddv52s71tbpp64eetiumnd49.apps.googleusercontent.com";
const FacebookAppId = "6681655011847110";

//Paypal URLS
const PaypalClientId =
  "AZXjEl5s-qSRAztMfcKc62MwmtjkwjHCofpEI0JQWhmeBgtsxaxssQbcLMSrivA1hfoMy3q6VPN2P0fL";

const Endpoint = {
  auth: {
    login: "login",
    register: "register",
    sendOtp: "send-otp",
    resetPassword: "reset-password",
    logout: "logout",
    socialLogin: "auth/social-login",
    verifyOtp: "verify-otp",
    verifyOtpReset: "verify-otp-reset",
    twitterAuth: "auth/twitter",
    twitterCallback: "",
    twitterLogin: "auth/twitter/user",
  },
  landing: {
    terms: "privacy-policy/0",
    privacy: "privacy-policy/1",
    homeGuideRules: "privacy-policy/2",
  },
  art: {
    create: "arts/create",
    getAllArts: "arts/all",
    getAllArtsContest: "arts/contest",
    getAllArtsStories: "arts/first-story",
    getAllMyArts: "arts/my-arts/",
    deleteArt: "arts/delete/",
    updateArt: "arts/update/",
    getAllArt: "arts/all-my-arts/",
    getArtDetail: "arts/detail/",
    contributersList: "arts/contributor-list/",
    artStories: "arts/",
    save: "arts/bookmark",
    featureArts: "arts/get-featured-arts",
    uploadImage: "arts/upload-image",
    getAllArtsWithoutContest: "arts/list-without-contest",
    makeArtDefault: "/arts/make-default-view",
  },
  profile: {
    getUserProfile: "user/get-profile/",
    updateCover: "user/update-cover-image",
    statistics: "transactions/statistics",
    supporters: "transactions/supporter-list",
    updateProfile: "user/update-profile",
    getSocialLinks: "user/social-links",
    updatePassword: "user/update-password",
    updateSocialLinks: "user/update-social-link",
    deleteSocialLink: "user/social-link-delete/",
    getSavedStories: "posts/bookmarks",
    getSavedArts: "arts/bookmarks",
    graphData: "transactions/earning-graph",
  },
  story: {
    create: "posts/create",
    getStories: "posts/my-stories/",
    delete: "posts/delete/",
    update: "posts/update",
    getPersonalStories: "posts/personal-contribution/",
    postDetail: "posts/detail/",
    like: "posts/like-dislike/",
    save: "posts/bookmark/",
    share: "posts/share/",
    morefromWriter: "posts/user-stories/",
    getComments: "comments/list/",
    replies: "comments/replies/",
    commentAction: "comments/like-dislike-comment",
    addComment: "comments/add-comment",
    allPost: "posts/all/",
    draftPost: "posts/draft/",
    deleteComment: "comments/delete-comment/",
    createDraft: "posts/create-draft",
    updateDraft: "posts/update-draft",
    getUsers: "user/lists",
    guestStory: "guest/stories",
  },
  general: {
    genre: "genres/genres-list",
    report: "report",
    writingTips: "writing-tips",
    newsLetter: "newsletter/subscribe",
    contact: "contact",
    search: "posts/search",
    payments: "paypal",
    tags: "tags/tags-list/",
    testimonials: "testimonials-list",
    getArtists: "user/artists-list",
    getWriters: "user/contributing-writers-list",
    getFeatureArtist: "user/get-featured-artists",
    getAllFeatureArtitst: "user/featured-artists-list",
    getWinnersList: "get-winners",
    getAnnoucements: "user-announcements-list",
    paidArtworks: "paid/art/lists",
    getFeatureWriters: "user/get-featured-writers",
    contestDescription: "get-contest-deadline-description",
    createBlob: "make-blob-file",
  },
  faq: {
    faqCategories: "faq-categories-list",
    getFaqs: "faq-list",
    getFAQbyId: "faqs-list-by-category/",
  },
  notifications: {
    getNotifications: "notifications/notifications-list/",
    notificationCount: "notifications/notifications-count",
    readAll: "notifications/read-notifications",
    readSingle: "notifications/read-notification/",
    setNotificationsPreference: "notifications/settings",
    getNotificationsPreference: "notifications/get-settings",
  },
};

export {
  BaseURL,
  Endpoint,
  GoogleAPI,
  FacebookAppId,
  PaypalClientId,
  SocketURL,
};
