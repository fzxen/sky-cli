interface CdnSources {
  name: string;
  scope: string;
  alias?: string;
  css: { development: string; production: string };
  js: { development: string; production: string };
}

type CdnConfiguration = Array<CdnSources>;

export default CdnConfiguration;
