export interface ISidebarItem {
  parent: {
    text: string;
    to: string;
    Icon: React.ReactElement<any, any>;
    prefix: string;
  };
  children?: {
    text: string;
    to: string;
  }[];
}
