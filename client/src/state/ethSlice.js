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
  factoryAbi
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
    }
  }
});

// Action creators are generated for each case reducer function
export const { init, updateEvents } = formSlice.actions;

export default formSlice.reducer;
