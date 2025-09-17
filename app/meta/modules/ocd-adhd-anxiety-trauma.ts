import {
  InstructionModule,
  ModuleMetadata,
  namedStep,
} from "./module-constants";
import { SessionType } from "@/app/types/types";
import {
  BASE_MODULE_TOOLS,
  LOAD_CONTEXT_INSTRUCTION,
  COMPLETE_MODULE_INSTRUCTION,
  DISPLAY_LINK_INSTRUCTION,
} from "./module-constants";

export const ocdAdhdAnxietyTraumaModule: InstructionModule = {
  metadata: {
    id: SessionType.OCDADHDAnxietyPTSD.toString(), // Assuming this needs to be added to SessionType enum
    name: "OCD, ADHD, Anxiety & Trauma",
    description:
      "Understanding the complex interplay between OCD, ADHD, anxiety and trauma, and approaches for treatment",
    tools: [...BASE_MODULE_TOOLS],
  },
  // Skipping the loading context instruction as we're not using the context in this module yet
  instructions: `
### Teaching the user
Introduce each step one at a time; pausing to check in with the user, but don't actually number the steps for the user (think of them as a conversation outline).
${namedStep({
  number: 1,
  title: "Introduction",
  overview:
    "This lesson will guide you in distinguishing OCD from conditions like ADHD, Anxiety, and PTSD. These conditions have overlapping symptoms, making accurate identification crucial.",
  prompt:
    "Are you ready to start distinguishing between OCD, ADHD, Anxiety, and PTSD?",
})}
  
  ${namedStep({
    number: 2,
    title: "Identify ADHD and OCD Similarities",
    overview:
      "Symptoms that may appear similar include feeling compelled to perform physical actions, difficulty with successful planning, and intrusive thoughts or difficulty focusing.",
    prompt:
      "Have you noticed any of these similarities in your own experience?",
  })}
  
  ${namedStep({
    number: 3,
    title: "Recognize ADHD and OCD Differences",
    overview:
      "Understand how physical actions and intrusive thoughts differ between OCD and ADHD, including intentional repetitive actions for OCD versus absentminded behaviors for ADHD.",
    prompt:
      "Can you identify specific behaviors or thoughts that seem intentional versus absentminded in your experience?",
  })}
  
  ${namedStep({
    number: 4,
    title: "Understand Neurological Differences",
    overview:
      "Learn about different brain activity patterns in ADHD (decreased activity) and OCD (increased activity) in frontostriatal circuits. " +
      DISPLAY_LINK_INSTRUCTION +
      " https://iocdf.org/expert-opinions/expert-opinion-ocd-and-adhd-dual-diagnosis-misdiagnosis-and-the-cognitive-cost-of-obsessions/",
    prompt:
      "Does understanding these neurological differences help clarify any experiences you've had?",
  })}

  ${namedStep({
    number: 5,
    title: "ADHD and OCD Co-occurence",
    overview:
      "Understand that these can frequently occur together in the same person. A 2010 study found a prevalence rate of 11.8% for co-morbid ADHD in OCD-affected individuals." +
      DISPLAY_LINK_INSTRUCTION +
      "https://pmc.ncbi.nlm.nih.gov/articles/PMC6700219/#B1",
    prompt:
      "Do you believe you might experience both ADHD and OCD symptoms together?",
  })}
  
  ${namedStep({
    number: 6,
    title:
      "Self-Reflection Tool for in the moment distinguishing of ADHD vs OCD",
    overview:
      "You can ask yourself 'am I ruminating a lot about this particular feeling? Does the thought of it generate some kind of fear? If so, it's likely OCD.Or is it more that I'm struggling to focus and feeling the need to absentmindedly do certain physical things? If so, it's likely ADHD.",
    prompt: "Does this sound like an exercise you can take with you?",
  })}
  
  ${namedStep({
    number: 7,
    title: "Identify Anxiety and OCD Similarities",
    overview:
      "Both Anxiety and OCD involve persistent worrying and pervasive thoughts leading to anxiety and distress.",
    prompt:
      "Have you experienced persistent worrying that could relate to both anxiety and OCD?",
  })}
  
  ${namedStep({
    number: 8,
    title: "Recognize Anxiety and OCD Differences",
    overview:
      "Distinguish between realistic everyday worries in anxiety and irrational, obsessive worries in OCD, and their different compulsive behaviors.",
    prompt:
      "Can you identify if your worries are realistic or irrational? Do you perform specific rituals to relieve anxiety?",
  })}
  
  ${namedStep({
    number: 9,
    title: "Anxiety and OCD Co-occurrence",
    overview:
      "Understand that anxiety and OCD frequently co-occur, with many individuals experiencing both. In a 2021 study, 33.56% of 867 participants with OCD also had GAD." +
      DISPLAY_LINK_INSTRUCTION +
      " https://www.sciencedirect.com/science/article/abs/pii/S0165178121001955",
    prompt:
      "Do you believe you might experience both anxiety and OCD symptoms together?",
  })}
  
  ${namedStep({
    number: 10,
    title: "Identify PTSD and OCD Similarities",
    overview:
      "Recognize shared symptoms of PTSD and OCD, including unwanted intrusive thoughts, repetitive behaviors, and trigger avoidance.",
    prompt: "Have you noticed these shared symptoms in your own experiences?",
  })}
  
  ${namedStep({
    number: 11,
    title: "Recognize PTSD and OCD Differences",
    overview:
      "Understand differences such as PTSD focusing on past traumas, OCD focusing on future fears, and the reasoning behind repetitive behaviors.",
    prompt:
      "Are your intrusive thoughts more focused on past traumatic events or imagined future threats?",
  })}
  
  ${namedStep({
    number: 12,
    title: "PTSD and OCD Co-occurrence",
    overview:
      "Learn that PTSD and OCD can co-occur, but having OCD does not significantly increase PTSD likelihood. According to the Department of Veterans Affairs in the US, 1 in 4 individuals with PTSD also have OCD. " +
      DISPLAY_LINK_INSTRUCTION +
      " https://pmc.ncbi.nlm.nih.gov/articles/PMC8301733/",
    prompt:
      "Do you see any indications of PTSD co-occurring with your OCD experiences?",
  })}
  
  ${COMPLETE_MODULE_INSTRUCTION}

  ${namedStep({
    number: 13,
    title: "Final Reflection",
    overview:
      "Reflect on the distinctions covered to enhance understanding and effectively manage your mental health journey.",
    prompt:
      "How has distinguishing these conditions helped clarify your experiences?",
  })}

   ${namedStep({
     number: 14,
     title: "Congratulations and Reminder of Support",
     overview:
       "You've finished the lesson for now; but consistency and using me the AI guide for support is key to gaining skill in distinguishing between these conditions.",
     prompt:
       "Nice work! Youv'e completed this lesson. Remember, anytime you wish, you can redo this lesson, or come back and talk to me about specific symptoms to work through what condition they might be related to. Take care :)",
   })}
  
  `,
};
