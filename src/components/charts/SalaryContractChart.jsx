import React, { useState, useEffect } from 'react';
import { Pie } from '@ant-design/plots';
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { Endpoint } from '../../utils/endpoint';

const SalaryContractChart = ({ darkmode }) => {
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const authToken = localStorage.getItem("jwtToken");
        const fetchData = async () => {
            try {
                setIsLoading(true);
                const response = await fetch(Endpoint()+'/api/Salarie_by_contrat/', {
                    headers: {
                        Authorization: `Bearer ${authToken}`,
                    },
                });
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const result = await response.json();
                const transformedData = result.labels.map((label, index) => ({
                    type: label,
                    value: result.data[index]
                }));
                setData(transformedData);
            } catch (error) {
                console.error('Error fetching data:', error);
                setError('Failed to fetch data. Please try again later.');
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    const config = {
        appendPadding: 10,
        data,
        angleField: 'value',
        colorField: 'type',
        radius: 0.9,
        label: {
            type: 'inner',
            offset: '-30%',
            content: ({ percent }) => `${(percent * 100).toFixed(0)}%`,
            style: {
                fontSize: 14,
                textAlign: 'center',
                fill: darkmode ? '#e5e7eb' : '#333333',
            },
        },
        tooltip: {
            domStyles: {
                'g2-tooltip': {
                    backgroundColor: darkmode ? '#374151' : '#fff',
                    color: darkmode ? '#e5e7eb' : '#333333',
                    boxShadow: darkmode ? '0 2px 8px rgba(0,0,0,0.5)' : '0 2px 8px rgba(0,0,0,0.15)',
                },
            },
        },
        theme: darkmode ? {
            colors10: [
                '#60A5FA', '#34D399', '#F472B6', '#A78BFA', '#FBBF24',
                '#4B5563', '#EC4899', '#818CF8', '#6EE7B7', '#F87171'
            ],
            backgroundColor: '#1F2937',
            subColor: '#9CA3AF',
            semanticRed: '#EF4444',
            semanticGreen: '#10B981',
        } : undefined,
        legend: {
            position: 'bottom',
            itemName: {
                style: {
                    fill: darkmode ? '#e5e7eb' : '#333333',
                },
            },
        },
        interactions: [
            {
                type: 'element-active',
            },
        ],
    };

    if (isLoading) return (
        <div className={`w-96 h-96 ${darkmode ? 'bg-green-800' : 'bg-white'} flex items-center justify-center
            border ${darkmode ? 'border-green-700' : 'border-green-200'} rounded-lg`}>
            <Spin indicator={
                <LoadingOutlined style={{ fontSize: 24, color: darkmode ? '#60A5FA' : '#1890ff' }} spin />
            } />
        </div>
    );

    if (error) return (
        <div className={`w-96 h-96 ${darkmode ? 'bg-green-500 text-red-400' : 'bg-white text-red-600'} 
            flex items-center justify-center p-4 text-center
            border ${darkmode ? 'border-green-500' : 'border-green-200'} rounded-lg`}>
            {error}
        </div>
    );

    return (
        <div className={`w-96 h-96 transition-colors duration-200 rounded-lg shadow-sm
            ${darkmode ? 'bg-green-800' : 'bg-white'}
            border ${darkmode ? 'border-green-500' : 'border-green-200'}
            pt-5 pb-10`}
        >
            <h2 className={`font-medium text-center mb-4 transition-colors duration-200
                ${darkmode ? 'text-white' : 'text-green-500'}`}>
                Contrats salarié
            </h2>
            <div className='w-full h-80'>
                <Pie {...config} />
            </div>
        </div>
    );
};

export default SalaryContractChart;