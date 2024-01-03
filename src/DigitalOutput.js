import React from 'react';
import { Box, Button, Alert } from '@mui/material';

const DigitalOutPut = ({ digitalOutput, toggle }) => {
  return (
    <>
    
    
   
    <Box
      display="flex"
      flexDirection="column"
      alignItems="normal"
      justifyContent="flex-start"
      textAlign="center"
      alignSelf="center"
      padding="5px"
      boxShadow="0px 0px 10px 0px grey"
      borderRadius={10}
    >
      

      {digitalOutput.length > 0 ? (
        digitalOutput.map((relayItem, index) => (
          <Button
            color={relayItem === 0 ? 'success' : 'error'}
            style={{ color: 'white', marginBottom: 10 , padding: "10px", margin: "10px" }}
            variant="contained"
            onClick={() => toggle(index + 1, relayItem)}
            size="large"
            key={index}
          >
            {`${index + 1} switch `}
          </Button>
        ))
      ) : (
        <Alert variant="filled" severity="warning">
          Device is not connected!!!
        </Alert>
      )}
    </Box>
    </>
  );
};

export default DigitalOutPut;
