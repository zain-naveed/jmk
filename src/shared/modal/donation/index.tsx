import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";
import { Modal } from "react-bootstrap";
import styles from "./style.module.scss";
import classNames from "classnames";
import { Icons } from "assets";
import { useRef, useState } from "react";
import { isNumberCheck } from "shared/utils/helper";
import { PaypalClientId } from "shared/utils/endpoints";
import { toastMessage } from "shared/components/toast";
import CommonModal from "../commonModal";
import { modals } from "../commonModal/constants";
import { useSelector } from "react-redux";
import { DonateOnPaypal } from "shared/services/generalService";
import { useNavigate } from "react-router";
import { routeConstant } from "shared/routes/routeConstant";

interface DonationModalProps {
  show: boolean;
  handleClose: () => void;
  otherUser: any;
}

const prices: {
  value: string;
}[] = [
  {
    value: "5",
  },
  {
    value: "10",
  },
  {
    value: "15",
  },
  {
    value: "20",
  },
];

const DonationModal = ({
  show,
  handleClose,
  otherUser,
}: DonationModalProps) => {
  const navigate = useNavigate();
  const {
    user: { user },
  } = useSelector((state: any) => state.root);
  const [showCommonModal, setShowCommonModal] = useState<boolean>(false);
  const [donatePrice, setDonationPrice] = useState<string>("");
  const [comment, setComment] = useState<string>("");
  const commentRef = useRef<string>("");
  const donatePriceRef = useRef<string>("5");
  const inputRef = useRef<any>();
  const [isNumber, setIsNumber] = useState<boolean>(false);
  const handleDonation = (val: string) => {
    setDonationPrice(val);
    donatePriceRef.current = val;
  };
  function myKeyPress(e: any) {
    if (e.code === "Backspace") {
      setIsNumber(true);
    } else {
      setIsNumber(isNumberCheck(e));
      if (!isNumberCheck(e)) {
        inputRef.current.value = "";
        setDonationPrice("");
        donatePriceRef.current = "";
        return;
      }
    }
  }

  const inputHandler = (value: string) => {
    // Remove all non-numeric characters from the input value
    const text = value.replace(/[^0-9]/g, "");

    if (text === "") {
      setDonationPrice("");
      donatePriceRef.current = "";
      inputRef.current.value = "";
      return;
    }

    // Parse the sanitized text as an integer
    const parsedNumber = parseInt(text, 10);

    if (!isNaN(parsedNumber) && parsedNumber > 0 && text.length < 8) {
      setDonationPrice(parsedNumber.toString()); // Convert back to string for display
      donatePriceRef.current = parsedNumber.toString();
    } else {
      // If the parsed number is not valid, set a default value (e.g., "1")
      setDonationPrice("1");
      donatePriceRef.current = "1";
    }
  };

  // creates a paypal order
  const createOrder = (data: any, actions: any) => {
    if (comment.length > 255) {
      toastMessage("error", "Message must not be greater than 255 characters");
    } else {
      return actions.order
        .create({
          purchase_units: [
            {
              amount: {
                value: donatePriceRef.current,
                breakdown: {
                  item_total: {
                    currency_code: "USD",
                    value: donatePriceRef.current,
                  },
                },
              },
              payee: {
                email_address: "sb-kfeea26126569@business.example.com",
              },
              items: [
                {
                  name: "donation-example",
                  quantity: "1",
                  unit_amount: {
                    currency_code: "USD",
                    value: donatePriceRef.current,
                  },
                  category: "DONATION",
                },
              ],
            },
          ],
        })
        .then((orderID: any) => {
          return orderID;
        });
    }
  };

  // check Approval
  const onApprove = (data: any, actions: any) => {
    return actions.order.capture().then(function (details: any) {
      let formdata = new FormData();
      formdata.append("from_user_id", user?.id);
      formdata.append("to_user_id", otherUser?.id);
      formdata.append("amount", donatePriceRef.current);
      formdata.append("transaction_id", details?.id);
      formdata.append("json", details);
      formdata.append("comment", commentRef.current);
      DonateOnPaypal(formdata)
        .then(({ data: { data, status, message } }) => {
          if (status) {
            toastMessage("success", "Donation Sent Successfully!");
            handleClose();
            handleShowCommonModal();
          } else {
            toastMessage("error", message);
          }
        })
        .catch((err) => {
          console.log(err);
          handleClose();
          toastMessage("error", "Something went wrong with donation");
        });
    });
  };

  const handleShowCommonModal = () => {
    setShowCommonModal(true);
  };

  const handleCloseCommonModal = () => {
    navigate(routeConstant.profile.path.replace(":id", otherUser?.id));
    setShowCommonModal(false);
  };

  return (
    <>
      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
        centered
        className={classNames("d-block d-sm-flex justify-content-center")}
        contentClassName={styles.modalContent}
        dialogClassName={classNames(styles.dialogContent)}
        style={{ background: "rgba(255, 255, 255, 0.95)" }}
      >
        <Modal.Body className={classNames(styles.modalContent, "px-4")}>
          <PayPalScriptProvider
            options={{
              "client-id": PaypalClientId,
              components: "buttons",
              currency: "USD",
            }}
          >
            <div
              className={classNames(
                "d-flex align-items-center justify-content-end mt-2"
              )}
            >
              <Icons.Cross
                onClick={handleClose}
                className={classNames(styles.crossIcon)}
                role="button"
              />
            </div>
            <div
              className={classNames(
                "d-flex flex-column align-items-center mt-3"
              )}
            >
              <Icons.Logo className={classNames(styles.logo)} />
              <label className={classNames(styles.headText, "my-4")}>
                Send some amount as gift to your favorite artist & story writers
              </label>
              <div className={classNames("d-flex flex-column w-100")}>
                <label className={classNames(styles.fieldLabel, "pb-2")}>
                  Choose Amount *
                </label>
                <div
                  className={classNames(
                    "d-flex  justify-content-start align-items-center pb-3 w-100 gap-1 gap-sm-2 flex-wrap w-100"
                  )}
                >
                  {prices.map((price, ind) => {
                    return (
                      <Card
                        value={price.value}
                        donatePrice={donatePrice}
                        key={ind}
                        handleActiveCard={handleDonation}
                      />
                    );
                  })}
                </div>

                <label className={classNames(styles.fieldLabel)}>
                  Or Enter Custom Amount *
                </label>
                <div
                  className={classNames(
                    "d-flex align-items-center mb-4 mt-1",
                    styles.inputContainer
                  )}
                >
                  <div className={classNames(styles.dollarIconContainer)}>
                    <Icons.Dollar className={classNames(styles.dollarIcon)} />
                  </div>
                  <input
                    ref={inputRef}
                    // pattern="[\d]{9}"
                    // inputmode="numeric"
                    // type={"number"}
                    value={donatePrice}
                    placeholder="Enter amount"
                    className={classNames(styles.inputStyle)}
                    onKeyDown={(e) => myKeyPress(e)}
                    onChange={(e) => inputHandler(e.target.value)}
                  />
                </div>
                <label className={classNames(styles.fieldLabel)}>
                  Your Message
                </label>
                <textarea
                  className={classNames(styles.textAreaStyle, "mb-4 mt-1")}
                  value={comment}
                  onChange={(e) => {
                    setComment(e.target.value);
                    commentRef.current = e.target.value;
                  }}
                  rows={3}
                />
                <PayPalButtons
                  fundingSource="paypal"
                  style={{
                    layout: "vertical",
                    label: "donate",
                    color: "gold",
                  }}
                  createOrder={createOrder}
                  onApprove={onApprove}
                  onError={(err) => {
                    console.log("ERR", err);
                  }}
                />
              </div>
            </div>
          </PayPalScriptProvider>
        </Modal.Body>
      </Modal>
      <CommonModal
        show={showCommonModal}
        handleClose={handleCloseCommonModal}
        activeModal={modals.success.name}
        amount={Number(donatePriceRef.current)}
        userID={otherUser?.id}
      />
    </>
  );
};

interface CardProps {
  value: string;
  donatePrice: string;
  handleActiveCard: (val: string) => void;
}

const Card = ({ value, donatePrice, handleActiveCard }: CardProps) => {
  return (
    <div
      className={classNames(styles.cardContainer, "px-2 position-relative")}
      style={donatePrice === value ? { borderColor: "#DEAC00" } : {}}
      role={"button"}
      onClick={() => {
        handleActiveCard(value);
      }}
    >
      <div
        className={classNames(
          "d-flex  justify-content-start align-items-center"
        )}
      >
        <label className={classNames(styles.priceLabel)} role={"button"}>
          ${value}
        </label>
      </div>
      {donatePrice === value && (
        <div className={classNames(styles.selectedPlan)}>
          <Icons.TickFill className={styles.tickStyle} />
        </div>
      )}
    </div>
  );
};

export default DonationModal;
