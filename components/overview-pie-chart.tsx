"use client";
import { ResponsiveContainer, Tooltip, PieChart, Cell, Pie } from "recharts";

interface OverviewPieChartProps {
    data: {
        name: string;
        value: number;
    }[];
}

const PURPLE_COLORS = [
    "#8a2be2", // Blue Violet
    "#9932cc", // Dark Orchid
    "#a020f0", // Purple
    "#9370db", // Medium Purple
    "#ba55d3", // Medium Orchid
    "#8b008b", // Dark Magenta
    "#9400d3", // Dark Violet
    "#4b0082", // Indigo
    "#6a5acd", // Slate Blue
    "#7b68ee", // Medium Slate Blue
];

export const OverviewPieChart = ({ data }: OverviewPieChartProps) => {
    const filteredData = data.filter(item => item.value > 0);

    return (
        <ResponsiveContainer width="100%" height={350}>
            <PieChart>
                <Pie
                    data={filteredData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    stroke="none"
                    label={({ name, value }) => `${name}: ${value}`}
                >
                    {filteredData.map((_, index) => (
                        <Cell
                            key={`cell-${index}`}
                            fill={PURPLE_COLORS[index % PURPLE_COLORS.length]}
                            stroke={PURPLE_COLORS[index % PURPLE_COLORS.length]}
                        />
                    ))}
                </Pie>
                <Tooltip
                    contentStyle={{
                        backgroundColor: '#fff',
                        border: '1px solid #ddd',
                        borderRadius: '4px',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                    }}
                />
            </PieChart>
        </ResponsiveContainer>
    );
};
