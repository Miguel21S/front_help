import { Chart as ChartJS, ArcElement, PointElement, LineElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title, } from "chart.js";

ChartJS.register(ArcElement, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend);