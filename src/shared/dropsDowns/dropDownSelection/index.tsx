import React, { useState } from "react";
import { Dropdown } from "react-bootstrap";
import styles from "./style.module.scss";
import classNames from "classnames";
import { Icons } from "assets";
import { useSelector } from "react-redux";

interface MyDropdownProps {
  tags: string[];
  setTags: React.Dispatch<React.SetStateAction<string[]>>;
  text: string;
}

const MyDropdown: React.FC<MyDropdownProps> = ({ tags, setTags, text }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { genre } = useSelector((state: any) => state.root);
  const options = genre?.genres?.map((genre: any) => genre.title);
  const [selections, setSelections] = useState<string[]>(options);

  const handleDropdownToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleTagRemove = (tag: string) => {
    const updatedTags = tags.filter((t: string) => t !== tag);
    setTags(updatedTags);

    setSelections([tag, ...selections]);
  };

  const handleSelection = (item: string) => {
    setTags([...tags, item]);
    let temp = [...selections];
    const index = selections.findIndex((t: string) => t === item);
    if (index > -1) {
      temp.splice(index, 1);
    }
    setSelections(temp);
  };

  return (
    <Dropdown show={isOpen} onToggle={handleDropdownToggle} role="button">
      <span className={styles.labelText}>{text}</span>
      <div onClick={handleDropdownToggle}>
        <div className={classNames(styles.selectionArea, "d-flex")}>
          {tags?.length
            ? tags.map((tag: string) => (
                <div key={tag} className={classNames(styles.tagsInside)}>
                  <span className={classNames(styles.tagText)}>{tag}</span>
                  <Icons.Cross
                    onClick={() => handleTagRemove(tag)}
                    style={{ cursor: "pointer" }}
                  />
                </div>
              ))
            : ""}
          <div className={styles.chevDownContainer}>
            <Icons.ChevDown />
          </div>
        </div>
      </div>
      <Dropdown.Menu className={styles.dropDownList}>
        {selections?.map((select: string, index: number) => (
          <Dropdown.Item
            key={index}
            onClick={() => handleSelection(select)}
            className={styles.dropDownItem}
          >
            {select}
          </Dropdown.Item>
        ))}
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default MyDropdown;
