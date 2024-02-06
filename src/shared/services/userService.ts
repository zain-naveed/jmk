import { Endpoint } from "shared/utils/endpoints";
import { HTTP_CLIENT } from "shared/utils/interceptor";

const GetUserProfile = (id: string) => {
  return HTTP_CLIENT.get(Endpoint.profile.getUserProfile + id);
};

const UpdateCoverPhoto = (params: {}) => {
  return HTTP_CLIENT.post(Endpoint.profile.updateCover, params);
};

const GetUserStatistics = () => {
  return HTTP_CLIENT.get(Endpoint.profile.statistics);
};

const UpdateProfile = (params: any) => {
  return HTTP_CLIENT.post(Endpoint.profile.updateProfile, params);
};

const getProfileSocialLink = () => {
  return HTTP_CLIENT.get(Endpoint.profile.getSocialLinks);
};

const UpdatePassword = (params: any) => {
  return HTTP_CLIENT.post(Endpoint.profile.updatePassword, params);
};

const UpdateSocialLink = (params: any) => {
  return HTTP_CLIENT.post(Endpoint.profile.updateSocialLinks, params);
};

const DeteleSocialLink = (id: any) => {
  return HTTP_CLIENT.delete(Endpoint.profile.deleteSocialLink + id);
};

const GetUserSupporters = ({
  page,
  pagination,
}: {
  pagination: number;
  page: number;
}) => {
  return HTTP_CLIENT.get(
    Endpoint.profile.supporters + `?pagination=${pagination}&&page=${page}`
  );
};
const GetSavedStories = ({ page }: any) => {
  return HTTP_CLIENT.get(Endpoint.profile.getSavedStories + `?page=${page}`);
};

const GetSavedArt = ({ page }: any) => {
  return HTTP_CLIENT.get(Endpoint.profile.getSavedArts + `?page=${page}`);
};

const GetGraphData = (year: any) => {
  return HTTP_CLIENT.get(Endpoint.profile.graphData + `?start_date=${year}`);
};

const GetArtists = ({
  page,
  pagination,
  search,
  filter,
}: {
  pagination: number;
  page: number;
  search: string;
  filter: string;
}) => {
  return HTTP_CLIENT.get(
    Endpoint.general.getArtists +
      `?pagination=${pagination}&&page=${page}&&search=${search}&&filter=${filter}`
  );
};

const GetWriters = ({
  page,
  pagination,
  search,
  filter,
}: {
  pagination: number;
  page: number;
  search: string;
  filter: string;
}) => {
  return HTTP_CLIENT.get(
    Endpoint.general.getWriters +
      `?pagination=${pagination}&&page=${page}&&search=${search}&&filter=${filter}`
  );
};

export {
  DeteleSocialLink,
  GetArtists,
  GetGraphData,
  GetSavedArt,
  GetSavedStories,
  GetUserProfile,
  GetUserStatistics,
  GetUserSupporters,
  GetWriters,
  UpdateCoverPhoto,
  UpdatePassword,
  UpdateProfile,
  UpdateSocialLink,
  getProfileSocialLink,
};
