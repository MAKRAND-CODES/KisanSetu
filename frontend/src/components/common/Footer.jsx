const Footer = () => {
  return (
    <footer className="border-t border-green-100 bg-white py-6">
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center">
          <h3 className="text-xl font-bold text-green-900">
            KisanSetu
          </h3>

          <p className="mt-2 text-sm text-gray-500">
            Smart Agriculture Support Platform
          </p>

          <div className="mx-auto mt-4 h-px w-32 bg-green-100" />

          <p className="mt-4 text-sm text-gray-500">
            Made with ❤️ by{" "}
            <span className="font-semibold text-green-800">
              Makrand Gurjar
            </span>
          </p>

          <p className="mt-2 text-xs text-gray-400">
            © {new Date().getFullYear()} KisanSetu. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;