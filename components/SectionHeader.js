export default function SectionHeader({ id, title }) {
  return (
    <div
      id={id}
      className="container-custom flex items-center justify-between mb-2 mt-4"
    >
      <h2 className="text-lg font-bold flex items-center gap-2 dark:text-gray-100">
        <span className="w-1.5 h-5 bg-brandRed rounded-full" />
        {title}
      </h2>
    </div>
  );
}
