
import './ChartSetup';
import { Pie, Bar, Line } from 'react-chartjs-2';

export const PieChartComponent = ({ data }) => {
    return <Pie data={data} />;
};

export const BarChartComponent = ({ data }) => {
    return <Bar data={data} />;
}
export const DoughnutChartComponent = ({ data }) => {
    return <Line data={data} />;
}