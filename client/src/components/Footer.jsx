const Footer = () => {
  return (
    <footer className="bg-[#2A6FDB] text-white mt-10">
      <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col md:flex-row justify-between items-center">
        <div className="text-center md:text-left mb-4 md:mb-0">
          <p className="text-lg font-semibold">📚 Study Mart</p>
          <p className="text-sm text-[#F3F6FA]/90">
            A peer-to-peer academic exchange platform by students, for students.
          </p>
          <p className="text-sm mt-1 text-[#FFD54F]">
            🚧 This website is currently under development.
          </p>
        </div>
      </div>

      <div className="bg-[#245dc0] py-3 text-center text-sm text-[#F3F6FA]/70">
        © {new Date().getFullYear()} Study Mart. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;