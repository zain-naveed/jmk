import classNames from "classnames";
import styles from "./style.module.scss";
import { Icons } from "assets";

interface SocialLinksProps {
  social_links: any[];
}

const SocialLinks = ({ social_links }: Partial<SocialLinksProps>) => {
  return (
    <div className={classNames("d-flex gap-2")}>
      {social_links?.map((item, inx) => {
        return item?.social_type === "Twitter" ? (
          <div
            className={classNames(styles.socialContainer)}
            role="button"
            key={inx}
          >
            <Icons.TwitterWhite
              className={classNames(styles.iconStyle)}
              onClick={() => {
                let url = item?.social_link.match(/^http[s]?:\/\//)
                  ? item?.social_link
                  : "https://" + item?.social_link;
                window.open(url, "_blank");
              }}
              role="button"
            />
          </div>
        ) : item?.social_type === "Facebook" ? (
          <div
            className={classNames(styles.socialContainer)}
            role="button"
            key={inx}
          >
            <Icons.FacebookWhite
              className={classNames(styles.iconStyle)}
              onClick={() => {
                let url = item?.social_link.match(/^http[s]?:\/\//)
                  ? item?.social_link
                  : "https://" + item?.social_link;
                window.open(url, "_blank");
              }}
              role="button"
            />
          </div>
        ) : item?.social_type === "Instagram" ? (
          <div
            className={classNames(styles.socialContainer)}
            role="button"
            key={inx}
          >
            <Icons.Instagram
              className={classNames(styles.iconStyle)}
              onClick={() => {
                let url = item?.social_link.match(/^http[s]?:\/\//)
                  ? item?.social_link
                  : "https://" + item?.social_link;
                window.open(url, "_blank");
              }}
              role="button"
            />
          </div>
        ) : item?.social_type === "Linkedin" ? (
          <div
            className={classNames(styles.socialContainer)}
            role="button"
            key={inx}
          >
            <Icons.Linkedin
              className={classNames(styles.iconStyle)}
              onClick={() => {
                let url = item?.social_link.match(/^http[s]?:\/\//)
                  ? item?.social_link
                  : "https://" + item?.social_link;
                window.open(url, "_blank");
              }}
              role="button"
            />
          </div>
        ) : null;
      })}
    </div>
  );
};

export default SocialLinks;
