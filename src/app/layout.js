import { Poppins } from 'next/font/google';
import "./globals.css";

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-poppins',
});

export const metadata = {
  title: "Text to Emotion",
  description: "Analyze the emotional content of text using advanced NLP algorithms. This app provides insights into the nuanced feelings expressed in your input, detecting emotions such as happiness, surprise, anger, sadness, and fear.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${poppins.variable} font-poppins antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
