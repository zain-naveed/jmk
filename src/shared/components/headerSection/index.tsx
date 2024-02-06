import classNames from "classnames";
import styles from "./style.module.scss";
import { Icons } from "assets";
import CustomButton from "../customButton";
import SkeletonLoader from "shared/loader/skeletonLoader";

interface HeaderSectionProps {
  title: string;
  subtitle: string;
  highlightedText: string;
  displayHighlightedText: boolean;
  displaySearch: boolean;
  search: string;
  setSearch: (val: string) => void;
  displayBtn: boolean;
  handleAction: () => void;
  isContentStyle2: boolean;
  loading: boolean;
}

const HeaderSection = ({
  title,
  subtitle,
  highlightedText,
  displayHighlightedText,
  displaySearch,
  search,
  setSearch,
  displayBtn,
  handleAction,
  isContentStyle2,
  loading,
}: Partial<HeaderSectionProps>) => {
  return (
    <div className={classNames(styles.toplevelContainer)}>
      <div
        className={classNames(
          isContentStyle2 ? styles.contentContainer2 : styles.contentContainer,
          "px-3 px-sm-0"
        )}
      >
        {loading ? (
          <>
            <SkeletonLoader iconStyle={classNames(styles.timeLabelLoader)} />
          </>
        ) : (
          <>
            {displayHighlightedText ? (
              <label className={classNames(styles.timeLabel, "mb-2")}>
                {highlightedText}
              </label>
            ) : null}
          </>
        )}

        <label className={classNames(styles.titleLabel)}>{title}</label>
        <label className={classNames(styles.subtitleLabel)}>{subtitle}</label>
        {displaySearch ? (
          <div className={classNames(styles.searchContainer, "px-3 mt-4")}>
            <div className={classNames("w-100 d-flex  align-items-center")}>
              <Icons.Search className={classNames(styles.iconStyle)} />
              <input
                placeholder="Search"
                className={classNames(styles.searchInput, "ms-1")}
                value={search}
                onChange={(e) => setSearch?.(e.target.value)}
              />
            </div>
            {search &&
              (search.length > 0 ? (
                <Icons.Cross onClick={() => setSearch?.("")} role="button" />
              ) : null)}
          </div>
        ) : null}
        {displayBtn ? (
          <CustomButton
            Icon={Icons.Gallery}
            label="Post An Art"
            customBtnContainer={classNames("mt-4 gap-2", styles.btnContainer)}
            onClick={handleAction}
          />
        ) : null}
      </div>
    </div>
  );
};

export default HeaderSection;
