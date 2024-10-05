import React, { useState, useEffect } from 'react';
import { Pie } from 'react-chartjs-2'; // Import the Pie component
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js';
import axios from 'axios';

// Register the required Chart.js components
Chart.register(ArcElement, Tooltip, Legend);

const ChartThree = () => {
  const [fitUsers, setFitUsers] = useState(null);
  const [unfitUsers, setUnfitUsers] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/clients/fit-status');
        const { fit, unfit } = response.data;
        console.log('Fit:', fit, 'Unfit:', unfit);
        setFitUsers(fit);
        setUnfitUsers(unfit);
      } catch (error) {
        console.error('Error fetching fit/unfit data:', error);
      }
    };

    fetchData();
  }, []);

  // Loading state while fetching data
  if (fitUsers === null || unfitUsers === null) {
    return <div>Loading chart...</div>;
  }

  // Prepare the data for Chart.js
  const data = {
    labels: ['Fit Users', 'Unfit Users'],
    datasets: [
      {
        data: [fitUsers, unfitUsers],
        backgroundColor: ['#100C45', '#204534'],
        hoverBackgroundColor: ['#100C45', '#204534'],
      },
    ],
  };

  const options = {
    plugins: {
      legend: {
        display: true,
        position: 'bottom',
        labels: {
          font: {
            family: 'Satoshi, sans-serif',
            size: 12,
            weight: 'bold',
            color: '#000',
          },
        },
      },
    },
    responsive: true,
    maintainAspectRatio: false,
  };

  return (
    <div className="sm:px-6 col-span-12 rounded-sm border border-stroke bg-white px-5 pb-5 pt-7 shadow-lg dark:border-strokedark dark:bg-boxdark xl:col-span-5">
      <h5 className="text-xl font-semibold text-black dark:text-white mb-4">
        Visitors Analytics
      </h5>

      <div className="mb-5">
        <div id="chartThree" className="mx-auto flex justify-center" style={{ height: '400px', width: '400px' }}>
          <Pie data={data} options={options} />
        </div>
      </div>

      <div className="flex flex-wrap justify-center space-x-8 space-y-4 sm:space-y-0">
        {[
          { label: 'Fit Users', color: 'bg-[#100C45]' },
          { label: 'Unfit Users', color: 'bg-[#204534]' },
        ].map((item, index) => (
          <div key={index} className="sm:w-1/2 w-full px-6">
            <div className="flex items-center">
              <span className={`h-4 w-4 rounded-full ${item.color}`}></span>
              <p className="ml-2 text-sm font-medium text-black dark:text-white">
                {item.label}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChartThree;
