import React from 'react';
import { BarChart, XAxis, YAxis, Tooltip, Legend, Bar, Cell, CartesianGrid } from 'recharts';
import { CircularProgress, Grid, Typography } from '@mui/material';

const AnalogInput = ({ analogInput, setAnalogInput }) => {
  const getBarColor = (entry) => {
    if (entry >= 18 && entry < 26) {
      return '#42b686';
    } else if (entry > 0.5 && entry < 6) {
      return 'red';
    } else {
      return 'blue';
    }
  };

  return (
    <>
     <Typography variant="h5" sx={{marginLeft:"50px"}} gutterBottom>
          Analog Input
        </Typography>
 
      {analogInput?.length > 0 ? (
        <BarChart width={900} height={500} data={analogInput.map((value, index) => ({ index: index + 1, value }))}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="index" />
          <YAxis tickFormatter={(value) => `${value}`} ticks={[1, 5, 10, 15, 20, 25, 30]}/>
          <Tooltip />
          <Legend />
          <Bar dataKey="value" fill="#8884d8">
            {analogInput.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={getBarColor(entry)} />
            ))}
          </Bar>
        </BarChart>
      ) : (
        <CircularProgress color="primary" />
      )}

    </>
  );
};

export default AnalogInput;
