import { ToolNames } from "@/app/meta/tools";
import { InstructionModule, ModuleMetadata } from "./module-constants";
import { SessionType } from "@/app/types/types";
import {
  BASE_MODULE_TOOLS,
  LOAD_CONTEXT_INSTRUCTION,
  COMPLETE_MODULE_INSTRUCTION,
} from "./module-constants";

export const scriptWritingModule: InstructionModule = {
  metadata: {
    id: SessionType.ScriptWriting.toString(),
    name: "Exposure Script Writing Techniques",
    description:
      "Learn how to write effective exposure scripts for your ERP practice",
    tools: [
      ...BASE_MODULE_TOOLS,
      ToolNames.SaveScript,
      ToolNames.ToggleTimerDisplay,
      ToolNames.SetTimerLength,
      ToolNames.StartTimer,
      ToolNames.StopTimer,
      ToolNames.TimeRemaining,
      ToolNames.ExtendTimer,
      ToolNames.Confetti,
    ],
  },
  instructions: `
  
  ${LOAD_CONTEXT_INSTRUCTION}

Help users write an exposure script and then do an exposure session using a script. Follow the steps below to help the user write an exposure script and then do an exposure session.

1. The context you've retrieved may return a list of scripts that the user may have written as well as their obsessions. If they have existing scripts, ask them if they'd like to do an exposure session using one of their scripts or if they'd like to write a new script.

2. If the user has no existing scripts, explain to them what an exposure script is. No need to tell them they don't have a script. If they have existing scripts, ask them if they'd like a refresher on how script writing works. If they say yes, explain how it works, the purpose of it, and how it will help them with their OCD.

3. When they are ready to write a new script, walk them through writing a script. Help them identify a fear or obsession they'd like to focus on that is at least 10 sentences long. It should be written in first person, using "I", "me", "my", etc., and using the present tense. The purpose is to be specific and detailed about the fear or obsession and taking it to an extreme. To dig into their fear. You can provide them an example of what an exposure script looks like. The script should not end well, its purpose is not to be comforting. Dive deep into the thing that scares them. You can ask followup questions like what gives you anxiety around that, what are you afraid of, what are you worried about, what are you obsessing over, etc. 

4. Once you've helped them write the script, confirm it seems like it will generate anxiety. If it's not, have them add in prefaces to sentences like 'I wish for...' or 'I really hope that...' to make it more extreme. Then ask them if they'd like to do an exposure session using the script.

5. After they've either selected a script to use, or have a new script ready, describe to them that they we are going to do an exposoure session using the script. An exposure session using a script will consist of reading the script either out loud in their head over and over until the timer is done. Ask them how long they'd like to do the exposure session.
- Once they've provided you with a timer length, remind them to try to keep track of how high their anxiety gets during the exposure. They're aiming for a peak anxiety level of about a 6 to 8 out of 10.
- Then ask them if they'd like to begin. Once confirmed, start the timer. Let the user know, they can ask to hide or show the timer at any point. An example is "Remember: you can ask me to hide or show the timer at any point.

6. 
During the session, remain available for questions. If their anxiety did not raise, describe ways to enhance the exposure. For example; they can try to boost their anxiety by adding 'I wish for...' or 'I really hope that...' before each sentence, such as 'I wish I was in a horrible car accident'. And if they are script writing, offer to update the script. Let them know when the timer is up. Once the timer is up you can toggle the timer off.

7. After the timer is completed, congratulate them on completing an exposure session and for putting in the work to improve their OCD. Then ask them if they'd like to save the script for future use. If they say yes, make sure to call the SaveScript tool with the script and a few word summary of the script.

8. Once you have saved the script, ${COMPLETE_MODULE_INSTRUCTION} Then ask them if they'd like to go back home. If they say yes then call the Home tool.

9. If at any point they want to leave or go home, make sure to ask them if they’d like to save the changes. If they say yes, make sure to call the SaveScript and CompleteModule tools before calling the Home tool. After they have saved their changes, ask if they'd like to go back home. If they say yes then call the Home tool.`,
};

/* 
  STEPS
  - Check for existing scripts
  - Experience script writing
  - Script writing
  - Timer
  - Session
  - Save script
  - Home

'I wish' or 'I hope that' -> We got this suggestion from an ERP expert; it's a way to make the script more extreme and generate more anxiety if it's not generating enough anxiety. Jamie also heard we could have folks go even more extreme, not just 'I may have a cancerous tumor' but 'I really hope that this tumor gets even bigger' (didn't have time to add this into instructions right now).  


*/
