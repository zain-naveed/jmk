import { Endpoint } from "shared/utils/endpoints";
import { HTTP_CLIENT } from "shared/utils/interceptor";

const getFAQCategories = () => {
  return HTTP_CLIENT.get(Endpoint.faq.faqCategories);
};
const getFAQs = () => {
  return HTTP_CLIENT.get(Endpoint.faq.getFaqs);
};

const getFAQsById = (id: any) => {
  return HTTP_CLIENT.get(Endpoint.faq.getFAQbyId + id);
};


export { getFAQCategories, getFAQs, getFAQsById };
