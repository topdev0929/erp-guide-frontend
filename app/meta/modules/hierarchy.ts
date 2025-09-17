import { ToolNames } from "@/app/meta/tools";
import { InstructionModule, ModuleMetadata } from "./module-constants";
import { SessionType } from "@/app/types/types";
import {
  BASE_MODULE_TOOLS,
  LOAD_CONTEXT_INSTRUCTION,
  COMPLETE_MODULE_INSTRUCTION,
} from "./module-constants";

export const hierarchyModule: InstructionModule = {
  metadata: {
    id: SessionType.Hierarchy.toString(),
    name: "Creating Your Exposure Hierarchy",
    description:
      "Build a personalized list of fears and challenges to tackle during your OCD treatment journey",
    tools: [
      ...BASE_MODULE_TOOLS,
      ToolNames.SaveExposureHierarchyData,
      ToolNames.GoToHierarchySortingPage,
    ],
  },
  instructions: `
  
Here are your step-by-step instructions:

  ${LOAD_CONTEXT_INSTRUCTION}

1 - Introduction:
Acknowledge their initial message with compassion; and validate that their experience is not a unusual one - many people suffer OCD with symptoms just like what the user describes.
Explain the goal: We're going to think up a list of actions or scenarios they avoid or find uncomfortable, and then mentally reframe some of those obsessions and fears during the course. Use this analogy in describing why we’re making this list - “Imagine you’re training for a marathon. You don’t start by running 26 miles on day one. You start with shorter, manageable runs and build up gradually. This list works the same way—it's like a training plan for your brain to face fears step by step.” Kindly ask if that makes sense to them so far.

2 - Next, briefly describe a few items on an example hierarchy for someone with the user's type of OCD (you as the assistant should have this context). If you don't have any useful info on their symptoms, show an example for someone with contamination OCD.  Acknowledge that a lot of these scenarios might not feel doable today, and that this exercise is brainstorming only; there's no need to do any of these anytime soon. Then confirm they’re ready to jump into brainstorming 15 exposures/scenarios with you (emphasize that the goal is 15).


3 - Iterative Brainstorming Process (Key Logic): After their confirmation,  start the process below, maybe even speculating based on what they shared so far. 
Ask how OCD further impacts what they'd like to do in life (e.g., thoughts, compulsive actions, increased anxiety, or avoidance).
Generate 3–5 exposure ideas based on their response. Use specific details from what they’ve shared. Continue to add these to the same numbered list; to keep track of the total number of exposures we’ve generated (which will need to be 15).
Ask them for exposure ideas they can think of (low or high intensity). Ideally these ideas are similar to things they'd like to do; or do with less anxiety than they are now. Add their ideas to the list.
Ask about compulsions they perform (e.g., actions, avoidance, reassurance, rumination).
If they confirm any compulsions, brainstorm 5 additional exposure ideas based on these compulsions.

4 - Keep repeating this pattern until the list contains at least 15 exposure ideas.
If they stop giving you new OCD impacts, and list is still short:
Deduce their OCD subtype and suggest 3–5 obsessions or compulsions related to that subtype (e.g., contamination OCD might include fears of germs, handling trash, or bathroom-related anxieties). Confirm if these resonate and create exposure ideas accordingly.

5 - Final Steps:
If the list is less than 15 exposures, pause to confirm the user doesn’t have additional ideas, and then you (the assistant) should generate enough so that the list is at least 15.
Compile a complete unsorted list of all safe exposure ideas, writing the exposures word-for-word from what you'd typed previously. Let the user know you'll save this list on their Insights tab, and that they’ll be redirected to a new page for the next step, once you’ve saved this list. confirm with the user they’re ready for you to save this list. On their confirmation, save the array of strings using the SaveExposureHierarchyData tool and once that's complete; use tool 
GoToHierarchySortingPage to redirect them to the sorting page.
  `,
};

/* REFACTOR -> Old drafting notes from some time ago; can likely delete just skim first */

/* Drafting notes: People aren't doing well when they arrive. One user started with 'terrible' when we asked them how they were doing. Yes or No's aren't engaging; hence asking them a question that's revealing but not pessimistic. 
D2: I'm trying to be more direct with the intention of what the AI is going to do with them to set up proper expectations. As written on slide 13, people are confused on what we are trying to do with them with as there are more parts than just the quiz. I know we thought through doing this as an exposure hierarchy, but people with OCD have a really easy time writing out all the ways OCD impact them, they message me on reddit describing all the ways it does and so did some of the users who originally paid the $10/month subscription.

D2: I'm trying to be more direct with the intention of what the AI is going to do with them to set up proper expectations. As written on slide 13, people are confused on what we are trying to do with them with as there are more parts than just the quiz. I know we thought through doing this as an exposure hierarchy, but people with OCD have a really easy time writing out all the ways OCD impact them, they message me on reddit describing all the ways it does and so did some of the users who originally paid the $10/month subscription.

In a way, I think a lot of people were engaged with the original assistant because they were able to talk about how their OCD affects them. I want to provide an opportunity for them to do that here. 

I'm also changing the word 'exposure' to 'fear' as a hierarchy of fears is easier to grasp than a hierarchy of exposures since a list of exposure might beg the question of what an exposure is.
*/

/* Drafting notes: 
  Background Section: To make it less confusing; I used laymen's terms as opposed to mentioning 'exposure hierarchy'. 
  
  Step 1: To address one user's feedback where they didn't realize they were drafting a list (they thought they were supposed to go out and do these exposures), I ensure we elaborate and go back and forth on this concept. 
  
  Step 2: We continue to elaborate on what this should look like; to avoid a past-user scenario where they didn't get why we were making the list. 
  
  Step 3: It's important that we get at what they WANT to do; what they WANT to see improve. OCD can impact a lot of life; but we want to ensure we're targeting what matters to them, but still feels achievable. Starting with impacts; elaborating with compulsion identification, seems to be good source of inspiration. Asking for ideas from them is good as they feel ownership in this intimidating list. Also, emphasizing '15 exposures' seems to be important for the assistant to actually tell the user repeatedly; so they know when this exercise will end (otherwise it can appear endless)
  * TODO maybe we give them the choice on what subtype to tackle first if they ahve multiple ones, a past OCD patient suggested this to Jamie
  
  Step 4:
  Going over to Zach's old list around static obsessions and compulsions for inspiration; once we run out of the assistant and the user riffing off of the user's impact on OCD. 
  
  Step 5:
  The order of operations here had to be really tested; in order to ensure we don't save too early; or save too late. Was running into issues where it would wait to save until the user messaged again but it wasn't clear that the user should message; or it'll save early and catch the user by surprise. 
  * TODO - pretty sure it will save right now even if we don't hit 15 exposures, not sure why it doesn't brainstorm a few more at end. Could test to confirm this issue. 
  
  
  Sidenote - breaking this up into multiple variables actually made it harder for me to read it, and edit in a google doc, so I started using one variable.  
  
  D2: Breaking this up into multiple variables to better test when certain instructions are not used. Remove the instructions to avoid talking about the exposure hierarchy.
  */
