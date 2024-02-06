import { Endpoint } from "shared/utils/endpoints";
import { HTTP_CLIENT } from "shared/utils/interceptor";

const Report = (params: any) => {
  return HTTP_CLIENT.post(Endpoint.general.report, params);
};

const GetWritingTips = () => {
  return HTTP_CLIENT.get(Endpoint.general.writingTips);
};

const NewsLetterApi = (params: {}) => {
  return HTTP_CLIENT.post(Endpoint.general.newsLetter, params);
};

const DonateOnPaypal = (params: {}) => {
  return HTTP_CLIENT.post(Endpoint.general.payments, params);
};

const GetTags = ({ search, page, pagination }: any) => {
  return HTTP_CLIENT.get(
    Endpoint.general.tags +
      `?page=${page}&pagination=${pagination}&search=${search}`
  );
};

const getTestimonials = () => {
  return HTTP_CLIENT.get(Endpoint.general.testimonials);
};

const GetFeatureArtists = () => {
  return HTTP_CLIENT.get(Endpoint.general.getFeatureArtist);
};

const GetFeatureWriters = () => {
  return HTTP_CLIENT.get(Endpoint.general.getFeatureWriters);
};

const GetWinnersList = () => {
  return HTTP_CLIENT.get(Endpoint.general.getWinnersList);
};

const GetAnnoucements = () => {
  return HTTP_CLIENT.get(Endpoint.general.getAnnoucements);
};

const GetPaidArtworks = () => {
  return HTTP_CLIENT.get(Endpoint.general.paidArtworks);
};

const GetAllFeatureArtists = () => {
  return HTTP_CLIENT.get(Endpoint.general.getAllFeatureArtitst);
};

const GetContestDescription = () => {
  return HTTP_CLIENT.get(Endpoint.general.contestDescription);
};

const createBlob = (obj: any) => {
  return HTTP_CLIENT.post(Endpoint.general.createBlob, obj);
};

export {
  Report,
  GetWritingTips,
  NewsLetterApi,
  DonateOnPaypal,
  GetTags,
  getTestimonials,
  GetFeatureArtists,
  GetWinnersList,
  GetAnnoucements,
  GetPaidArtworks,
  GetAllFeatureArtists,
  GetFeatureWriters,
  GetContestDescription,
  createBlob,
};
