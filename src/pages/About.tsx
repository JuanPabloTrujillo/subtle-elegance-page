
import React from 'react';
import { Navbar } from '@/components/Navbar';

const About = () => {
  return (
    <div className="min-h-screen bg-sage-50">
      <Navbar />
      <main className="pt-28 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold text-text-heading mb-4">Sobre Nosotros</h1>
            <p className="text-xl text-text-body max-w-2xl mx-auto">
              Facilitamos la gestión de reservas deportivas para que puedas enfocarte en lo que realmente importa: disfrutar del deporte.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
            <div className="space-y-6">
              <h2 className="text-3xl font-semibold text-text-heading">Nuestra Misión</h2>
              <p className="text-lg text-text-body">
                Buscamos transformar la manera en que las personas acceden a instalaciones deportivas, 
                haciendo el proceso más simple, eficiente y accesible para todos.
              </p>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <svg className="h-6 w-6 text-sage-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-text-body">Reservas instantáneas 24/7</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-6 w-6 text-sage-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-text-body">Sistema de gestión eficiente</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-6 w-6 text-sage-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-text-body">Soporte técnico dedicado</span>
                </li>
              </ul>
            </div>
            <div className="relative h-96 rounded-2xl overflow-hidden shadow-xl">
              <img 
                src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158"
                alt="Persona usando la plataforma"
                className="object-cover w-full h-full"
              />
            </div>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div>
                <div className="text-4xl font-bold text-sage-500 mb-2">1000+</div>
                <div className="text-text-body">Usuarios activos</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-sage-500 mb-2">5000+</div>
                <div className="text-text-body">Reservas completadas</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-sage-500 mb-2">98%</div>
                <div className="text-text-body">Satisfacción del cliente</div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default About;
