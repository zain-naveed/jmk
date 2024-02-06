import { Icons, Images } from "assets";
import classNames from "classnames";
import { useEffect, useRef, useState } from "react";
import { Spinner } from "react-bootstrap";
import { useParams } from "react-router";
import ContributerCardLoader from "shared/loader/contributerUserCardLoader";
import { GetArtContributersList } from "shared/services/artsService";
import ContributerCard from "../contributerCard";
import NoContentCard from "../noContentCard";
import styles from "./style.module.scss";
import useWindowDimensions from "shared/hooks/useWindowDimentions";
import $ from "jquery";

const ContibutersList = () => {
  const { id } = useParams();
  const { width } = useWindowDimensions();
  const pageRef = useRef<number>(1);
  const contributersListRef = useRef<[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [initialloading, setInitialLoading] = useState<boolean>(false);
  const [contributersList, setContributersList] = useState<[]>([]);
  const [moreLoad, setMoreLoad] = useState<boolean>(false);
  const [isOverflowing, setIsOverflowing] = useState<boolean>(true);

  const scrollRight = () => {
    let elem: any = document.getElementById("contributerSubContainer");
    let width: any = document.getElementById(
      "contributerSubContainer"
    )?.clientWidth;
    elem.scrollLeft = elem?.scrollLeft + width;
    var eleme = document.getElementById("contributerSubContainer");
    var newScrollLeft: any = eleme?.scrollLeft;
    var widthh: any = eleme?.offsetWidth;
    var scrollWidth: any = eleme?.scrollWidth;
    if (Math.trunc(widthh + newScrollLeft) === scrollWidth) {
      if (moreLoad) {
        pageRef.current = pageRef.current + 1;
        setLoading(true);
        getContributersList();
      }
    }
  };
  const scrollLeft = () => {
    let elem: any = document.getElementById("contributerSubContainer");
    let width: any = document.getElementById(
      "contributerSubContainer"
    )?.clientWidth;
    elem.scrollLeft = elem.scrollLeft - width;
  };

  const getContributersList = () => {
    GetArtContributersList({ id: id, page: pageRef.current, pagination: 9 })
      .then(
        ({
          data: {
            data: { data, last_page },
            status,
            message,
          },
        }) => {
          if (status) {
            if (pageRef.current === last_page) {
              setMoreLoad(false);
            }
            let cloneContributers: any = [...contributersListRef.current];
            cloneContributers = [...cloneContributers, ...data];
            contributersListRef.current = cloneContributers;
            setContributersList(cloneContributers);
          } else {
            console.log("Error", message);
          }
        }
      )
      .catch((err) => {
        console.log("Error", err);
      })
      .finally(() => {
        setLoading(false);
        setInitialLoading(false);
      });
  };

  useEffect(() => {
    if (!loading) {
      let elem: any = document.getElementById("contributerSubContainer");
      let width: any = document.getElementById(
        "contributerSubContainer"
      )?.clientWidth;
      elem.scrollLeft = elem?.scrollLeft + width;
    }
  }, [loading]);

  useEffect(() => {
    if (
      $("#contributerSubContainer")[0].scrollWidth >
      Math.ceil($("#contributerSubContainer").innerWidth())
    ) {
      setIsOverflowing(true);
    }
  }, [width]);

  useEffect(() => {
    setInitialLoading(true);
    getContributersList();
    // eslint-disable-next-line
  }, []);

  return (
    <div
      className={classNames(
        "w-100 d-flex align-items-center  py-5",
        styles.btmBorder
      )}
    >
      {!initialloading && isOverflowing && contributersList?.length > 0 ? (
        <Icons.ArrowCircleLeft
          onClick={scrollLeft}
          className={classNames(styles.iconStyle)}
          role={!initialloading ? "button" : "none"}
        />
      ) : null}

      <div
        className={classNames("d-flex w-100", styles.contributerSubContainer)}
        id="contributerSubContainer"
      >
        {initialloading ? (
          <>
            <ContributerCardLoader />
            <ContributerCardLoader />
            <ContributerCardLoader />
          </>
        ) : contributersList?.length > 0 ? (
          <>
            {contributersList?.map((item: any, inx: number) => {
              return <ContributerCard key={inx} item={item} />;
            })}
          </>
        ) : (
          <div
            className={classNames(
              "d-flex align-items-center justify-content-center w-100"
            )}
          >
            <NoContentCard
              Icon={Images.NoData}
              label2="Oops! Nothing here yet."
              customContainer={classNames(
                "gap-0 d-flex flex-column align-items-center"
              )}
              customIconContianer={classNames(styles.noContentIcon)}
              customLabel2Style={classNames(styles.noContentLabel)}
            />
          </div>
        )}
      </div>
      {!initialloading && isOverflowing && contributersList?.length > 0 ? (
        <>
          {loading ? (
            <div className={classNames(styles.loaderContainer)}>
              <Spinner animation="border" size="sm" />
            </div>
          ) : (
            <Icons.ArrowCircleRight
              onClick={() => {
                if (!initialloading && !loading) {
                  scrollRight();
                }
              }}
              className={classNames(styles.iconStyle)}
              role={!initialloading && !loading && moreLoad ? "button" : "none"}
            />
          )}
        </>
      ) : null}
    </div>
  );
};

export default ContibutersList;
