const ContactSection = () => {
  return (
    <section className="py-20 bg-blue-50">
      <div className="max-w-4xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-6">Liên hệ với chúng tôi</h2>
        <p className="text-center mb-8">Bạn có thắc mắc hoặc cần tư vấn? Hãy liên hệ ngay.</p>
        <form className="bg-white p-6 rounded-xl shadow-md space-y-4">
          <input type="text" placeholder="Họ và tên" className="w-full p-3 border rounded-md" />
          <input type="email" placeholder="Email" className="w-full p-3 border rounded-md" />
          <textarea rows="4" placeholder="Nội dung" className="w-full p-3 border rounded-md"></textarea>
          <button type="submit" className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition">Gửi liên hệ</button>
        </form>
      </div>
    </section>
  );
};

export default ContactSection;
