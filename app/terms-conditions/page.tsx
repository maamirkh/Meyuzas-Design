import React from 'react';
import Link from 'next/link';

const TermsAndConditions = () => {
  return (
    <div className="min-h-screen bg-[#9ECFD4] py-8 px-4">
      <div className="max-w-3xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-8">
          <Link 
            href="/" 
            className="inline-flex items-center text-white bg-black/20 hover:bg-black/30 px-4 py-2 rounded-full transition-all duration-300 mb-6"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Home
          </Link>
          
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl">
            <h1 className="text-3xl font-bold text-gray-800 mb-3">Terms & Conditions / Policy</h1>
            <p className="text-gray-600">Last Updated: {new Date().toLocaleDateString()}</p>
          </div>
        </div>

        {/* Terms Content */}
        <div className="space-y-6">
          {/* Card 1 */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 bg-[#9ECFD4] rounded-full flex items-center justify-center mr-3">
                <span className="text-white font-bold text-sm">1</span>
              </div>
              <h2 className="text-xl font-bold text-gray-800">Privacy Policy</h2>
            </div>
            <p className="text-gray-700 leading-relaxed">
              1. Introduction <br/><br/>

              We value your privacy and are committed to protecting your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit or make a purchase from our e-commerce website. <br/><br/>

              2. Information We Collect <br/><br/>

                We may collect the following types of information: <br/>

                * Personal details such as name, email address, phone number, billing and shipping address <br/>
                * Payment-related information (processed securely via third-party payment gateways; we do not store card or wallet details) <br/>
                * Order details, transaction history, and customer support communications <br/><br/>

              3. How We Use Your Information <br/><br/>

                Your information is used to: <br/>

                * Process and fulfill orders <br/>
                * Facilitate payments and refunds <br/>
                * Communicate order updates and customer support responses <br/>
                * Improve website functionality and user experience<br/>
                * Comply with legal and regulatory requirements<br/><br/>

              4. Policy Updates<br/><br/>

                We may update this Privacy Policy from time to time. Any changes will be posted on this page.<br/><br/><br/>
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 bg-[#9ECFD4] rounded-full flex items-center justify-center mr-3">
                <span className="text-white font-bold text-sm">2</span>
              </div>
              <h2 className="text-xl font-bold text-gray-800">Shipping and Service Policy</h2>
            </div>
            <p className="text-gray-700 leading-relaxed">
              1. Order Processing <br/><br/>

                Orders are typically processed within 1–3 business days after payment confirmation, excluding weekends and public holidays.<br/><br/>

              2. Shipping Methods and Delivery Time<br/><br/>

                We partner with reliable courier services to deliver products. Estimated delivery times vary based on location and shipping method selected at checkout.<br/><br/>

              3. Shipping Charges<br/><br/>

                Shipping fees, if applicable, are calculated at checkout and displayed before payment confirmation.<br/><br/>

              4. Delivery Issues<br/><br/>

                We are not responsible for delays caused by courier services, weather conditions, or incorrect address information provided by the customer.<br/><br/>

              5. Services<br/><br/>

                Access details or service confirmation will be provided electronically after successful payment.<br/><br/>

              6. Contact Information<br/><br/>

                For questions related to shipping, returns, refunds, or privacy concerns, customers may contact our support team through the contact details provided on the website.<br/><br/>
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 bg-[#9ECFD4] rounded-full flex items-center justify-center mr-3">
                <span className="text-white font-bold text-sm">3</span>
              </div>
              <h2 className="text-xl font-bold text-gray-800">Payments</h2>
            </div>
            <p className="text-gray-700 leading-relaxed">
              1. Payment Security<br/><br/>

                All payments are processed through secure, PCI-compliant third-party payment providers. We do not store or have direct access to your debit/credit card or mobile wallet credentials.<br/><br/>

              2. Information Sharing<br/><br/>

                We do not sell or rent your personal data. Information may only be shared with trusted third parties such as payment processors, shipping partners, and legal authorities when required by law.<br/><br/>

              3. Data Protection<br/><br/>

                We implement reasonable technical and organizational measures to protect your personal information against unauthorized access, loss, or misuse.<br/><br/>

              4. User Rights<br/><br/>

                You have the right to request access to, correction of, or deletion of your personal information, subject to applicable laws.<br/><br/>
            </p>
          </div>

          {/* Card 5 */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 bg-[#9ECFD4] rounded-full flex items-center justify-center mr-3">
                <span className="text-white font-bold text-sm">4</span>
              </div>
              <h2 className="text-xl font-bold text-gray-800">Returns & Support</h2>
            </div>
            <p className="text-gray-700 leading-relaxed">
              1. Eligibility for Returns <br/><br/>

                Products may be eligible for return if: <br/><br/>

                * The item is damaged, defective, or incorrect <br/>
                * The return request is made within the specified return period (e.g., 7 days from delivery)<br/>
                * The product is unused and in its original packaging<br/><br/>

              2. Non-Returnable Items<br/><br/>

                Certain items may not be eligible for return, including:<br/><br/>

                * Digital products or downloadable items<br/>
                * Perishable goods<br/>
                * Items marked as non-returnable at the time of purchase<br/><br/>

              3. Return Process<br/><br/>

                To initiate a return, customers must contact our support team with order details and reason for return. Approved returns must be sent to the provided return address.<br/><br/>

              4. Refunds<br/><br/>

                Once the returned item is inspected and approved, refunds will be processed to the original payment method within a reasonable timeframe. Processing time may vary depending on the payment provider.<br/><br/>

              5. Shipping Costs <br/><br/>

                Return shipping costs may be borne by the customer unless the return is due to an error on our part.
            </p>
          </div>

          {/* Summary Card */}
          <div className="bg-black/10 backdrop-blur-sm rounded-2xl p-6 border-2 border-white/30">
            <div className="flex items-start">
              <svg className="w-6 h-6 text-gray-700 mr-3 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-gray-700 font-medium">
                By shopping with us, you agree to these terms. We may update them to serve you better, and we'll always keep you informed.
              </p>
            </div>
          </div>
        </div>

        {/* Footer Links */}
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link 
            href="/privacy" 
            className="bg-white/90 backdrop-blur-sm text-gray-800 px-6 py-3 rounded-full hover:bg-white transition-all duration-300 shadow-lg hover:shadow-xl font-medium"
          >
            Privacy Policy
          </Link>
          <Link 
            href="/returns" 
            className="bg-white/90 backdrop-blur-sm text-gray-800 px-6 py-3 rounded-full hover:bg-white transition-all duration-300 shadow-lg hover:shadow-xl font-medium"
          >
            Return Policy
          </Link>
          <Link 
            href="/contact" 
            className="bg-white/90 backdrop-blur-sm text-gray-800 px-6 py-3 rounded-full hover:bg-white transition-all duration-300 shadow-lg hover:shadow-xl font-medium"
          >
            Contact Us
          </Link>
        </div>

        {/* Bottom Note */}
        <div className="text-center mt-8">
          <p className="text-white/80 text-sm">
            Thank you for choosing us! ❤️
          </p>
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditions;