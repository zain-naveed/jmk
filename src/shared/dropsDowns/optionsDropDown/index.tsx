import classNames from "classnames";
import { useEffect } from "react";
import { OptionProps } from "shared/utils/constants";
import styles from "./style.module.scss";

interface OptionsDropDownProps {
  openSelection: boolean;
  setOpenSelection: (val: boolean) => void;
  options: OptionProps[];
  customContainer: any;
  activeTab: string;
  header: boolean;
  setInnerClose: (val: boolean) => void;
}

const OptionsDropDown = ({
  openSelection,
  setOpenSelection,
  options,
  customContainer,
  activeTab,
  header,
  setInnerClose,
}: Partial<OptionsDropDownProps>) => {
  function handleClick(e: any) {
    const elem: any = document.getElementById("optionsDropDownContainer");
    if (elem) {
      if (!elem?.contains(e.target)) {
        if (header) {
          setOpenSelection?.(false);
          setInnerClose?.(true);
        } else {
          setOpenSelection?.(false);
        }
      }
    }
  }

  useEffect(() => {
    document.body.addEventListener(
      "click",
      (event: any) => {
        handleClick(event);
      },
      true
    );

    return () => {
      document.body.removeEventListener(
        "click",
        (event: any) => {
          handleClick(event);
        },
        true
      );
    };

    // eslint-disable-next-line
  }, []);
  return (
    <div
      className={classNames(
        styles.optionsContainer,
        customContainer && customContainer
      )}
      id="optionsDropDownContainer"
      style={openSelection ? { display: "flex" } : { display: "none" }}
    >
      {options?.map((Item, inx) => {
        return (
          <div
            className={classNames(
              "d-flex align-items-center gap-2 py-3 px-3",
              styles.optionContainer,
              inx === options?.length - 1 && styles.btmradius,
              inx === 0 && styles.topradius
            )}
            style={inx === options?.length - 1 ? { borderBottom: "0px" } : {}}
            onClick={Item.action}
            key={inx}
            role="button"
          >
            {Item?.Icon ? (
              <Item.Icon className={classNames(styles.iconStyle)} />
            ) : null}
            <label
              className={classNames(
                styles.labelStyle,
                activeTab === "/" + Item.title.toLowerCase() &&
                  styles.activeOption
              )}
              role="button"
            >
              {Item?.title}
            </label>
          </div>
        );
      })}
    </div>
  );
};

export default OptionsDropDown;
