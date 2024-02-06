import React, { useState } from "react";
import { Icons } from "assets";
import styles from "./style.module.scss";
import classNames from "classnames";
import { toastMessage } from "shared/components/toast";

interface TagInputProps {
  tags: string[];
  setTags: React.Dispatch<React.SetStateAction<string[]>>;
  text: string;
}

const TagInput: React.FC<TagInputProps> = ({ tags, setTags, text }) => {
  const [inputValue, setInputValue] = useState("");

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const handleInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" || event.key === ",") {
      event.preventDefault();
      const newTag = inputValue?.trim();
      if (newTag !== "" && !tags?.includes(newTag)) {
        setTags([...tags, newTag]);
        setInputValue("");
      } else if (tags?.includes(newTag)) {
        toastMessage("error", "Already added");
      }
    } else if (event.key === "Backspace" && inputValue === "") {
      setTags(tags?.slice(0, tags.length - 1));
    }
  };

  const handleTagRemove = (tag: string) => {
    const updatedTags = tags?.filter((t) => t !== tag);
    setTags(updatedTags);
  };

  return (
    <div>
      <div className={classNames(styles.tagHeading)}>{text}</div>
      <div className={classNames(styles.tagsComp)}>
        <div style={{ display: "flex" }}>
          {tags?.map((tag) => (
            <div key={tag} className={classNames(styles.tagsInside)}>
              <span className={classNames(styles.tagText)}>{tag}</span>
              <Icons.Cross
                onClick={() => handleTagRemove(tag)}
                style={{ cursor: "pointer" }}
              />
            </div>
          ))}
        </div>
        <input
          className={classNames(styles.inputTags)}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleInputKeyDown}
          placeholder="Enter"
        />
      </div>
    </div>
  );
};

export default TagInput;
