const storiesType = [
  { name: "Poetry", value: 4 },
  { name: "Story", value: 1 },
  { name: "Commentary", value: 5 },
];

interface OptionProps {
  title: string;
  Icon: any;
  action: (e: any) => void;
}

const postTypes: { name: string; value: number }[] = [
  { name: "Poetry", value: 4 },
  { name: "Story", value: 1 },
  { name: "Commentary", value: 5 },
];

const postCategories: { name: string; value: number }[] = [
  { name: "Poetry", value: 4 },
  { name: "Story", value: 1 },
  { name: "Commentary", value: 5 },
];

export { storiesType, postTypes, postCategories };

export type { OptionProps };
