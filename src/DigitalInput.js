import React from 'react';
import { Box, Typography } from '@mui/material';

const DigitalComponent = ({ values, type }) => {
  return (
    <Box
      display="flex"
      flexDirection="row"
      alignItems="center"
      justifyContent="center"
      width="100%"
      textAlign="center"
      boxShadow="0px 0px 10px 0px grey"
      borderRadius={10}
    >
      {values.length > 0 ? (
        values.map((item, index) => (
          <Box
            key={index}
            bgcolor={item === 0 ? 'green' : 'red'}
            color="white"
            padding={2}
            margin={1}
            width={100}
            borderRadius={4}
          >
            {`${index + 1}: ${item === 0 ? 'OFF' : 'ON'}`}
          </Box>
        ))
      ) : (
        <Box>
          <Typography variant="body1" color="warning" fontWeight="bold">
            Device is not connected!!!
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default DigitalComponent;
