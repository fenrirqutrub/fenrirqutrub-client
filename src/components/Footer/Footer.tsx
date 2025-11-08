const Footer = () => {
  const handleScroll = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div className="bg-[#010409]">
      <footer className="border-t-4 border-[#0a0a0a]">
        <div className="flex items-center justify-center p-6">
          <button
            onClick={handleScroll}
            className="text-sm text-[#f8f9fa] flex items-center gap-x-2 font"
          >
            &copy; Copyright 2024 - {new Date().getFullYear()} All Rights
            Reserved by
            <span className="hidden md:block font-b">Fenrir Qutrub</span>
          </button>
        </div>
      </footer>
    </div>
  );
};

export default Footer;
