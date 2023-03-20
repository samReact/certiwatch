import { Button, Grid, Stack, Typography } from '@mui/material';
import Grid2 from '@mui/material/Unstable_Grid2/Grid2';
import { Box, Container } from '@mui/system';
import React from 'react';
import { useContractRead, useContractWrite } from 'wagmi';
import abi from '../abi/SimpleStorage.json';

export default function HomePage() {
  // const contractAddress = '0x5FbDB2315678afecb367f032d93F642f64180aa3';

  // const { data, isLoading, isSuccess, write } = useContractWrite({
  //   mode: 'recklesslyUnprepared',
  //   address: contractAddress,
  //   abi: abi,
  //   functionName: 'setNumber',
  //   args: [10]
  // });

  // const result = useContractRead({
  //   address: contractAddress,
  //   abi: abi,
  //   functionName: 'getNumber',
  //   watch: true
  // });
  return (
    // <div>
    //   {parseInt(result.data)}
    //   <button onClick={() => write()}>Feed</button>
    // </div>
    <>
      <Box
        sx={{ height: '50vh', backgroundColor: 'red', position: 'relative' }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: '70%',
            left: 0,
            right: 0,
            marginLeft: 'auto',
            marginRight: 'auto',
            width: '30vw'
          }}
        >
          <Stack direction={'row'} justifyContent="space-between">
            <Button variant="contained" size="small">
              Je suis acheteur
            </Button>
            <Button variant="contained" size="small">
              Je suis vendeur
            </Button>
          </Stack>
        </Box>
        <img
          src="https://placehold.co/600x400"
          alt=""
          style={{ objectFit: 'cover', width: '100%', height: '100%' }}
        />
      </Box>
      <Box component={'section'}>
        <Container sx={{ paddingTop: 5, paddingBottom: 5 }}>
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <img src="https://placehold.co/500x300" alt="" width={'100%'} />
            </Grid>
            <Grid item xs={12} md={6}>
              <Stack>
                <Typography variant="h6">
                  A Certified Watch portfolio
                </Typography>
                <Typography>
                  Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut
                  odit aut fugit, sed quia consequuntur magni dolores eos qui
                  ratione voluptatem sequi nesciunt. Neque porro quisquam est,
                  qui dolorem.
                </Typography>
              </Stack>
            </Grid>
          </Grid>
        </Container>
      </Box>
      <Box component={'section'} sx={{ backgroundColor: '#F5F5F5' }}>
        <Container sx={{ paddingTop: 5, paddingBottom: 5 }}>
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Stack>
                <Typography variant="h6">
                  BLOCKCHAIN ENABLED PLATFORM
                </Typography>
                <Typography>
                  Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut
                  odit aut fugit, sed quia consequuntur magni dolores eos qui
                  ratione voluptatem sequi nesciunt. Neque porro quisquam est,
                  qui dolorem.
                </Typography>
              </Stack>
            </Grid>
            <Grid item xs={12} md={6}>
              <img src="https://placehold.co/500x300" alt="" width={'100%'} />
            </Grid>
          </Grid>
        </Container>
      </Box>
      <Box component={'section'} height={300}>
        <Container sx={{ paddingTop: 5, paddingBottom: 5 }}>
          <Stack spacing={4} alignItems="center">
            <Typography variant="h4">BUY AND SELL SAFELY</Typography>
            <Typography variant="body1">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore
            </Typography>
          </Stack>
        </Container>
      </Box>
    </>
  );
}
