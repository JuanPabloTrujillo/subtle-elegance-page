
import React from 'react';
import { 
  Card, 
  CardContent
} from "@/components/ui/card";
import { 
  ChartContainer, 
  ChartTooltip, 
  ChartTooltipContent 
} from "@/components/ui/chart";
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  ResponsiveContainer
} from 'recharts';
import { 
  ChartBar, 
  Wallet, 
  FileCheck,
  Home,
  TrendingUp,
  PieChart as PieChartIcon,
  FileText
} from "lucide-react";
import insuranceData from '../data/insurance-data.json';

const DashboardOverview = ({ setActiveTab }: { setActiveTab: (tab: string) => void }) => {
  // Format amount as currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      maximumFractionDigits: 0
    }).format(value);
  };

  // Chart configuration options
  const chartConfig = {
    sales: { label: "Ventas", color: "#3B82F6" },
    revenue: { label: "Ingresos", color: "#059669" },
    expenses: { label: "Egresos", color: "#EF4444" },
    profit: { label: "Beneficio", color: "#8B5CF6" },
    auto: { label: "Auto", color: "#059669" },
    hogar: { label: "Hogar", color: "#3B82F6" },
    vida: { label: "Vida", color: "#F97316" },
    salud: { label: "Salud", color: "#EC4899" }
  };

  // Create simplified data for overview charts
  const revenueData = insuranceData.monthlyRevenue.slice(0, 4);
  const policyTypesData = insuranceData.policyTypes.map(type => ({
    name: type.name,
    value: type.count
  }));
  const claimsData = insuranceData.claimsData.slice(0, 4).map(item => ({
    name: item.month,
    aprobados: item.approved,
    rechazados: item.rejected
  }));

  // COLORS for the pie chart
  const COLORS = ['#059669', '#3B82F6', '#F97316', '#EC4899'];

  return (
    <div className="animate-fade-in">
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-lg font-semibold text-text-heading mb-4 flex items-center gap-2">
          <Home className="h-5 w-5 text-sage-500" />
          Resumen General
        </h2>
        <p className="text-text-body mb-6">
          Bienvenido al panel de control principal. Utiliza la navegación superior para acceder a información detallada sobre ventas, finanzas y pólizas.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Same module navigation cards */}
          <Card onClick={() => setActiveTab('sales')} className="p-4 cursor-pointer hover:shadow-card-hover transition-shadow border-sage-100">
            <div className="flex flex-col items-center text-center gap-2">
              <div className="p-3 rounded-full bg-sage-50">
                <ChartBar className="h-8 w-8 text-sage-500" />
              </div>
              <h3 className="font-medium text-text-heading">Ventas y Leads</h3>
              <p className="text-sm text-text-body">Métricas de ventas y leads</p>
            </div>
          </Card>
          
          <Card onClick={() => setActiveTab('finances')} className="p-4 cursor-pointer hover:shadow-card-hover transition-shadow border-sage-100">
            <div className="flex flex-col items-center text-center gap-2">
              <div className="p-3 rounded-full bg-sage-50">
                <Wallet className="h-8 w-8 text-sage-500" />
              </div>
              <h3 className="font-medium text-text-heading">Estados Financieros</h3>
              <p className="text-sm text-text-body">Reportes financieros</p>
            </div>
          </Card>
          
          <Card onClick={() => setActiveTab('policies')} className="p-4 cursor-pointer hover:shadow-card-hover transition-shadow border-sage-100">
            <div className="flex flex-col items-center text-center gap-2">
              <div className="p-3 rounded-full bg-sage-50">
                <FileCheck className="h-8 w-8 text-sage-500" />
              </div>
              <h3 className="font-medium text-text-heading">Gestión de Pólizas</h3>
              <p className="text-sm text-text-body">Gestión de pólizas</p>
            </div>
          </Card>
        </div>
        
        {/* New section with modern charts summarizing each module */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 mb-6">
          {/* Ventas - Bar Chart */}
          <Card className="shadow-sm hover:shadow-card transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="h-5 w-5 text-sage-500" />
                <h3 className="font-medium text-text-heading">Ingresos Recientes</h3>
              </div>
              <div className="h-[200px]">
                <ChartContainer
                  config={chartConfig}
                  className="h-full"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={revenueData}
                      margin={{ top: 10, right: 10, left: 0, bottom: 20 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                      <XAxis dataKey="month" />
                      <YAxis tickFormatter={(value) => `$${value / 1000}k`} />
                      <ChartTooltip
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            return (
                              <div className="bg-white p-2 border rounded shadow-sm">
                                <p className="font-medium">{payload[0].payload.month}</p>
                                <p className="text-sage-500">{formatCurrency(payload[0].value as number)}</p>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                      <Bar 
                        dataKey="value" 
                        name="revenue" 
                        fill="#059669" 
                        radius={[4, 4, 0, 0]} 
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>
            </CardContent>
          </Card>

          {/* Distribución de Pólizas - Pie Chart */}
          <Card className="shadow-sm hover:shadow-card transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-4">
                <PieChartIcon className="h-5 w-5 text-sage-500" />
                <h3 className="font-medium text-text-heading">Distribución de Pólizas</h3>
              </div>
              <div className="h-[200px]">
                <ChartContainer
                  config={chartConfig}
                  className="h-full"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={policyTypesData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        nameKey="name"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {policyTypesData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <ChartTooltip
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            return (
                              <div className="bg-white p-2 border rounded shadow-sm">
                                <p className="font-medium">{payload[0].name}</p>
                                <p>Pólizas: {payload[0].value}</p>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>
            </CardContent>
          </Card>

          {/* Reclamaciones - Area Chart */}
          <Card className="shadow-sm hover:shadow-card transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-4">
                <ChartBar className="h-5 w-5 text-sage-500" />
                <h3 className="font-medium text-text-heading">Reclamaciones Recientes</h3>
              </div>
              <div className="h-[200px]">
                <ChartContainer
                  config={chartConfig}
                  className="h-full"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={claimsData}
                      margin={{ top: 10, right: 10, left: 0, bottom: 20 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="aprobados" stackId="a" fill="#059669" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="rechazados" stackId="a" fill="#EF4444" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>
            </CardContent>
          </Card>
          
          {/* Documents Section */}
          <Card className="shadow-sm hover:shadow-card transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-4">
                <FileText className="h-5 w-5 text-sage-500" />
                <h3 className="font-medium text-text-heading">Documentos Recientes</h3>
              </div>
              <div className="h-[200px] overflow-y-auto">
                <div className="space-y-2">
                  {[1, 2, 3, 4, 5].map((_, idx) => (
                    <div key={idx} className="flex items-center p-2 border rounded-lg group hover:bg-sage-50 transition-colors">
                      <div className="p-2 bg-sage-50 rounded mr-3 group-hover:bg-white transition-colors">
                        <FileText className="h-5 w-5 text-sage-500" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Póliza-{(idx + 1).toString().padStart(4, '0')}.pdf</p>
                        <p className="text-xs text-text-body">
                          {(250 + idx * 10).toFixed(1)} KB • Hace {idx + 1} días
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;
