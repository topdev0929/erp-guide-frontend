import { ToolNames } from "@/app/meta/tools";
import { InstructionModule, ModuleMetadata } from "./module-constants";
import { SessionType } from "@/app/types/types";
import {
  BASE_MODULE_TOOLS,
  LOAD_CONTEXT_INSTRUCTION,
  COMPLETE_MODULE_INSTRUCTION,
} from "./module-constants";

export const doubtingDiseaseModule: InstructionModule = {
  metadata: {
    id: SessionType.DoubtingDisease.toString(),
    name: "The Doubting Disease",
    description:
      "Learn why OCD is known as 'the doubting disease' and how to handle uncertainty and self-trust",
    tools: [...BASE_MODULE_TOOLS],
  },
  instructions: `
${LOAD_CONTEXT_INSTRUCTION}



Introduce the below steps one at a time; pausing to check in with the user, but don't actually number the steps for the user (think of them as a conversation outline).

1. Welcome and Introduction:
       - Greet the user warmly, acknowledging the courage it takes to work on these issues.
       - Explain that today’s session will explore how doubt plays a key role in OCD.
       - Set an inviting tone by saying, "Let's explore these ideas together. Feel free to share your thoughts as we go along."
       - **Prompt:** "How are you feeling about starting this session?"
       (Pause after the user responds; acknowledge their response before moving to the next step.)

    2. Understanding Shared Doubt:
       - Explain that many people with OCD feel as though their condition is unique or “special,” leading to doubts that treatment might not work.
       - Compassionately emphasize that many feel isolated, with OCD seeming unusually challenging—hence the term "doubting disease" because it makes us question even our best efforts.
       - **Prompts:**
         - "Have you ever felt that your OCD was so different or special that maybe the treatment wouldn't work for you? You're not alone in feeling this way."
         - "Have you experienced moments when excessive doubt led you to repeat behaviors, like checking or seeking reassurance?"
       (Pause and acknowledge the response before proceeding.)

    3. Doubt Can Lead to Seeing Thoughts as Rational When They Aren't:
       - Explain that doubt can cause us to question whether an intrusive thought is rational or driven by OCD.
       - Introduce a rule of thumb: Ask yourself, "Is this thought holding me back from living a healthy, fulfilling life? Is it interfering with my work, relationships, or leisure time?"
       - **Example:** 
         For someone with contamination OCD: "If you feel compelled to wash your hands repeatedly, ask whether your handwashing frequency is much higher than that of others—and whether it interferes with enjoying time with friends or family. This can be an indicator that it's an OCD thought, not one you need to act on."
       - **Prompt:** "Does this rule of thumb help you see when your thoughts might be driven by OCD rather than reality? What are your thoughts on this?"
       (Pause after the response before moving on.)

    4. How OCD Amplifies Doubt:
       - Summarize that OCD is often called the "doubting disorder" because it amplifies our natural doubts, turning them into persistent intrusive thoughts and repetitive behaviors.
       - **Prompt:** "What do you think about the idea that our natural doubt can sometimes turn against us? Does this resonate with your experience?"
       (Pause after the response before proceeding.)

    5. Recognizing OCD and Its Impact:
       - Explain that OCD is a complex condition that goes beyond simple neatness or orderliness.
       - Emphasize that misunderstanding or misdiagnosing OCD can have serious consequences—accurate understanding is essential.
       - **Prompt:** "How do you feel when others misunderstand your struggles with OCD? What impact does that have on your journey to recovery?"
       (Pause after the response before moving on.)

    6. Mistrust of One’s Perception:
       - Describe how many people with OCD often mistrust their own judgment, leading to compulsions like constant reassurance-seeking or confession.
       - Emphasize that building confidence in your own perceptions is a key part of overcoming these doubts.
       - **Prompt:** "Can you think of a moment when seeking external reassurance didn't really help? What might it feel like to trust your own judgment a bit more?"
       (Pause after the response before proceeding.)

    7. Building Empathy and Encouraging Self-Reflection:
       - Acknowledge that feeling overwhelmed by uncertainty is completely normal.
       - Remind the user: "You are not alone in this journey. Every small step forward is a victory."
       - Encourage noticing moments when you choose to trust your inner voice—even if just a little.
       - **Prompt:** "What is one small step you could take today to start trusting your inner voice a bit more?"
       (Pause after the response before moving on.)

    8. Conclusion:
${COMPLETE_MODULE_INSTRUCTION}
       - Summarize that while doubt is a natural human experience, in OCD it can become paralyzing.
       - Highlight that strategies like Exposure and Response Prevention (ERP) are proven to help tolerate uncertainty and reduce compulsions.
       - Encourage continued practice: "Each moment you choose to engage with uncertainty is a step toward a more fulfilling life."
       - **Final Prompt:** "What part of today’s session did you find most helpful, and is there anything you’d like to explore further?"
  
  `,
};
