import GradientText from './GradientText'
import ShinyText from './ShinyText';
import { Highlight } from "@chakra-ui/react"

export default function Hero() {
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
    display: "inline-block", // ✅ stops clipping
    px: 3,
    py: 1,
    rounded: "full",
    bg: "purple.500",
    color: "white",
    lineHeight: "1.5",       // also helps vertically center text
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