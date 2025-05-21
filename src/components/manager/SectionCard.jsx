
const SectionCard = ({ icon: Icon, title, description, color }) => (
  <div className={`rounded-2xl shadow-lg transition-all p-6 border-l-4 ${color.bg} ${color.border}`}>
    <div className="flex items-center gap-4 mb-4">
      <Icon className={`${color.icon}`} size={28} />
      <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
    </div>
    <p className="text-gray-700 text-sm">{description}</p>
  </div>
);
export default SectionCard;