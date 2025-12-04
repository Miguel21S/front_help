import { BarChart, Bar, PieChart, Pie, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from 'recharts';

/* export const MyBarChart = ({ data }) => {
  return (
    // Un contenedor que hace el gráfico sensible al tamaño de la pantalla
    <ResponsiveContainer width="100%" height={300}>
      <BarChart
        data={data}
        margin={{
          top: 5, right: 30, left: 20, bottom: 5,
        }}
      >
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        // El componente Bar para dibujar las barras
        <Bar dataKey="value" fill="#8884d8" />
      </BarChart>
    </ResponsiveContainer>
  );
}; */

// export const MyPieChart = ({ data }) => {
//   return (
//     <ResponsiveContainer width="100%" height={250}>
//       <PieChart>
//         <Pie
//           data={data}
//           dataKey="value"
//           nameKey="name"
//           outerRadius={80}
//           fill="#0e7490"
//           label
//         />
//         <Tooltip />
//         <Legend />
//       </PieChart>
//     </ResponsiveContainer>
//   );
// };