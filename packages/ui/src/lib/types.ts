import { SocialFooterProps } from "../components/socials";

export type Prettify<T> = {
	[K in keyof T]: T[K];
} & {};

type socials = Pick<SocialFooterProps, "config">;

type SiteConfigKey = Pick<SocialFooterProps, "config">[keyof socials];

export type SiteConfig = Record<keyof SiteConfigKey | ({} & string), string>;
