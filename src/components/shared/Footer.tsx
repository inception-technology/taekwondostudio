"use client";
import "@/styles/components.css";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  return (
    <footer className='p-5 items-center text-center bottom-0 w-full flex flex-col'>
      <small className="text-gray-500 font-light">
        &copy; Taekwondo Studio {currentYear}
      </small>
    </footer>
  )
}
export default Footer