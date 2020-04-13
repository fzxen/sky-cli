import { ExternalsElement } from 'webpack';

interface HtmlCdn {
  css: string;
  js: string;
}
type Externals = ExternalsElement | ExternalsElement[];
type HtmlCdns = Array<HtmlCdn>;

export default HtmlCdns;
