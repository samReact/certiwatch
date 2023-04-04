import { ethers } from 'ethers';

export function formattedAddress(_address) {
  return (
    _address.substring(0, 5) + '...' + _address.substring(_address.length - 4)
  );
}

export function fromWei(value) {
  return ethers.utils.formatEther(value);
}

export function toWei(value) {
  return ethers.utils.parseUnits(value.toString(), 'ether');
}

export function removeIpfs(url) {
  return url.replace(/^ipfs?:\/\//, '');
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
