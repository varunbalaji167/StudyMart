import { Link } from "react-router-dom";
import {
  FaExchangeAlt,
  FaBook,
  FaUniversity,
  FaLeaf,
  FaComments,
  FaStar,
} from "react-icons/fa";
import Footer from "./Footer";

const HomePage = () => {
  return (
    <div className="min-h-screen bg-[#F3F6FA] text-[#333] flex flex-col">
      <header className="bg-[#2A6FDB] text-white py-6 px-4 shadow-md">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center">
          <h1 className="text-3xl font-bold mb-4 md:mb-0">📚 Study Mart</h1>
          <div className="flex gap-4">
            <Link
              to="/login"
              className="bg-white text-[#2A6FDB] px-4 py-2 rounded-lg font-medium hover:bg-[#e8f0fe] transition"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="bg-white text-[#2A6FDB] px-4 py-2 rounded-lg font-medium hover:bg-[#e8f0fe] transition"
            >
              Register
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-grow max-w-6xl mx-auto py-12 px-4 space-y-20">
        {/* Hero */}
        <section className="text-center space-y-6">
          <h2 className="text-4xl md:text-5xl font-extrabold text-[#2A6FDB]">
            Empowering Students, Enabling Sustainability 🌱
          </h2>
          <p className="text-lg text-[#555] max-w-3xl mx-auto">
            Study Mart is your campus companion to donate, swap, and discover academic materials easily and securely.
            Built with students in mind, it's more than just a platform—it's a movement.
          </p>
          <blockquote className="italic text-xl md:text-2xl font-semibold text-[#1e40af] bg-[#e0ebff] px-6 py-4 rounded-lg shadow-sm inline-block">
            “Why pay more, when your campus has more? Share, swap, and support.”
          </blockquote>
        </section>

        {/* What & Why */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <Card title="What is Study Mart?">
            <p>
              A secure, student-only digital hub for donating or swapping educational materials. From textbooks to lab kits, we make it easier to help each other thrive while saving money and reducing waste.
            </p>
          </Card>

          <Card title="Why Choose Us?">
            <ul className="space-y-3 text-[#555]">
              <ListItem>👨‍🎓 Built by students, for students</ListItem>
              <ListItem>📧 Verified university logins only</ListItem>
              <ListItem>💸 peer-to-peer exchange</ListItem>
              <ListItem>⭐ Trust-driven with reviews & ratings</ListItem>
              <ListItem>🌍 Promoting sustainable reuse culture</ListItem>
            </ul>
          </Card>
        </section>

        {/* Features */}
        <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          <FeatureCard
            icon={<FaExchangeAlt size={24} />}
            title="Swap & Donate"
            desc="Give or get academic items at zero cost."
          />
          <FeatureCard
            icon={<FaBook size={24} />}
            title="Course-Based Listings"
            desc="Find what you need by course or department."
          />
          <FeatureCard
            icon={<FaUniversity size={24} />}
            title="Verified Access"
            desc="Only real students. Always secure."
          />
          <FeatureCard
            icon={<FaComments size={24} />}
            title="In-App Chat"
            desc="Coordinate easily with built-in messaging."
          />
          <FeatureCard
            icon={<FaStar size={24} />}
            title="Reviews & Ratings"
            desc="Earn trust, build community with feedback."
          />
          <FeatureCard
            icon={<FaLeaf size={24} />}
            title="Eco-Friendly Impact"
            desc="Reduce waste. Save the planet. Start here."
          />
        </section>
      </main>

      <Footer />
    </div>
  );
};

const Card = ({ title, children }) => (
  <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition space-y-4">
    <h3 className="text-2xl font-bold text-[#2A6FDB]">{title}</h3>
    <div className="text-[#555] text-base">{children}</div>
  </div>
);

const FeatureCard = ({ icon, title, desc }) => (
  <div className="bg-white p-6 rounded-xl shadow text-center space-y-3 hover:shadow-lg transition">
    <div className="text-[#2A6FDB] mx-auto">{icon}</div>
    <h4 className="text-xl font-semibold text-[#2A6FDB]">{title}</h4>
    <p className="text-[#555] text-sm">{desc}</p>
  </div>
);

const ListItem = ({ children }) => (
  <li className="flex items-start gap-2">
    <span className="text-[#2A6FDB] font-bold">•</span>
    <span>{children}</span>
  </li>
);

export default HomePage;