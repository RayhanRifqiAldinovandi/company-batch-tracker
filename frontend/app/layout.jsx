import { Poppins } from "next/font/google";
import { Raleway } from "next/font/google";
import "./globals.css";

const poppins = Poppins({ 
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"], 
  style: ["normal", "italic"], subsets: ["latin"] 
});
const raleway = Raleway({ 
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"], 
  style: ["normal", "italic"], subsets: ["latin"] 
});

export const metadata = {
  title: "E IMC OMC",
  description: "E IMC OMC",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={poppins.className}>{children}</body>
    </html>
  );
}
