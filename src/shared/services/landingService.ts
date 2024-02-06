import { Endpoint } from "shared/utils/endpoints";
import { HTTP_CLIENT } from "shared/utils/interceptor";

const GetTerms = () => {
  return HTTP_CLIENT.get(Endpoint.landing.terms);
};
const GetPrivacyPolicy = () => {
  return HTTP_CLIENT.get(Endpoint.landing.privacy);
};

const GetHomeGuideRules = () => {
  return HTTP_CLIENT.get(Endpoint.landing.homeGuideRules);
};

const ContactUsService = (params: any) => {
  return HTTP_CLIENT.post(Endpoint.general.contact, params);
};

export { GetTerms, GetPrivacyPolicy, ContactUsService, GetHomeGuideRules };
