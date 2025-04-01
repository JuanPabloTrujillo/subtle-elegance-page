
import React, { useState } from 'react';
import { 
  Card, 
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter
} from "@/components/ui/card";
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer, 
  Cell
} from 'recharts';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { 
  ChartBar, 
  TrendingUp, 
  Target, 
  Activity,
  UserPlus,
  Users
} from "lucide-react";
import { Progress } from "@/components/ui/progress";

const salesData = {
  monthlySales: [
    { month: 'Ene', sales: 35, target: 40 },
    { month: 'Feb', sales: 42, target: 40 },
    { month: 'Mar', sales: 38, target: 40 },
    { month: 'Abr', sales: 45, target: 40 },
    { month: 'May', sales: 50, target: 40 },
    { month: 'Jun', sales: 48, target: 40 }
  ],
  leadPerformance: [
    { month: 'Ene', generated: 68, converted: 25 },
    { month: 'Feb', generated: 74, converted: 32 },
    { month: 'Mar', generated: 82, converted: 38 },
    { month: 'Abr', generated: 78, converted: 35 },
    { month: 'May', generated: 85, converted: 42 },
    { month: 'Jun', generated: 79, converted: 38 }
  ],
  salesByProduct: [
    { name: 'Auto', value: 40 },
    { name: 'Hogar', value: 25 },
    { name: 'Vida', value: 20 },
    { name: 'Salud', value: 15 }
  ],
  salesPerformance: [
    { name: 'Ana', leads: 45, sales: 22, conversion: 48.9, revenue: 586000 },
    { name: 'Pablo', leads: 38, sales: 19, conversion: 50.0, revenue: 532000 },
    { name: 'Sara', leads: 42, sales: 25, conversion: 59.5, revenue: 628000 },
    { name: 'Carlos', leads: 36, sales: 16, conversion: 44.4, revenue: 490000 }
  ]
};

const COLORS = ['#059669', '#3B82F6', '#F97316', '#EC4899'];

