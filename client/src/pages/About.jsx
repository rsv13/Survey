import React from 'react';

export default function AboutUsPage() {
  return (
    <div className='bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100'>
      {/* Hero Section */}
      <section className='bg-gradient-to-r from-teal-400 to-cyan-500 text-white py-20'>
        <div className='container mx-auto px-6 text-center'>
          <h1 className='text-4xl font-bold mb-4'>About Us</h1>
          <p className='text-lg mb-6'>
            Learn more about the South Wales Social Well-being Scale (SWSWBS) and our commitment to enhancing social well-being.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <main className='py-12'>
        <section className='container mx-auto px-6'>
          <div className='mb-12'>
            <h2 className='text-3xl font-semibold mb-4'>Our Mission</h2>
            <p className='text-lg mb-6'>
              The South Wales Social Well-being Scale (SWSWBS) aims to provide a comprehensive measure of social well-being
              by evaluating individuals' external social resources, their perceived ability to engage in and enjoy their 
              social environment, and their overall capacity for human flourishing. Our goal is to offer a richer and 
              more holistic understanding of well-being that includes physical, mental, and social dimensions.
            </p>
          </div>

          <div className='mb-12'>
            <h2 className='text-3xl font-semibold mb-4'>Our Vision</h2>
            <p className='text-lg mb-6'>
              We envision a world where social well-being is given equal importance as physical and mental health. By
              focusing on the social components of well-being, we strive to influence health policies and practices to
              better support individuals and communities in their journey towards a balanced and fulfilling life.
            </p>
          </div>

          <div className='mb-12'>
            <h2 className='text-3xl font-semibold mb-4'>Supporting Organizations</h2>
            <p className='text-lg mb-4'>
              Our work is supported by several esteemed organizations that share our vision of enhancing social well-being:
            </p>
            <ul className='list-disc list-inside mb-6'>
              <li className='mb-4'>
                <a href="https://www.southwales.ac.uk/" target="_blank" rel="noopener noreferrer" className='text-blue-600 hover:underline'>
                  University of South Wales
                </a> - The University of South Wales is one of the largest universities in Wales, renowned for its commitment to research, innovation, and community engagement. With a focus on addressing real-world issues, the university provides vital support to our initiatives, including research, academic expertise, and resources. Their collaboration helps us ensure that our approach to social well-being is grounded in evidence and best practices.
              </li>
              <li className='mb-4'>
                <a href="https://www.primecentre.wales/" target="_blank" rel="noopener noreferrer" className='text-blue-600 hover:underline'>
                  Prime Centre Wales
                </a> - Prime Centre Wales is a leading research center dedicated to improving primary care and health services across Wales. They focus on enhancing the quality of care and integrating innovative solutions into healthcare practice. Their support includes research contributions, data analysis, and policy recommendations, which are crucial in advancing our understanding and implementation of social well-being measures.
              </li>
              <li className='mb-4'>
                <a href="https://www.wsspr.ac.uk/" target="_blank" rel="noopener noreferrer" className='text-blue-600 hover:underline'>
                  WSSPR (Wales School for Social Prescribing Research)
                </a> - WSSPR is at the forefront of social prescribing research in Wales, exploring how social prescriptions can improve health outcomes and well-being. Their work includes evaluating the effectiveness of social prescribing interventions and developing new models for integrating social well-being into healthcare systems. Their expertise and research are instrumental in shaping our approach and enhancing the impact of our scale.
              </li>
              <li className='mb-4'>
                <a href="https://www.healthcarewales.com/" target="_blank" rel="noopener noreferrer" className='text-blue-600 hover:underline'>
                  Health Care Wales
                </a> - Health Care Wales is responsible for overseeing and improving healthcare services across Wales. They work to ensure that health services are accessible, effective, and aligned with the needs of the community. Their support includes policy guidance, strategic initiatives, and collaboration on projects aimed at enhancing overall health and well-being, including the social components that our scale addresses.
              </li>
            </ul>
          </div>
        </section>
      </main>
    </div>
  );
}
