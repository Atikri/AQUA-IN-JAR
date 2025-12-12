import React, { useMemo } from 'react';
import { ResponsiveSankey } from '@nivo/sankey';
import { formatCurrency } from '../lib/db';

const SankeyDiagram = ({ transactions }) => {
    const data = useMemo(() => {
        // 1. Calculate Total Income
        const income = transactions
            .filter(t => t.type !== 'expense')
            .reduce((sum, t) => sum + t.amount, 0);

        // 2. Group Expenses by Category
        const expensesByCategory = transactions
            .filter(t => t.type === 'expense')
            .reduce((acc, t) => {
                const cat = t.category || "General";
                acc[cat] = (acc[cat] || 0) + t.amount;
                return acc;
            }, {});

        // 3. Construct Nodes & Links
        const nodes = [
            { id: "Income", nodeColor: "#4ade80" },
            { id: "Budget", nodeColor: "#818cf8" }
        ];

        const links = [];

        // Link Income -> Budget (or just assume a monthly budget pool if income isn't tracked strictly)
        if (income > 0) {
            links.push({ source: "Income", target: "Budget", value: income });
        }

        Object.entries(expensesByCategory).forEach(([cat, amount]) => {
            nodes.push({ id: cat, nodeColor: "#f87171" });
            links.push({ source: "Budget", target: cat, value: amount });
        });

        return { nodes, links };
    }, [transactions]);

    if (data.links.length === 0) return (
        <div className="h-64 flex items-center justify-center text-gray-400 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
            Not enough data for flow chart
        </div>
    );

    return (
        <div className="h-[400px] w-full bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Cash Flow</h3>
            <ResponsiveSankey
                data={data}
                margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
                align="justify"
                colors={node => node.nodeColor || node.color}
                nodeOpacity={1}
                nodeHoverOthersOpacity={0.35}
                nodeThickness={18}
                nodeSpacing={24}
                nodeBorderWidth={0}
                linkContract={3}
                enableLinkGradient={true}
                labelPosition="outside"
                labelOrientation="horizontal"
                labelPadding={16}
                labelTextColor={{ from: 'color', modifiers: [['darker', 1]] }}
                tooltip={({ node, value }) => (
                    <div className="bg-white px-3 py-2 shadow-lg border border-gray-100 rounded text-xs font-bold">
                        {node ? `${node.id}: ${formatCurrency(node.value)}` : `${formatCurrency(value)}`}
                    </div>
                )}
            />
        </div>
    );
};

export default SankeyDiagram;
