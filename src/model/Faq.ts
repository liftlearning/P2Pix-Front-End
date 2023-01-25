export type Faq = Section[];

export type Section = {
  name: string;
  items: Question[];
};

export type Question = {
  title: string;
  content: string;
  isOpen?: boolean;
};
