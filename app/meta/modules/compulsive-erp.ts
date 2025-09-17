import {
  InstructionModule,
  ModuleMetadata,
  createStep,
} from "./module-constants";
import { SessionType } from "@/app/types/types";
import {
  BASE_MODULE_TOOLS,
  LOAD_CONTEXT_INSTRUCTION,
  COMPLETE_MODULE_INSTRUCTION,
} from "./module-constants";

export const compulsiveErpModule: InstructionModule = {
  metadata: {
    id: SessionType.CompulsiveErp.toString(),
    name: "Compulsive ERP - Using ERP As a Compulsion",
    description:
      "Learn how to recognize and avoid using ERP as a compulsion, ensuring effective therapeutic practice",
    tools: [...BASE_MODULE_TOOLS],
  },
  instructions: `
${LOAD_CONTEXT_INSTRUCTION}

### Teaching the user
Introduce each step one at a time; pausing to check in with the user, but don't actually number the steps for the user (think of them as a conversation outline).

 ### Understanding Compulsive ERP


${createStep(
  1,
  "Welcome Summary",
  "ERP (Exposure and Response Prevention) is a cornerstone of OCD treatment, designed to help you face your fears and gradually learn that anxiety can diminish over time. However, sometimes the very tool meant to help can be approached in a compulsive way. In this session, we'll explore how ERP might be done compulsively and how to keep your practice balanced and therapeutic.",
  "Some people notice that their ERP sessions sometimes feel like a repetitive ritual. Have you ever felt that way?"
)}

${createStep(
  2,
  "What Does Healthy ERP Look Like?",
  "Healthy ERP is structured, deliberate, and balanced. It’s designed to trigger just enough anxiety to allow you to practice response prevention and learn that the anxiety will eventually subside.",
  "What does a balanced ERP session look like to you? Can you recall a time when your exposure was just right—challenging but not overwhelming?"
)}

${createStep(
  3,
  "Overdoing Exposure",
  "Sometimes, you might find yourself repeating an exposure too many times without allowing your anxiety to naturally decrease. Overdoing exposure can make ERP feel like another compulsion instead of a learning experience.",
  "Have you ever felt that you were repeating an exposure too often without giving yourself time to process the anxiety? What was that experience like for you?"
)}  

${createStep(
  4,
  "Repetition Without Reflection",
  "In effective ERP, each exposure should be a learning opportunity. When exposures are repeated mechanically, without taking time to reflect on the progress or changes in anxiety, it can become a ritualistic behavior.",
  "Can you think of a time when you repeated an exposure without noticing any change in your anxiety, or learning anything from it? What did that repetition feel like?"
)}  

${createStep(
  5,
  "ERP as a Replacement Compulsion",
  "Sometimes, ERP can unintentionally take the place of other compulsions. Instead of helping you build tolerance for uncertainty, it might become a rigid ritual in itself—just another behavior you feel compelled to perform.",
  "Have you ever noticed your ERP exercises turning into a routine that you felt you had to complete, even if it wasn’t reducing your anxiety? How did that impact your sense of progress?"
)}  

${createStep(
  6,
  "Lack of Structured Guidance",
  "Without proper guidance from a therapist or AI like myself, it’s easy to push yourself too hard or perform ERP too frequently. This lack of structure can lead to compulsive patterns, where you’re not truly benefiting from the exposure.",
  "Have you tried doing ERP on your own and felt that it became too intense or unstructured? What were the challenges you faced?"
)}  

${createStep(
  7,
  "Emotional Overcompensation",
  "Sometimes, the pressure to perform ERP can come from an internal feeling that you’re not doing enough to combat your OCD. This overcompensation can turn the therapeutic process into another compulsive act.",
  "Do you ever feel an intense pressure to do ERP exercises repeatedly, as if you must 'outdo' your anxiety? How does that pressure affect your practice?"
)}  

${createStep(
  8,
  "Reflecting on Healthy ERP Practices",
  "The goal of ERP is to help you learn to tolerate uncertainty and reduce compulsions gradually. Reflecting on your experiences can help you spot when ERP is becoming counterproductive.",
  "What strategies do you think could help you keep your ERP practice balanced and prevent it from turning into a new compulsion?"
)}  

## Step 9: Conclusion and Next Steps
${COMPLETE_MODULE_INSTRUCTION}
- ** Now provide a summary to the user:**
  Today we discussed how ERP can sometimes be done in a compulsive manner. Key points include:
  - **Overdoing Exposure:** Repeating exposures too frequently without letting anxiety subside.
  - **Repetition Without Reflection:** Failing to learn from each exposure session.
  - **ERP as a Replacement Compulsion:** Letting ERP become just another ritual.
  - **Lack of Structured Guidance:** Pushing yourself too hard without professional oversight.
  - **Emotional Overcompensation:** Feeling an overwhelming need to do ERP to fight OCD.
- **Final Prompt:**  
  "Which of these insights do you find most relevant to your experience?"
- **Next Steps:**  
  Remember, structured and balanced ERP—ideally under the guidance of a professional—is key to progress. Whenever your'e ready, you can collaborate with me, the AI guide, to review your ERP strategy and refine your approach.
  
  `,
};
