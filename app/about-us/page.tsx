export default function AboutUs() {
  return (
    <div className="min-h-screen bg-[#9ECFD4]">
      {/* Hero Section */}
      <div className="bg-[#9ECFD4] pt-24 pb-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl lg:text-5xl font-bold text-black mb-6">
            About Meyuza's
          </h1>
          <p className="text-lg lg:text-xl text-gray-800 max-w-3xl mx-auto">
            Where Style Meets Confidence, and Fashion Becomes Your Story
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        {/* Mission Section */}
        <div className="bg-white rounded-2xl p-8 lg:p-12 mb-12 shadow-lg border-2 border-transparent hover:border-black transition-all duration-300">
          <div className="flex items-start gap-6">
            <div className="w-12 h-12 bg-[#016B61] rounded-full flex items-center justify-center flex-shrink-0 mt-1">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <h2 className="text-2xl lg:text-3xl font-bold text-black mb-4">Our Mission</h2>
              <p className="text-lg text-gray-700 leading-relaxed">
                At Meyuza's, we believe style should feel effortless, confident, and true to who you are. 
                Our collections are thoughtfully designed to blend modern aesthetics with everyday comfort, 
                using quality materials that stand the test of time.
              </p>
            </div>
          </div>
        </div>

        {/* Vision Section */}
        <div className="bg-white rounded-2xl p-8 lg:p-12 mb-12 shadow-lg border-2 border-transparent hover:border-black transition-all duration-300">
          <div className="flex items-start gap-6">
            <div className="w-12 h-12 bg-[#016B61] rounded-full flex items-center justify-center flex-shrink-0 mt-1">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </div>
            <div>
              <h2 className="text-2xl lg:text-3xl font-bold text-black mb-4">Our Vision</h2>
              <p className="text-lg text-gray-700 leading-relaxed">
                At Meyuza's, we design clothing that celebrates confidence and style. From refined formals 
                to elegant fancy wear and effortless casuals, our pieces are crafted to elevate every moment. 
                We believe in quality, comfort, and timeless fashion made for people who love to stand out.
              </p>
            </div>
          </div>
        </div>

        {/* Story Section */}
        <div className="bg-white rounded-2xl p-8 lg:p-12 shadow-lg border-2 border-transparent hover:border-black transition-all duration-300">
          <div className="flex items-start gap-6">
            <div className="w-12 h-12 bg-[#016B61] rounded-full flex items-center justify-center flex-shrink-0 mt-1">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <div>
              <h2 className="text-2xl lg:text-3xl font-bold text-black mb-4">Our Story</h2>
              <p className="text-lg text-gray-700 leading-relaxed">
                Born from a love for style that fits every occasion, Meyuza's offers fancy, formal, and casual 
                pieces thoughtfully made for real life. With fine fabrics, modern silhouettes, and attention to 
                detail, we help you express your style with confidence—wherever you go.
              </p>
            </div>
          </div>
        </div>

        {/* Values Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
          <div className="bg-white rounded-2xl p-6 text-center shadow-lg border-2 border-transparent hover:border-black transition-all duration-300 transform hover:-translate-y-1">
            <div className="w-16 h-16 bg-[#016B61] rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-black mb-3">Quality Craftsmanship</h3>
            <p className="text-gray-700">
              Premium materials and attention to detail in every stitch
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 text-center shadow-lg border-2 border-transparent hover:border-black transition-all duration-300 transform hover:-translate-y-1">
            <div className="w-16 h-16 bg-[#016B61] rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-black mb-3">Timeless Style</h3>
            <p className="text-gray-700">
              Fashion that transcends trends and seasons
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 text-center shadow-lg border-2 border-transparent hover:border-black transition-all duration-300 transform hover:-translate-y-1">
            <div className="w-16 h-16 bg-[#016B61] rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-black mb-3">For Everyone</h3>
            <p className="text-gray-700">
              Inclusive designs for all styles and occasions
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}