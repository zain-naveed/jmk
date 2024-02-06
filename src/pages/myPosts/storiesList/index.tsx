import { useRef, useState } from "react";
import CustomTab from "shared/components/customTabs";
import { horizontalTabs, horizontalTabsEnums } from "./contants";
import PersonalStories from "./personal";
import PublicStories from "./public";

interface ListProps {
  endReach: boolean;
}

const StoriesList = ({ endReach }: ListProps) => {
  const TabsDiv = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState<string>(horizontalTabs[0]);
  const handleActiveTab = (val: string) => {
    if (TabsDiv.current) {
      TabsDiv.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
        inline: "center",
      });
    }
    setActiveTab(val);
  };
  return (
    <div ref={TabsDiv}>
      <CustomTab
        tabs={horizontalTabs}
        activeTab={activeTab}
        handleActiveTab={handleActiveTab}
      />
      {horizontalTabsEnums.stories === activeTab ? (
        <PublicStories endReach={endReach} />
      ) : (
        horizontalTabsEnums.personal === activeTab && (
          <>
            <PersonalStories endReach={endReach} />
          </>
        )
      )}
    </div>
  );
};

export default StoriesList;
