import { Icons } from "assets";
import classNames from "classnames";
import {
  FacebookShareButton,
  LinkedinShareButton,
  PinterestShareButton,
  TwitterShareButton,
} from "react-share";
import styles from "./style.module.scss";

interface ShareSocialMediaLinkProps {
  link: string;
  handleSubmit?: () => void;
}

function ShareSocialMediaLink({
  link,
  handleSubmit,
}: ShareSocialMediaLinkProps) {
  return (
    <div className={classNames("d-flex gap-2")}>
      <div className={classNames(styles.socialContainer)} role="button">
        <LinkedinShareButton
          url={link}
          onClick={() => handleSubmit?.()}
          className={classNames(styles.socialContainer)}
        >
          <Icons.Linkedin className={classNames(styles.iconStyle)} />
        </LinkedinShareButton>
      </div>
      <div className={classNames(styles.socialContainer)} role="button">
        <PinterestShareButton
          media={link}
          url={link}
          onClick={() => handleSubmit?.()}
          className={classNames(styles.socialContainer)}
        >
          <Icons.Pinterest className={classNames(styles.iconPinterest)} />
        </PinterestShareButton>
      </div>
      <div className={classNames(styles.socialContainer)} role="button">
        <TwitterShareButton
          url={link}
          onClick={() => handleSubmit?.()}
          className={classNames(styles.socialContainer)}
        >
          <Icons.TwitterWhite className={classNames(styles.iconStyle)} />
        </TwitterShareButton>
      </div>
      <div className={classNames(styles.socialContainer)} role="button">
        <FacebookShareButton
          url={link}
          onClick={() => handleSubmit?.()}
          className={classNames(styles.socialContainer)}
        >
          <Icons.FacebookWhite className={classNames(styles.iconStyle)} />
        </FacebookShareButton>
      </div>
    </div>
  );
}

export default ShareSocialMediaLink;
