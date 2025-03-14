import React from "react";
import { Link } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const images = [
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTxSWBUfk8Uqu8E2Z4Jbh28kRF_QQVxHXslBA&s",
  "vcetstatue.jpg",
  "sports.jpg",
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRblH8VF1YYqk7WIFchJaFM1qk4Womjp1difQ&s",
];

const HomePage = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 900,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-6">
      {/* Header */}
      <header className="w-full bg-gray-600 text-white text-center py-6 shadow-lg">
        <h1 className="text-4xl font-bold">VCET Student Performance Tracking System</h1>
        <p className="text-lg mt-2">Monitor and Analyze Student Progress Effectively</p>
      </header>

      {/* Image Slider */}
      <div className="w-full max-w-4xl mt-6">
        <Slider {...settings}>
          {images.map((img, index) => (
            <div key={index} className="w-full h-full">
              <img src={img} alt={`Slide ${index + 1}`} className="w-full h-full object-cover rounded-lg" />
            </div>
          ))}
        </Slider>
      </div>

      {/* Login Button */}
      <div className="mt-6 flex gap-4">
        <Link to="/login">
          <button className="bg-green-500 text-white px-6 py-3 rounded-lg shadow-md hover:bg-green-700 transition">
            Login
          </button>
        </Link>
      </div>

      {/* Main Content */}
      <main className="flex flex-col items-center mt-12">
        <div className="max-w-4xl bg-white shadow-xl rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-semibold text-gray-800">Empowering Educators & Students</h2>
          <p className="text-gray-600 mt-4">
            Our system provides real-time analytics, performance tracking, and insightful reports to help students and educators achieve academic excellence.
          </p>
          <div className="mt-6 flex gap-4 justify-center">
            <button className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-blue-700 transition">
              Get Started
            </button>
            <button className="bg-gray-200 text-gray-800 px-6 py-3 rounded-lg shadow-md hover:bg-gray-300 transition">
              Learn More
            </button>
          </div>
        </div>
      </main>

      {/* Features Section */}
      <section className="mt-12 w-full max-w-6xl grid md:grid-cols-3 gap-8">
        {[
          { title: "Real-Time Insights", desc: "Track academic progress with real-time data analytics." },
          { title: "Comprehensive Reports", desc: "Generate detailed performance reports for better decision-making." },
          { title: "User-Friendly Dashboard", desc: "Intuitive interface for seamless navigation and ease of use." },
        ].map((feature, index) => (
          <div key={index} className="bg-white shadow-lg p-6 rounded-xl text-center">
            <h3 className="text-xl font-semibold text-blue-600">{feature.title}</h3>
            <p className="text-gray-600 mt-2">{feature.desc}</p>
          </div>
        ))}
      </section>

      {/* Footer */}
      <footer className="mt-12 w-full bg-gray-600 text-white text-center py-4">
        <p>&copy; {new Date().getFullYear()} Student Performance Tracking System. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default HomePage;
