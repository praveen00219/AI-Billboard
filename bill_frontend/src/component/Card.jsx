const Card = ({ icon, title, description }) => (
  <div className="border rounded-lg shadow-sm p-6 text-center">
    <div className="flex justify-center mb-4">{icon}</div>
    <h3 className="text-lg font-semibold text-white">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
);

export default Card;
