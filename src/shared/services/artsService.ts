import { Endpoint } from "shared/utils/endpoints";
import { HTTP_CLIENT } from "shared/utils/interceptor";

interface ApiProps {
  pagination: number;
  page: number;
  search: string;
}

const GetAllArts = ({ pagination, page, search }: Partial<ApiProps>) => {
  return HTTP_CLIENT.get(
    Endpoint.art.getAllArts +
    `?page=${page}&&pagination=${pagination}&&search=${search}`
  );
};

const GetAllArtsContests = ({
  pagination,
  page,
  search,
}: Partial<ApiProps>) => {
  return HTTP_CLIENT.get(
    Endpoint.art.getAllArtsContest + `?page=${page}&&pagination=${pagination}`
  );
};

const GetAllArtsStories = ({ pagination, page, search }: Partial<ApiProps>) => {
  return HTTP_CLIENT.get(
    Endpoint.art.getAllArtsStories + `?page=${page}&&pagination=${pagination}`
  );
};

const CreateArt = (params: any) => {
  return HTTP_CLIENT.post(Endpoint.art.create, params);
};

const GetAllMyArt = ({ id, page }: any) => {
  return HTTP_CLIENT.get(Endpoint.art.getAllMyArts + `${id}?page=${page}`);
};

const DeleteArt = (id: any) => {
  return HTTP_CLIENT.delete(Endpoint.art.deleteArt + id);
};

const UpdateArt = (params: any, id: number) => {
  return HTTP_CLIENT.post(Endpoint.art.updateArt + id, params);
};

const getAllMyArts = ({ id, filter, page, search }: any) => {
  return HTTP_CLIENT.get(
    Endpoint.art.getAllArt +
    `${id}?filter=${filter}&page=${page}&search=${search}`
  );
};

const GetArtDetail = (id: any) => {
  return HTTP_CLIENT.get(Endpoint.art.getArtDetail + id);
};

const GetArtContributersList = ({ id, page, pagination }: any) => {
  return HTTP_CLIENT.get(
    Endpoint.art.contributersList +
    id +
    `?page=${page}&pagination=${pagination}`
  );
};

const GetArtStories = ({ id, page, pagination, filter }: any) => {
  return HTTP_CLIENT.get(
    Endpoint.art.artStories +
    id +
    `/posts?filter=${filter ? filter : []}` +
    `&page=${page}&pagination=${pagination}`
  );
};

const SaveArt = (params: {}) => {
  return HTTP_CLIENT.post(Endpoint.art.save, params);
};

const GetAllFeatureArts = ({ pagination, page }: Partial<ApiProps>) => {
  return HTTP_CLIENT.get(
    Endpoint.art.featureArts + `?page=${page}&&pagination=${pagination}`
  );
};

const GetAllArtsWithoutContest = ({ pagination, page }: Partial<ApiProps>) => {
  return HTTP_CLIENT.get(
    Endpoint.art.getAllArtsWithoutContest +
    `?page=${page}&&pagination=${pagination}`
  );
};

const MakeArtPieceDefault = (params: any) => {
  return HTTP_CLIENT.post(Endpoint.art.makeArtDefault, params)
}

export {
  GetAllArts,
  GetAllArtsContests,
  GetAllArtsStories,
  CreateArt,
  GetAllMyArt,
  DeleteArt,
  UpdateArt,
  getAllMyArts,
  GetArtDetail,
  GetArtContributersList,
  GetArtStories,
  SaveArt,
  GetAllFeatureArts,
  GetAllArtsWithoutContest,
  MakeArtPieceDefault
};
