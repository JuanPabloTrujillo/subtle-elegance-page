
import React, { useState } from 'react';
import { 
  Card, 
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from "@/components/ui/card";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';
import { Button } from "@/components/ui/button";
import { 
  Download, 
  Filter, 
  PieChart as PieChartIcon, 
  BarChart2, 
  TrendingUp,
  Wallet,
  DollarSign,
  CreditCard,
  Calendar
} from "lucide-react";
import { Progress } from "@/components/ui/progress";

const financialData = {
  monthlyRevenue: [
    { name: 'Ene', value: 185000 },
    { name: 'Feb', value: 192000 },
    { name: 'Mar', value: 205000 },
    { name: 'Abr', value: 198000 },
    { name: 'May', value: 220000 },
    { name: 'Jun', value: 215000 }
  ],
  monthlyExpenses: [
    { name: 'Ene', value: 125000 },
    { name: 'Feb', value: 128000 },
    { name: 'Mar', value: 130000 },
    { name: 'Abr', value: 127000 },
    { name: 'May', value: 135000 },
    { name: 'Jun', value: 132000 }
  ],
  quarterlyProfit: [
    { name: '1Q', value: 127000 },
    { name: '2Q', value: 145000 }
  ],
  policyTypeRevenue: [
    { name: 'Auto', value: 35 },
    { name: 'Hogar', value: 25 },
    { name: 'Vida', value: 20 },
    { name: 'Salud', value: 20 }
  ],
  kpis: [
    { name: 'Ingresos Mensuales', value: 215000, target: 220000, growth: 8.4 },
    { name: 'Egresos Mensuales', value: 132000, target: 130000, growth: -1.5 },
    { name: 'Beneficio Neto', value: 83000, target: 90000, growth: 12.3 },
    { name: 'Prima Promedio', value: 4200, target: 4500, growth: 5.7 }
  ]
};

const COLORS = ['#059669', '#3B82F6', '#F97316', '#EC4899'];

const FinancialReports = () => {
  const [period, setPeriod] = useState('monthly');

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      maximumFractionDigits: 0
    }).format(value);
  };

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
        <h2 className="text-xl font-semibold text-text-heading flex items-center gap-2">
          <Wallet className="h-5 w-5 text-sage-500" /> 
          Estados Financieros
        </h2>
        <div className="flex items-center gap-2">
          <Tabs defaultValue="monthly" className="w-[300px]">
            <TabsList className="grid grid-cols-3">
              <TabsTrigger value="monthly" onClick={() => setPeriod('monthly')}>Mensual</TabsTrigger>
              <TabsTrigger value="quarterly" onClick={() => setPeriod('quarterly')}>Trimestral</TabsTrigger>
              <TabsTrigger value="yearly" onClick={() => setPeriod('yearly')}>Anual</TabsTrigger>
            </TabsList>
          </Tabs>
          <Button variant="outline" size="sm" className="flex items-center gap-1">
            <Filter className="h-4 w-4" /> Filtrar
          </Button>
          <Button variant="outline" size="sm" className="flex items-center gap-1">
            <Download className="h-4 w-4" /> Exportar
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {financialData.kpis.map((kpi, index) => (
          <Card key={index} className={`shadow-sm hover:shadow-md transition-shadow ${index === 2 ? 'bg-green-50 border-green-100' : ''}`}>
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-2">
                <p className="text-sm text-text-body">{kpi.name}</p>
                {index === 0 ? (
                  <DollarSign className="h-5 w-5 text-blue-500" />
                ) : index === 1 ? (
                  <CreditCard className="h-5 w-5 text-red-500" />
                ) : index === 2 ? (
                  <TrendingUp className="h-5 w-5 text-green-500" />
                ) : (
                  <Calendar className="h-5 w-5 text-purple-500" />
                )}
              </div>
              <div className="mb-1">
                <span className="text-2xl font-bold text-text-heading">{formatCurrency(kpi.value)}</span>
                <span className={`ml-2 text-xs font-medium ${kpi.growth > 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {kpi.growth > 0 ? '+' : ''}{kpi.growth}%
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <div className="flex justify-between text-xs">
                  <span>Objetivo: {formatCurrency(kpi.target)}</span>
                  <span>{Math.round((kpi.value / kpi.target) * 100)}%</span>
                </div>
                <Progress value={(kpi.value / kpi.target) * 100} className="h-1.5" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-sage-500" />
              Ingresos vs Egresos
            </CardTitle>
            <CardDescription>Comparativa mensual de ingresos y egresos</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={financialData.monthlyRevenue.map((item, i) => ({
                  name: item.name,
                  ingresos: item.value,
                  egresos: financialData.monthlyExpenses[i].value
                }))}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis dataKey="name" />
                <YAxis tickFormatter={(value) => `$${value / 1000}k`} />
                <Tooltip formatter={(value) => [formatCurrency(value as number), '']} />
                <Area 
                  type="monotone" 
                  dataKey="ingresos" 
                  stackId="1"
                  stroke="#059669" 
                  fill="#059669" 
                  fillOpacity={0.2} 
                  name="Ingresos"
                />
                <Area 
                  type="monotone" 
                  dataKey="egresos" 
                  stackId="2"
                  stroke="#EF4444" 
                  fill="#EF4444" 
                  fillOpacity={0.1} 
                  name="Egresos"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium flex items-center gap-2">
              <PieChartIcon className="h-5 w-5 text-sage-500" />
              Distribución de Ingresos
            </CardTitle>
            <CardDescription>Ingresos por tipo de póliza</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={financialData.policyTypeRevenue}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  nameKey="name"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {financialData.policyTypeRevenue.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value}%`, '']} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-sm hover:shadow-md transition-shadow">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium flex items-center gap-2">
            <BarChart2 className="h-5 w-5 text-sage-500" />
            Tendencia de Beneficio Neto
          </CardTitle>
          <CardDescription>Beneficio neto por periodo</CardDescription>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={financialData.monthlyRevenue.map((item, i) => ({
                name: item.name,
                beneficio: item.value - financialData.monthlyExpenses[i].value
              }))}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
              <XAxis dataKey="name" />
              <YAxis tickFormatter={(value) => `$${value / 1000}k`} />
              <Tooltip formatter={(value) => [formatCurrency(value as number), 'Beneficio Neto']} />
              <Bar dataKey="beneficio" name="Beneficio Neto" fill="#059669" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default FinancialReports;
