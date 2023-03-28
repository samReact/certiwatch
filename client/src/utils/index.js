export function formattedAddress(_address) {
  return (
    _address.substring(0, 5) + '...' + _address.substring(_address.length - 4)
  );
}

export const WATCH_BRANDS = [
  'Rolex',
  'Audemars Piguet',
  'Richard Mille',
  'Patek Phillip',
  'Omega',
  'Tudor',
  'Tag Heuer',
  'Jaeger LeCoultre',
  'Cartier',
  'Hublot',
  'IWS',
  'Other'
];

export const GENDER = ['Men', 'Woman', 'Unisex'];

export const CASE_MATERIAL = [
  'Gold',
  'Stainless Steel',
  'Titanium',
  'Bronze',
  'Ceramic',
  'Other'
];

export const BRACELET_MATERIAL = [
  'Gold',
  'Stainless Steel',
  'Titanium',
  'Bronze',
  'Ceramic',
  'Leather',
  'Rubber',
  'Nylon',
  'Other'
];

export const WATCH_MOVEMENTS = ['Quartz', 'Mechanical', 'Automatic', 'Other'];

export function removeIpfs(url) {
  return url.replace(/^ipfs?:\/\//, '');
}
