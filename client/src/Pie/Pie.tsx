import React from 'react';
import useEntryStore, { Entry } from '../stores/useUserStore';
import { Line } from '@ant-design/charts';

const Pie = () => {
  const newarr: any[] = [];
  const arr: any[] = [];
  const entries: Entry[] = useEntryStore(state => state.entries);
  
  entries.forEach(each => {
    if (each.address?.city) {
      arr.push({ city: each.address.city });
    }
  });

  const calculateCitiesPercent = () => {
    const cityCounts: { [city: string]: number } = arr.reduce((acc: any, obj: any) => {
      const city = obj.city;
      acc[city] = (acc[city] || 0) + 1;
      return acc;
    }, {});

    const totalCities: number = arr.length;

    const cityPercentages: { [city: string]: number } = {};
    for (const city in cityCounts) {
      const count = cityCounts[city];
      const percentage = (count / totalCities) * 100;
      cityPercentages[city] = percentage;
    }

    newarr.push(cityPercentages);
  };

  calculateCitiesPercent();
  const newData = newarr[0];

  const data: any[] = [];
  for (const city in newData) {
    data.push({ city, value: newData[city] });
  }

  const config = {
    data,
    xField: 'city',
    yField: 'value',
    point: {
      size: 5,
      shape: 'diamond',
    },
  };
  
  return <Line {...config} />;
};

export default Pie;