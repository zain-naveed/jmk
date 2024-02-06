import { Icons } from "assets";
import classNames from "classnames";
import { useEffect, useRef, useState } from "react";
import styles from "./style.module.scss";

interface YearPickerProps {
  openSelection: boolean;
  setOpenSelection: (val: boolean) => void;
  setActiveDate: (val: any) => void;
}
let PageSize = 12;
const YearPicker = ({
  openSelection,
  setOpenSelection,
  setActiveDate,
}: Partial<YearPickerProps>) => {
  const [years, setYears] = useState<any[]>([]);
  const [totalYears, setTotalYears] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const firstTimeRef = useRef<number>(1);
  function handleClick(e: any) {
    const elem: any = document.getElementById("YearPicker");
    if (elem) {
      if (!elem?.contains(e.target)) {
        setOpenSelection?.(false);
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

  const yearsCalculator = () => {
    let tempYears: any = [];
    let startyear = new Date().getFullYear();
    for (let index = startyear; index > 1900; index--) {
      tempYears.push(index);
    }
    setTotalYears(tempYears);
    const firstPageIndex = (currentPage - 1) * PageSize;
    const lastPageIndex = firstPageIndex + PageSize;

    setYears(tempYears.slice(firstPageIndex, lastPageIndex));
    firstTimeRef.current = 2;
  };

  useEffect(() => {
    yearsCalculator();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (firstTimeRef.current === 2 && years.length > 0) {
      const firstPageIndex = (currentPage - 1) * PageSize;
      const lastPageIndex = firstPageIndex + PageSize;

      setYears(totalYears.slice(firstPageIndex, lastPageIndex));
    }
    // eslint-disable-next-line
  }, [currentPage]);

  return (
    <div
      className={classNames(styles.optionsContainer, "p-3")}
      id="YearPicker"
      style={openSelection ? { display: "flex" } : { display: "none" }}
      onClick={(e) => e.stopPropagation()}
    >
      <div
        className={classNames(
          "d-flex align-items-center justify-content-between px-2 w-100"
        )}
      >
        <label className={classNames(styles.title)}>Choose Year</label>
        <div
          className={classNames(
            "d-flex align-items-center justify-content-center gap-3"
          )}
        >
          <Icons.Left
            role="button"
            onClick={(e) => {
              e.stopPropagation();
              if (currentPage > 1) {
                setCurrentPage(currentPage - 1);
              }
            }}
          />
          <Icons.Right
            role="button"
            onClick={(e) => {
              e.stopPropagation();
              if (currentPage < totalYears.length / PageSize)
                setCurrentPage(currentPage + 1);
            }}
          />
        </div>
      </div>

      <div
        className={classNames(
          "d-flex align-items-start justify-content-between",
          styles.yearContainer
        )}
      >
        {years?.map((item, inx) => {
          return (
            <label
              className={classNames(styles.labelStyle, "m-2")}
              role="button"
              key={inx}
              onClick={() => {
                setActiveDate?.({ name: item, value: `${item}-01-01` });
                setOpenSelection?.(false);
              }}
            >
              {item}
            </label>
          );
        })}
      </div>
    </div>
  );
};

export default YearPicker;
