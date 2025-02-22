
import React from 'react';
import { Navbar } from '@/components/Navbar';

const Pricing = () => {
  return (
    <div className="min-h-screen bg-sage-50">
      <Navbar />
      <main className="pt-28 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold text-text-heading mb-4">Planes y Precios</h1>
            <p className="text-xl text-text-body max-w-2xl mx-auto">
              Elije el plan que mejor se adapte a tus necesidades deportivas
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Plan Básico */}
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
              <div className="text-center mb-8">
                <h3 className="text-xl font-semibold text-text-heading mb-2">Plan Básico</h3>
                <div className="text-4xl font-bold text-sage-500 mb-4">
                  $29<span className="text-lg text-text-body">/mes</span>
                </div>
                <p className="text-text-body">Perfecto para uso personal</p>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center">
                  <svg className="h-5 w-5 text-sage-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-text-body">5 reservas mensuales</span>
                </li>
                <li className="flex items-center">
                  <svg className="h-5 w-5 text-sage-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-text-body">Acceso básico al calendario</span>
                </li>
                <li className="flex items-center">
                  <svg className="h-5 w-5 text-sage-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-text-body">Soporte por email</span>
                </li>
              </ul>
              <button className="w-full py-3 px-6 rounded-lg bg-sage-500 text-white font-medium hover:bg-sage-500/90 transition-colors">
                Comenzar
              </button>
            </div>

            {/* Plan Pro */}
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-sage-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                  Más Popular
                </span>
              </div>
              <div className="text-center mb-8">
                <h3 className="text-xl font-semibold text-text-heading mb-2">Plan Pro</h3>
                <div className="text-4xl font-bold text-sage-500 mb-4">
                  $49<span className="text-lg text-text-body">/mes</span>
                </div>
                <p className="text-text-body">Para deportistas frecuentes</p>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center">
                  <svg className="h-5 w-5 text-sage-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-text-body">15 reservas mensuales</span>
                </li>
                <li className="flex items-center">
                  <svg className="h-5 w-5 text-sage-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-text-body">Calendario avanzado</span>
                </li>
                <li className="flex items-center">
                  <svg className="h-5 w-5 text-sage-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-text-body">Soporte prioritario</span>
                </li>
                <li className="flex items-center">
                  <svg className="h-5 w-5 text-sage-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-text-body">Estadísticas básicas</span>
                </li>
              </ul>
              <button className="w-full py-3 px-6 rounded-lg bg-sage-500 text-white font-medium hover:bg-sage-500/90 transition-colors">
                Comenzar
              </button>
            </div>

            {/* Plan Enterprise */}
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
              <div className="text-center mb-8">
                <h3 className="text-xl font-semibold text-text-heading mb-2">Plan Enterprise</h3>
                <div className="text-4xl font-bold text-sage-500 mb-4">
                  $99<span className="text-lg text-text-body">/mes</span>
                </div>
                <p className="text-text-body">Para equipos y clubes</p>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center">
                  <svg className="h-5 w-5 text-sage-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-text-body">Reservas ilimitadas</span>
                </li>
                <li className="flex items-center">
                  <svg className="h-5 w-5 text-sage-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-text-body">Calendario personalizado</span>
                </li>
                <li className="flex items-center">
                  <svg className="h-5 w-5 text-sage-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-text-body">Soporte 24/7</span>
                </li>
                <li className="flex items-center">
                  <svg className="h-5 w-5 text-sage-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-text-body">Estadísticas avanzadas</span>
                </li>
                <li className="flex items-center">
                  <svg className="h-5 w-5 text-sage-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-text-body">API access</span>
                </li>
              </ul>
              <button className="w-full py-3 px-6 rounded-lg bg-sage-500 text-white font-medium hover:bg-sage-500/90 transition-colors">
                Contactar
              </button>
            </div>
          </div>

          <div className="mt-16 text-center">
            <h3 className="text-2xl font-semibold text-text-heading mb-4">¿Necesitas un plan personalizado?</h3>
            <p className="text-text-body mb-8">
              Contáctanos para crear un plan que se ajuste perfectamente a tus necesidades específicas
            </p>
            <button className="inline-flex items-center px-6 py-3 rounded-lg border-2 border-sage-500 text-sage-500 font-medium hover:bg-sage-500 hover:text-white transition-colors">
              Hablar con ventas
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Pricing;
