import { createSlice } from '@reduxjs/toolkit';
import { address as marketplaceAddress } from '../../contractsData/Marketplace-address.json';
import { abi as marketplaceAbi } from '../../contractsData/Marketplace.json';
import { address as nftCollectionAddress } from '../../contractsData/NFTCollection-address.json';
import { abi as nftCollectionAbi } from '../../contractsData/NFTCollection.json';

const initialState = {
  expertEvents: [],
  itemEvents: [],
  marketplaceAbi,
  marketplaceAddress,
  nftCollectionAbi,
  nftCollectionAddress
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
