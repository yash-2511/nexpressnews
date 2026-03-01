export default function AdBanner({ format = "horizontal" }) {
  if (format === "vertical") {
    return (
      <aside className="w-full max-w-xs mx-auto">
        <ins
          className="adsbygoogle"
          style={{ display: "block" }}
          data-ad-client="ca-pub-xxxxxxxxxxxxxxxx"
          data-ad-slot="1234567890"
          data-ad-format="vertical"
        ></ins>
      </aside>
    );
  }

  if (format === "square") {
    return (
      <div className="flex justify-center">
        <ins
          className="adsbygoogle"
          style={{ display: "inline-block", width: "300px", height: "250px" }}
          data-ad-client="ca-pub-xxxxxxxxxxxxxxxx"
          data-ad-slot="1234567890"
        ></ins>
      </div>
    );
  }

  // Horizontal (banner)
  return (
    <div className="w-full overflow-x-auto">
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client="ca-pub-xxxxxxxxxxxxxxxx"
        data-ad-slot="1234567890"
        data-ad-format="horizontal"
        data-full-width-responsive="true"
      ></ins>
    </div>
  );
}
