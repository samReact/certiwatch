export function formattedAddress(_address) {
  return (
    _address.substring(0, 5) + '...' + _address.substring(_address.length - 4)
  );
}
