function Card({
  title,
  submission,
  subtext,
  icons: IconComponent,
  color = "text-white",
}) {
  return (
    <article className="border border-gray-700 rounded-xl p-6 flex flex-col justify-between">
      <div className="flex justify-between items-start">
        <h2 className="font-semibold text-gray-200 text-sm">{title}</h2>
        {IconComponent && <IconComponent className="text-gray-500 w-5 h-5" />}
      </div>
      <div className="mt-2">
        <p className={`font-extrabold text-3xl leading-none ${color}`}>
          {submission}
        </p>
        <p className="text-gray-500 text-xs mt-1">{subtext}</p>
      </div>
    </article>
  );
}

export default Card;