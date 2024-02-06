import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "./style.scss";
import classNames from "classnames";
import { useEffect, useState } from "react";

interface RichTextProps {
  error: string;
  value: string;
  placeholder: string;
  onChange: any;
}

const CustomRichTextEditor = ({ error, value, onChange, placeholder }: Partial<RichTextProps>) => {
  const [wordsCount, setWordsCount] = useState<number>(0);
  const modules = {
    toolbar: [["bold", "italic", "link", { list: "ordered" }, { list: "bullet" }]],
  };
  useEffect(() => {
    if (value) {
      var cont = value.replace(/<[^>]*>/g, " ");
      cont = cont.replace(/\s+/g, " ");
      cont = cont.trim();
      if (cont === "") {
        setWordsCount(0);
      } else {
        setWordsCount(cont.split(" ").length);
      }
    }
  }, [value]);
  return (
    <div className={classNames("mb-3 position-relative")}>
      <ReactQuill theme="snow" modules={modules} value={value} onChange={onChange} placeholder={placeholder} />
      {!!error ? (
        <div className={classNames("error")}>{error}</div>
      ) : (
        <div className={classNames("word-label")}>
          {wordsCount} word{wordsCount > 1 || wordsCount === 0 ? "s" : ""} added.
        </div>
      )}
    </div>
  );
};

export default CustomRichTextEditor;
