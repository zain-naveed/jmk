import classNames from "classnames";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import ArtProfileCard from "shared/components/artProfileCard";
import NoContentCard from "shared/components/noContentCard";
import ArtProfileCardLoader from "shared/loader/artProfileCardLoader";
import { GetAllMyArt, MakeArtPieceDefault } from "shared/services/artsService";
import styles from "./style.module.scss";
import { Icons, Images } from "assets";
import CustomButton from "shared/components/customButton";
import { typesEnum } from "../constants";
import AddArt from "shared/modal/addArt";

interface ArtListProps {
  existingState: any;
  endReach: boolean;
  id: number;
}

const ArtsList = ({ existingState, endReach, id }: ArtListProps) => {
  const {
    user: { user },
  } = useSelector((state: any) => state.root);
  const pageRef = useRef<number>(1);
  const artsRef = useRef<any>([]);
  const [loadMore, setLoadMore] = useState<boolean>(false);
  const [artList, setArtList] = useState<string[]>([]);
  const [initialLoading, setInitialLoading] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [openArt, setOpenArt] = useState<boolean>(false);

  const getArt = () => {
    GetAllMyArt({ id: id, page: pageRef.current })
      .then(({ data: { data, message, status } }) => {
        if (status) {
          if (data.current_page === data.last_page) {
            setLoadMore(false);
          } else {
            setLoadMore(true);
          }
          let cloneArts: any = [...artsRef.current];
          cloneArts = [...cloneArts, ...data?.data];
          artsRef.current = cloneArts;
          setArtList(cloneArts);
        } else {
          console.log("Error", message);
        }
      })
      .catch((err) => {
        console.log("Error", err);
      })
      .finally(() => {
        setLoading(false);
        setInitialLoading(false);
      });
  };

  const handleArtDefault = (artDetail: any) => {
    if (!artDetail?.is_default_view) {
      MakeArtPieceDefault({ art_id: artDetail?.id })
        .then(({ data: { data, message } }) => {
          const updatedArtList = artList.map((item: any) => {
            if (item.id === artDetail?.id) {
              return { ...item, is_default_view: 1 };
            } else if (item.is_default_view === 1) {
              return { ...item, is_default_view: 0 };
            }
            return item;
          });
          setArtList(updatedArtList);
        })
        .catch((err) => {
          console.log("err", err);
        });
    }
  };

  useEffect(() => {
    var elem: any = document.getElementById("user-profile");
    if (endReach && elem.scrollTop !== 0 && !loading && loadMore && !initialLoading) {
      setLoading(true);
      pageRef.current = pageRef.current + 1;
      getArt();
    }
    // eslint-disable-next-line
  }, [endReach]);

  useEffect(() => {
    pageRef.current = 1;
    artsRef.current = [];
    setInitialLoading(true);
    getArt();
    // eslint-disable-next-line
  }, [id]);

  const handleOpenArtModal = () => {
    setOpenArt(true);
  };

  const handleCloseArtModal = () => {
    setOpenArt(false);
  };

  const handleAddArt = (addedArt: any) => {
    const updatedArtList = [...artList, addedArt];
    setArtList(updatedArtList);
    handleCloseArtModal();
  };

  return (
    <div className={classNames("d-flex mt-3 row")}>
      {user?.id === id ? (
        <div className={classNames("position-relative", styles.addArtContainer)}>
          <CustomButton
            label={user?.type === typesEnum.writer ? "New Story" : "New Art"}
            Icon={Icons.Plus}
            isBlackIcon
            customIconStyle={classNames("me-1", styles.plusIcon)}
            customBtnContainer={classNames(styles.plusBtn, "px-3")}
            onClick={() => {
              handleOpenArtModal();
            }}
          />
        </div>
      ) : null}
      {initialLoading ? (
        <>
          <ArtProfileCardLoader />
          <ArtProfileCardLoader />
        </>
      ) : (
        <>
          {artList.length > 0 ? (
            <>
              {artList?.map((art: any, index: number) => (
                <ArtProfileCard key={index} artDetail={art} artList={artList} setArtList={setArtList} existingState={existingState} isSelf={art?.user?.id === user?.id} handleArtDefault={handleArtDefault} />
              ))}
            </>
          ) : (
            <div className={classNames(styles.noContentTopContainer)}>
              <NoContentCard Icon={Images.NoData} label1="No Arts found" label2="Please start writing & uploading arts to see here." />
            </div>
          )}

          {loading ? (
            <>
              <ArtProfileCardLoader />
              <ArtProfileCardLoader />
            </>
          ) : null}

          <AddArt show={openArt} handleClose={handleCloseArtModal} handleOpen={handleOpenArtModal} handleAddArt={handleAddArt} />
        </>
      )}
    </div>
  );
};

export default ArtsList;
