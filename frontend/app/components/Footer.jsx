import Link from "next/link";

const Footer = () => {
  return (
    <div className="p-2 pb-4 lg:pl-[95px]">
      <p className="text-xs text-center">
        &copy; 2024, Developed by{" "}
        <Link href="https://bintang7.com" target="_blank">
          <span className="font-semibold text-[#80BC00]">Bintang Toedjoe</span>
        </Link>{" "}
        in collaboration with{" "}
        <Link href="https://president.ac.id" target="_blank">
          <span className="font-semibold text-red-500">President</span> <span className="font-bold text-blue-700">University</span>
        </Link>{" "}
        (<span className="font-medium italic">Dimas Azizir, Matthew, Rayhan Rifqi</span>)
      </p>
    </div>
  );
};

export default Footer;
