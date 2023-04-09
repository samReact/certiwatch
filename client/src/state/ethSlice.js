import { createSlice } from '@reduxjs/toolkit';
import { address as marketplaceAddress } from '../contractsData/Marketplace-address.json';
import { abi as marketplaceAbi } from '../contractsData/Marketplace.json';
import { address as nftCollectionAddress } from '../contractsData/NFTCollection-address.json';
import { abi as nftCollectionAbi } from '../contractsData/NFTCollection.json';
import { address as factoryAddress } from '../contractsData/Factory-address.json';
import { abi as factoryAbi } from '../contractsData/Factory.json';

const initialState = {
  expertEvents: [],
  itemEvents: [],
  collectionEvents: [],
  marketplaceAbi,
  marketplaceAddress,
  nftCollectionAbi,
  nftCollectionAddress,
  factoryAddress,
  factoryAbi,
  isOwner: false,
  isExpert: false
};

export const formSlice = createSlice({
  name: 'eth',
  initialState,
  reducers: {
    init: (state, action) => {
      return { ...state, ...action.payload };
    },
    updateEvents: (state, action) => {
      return {
        ...state,
        [action.payload.name]: [
          ...state[action.payload.name],
          ...action.payload.value
        ]
      };
    },
    updateOwner: (state, action) => {
      state.isOwner = action.payload;
    },
    updateExpert: (state, action) => {
      state.isExpert = action.payload;
    }
  }
});

export const { init, updateEvents, updateOwner, updateExpert } =
  formSlice.actions;

export default formSlice.reducer;