const SalesStatistics = () => {
  const [timePeriod, setTimePeriod] = useState('monthly');

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      maximumFractionDigits: 0
    }).format(value);
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border rounded-md shadow-md">
          <p className="font-medium text-sm">{`${label}`}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {`${entry.name}: ${entry.name === 'Ingresos' ? formatCurrency(entry.value) : entry.value}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
        <h2 className="text-xl font-semibold text-text-heading flex items-center gap-2">
          <ChartBar className="h-5 w-5 text-sage-500" /> 
          Estadísticas de Ventas y Leads
        </h2>
        <Tabs defaultValue="monthly" className="w-[300px]">
          <TabsList className="grid grid-cols-3">
            <TabsTrigger value="monthly" onClick={() => setTimePeriod('monthly')}>Mensual</TabsTrigger>
            <TabsTrigger value="quarterly" onClick={() => setTimePeriod('quarterly')}>Trimestral</TabsTrigger>
            <TabsTrigger value="yearly" onClick={() => setTimePeriod('yearly')}>Anual</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-sage-50 border-sage-100 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-text-body">Ventas Totales</h3>
              <ChartBar className="h-5 w-5 text-sage-500" />
            </div>
            <div className="flex items-baseline gap-2 mb-1">
              <span className="text-2xl font-bold text-text-heading">258</span>
              <span className="text-sm text-green-600">+12.4%</span>
            </div>
            <p className="text-xs text-text-body mb-2">vs. periodo anterior</p>
            <div className="w-full bg-white rounded-full h-1.5">
              <div className="bg-sage-500 h-1.5 rounded-full" style={{ width: '78%' }}></div>
            </div>
            <p className="text-xs text-right mt-1">78% del objetivo</p>
          </CardContent>
        </Card>
        
        <Card className="bg-blue-50 border-blue-100 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-text-body">Leads Generados</h3>
              <UserPlus className="h-5 w-5 text-blue-500" />
            </div>
            <div className="flex items-baseline gap-2 mb-1">
              <span className="text-2xl font-bold text-text-heading">466</span>
              <span className="text-sm text-green-600">+8.2%</span>
            </div>
            <p className="text-xs text-text-body mb-2">vs. periodo anterior</p>
            <div className="w-full bg-white rounded-full h-1.5">
              <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: '85%' }}></div>
            </div>
            <p className="text-xs text-right mt-1">85% del objetivo</p>
          </CardContent>
        </Card>
        
        <Card className="bg-orange-50 border-orange-100 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-text-body">Tasa de Conversión</h3>
              <Target className="h-5 w-5 text-orange-500" />
            </div>
            <div className="flex items-baseline gap-2 mb-1">
              <span className="text-2xl font-bold text-text-heading">42.3%</span>
              <span className="text-sm text-green-600">+3.5%</span>
            </div>
            <p className="text-xs text-text-body mb-2">vs. periodo anterior</p>
            <div className="w-full bg-white rounded-full h-1.5">
              <div className="bg-orange-500 h-1.5 rounded-full" style={{ width: '65%' }}></div>
            </div>
            <p className="text-xs text-right mt-1">65% del objetivo</p>
          </CardContent>
        </Card>
        
        <Card className="bg-purple-50 border-purple-100 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-text-body">Ingresos por Ventas</h3>
              <TrendingUp className="h-5 w-5 text-purple-500" />
            </div>
            <div className="flex items-baseline gap-2 mb-1">
              <span className="text-2xl font-bold text-text-heading">$2.4M</span>
              <span className="text-sm text-green-600">+15.8%</span>
            </div>
            <p className="text-xs text-text-body mb-2">vs. periodo anterior</p>
            <div className="w-full bg-white rounded-full h-1.5">
              <div className="bg-purple-500 h-1.5 rounded-full" style={{ width: '92%' }}></div>
            </div>
            <p className="text-xs text-right mt-1">92% del objetivo</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-sage-500" />
              Evolución de Ventas vs. Objetivos
            </CardTitle>
            <CardDescription>Comparativa de ventas mensuales contra objetivos</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={salesData.monthlySales}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="sales" 
                  name="Ventas" 
                  stroke="#059669" 
                  strokeWidth={2} 
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="target" 
                  name="Objetivo" 
                  stroke="#9CA3AF" 
                  strokeWidth={2} 
                  strokeDasharray="5 5" 
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium flex items-center gap-2">
              <Target className="h-5 w-5 text-sage-500" />
              Leads y Conversiones
            </CardTitle>
            <CardDescription>Generación de leads y tasa de conversión</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={salesData.leadPerformance}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
                <XAxis dataKey="month" />
                <YAxis yAxisId="left" orientation="left" />
                <YAxis 
                  yAxisId="right" 
                  orientation="right" 
                  tickFormatter={(value) => `${(value / salesData.leadPerformance[0].generated * 100).toFixed(0)}%`} 
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar 
                  yAxisId="left" 
                  dataKey="generated" 
                  name="Leads Generados" 
                  fill="#3B82F6" 
                  radius={[4, 4, 0, 0]}
                />
                <Bar 
                  yAxisId="left" 
                  dataKey="converted" 
                  name="Convertidos" 
                  fill="#059669" 
                  radius={[4, 4, 0, 0]}
                />
                <Line 
                  yAxisId="right" 
                  type="monotone" 
                  dataKey={(data) => (data.converted / data.generated) * 100} 
                  name="Tasa de Conversión" 
                  stroke="#EC4899" 
                  strokeWidth={2} 
                  dot={{ r: 4 }}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium flex items-center gap-2">
              <Activity className="h-5 w-5 text-sage-500" />
              Rendimiento de Agentes
            </CardTitle>
            <CardDescription>Desempeño de ventas por agente</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="text-left py-3 px-4 font-medium text-text-body">Agente</th>
                    <th className="text-left py-3 px-4 font-medium text-text-body">Leads</th>
                    <th className="text-left py-3 px-4 font-medium text-text-body">Ventas</th>
                    <th className="text-left py-3 px-4 font-medium text-text-body">Conversión</th>
                    <th className="text-left py-3 px-4 font-medium text-text-body">Ingresos</th>
                  </tr>
                </thead>
                <tbody>
                  {salesData.salesPerformance.map((agent, index) => (
                    <tr 
                      key={agent.name} 
                      className={`border-b border-gray-50 hover:bg-gray-50/50 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'}`}
                    >
                      <td className="py-3 px-4 font-medium">{agent.name}</td>
                      <td className="py-3 px-4">{agent.leads}</td>
                      <td className="py-3 px-4">{agent.sales}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <Progress value={agent.conversion} className="h-1.5 w-24" />
                          <span>{agent.conversion.toFixed(1)}%</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">{formatCurrency(agent.revenue)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium flex items-center gap-2">
              <Users className="h-5 w-5 text-sage-500" />
              Ventas por Producto
            </CardTitle>
            <CardDescription>Distribución de ventas por tipo de producto</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={salesData.salesByProduct}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  nameKey="name"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {salesData.salesByProduct.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value}%`, '']} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SalesStatistics;
