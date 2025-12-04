
import './ChartSetup';
import { Doughnut, Pie, Bar, Line } from 'react-chartjs-2';

export const DoughnutChartComponent = ({ data }) => {
    return <Doughnut data={data} />;
};

export const BarChartComponent = ({ data }) => {
    return <Bar data={data} />;
}
export const LineChartComponent = ({ data }) => {
    return <Line data={data} />;
}

export const PieChartComponent = ({ data }) => {
    return <Pie data={data} />;
}