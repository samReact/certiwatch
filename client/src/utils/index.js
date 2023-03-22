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
  'Autre'
];
