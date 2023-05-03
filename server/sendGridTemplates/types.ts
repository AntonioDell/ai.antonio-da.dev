type DynamicTemplateData = { [key: string]: any } & {
  unsubscribeLink: string;
};

interface Personalization {
  to: string;
  dynamicTemplateData: DynamicTemplateData;
}

export type { Personalization };
