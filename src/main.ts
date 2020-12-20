import { matchUri, Uri, Url, Urn } from './uri';
import { matchIpAddress, IpAddress } from './ip-address';

export interface Matched {
  type: string;
  label: string;
  matched: string;
}

export { matchUri, Uri, Url, Urn };
export { matchIpAddress, IpAddress };
