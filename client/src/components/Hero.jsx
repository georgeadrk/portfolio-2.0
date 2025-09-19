import GradientText from './GradientText'
import ShinyText from './ShinyText';
import { Highlight, keyframes } from "@chakra-ui/react"

export default function Hero() {
  const gradientAnimation = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;
  return (
    <section
      id="hero"
      className="min-h-screen flex flex-col justify-center items-center text-center px-6 bg-gradient-to-b text-gray-100"
    >
      <GradientText
        colors={["#BD8AFF", "#2E5BFF", "#BD8AFF", "#2E5BFF", "#BD8AFF"]}
        animationSpeed={10}
        showBorder={false}
        className="text-5xl md:text-10xl font-extrabold cursor-target"
      >
        <Highlight
  query="George"
  styles={{
    display: "inline-block",        // make it block-like
    lineHeight: "1.4",              // more breathing room vertically
    px: 3,
    py: 1,
    rounded: "md", // slight rounded edges
    bgGradient: "linear(to-r, #BD8AFF, #2E5BFF, #BD8AFF)", // gradient background
    backgroundSize: "200% 200%", // so it can animate
    animation: `${gradientAnimation} 4s ease infinite`, // run the animation
    color: "white", // text color inside
    fontWeight: "bold",
  }}
>
  Hi, I'm George
</Highlight>
      </GradientText>
      <ShinyText 
        text="A 17-year old student who focuses in AI development and constantly open to learn more programming technologies." 
        disabled={false} 
        speed={5} 
        className='cursor-target' 
      />
      <a
        href="#projects"
        className="mt-8 inline-block bg-purpleAccent text-white px-6 py-3 rounded text-lg shadow-lg cursor-target glow-button"
      >
        See My Work
      </a>
    </section>
  );
}