import { Endpoint } from "shared/utils/endpoints";
import { HTTP_CLIENT } from "shared/utils/interceptor";

const GetGenres = () => {
  return HTTP_CLIENT.get(Endpoint.general.genre);
};

const CreatePost = (params: {}) => {
  return HTTP_CLIENT.post(Endpoint.story.create, params);
};

const CreateDraft = (params: {}) => {
  return HTTP_CLIENT.post(Endpoint.story.createDraft, params);
};

const GetUserStories = ({ id, page }: any) => {
  return HTTP_CLIENT.get(Endpoint.story.getStories + `${id}?page=${page}`);
};

const getAllPosts = ({ id, filter, page, type, search }: any) => {
  return HTTP_CLIENT.get(
    Endpoint.story.allPost +
      `${id}?filter=${filter}&page=${page}&post_type=${type}&search=${search}`
  );
};

const getAllDraftPosts = ({ id, filter, page, search }: any) => {
  return HTTP_CLIENT.get(
    Endpoint.story.draftPost +
      `${id}?filter=${filter}&page=${page}&search=${search}`
  );
};

const GetUserPersonalStories = ({ id, filter, page, type, search }: any) => {
  return HTTP_CLIENT.get(
    Endpoint.story.getPersonalStories +
      `${id}?filter=${filter}&page=${page}&post_type=${type}&search=${search}`
  );
};

const DeleteStory = (id: any) => {
  return HTTP_CLIENT.delete(Endpoint.story.delete + id);
};

const UpdatePost = (params: {}) => {
  return HTTP_CLIENT.post(Endpoint.story.update, params);
};

const UpdateDraft = (params: {}) => {
  return HTTP_CLIENT.post(Endpoint.story.updateDraft, params);
};

const SearchPost = ({ text, type, page, pagination }: any) => {
  if (text) {
    return HTTP_CLIENT.get(
      Endpoint.general.search +
        `?search=${text}&type=${type}&page=${page}&pagination=${pagination}`
    );
  } else {
    return HTTP_CLIENT.get(
      Endpoint.general.search +
        `?search=&type=${type}&page=${page}&pagination=${pagination}`
    );
  }
};

const GetStoryDetail = (id: any) => {
  return HTTP_CLIENT.get(Endpoint.story.postDetail + id);
};

const LikeStory = (params: {}) => {
  return HTTP_CLIENT.post(Endpoint.story.like, params);
};

const SaveStory = (params: {}) => {
  return HTTP_CLIENT.post(Endpoint.story.save, params);
};

const ShareStory = (params: {}) => {
  return HTTP_CLIENT.post(Endpoint.story.share, params);
};

const GetMoreFromWriter = (id: number, postId: number) => {
  return HTTP_CLIENT.get(
    Endpoint.story.morefromWriter + `${id}/${postId}?limit=3`
  );
};

const GetComments = ({ id, page, pagination, comment_id }: any) => {
  if (comment_id) {
    return HTTP_CLIENT.get(
      Endpoint.story.getComments +
        `${id}?page=${page}&&pagination=${pagination}&&comment_id=${comment_id}`
    );
  } else {
    return HTTP_CLIENT.get(
      Endpoint.story.getComments +
        `${id}?page=${page}&&pagination=${pagination}`
    );
  }
};

const GetReplies = (id: number, page: number, pagination: number) => {
  return HTTP_CLIENT.get(
    Endpoint.story.replies + `${id}?page=${page}&&pagination=${pagination}`
  );
};

const CommentAction = (params: {}) => {
  return HTTP_CLIENT.post(Endpoint.story.commentAction, params);
};

const AddComment = (params: {}) => {
  return HTTP_CLIENT.post(Endpoint.story.addComment, params);
};

const DeleteComment = (id: any) => {
  return HTTP_CLIENT.delete(Endpoint.story.deleteComment + id);
};

const GetAllUsers = () => {
  return HTTP_CLIENT.get(Endpoint.story.getUsers);
};

const guestStory = (obj: any) => {
  return HTTP_CLIENT.post(Endpoint.story.guestStory, obj);
};

export {
  GetGenres,
  CreatePost,
  GetUserStories,
  DeleteStory,
  GetUserPersonalStories,
  SearchPost,
  GetStoryDetail,
  LikeStory,
  SaveStory,
  ShareStory,
  GetMoreFromWriter,
  GetComments,
  GetReplies,
  CommentAction,
  AddComment,
  getAllPosts,
  UpdatePost,
  DeleteComment,
  CreateDraft,
  UpdateDraft,
  getAllDraftPosts,
  GetAllUsers,
  guestStory,
};
