import React, { useState } from 'react';
import { View } from 'react-native';
import { BarChart } from 'react-native-chart-kit';

const chartConfig = {
  backgroundColor: 'white',
  backgroundGradientFrom: 'white',
  backgroundGradientTo: 'white',
  decimalPlaces: 2,
  color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  barPercentage: 0.5,
};

// Define your chart component
const ChartComponent = (props: any) => {
    
const [successRecStatus, setSuccessRecStatus] = useState<number>(0);
const [wrongRecStatus , setWrongRecStatus ] = useState<number>(0);
// Define your chart data and options
const chartData = {
    labels: [`WRONG ${Math.round((wrongRecStatus / (wrongRecStatus + successRecStatus)) * 100)}%`, `GOOD ${Math.round(100 - (wrongRecStatus / (wrongRecStatus + successRecStatus)) * 100)}%`],
    datasets: [
      {
        data: [wrongRecStatus / PAGE_SIZE * 100, successRecStatus / PAGE_SIZE * 100],
        colors: [
          (opacity = 1) => `rgba(255, 99, 132, ${opacity})`,
          (opacity = 1) => `rgba(75, 192, 192, ${opacity})`,
        ],
        strokeWidth: 2, // optional
      },
    ],
  };
  return (
    <View>
      <BarChart
        data={chartData}
        width={400}
        height={220}
        chartConfig={chartConfig}
      />
    </View>
  );
};

export default ChartComponent;
