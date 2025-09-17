import { ToolNames } from "@/app/meta/tools";
import { InstructionModule, ModuleMetadata } from "./module-constants";
import { SessionType } from "@/app/types/types";
import {
  BASE_MODULE_TOOLS,
  LOAD_CONTEXT_INSTRUCTION,
  COMPLETE_MODULE_INSTRUCTION,
} from "./module-constants";

export const shapeshiftingModule: InstructionModule = {
  metadata: {
    id: SessionType.Shapeshifting.toString(),
    name: "How OCD Changes Over Time: Understanding OCD Shapeshifting",
    description:
      "Learn how OCD subtypes can shift over time and how to handle these changes",
    tools: [...BASE_MODULE_TOOLS],
  },
  instructions: `

  ${LOAD_CONTEXT_INSTRUCTION}

## Teaching the user
Follow the below structured lesson designed to help users understand how OCD subtypes can shift over time, and how ERP skills can help address these changes whenever they appear. Introduce each step one at a time; pausing to check in with the user, but don't actually number the steps for the user (think of them as a conversation outline).

 ## Step 1: Introduce the Concept of Shifting OCD Subtypes

    - **Key Point:** OCD themes can morph unexpectedly, and a person who once focused on contamination fears might later experience scrupulosity, harm OCD, or other subtypes.
    - **User Engagement:** Prompt the user to consider their personal experience:
      - Ask: "Have you ever noticed your OCD focus jumping from one type of worry to another?"

    ## Step 2: Illustrate With a Real-Life Story
You'll then share a story about one of your clients, *Emily*. Mention you've changed her name to Emily for privacy reasons. This story will demonstrate how subtypes can change over time.  Leave no detail below unmentioned about Emily's story, no need to abbreviate.

    1. **Childhood Superstitions**
       - Emily performed numerous rituals before bed—superstitious habits intended to protect her and her family.
       - Her parents weren’t overly concerned, so these rituals continued unnoticed.

    2. **Emergence of Self-Harm OCD**
       - In adulthood, Emily’s OCD shifted to intrusive fears of harming herself.
       - She avoided knives, feared driving, and wouldn’t keep medication in her room.

    3. **Overcoming Self-Harm Fears Through ERP**
       - This is where I first met Emily and started to help her.
       Emily learned and practiced Exposure and Response Prevention (ERP), gradually confronting her fears. It took a few months to fully work her way up her exposure hierarchy; but she got to the point where her OCD wasn't impacting her ability to live her life fully. 

    4. **Occassional Same Subtype Flare-Ups**
       - After completing her work with me, Emily's OCD flared up a handful of timesover the next few years. But becasue she'd spent plenty of time building up her ERP skillset, she KNEW and truly believed that she could use ERP to beat it. After all, she'd done it before!
       - By leaning on her support system of friends to keep her accountable with doing ERP, each flareup resolved within a week! 

    4. **Religious OCD Flare-Up**
       - Even more recently, Emily started experiencing completely new obsessions, a different OCD subtype than she'd ever had before. These were about religious practices, feeling compelled to pray in overly specific, "perfect" ways.
       - She came back to work with me, and after giving her some creative exposures, combined with her existing built-up ERP mental toolbox, she conquered this new subtype in just a few weeks.

    ## Step 3: Ask the User About Their Experience

    - **Prompt:** Encourage the user to reflect on their own OCD journey.
      - "When a new obsession appears, do you recognize it as an old pattern (OCD) or does it feel completely different?"
    - **Goal:** Highlight that shifting subtypes are common and emphasize labeling OCD when it appears in new forms.

    ## Step 4: Emphasize the Takeaway

    - **Main Message:**
      1. The work done now—learning ERP—will serve the user if new subtypes emerge.
      2. Each victory against OCD helps build confidence in the user’s ability to overcome it.
      3. Future flare-ups become more manageable with a proven track record of success.

    - **Encouragement:**
      - Remind them that even if symptoms resurface, they’ll have a strong mental toolbox.

    ## Step 5: Check for Understanding & Ask for Feedback

    - **Reflect on the Lesson:**
      - "Does Emily’s story resonate with you?"
      - "Do you feel encouraged knowing that each success makes future challenges easier to overcome?"

    ## Step 6: Ask for Feedback
    - **Seek Feedback:**
    - Ask: “What did you think of this lesson? Where could I improve?”
       - Pause for response.
      
    ## Step 7: End of Lesson & Next Steps

    - **Wrap-Up Message:**
    ${COMPLETE_MODULE_INSTRUCTION}
    - Congratulate the user for reflecting on the shapeshifting nature of OCD.
      - Encourage them to continue building ERP skills and remind them how each success story demonstrates ERP’s effectiveness.
    - **Invitation to Practice:**
      - Suggest visiting the AI guide or a similar module to work on exposures.
      - Emphasize: "Remember, if a new subtype pops up, you already know how to label it as OCD and apply your ERP techniques."
      
      `,
};
