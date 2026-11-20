import { Caps } from '../../components/Caps';
import { FadeIn } from '../../animation/Reveal';
import { SplitText } from '../../animation/SplitText';
import { Button } from '../../components/Button';

export default function Intro() {
  return (
    <section className="section intro" aria-labelledby="intro-title">
      <div className="container intro__grid">
        <FadeIn y={12}>
          <span className="eyebrow" id="intro-title"><Caps>
            What is µLearn CHN?
          </Caps></span>
        </FadeIn>

        <div className="intro__body">
          <SplitText
            as="p"
            variant="heading"
            className="intro__statement"
            text="A student-run community at College of Engineering Chengannur where we *learn from each other* and build together."
          />

          <div className="intro__cols">
            <SplitText
              as="p"
              variant="paragraph"
              className="dim"
              text="µLearn is a peer-learning approach: instead of waiting to be taught, members share what they know, ask questions in the open and grow through practice."
            />
            <SplitText
              as="p"
              variant="paragraph"
              className="dim"
              delay={0.15}
              text="µLearn CHN is our campus chapter. It is for anyone curious enough to show up — whatever your branch, year or starting point."
            />
          </div>

          <FadeIn delay={0.2}>
            <Button to="/about" variant="ghost">
              About the community
            </Button>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
