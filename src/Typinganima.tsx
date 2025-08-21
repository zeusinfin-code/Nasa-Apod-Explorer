import { useEffect, useState, useRef } from "react";

type TypeWriterProps = {
  text: string;
  speed?: number;
};

export function TypeWriter({ text, speed = 50 }: TypeWriterProps) {
  const [displayed, setDisplayed] = useState("");
  const indexRef = useRef(0);

  useEffect(() => {
    setDisplayed("");
    indexRef.current = 0;

    const interval = setInterval(() => {
      setDisplayed((prev) => prev + text.charAt(indexRef.current));
      indexRef.current++;
      if (indexRef.current >= text.length) clearInterval(interval);
    }, speed);

    return () => clearInterval(interval);
  }, [text, speed]);

  return (
    <h1 className="text-4xl sm:text-6xl font-extrabold mb-2 text-white tracking-wide">
      {displayed}
    </h1>
  );
}
