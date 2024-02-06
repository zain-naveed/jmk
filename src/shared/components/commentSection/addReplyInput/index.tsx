import { Icons } from "assets";
import classNames from "classnames";
import { useEffect, useRef, useState } from "react";
import { Spinner } from "react-bootstrap";
import { useParams } from "react-router";
import { GetAllUsers } from "shared/services/storyService";
import styles from "./style.module.scss";
import { MentionsInput, Mention } from "react-mentions";
import mentions from "../addComment/mention.module.css";

interface AddCommentInputProps {
  comment: string;
  setComment: (val: string) => void;
  action: (comment: any, tagsUserIds: number[]) => void;
  placeholder?: string;
  autoFocus?: boolean;
  setParentComment: (val: any) => void;
  item?: any;
  setIsReplying?: (val: boolean) => void;
  replyLoading: boolean;
}

const AddReplyInput = ({ comment, setComment, action, placeholder, setParentComment, item, setIsReplying, replyLoading }: AddCommentInputProps) => {
  const { id } = useParams();
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const inputRef = useRef<any>(null);
  const getUsers = () => {
    GetAllUsers()
      .then(({ data: { data, status, message } }) => {
        if (status) {
          setAllUsers(data);
        } else {
          console.log("Error", message);
        }
      })
      .catch((err) => {
        console.log("Error", err);
      });
  };

  const handleMentions = (string: string) => {
    let userIds: any = [];
    let newString = "";
    const replaceRegex = /\[([^)]+)\]\(\d+\)/g;

    string.split("@").forEach((itm, inx) => {
      const regex = /\[([\w\s]+)\]\((\d+)\)/g;
      let match = regex.exec(itm);
      if (match !== null) {
        const number = match[2];
        userIds.push(Number(number));
        let username = findUserName(Number(number));
        const replacedString = itm.replace(replaceRegex, `@${username} `);
        newString = newString + replacedString;
      } else {
        newString = newString + itm;
      }
    });
    action(newString, userIds);
  };

  const findUserName = (id: number) => {
    for (let i = 0; i < allUsers?.length; i++) {
      if (Number(allUsers[i]?.id) === Number(id)) {
        return allUsers[i]?.user_name;
      }
    }
  };

  useEffect(() => {
    getUsers();
    // eslint-disable-next-line
  }, [id]);

  return (
    <div className={classNames("d-flex w-100 align-items-start justify-content-between gap-2 mt-4", item && styles.replyCommentContinaer)}>
      <div className={classNames("col-10 position-relative")}>
        <MentionsInput
          markup="@[__display__](__id__)"
          value={comment}
          onChange={(e: any, newPlainTextValue: any) => {
            setComment(e.target.value);
            if (item) {
              setParentComment(item);
            } else {
              if (setIsReplying) {
                console.log("here");
                setIsReplying?.(false);
              }

              setParentComment(null);
            }
          }}
          onKeyDown={(e: any) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleMentions(comment);
            }
          }}
          placeholder={placeholder ? placeholder : "Share your thoughts"}
          a11ySuggestionsListLabel={"Suggested mentions"}
          classNames={mentions}
          inputRef={inputRef}
        >
          <Mention markup="@[__display__](__id__)" trigger="@" data={allUsers} className={mentions.mentions__mention} />
        </MentionsInput>
      </div>
      <div className={classNames("col-2")}>
        <button className={classNames(styles.sendIconContainer, comment?.length > 0 && styles.activeComment)} disabled={comment?.length === 0 || replyLoading} onClick={() => handleMentions(comment)}>
          {replyLoading ? <Spinner animation={"border"} size="sm" style={{ color: "white" }} /> : <Icons.Send className={classNames(styles.sendIcon)} />}
        </button>
      </div>
    </div>
  );
};

export default AddReplyInput;
